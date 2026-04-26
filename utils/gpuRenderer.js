export class GpuWarpRenderer {
  /**
   * @param {HTMLCanvasElement} canvas
   */
  constructor(canvas) {
    this.canvas = canvas;
    /** @type {WebGLRenderingContext|null} */
    this.gl =
      canvas.getContext("webgl", { antialias: true, premultipliedAlpha: true }) ||
      canvas.getContext("experimental-webgl");
    if (!this.gl) {
      this.supported = false;
      return;
    }
    this.supported = true;
    this.program = null;
    this.positionBuffer = null;
    this.texcoordBuffer = null;
    this.texture = null;
    this.imageWidth = 1;
    this.imageHeight = 1;

    this._init();
  }

  _compileShader(type, source) {
    const gl = this.gl;
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      console.warn("GPU shader compile error:", gl.getShaderInfoLog(shader));
      gl.deleteShader(shader);
      return null;
    }
    return shader;
  }

  _createProgram(vsSource, fsSource) {
    const gl = this.gl;
    const vs = this._compileShader(gl.VERTEX_SHADER, vsSource);
    const fs = this._compileShader(gl.FRAGMENT_SHADER, fsSource);
    if (!vs || !fs) return null;
    const program = gl.createProgram();
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.warn("GPU program link error:", gl.getProgramInfoLog(program));
      gl.deleteProgram(program);
      return null;
    }
    return program;
  }

  _init() {
    const gl = this.gl;
    const vsSource = `
      attribute vec2 a_position;
      attribute vec2 a_texCoord;
      uniform vec2 u_resolution;
      varying vec2 v_texCoord;

      void main() {
        // Convert from pixels to clipspace
        vec2 zeroToOne = a_position / u_resolution;
        vec2 zeroToTwo = zeroToOne * 2.0;
        vec2 clipSpace = zeroToTwo - 1.0;
        gl_Position = vec4(clipSpace * vec2(1.0, -1.0), 0.0, 1.0);
        v_texCoord = a_texCoord;
      }
    `;

    const fsSource = `
      precision mediump float;
      varying vec2 v_texCoord;
      uniform sampler2D u_image;

      void main() {
        gl_FragColor = texture2D(u_image, v_texCoord);
      }
    `;

    const program = this._createProgram(vsSource, fsSource);
    if (!program) {
      this.supported = false;
      return;
    }
    this.program = program;

    this.positionLocation = gl.getAttribLocation(program, "a_position");
    this.texcoordLocation = gl.getAttribLocation(program, "a_texCoord");
    this.resolutionLocation = gl.getUniformLocation(program, "u_resolution");
    this.imageLocation = gl.getUniformLocation(program, "u_image");

    this.positionBuffer = gl.createBuffer();
    this.texcoordBuffer = gl.createBuffer();

    this.texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, this.texture);
    // Default 1x1 pixel until we upload the real image
    const pixel = new Uint8Array([0, 0, 0, 255]);
    gl.texImage2D(
      gl.TEXTURE_2D,
      0,
      gl.RGBA,
      1,
      1,
      0,
      gl.RGBA,
      gl.UNSIGNED_BYTE,
      pixel
    );
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  }

  /**
   * Upload image as texture.
   * Always refresh the texture so switching sessions with same-sized images
   * correctly updates the warped mesh.
   * @param {HTMLImageElement} image
   */
  ensureTexture(image) {
    if (!this.supported) return;
    if (!image) return;

    const gl = this.gl;
    this.imageWidth = image.width;
    this.imageHeight = image.height;

    gl.bindTexture(gl.TEXTURE_2D, this.texture);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 0);
    gl.texImage2D(
      gl.TEXTURE_2D,
      0,
      gl.RGBA,
      gl.RGBA,
      gl.UNSIGNED_BYTE,
      image
    );
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  }

  /**
   * Render the warped image using triangles and vertices.
   * @param {HTMLImageElement} image
   * @param {import("../types.js").Vertex[]} vertices
   * @param {import("../types.js").Triangle[]} triangles
   * @param {number} width
   * @param {number} height
   */
  render(image, vertices, triangles, width, height) {
    if (!this.supported) return;
    if (!image || !vertices || vertices.length === 0 || !triangles || triangles.length === 0) return;

    const gl = this.gl;
    this.ensureTexture(image);

    gl.viewport(0, 0, width, height);
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    gl.useProgram(this.program);
    gl.uniform2f(this.resolutionLocation, width, height);

    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, this.texture);
    gl.uniform1i(this.imageLocation, 0);

    const vMap = new Map(vertices.map((v) => [v.id, v]));

    const vertexCount = triangles.length * 3;
    const positions = new Float32Array(vertexCount * 2);
    const texcoords = new Float32Array(vertexCount * 2);

    let pi = 0;
    let ti = 0;

    for (let i = 0; i < triangles.length; i++) {
      const tri = triangles[i];
      const v0 = vMap.get(tri.indices[0]);
      const v1 = vMap.get(tri.indices[1]);
      const v2 = vMap.get(tri.indices[2]);
      if (!v0 || !v1 || !v2) continue;

      const verts = [v0, v1, v2];
      for (let k = 0; k < 3; k++) {
        const v = verts[k];
        // dest position in pixels
        const x = v.pos.x * width;
        const y = v.pos.y * height;
        positions[pi++] = x;
        positions[pi++] = y;

        // UV in [0,1]
        texcoords[ti++] = v.uv.x;
        texcoords[ti++] = v.uv.y;
      }
    }

    // Upload positions
    gl.bindBuffer(gl.ARRAY_BUFFER, this.positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, positions, gl.DYNAMIC_DRAW);
    gl.enableVertexAttribArray(this.positionLocation);
    gl.vertexAttribPointer(this.positionLocation, 2, gl.FLOAT, false, 0, 0);

    // Upload texcoords
    gl.bindBuffer(gl.ARRAY_BUFFER, this.texcoordBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, texcoords, gl.DYNAMIC_DRAW);
    gl.enableVertexAttribArray(this.texcoordLocation);
    gl.vertexAttribPointer(this.texcoordLocation, 2, gl.FLOAT, false, 0, 0);

    const trianglesToDraw = pi / 2 / 3;
    if (trianglesToDraw > 0) {
      gl.drawArrays(gl.TRIANGLES, 0, trianglesToDraw * 3);
    }
  }
}