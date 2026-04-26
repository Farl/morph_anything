// Simple affine triangle warp based on:
//  - clip to destination triangle
//  - compute affine transform from source (uv) to destination (screen)
//  - draw image through that transform

/**
 * @param {CanvasRenderingContext2D} ctx
 * @param {HTMLImageElement} image
 * @param {[{x:number,y:number},{x:number,y:number},{x:number,y:number}]} src
 * @param {[{x:number,y:number},{x:number,y:number},{x:number,y:number}]} dst
 */
export function drawWarpedTriangle(ctx, image, src, dst) {
  const [s0, s1, s2] = src;
  const [rawD0, rawD1, rawD2] = dst;

  // Slightly expand the destination triangle so neighboring triangles
  // overlap a bit; this helps hide tiny gaps that look like a wireframe.
  const cx = (rawD0.x + rawD1.x + rawD2.x) / 3;
  const cy = (rawD0.y + rawD1.y + rawD2.y) / 3;
  const pad = 0.75; // pixels

  function expandPoint(p) {
    const vx = p.x - cx;
    const vy = p.y - cy;
    const len = Math.hypot(vx, vy) || 1;
    const factor = (len + pad) / len;
    return {
      x: cx + vx * factor,
      y: cy + vy * factor,
    };
  }

  const d0 = expandPoint(rawD0);
  const d1 = expandPoint(rawD1);
  const d2 = expandPoint(rawD2);

  ctx.save();

  // Clip to expanded destination triangle
  ctx.beginPath();
  ctx.moveTo(d0.x, d0.y);
  ctx.lineTo(d1.x, d1.y);
  ctx.lineTo(d2.x, d2.y);
  ctx.closePath();
  ctx.clip();

  // Solve affine transform that maps src -> expanded dst:
  // [dx]   [a c e][sx]
  // [dy] = [b d f][sy]
  // [1 ]   [0 0 1][1 ]
  const denom =
    (s0.x * (s1.y - s2.y) +
      s1.x * (s2.y - s0.y) +
      s2.x * (s0.y - s1.y)) || 1e-5;

  const a =
    (d0.x * (s1.y - s2.y) +
      d1.x * (s2.y - s0.y) +
      d2.x * (s0.y - s1.y)) / denom;
  const b =
    (d0.y * (s1.y - s2.y) +
      d1.y * (s2.y - s0.y) +
      d2.y * (s0.y - s1.y)) / denom;
  const c =
    (d0.x * (s2.x - s1.x) +
      d1.x * (s0.x - s2.x) +
      d2.x * (s1.x - s0.x)) / denom;
  const d =
    (d0.y * (s2.x - s1.x) +
      d1.y * (s0.x - s2.x) +
      d2.y * (s1.x - s0.x)) / denom;
  const e =
    (d0.x * (s1.x * s2.y - s2.x * s1.y) +
      d1.x * (s2.x * s0.y - s0.x * s2.y) +
      d2.x * (s0.x * s1.y - s1.x * s0.y)) / denom;
  const f =
    (d0.y * (s1.x * s2.y - s2.x * s1.y) +
      d1.y * (s2.x * s0.y - s0.x * s2.y) +
      d2.y * (s0.x * s1.y - s1.x * s0.y)) / denom;

  ctx.setTransform(a, b, c, d, e, f);

  // Draw the whole image; clipping + transform restrict to the triangle
  ctx.drawImage(image, 0, 0);

  ctx.restore();
}