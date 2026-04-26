export const AppMode = {
  UPLOAD: "UPLOAD",
  BUILD: "BUILD",
  ANIMATE: "ANIMATE",
};

/**
 * @typedef {{x:number,y:number}} Point
 */

/**
 * @typedef {{id:number,pos:Point,uv:Point}} Vertex
 */

/**
 * @typedef {{id:string,indices:[number,number,number]}} Triangle
 */

/**
 * @typedef {{id:string,positions:Record<number, Point>,duration:number,preview?:string}} Keyframe
 */