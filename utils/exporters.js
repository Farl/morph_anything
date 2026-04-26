import { drawWarpedTriangle } from "./warp.js";
// GIF export uses the global GIF constructor provided by gif.js loaded in index.html

async function createGifWorkerUrl(url) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to load GIF worker script: ${response.status} ${response.statusText}`);
  }
  const script = await response.text();
  const blob = new Blob([script], { type: "application/javascript" });
  return URL.createObjectURL(blob);
}

/**
 * Prefer MP4 when available, otherwise fall back to the best supported type.
 */
export function getBestMimeTypeForMp4() {
  const candidates = [
    "video/mp4", // prefer real mp4 where available
    "video/webm;codecs=vp9",
    "video/webm;codecs=vp8",
    "video/webm",
  ];

  if (typeof MediaRecorder === "undefined") return null;
  if (typeof MediaRecorder.isTypeSupported !== "function") {
    return candidates[0];
  }

  return candidates.find((t) => MediaRecorder.isTypeSupported(t)) || null;
}

/**
 * Record the given canvas as a video once through the animation duration.
 * @param {HTMLCanvasElement} canvas
 * @param {string} imageName
 * @param {number} totalDurationMs
 * @param {() => void} onStart
 * @param {() => void} onDone
 */
export function exportMp4WithMediaRecorder(
  canvas,
  imageName,
  totalDurationMs,
  onStart,
  onDone
) {
  const mimeType = getBestMimeTypeForMp4();
  if (!mimeType) {
    alert("Video export is not supported in this browser.");
    return;
  }

  const ext = mimeType.includes("mp4") ? "mp4" : "webm";

  const stream = canvas.captureStream(30);
  const recorder = new MediaRecorder(stream, { mimeType });
  const chunks = [];

  recorder.ondataavailable = (e) => {
    if (e.data.size > 0) chunks.push(e.data);
  };
  recorder.onstop = () => {
    const blob = new Blob(chunks, { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `morph-any_${imageName || "animation"}.${ext}`;
    a.click();
    URL.revokeObjectURL(url);
    onDone();
  };

  onStart();
  recorder.start();
  setTimeout(() => {
    try {
      recorder.stop();
    } catch {
      onDone();
    }
  }, totalDurationMs + 200);
}

async function downloadBlobWithName(blob, filename) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

async function postImageToWebsimComments(blob, filename, content) {
  try {
    if (typeof window === "undefined" || !window.websim) return;
    const file = new File([blob], filename, { type: blob.type });
    const url = await window.websim.upload(file);
    await window.websim.postComment({
      content: content || `Shared from Morph Anything: ${filename}`,
      images: [url],
    });
  } catch (e) {
    console.warn("Failed to post image to WebSim comments", e);
  }
}

/**
 * Render the animation into an animated GIF using an offscreen canvas.
 * This does not alter current React state.
 *
 * @param {HTMLImageElement} image
 * @param {string} imageName
 * @param {import("../types.js").Keyframe[]} keyframes
 * @param {import("../types.js").Triangle[]} lockedTriangles
 * @param {import("../types.js").Vertex[]} baseVertices
 * @param {{width:number,height:number}} sizePx
 * @param {{postToComments?:boolean,download?:boolean}} [options]
 */
export async function exportGifFromAnimation(
  image,
  imageName,
  keyframes,
  lockedTriangles,
  baseVertices,
  sizePx,
  options = {}
) {
  if (!image || !keyframes || keyframes.length === 0) return;
  const { postToComments = false, download = true } = options;
  if (!lockedTriangles || lockedTriangles.length === 0) {
    alert("Please lock the mesh by switching to Animate mode before exporting GIF.");
    return;
  }

  const { width, height } = sizePx;
  if (!width || !height) return;

  const canvas = document.createElement("canvas");
  canvas.width = Math.max(1, Math.floor(width));
  canvas.height = Math.max(1, Math.floor(height));
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  if (typeof window === "undefined" || !window.GIF) {
    alert("GIF export library (gif.js) is not available in this environment.");
    return;
  }

  const fps = 20;
  const frameDelayMs = Math.round(1000 / fps);

  const workerUrl = await createGifWorkerUrl(
    "https://unpkg.com/gif.js@0.2.0/dist/gif.worker.js"
  );

  const gif = new window.GIF({
    workers: 2,
    quality: 10,
    workerScript: workerUrl,
    width: canvas.width,
    height: canvas.height,
  });

  const vBaseMap = new Map(baseVertices.map((v) => [v.id, v]));

  const totalSegments = keyframes.length;
  const framesPerSegment = Math.max(3, Math.round((fps * (keyframes[0].duration || 1000)) / 1000));

  for (let segIndex = 0; segIndex < totalSegments; segIndex++) {
    const kf = keyframes[segIndex];
    const next = keyframes[(segIndex + 1) % totalSegments];

    const segDuration = kf.duration || 1000;
    const framesForThisSegment = Math.max(
      3,
      Math.round((fps * segDuration) / 1000)
    );

    for (let fi = 0; fi < framesForThisSegment; fi++) {
      const t =
        framesForThisSegment <= 1 ? 0 : fi / (framesForThisSegment - 1);

      // Build interpolated position map
      const posMap = new Map();
      baseVertices.forEach((v) => {
        const p1 = kf.positions[v.id] || v.uv;
        const p2 = next.positions[v.id] || v.uv;
        const x = p1.x + (p2.x - p1.x) * t;
        const y = p1.y + (p2.y - p1.y) * t;
        posMap.set(v.id, { x, y });
      });

      // Clear and draw frame
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      lockedTriangles.forEach((tri) => {
        const v0 = vBaseMap.get(tri.indices[0]);
        const v1 = vBaseMap.get(tri.indices[1]);
        const v2 = vBaseMap.get(tri.indices[2]);
        if (!v0 || !v1 || !v2) return;

        const p0 = posMap.get(v0.id) || v0.uv;
        const p1p = posMap.get(v1.id) || v1.uv;
        const p2p = posMap.get(v2.id) || v2.uv;

        const uvSet = [
          { x: v0.uv.x * image.width, y: v0.uv.y * image.height },
          { x: v1.uv.x * image.width, y: v1.uv.y * image.height },
          { x: v2.uv.x * image.width, y: v2.uv.y * image.height },
        ];
        const destSet = [
          { x: p0.x * canvas.width, y: p0.y * canvas.height },
          { x: p1p.x * canvas.width, y: p1p.y * canvas.height },
          { x: p2p.x * canvas.width, y: p2p.y * canvas.height },
        ];

        drawWarpedTriangle(ctx, image, uvSet, destSet);
      });

      // Push this canvas frame into the GIF encoder
      gif.addFrame(canvas, {
        delay: frameDelayMs,
        copy: true,
      });
    }
  }

  await new Promise((resolve) => {
    gif.on("finished", async (blob) => {
      const filename = `morph-any_${imageName || "animation"}.gif`;
      if (download) {
        await downloadBlobWithName(blob, filename);
      }
      if (postToComments) {
        await postImageToWebsimComments(blob, filename);
      }
      resolve();
    });

    gif.render();
  });

  // Clean up the worker Blob URL
  if (gif.options && gif.options.workerScript) {
    try {
      URL.revokeObjectURL(gif.options.workerScript);
    } catch {
      // ignore
    }
  }
}

/**
 * Export a single still frame from the animation as an image file.
 *
 * @param {HTMLImageElement} image
 * @param {string} imageName
 * @param {import("../types.js").Keyframe[]} keyframes
 * @param {import("../types.js").Triangle[]} lockedTriangles
 * @param {import("../types.js").Vertex[]} baseVertices
 * @param {{width:number,height:number}} sizePx
 * @param {{format:"image/jpeg"|"image/webp",extension:string,keyframeIndex?:number,postToComments?:boolean,download?:boolean}} options
 */
export async function exportStillFrameFromAnimation(
  image,
  imageName,
  keyframes,
  lockedTriangles,
  baseVertices,
  sizePx,
  options
) {
  if (!image || !keyframes || keyframes.length === 0) return;
  if (!lockedTriangles || lockedTriangles.length === 0) {
    alert(
      "Please lock the mesh by switching to Animate mode before exporting."
    );
    return;
  }

  const { width, height } = sizePx;
  if (!width || !height) return;

  const {
    format,
    extension,
    keyframeIndex = 0,
    postToComments = false,
    download = true,
  } = options;

  const canvas = document.createElement("canvas");
  canvas.width = Math.max(1, Math.floor(width));
  canvas.height = Math.max(1, Math.floor(height));
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  const vBaseMap = new Map(baseVertices.map((v) => [v.id, v]));
  const kf = keyframes[Math.max(0, Math.min(keyframes.length - 1, keyframeIndex))];

  const posMap = new Map();
  baseVertices.forEach((v) => {
    const p = (kf && kf.positions && kf.positions[v.id]) || v.uv;
    posMap.set(v.id, { x: p.x, y: p.y });
  });

  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  lockedTriangles.forEach((tri) => {
    const v0 = vBaseMap.get(tri.indices[0]);
    const v1 = vBaseMap.get(tri.indices[1]);
    const v2 = vBaseMap.get(tri.indices[2]);
    if (!v0 || !v1 || !v2) return;

    const p0 = posMap.get(v0.id) || v0.uv;
    const p1p = posMap.get(v1.id) || v1.uv;
    const p2p = posMap.get(v2.id) || v2.uv;

    const uvSet = [
      { x: v0.uv.x * image.width, y: v0.uv.y * image.height },
      { x: v1.uv.x * image.width, y: v1.uv.y * image.height },
      { x: v2.uv.x * image.width, y: v2.uv.y * image.height },
    ];
    const destSet = [
      { x: p0.x * canvas.width, y: p0.y * canvas.height },
      { x: p1p.x * canvas.width, y: p1p.y * canvas.height },
      { x: p2p.x * canvas.width, y: p2p.y * canvas.height },
    ];

    drawWarpedTriangle(ctx, image, uvSet, destSet);
  });

  await new Promise((resolve, reject) => {
    canvas.toBlob(
      async (blob) => {
        try {
          if (!blob) return resolve();
          const filename = `morph-any_${imageName || "frame"}.${extension}`;
          if (download) {
            await downloadBlobWithName(blob, filename);
          }
          if (postToComments) {
            await postImageToWebsimComments(blob, filename);
          }
          resolve();
        } catch (e) {
          reject(e);
        }
      },
      format,
      0.92
    );
  });
}