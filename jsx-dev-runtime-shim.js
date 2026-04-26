// Shim: maps react/jsx-dev-runtime to production-safe equivalents.
// The source files are pre-compiled by websim and explicitly call jsxDEV(),
// but React sets jsxDEV=undefined in production builds. This shim fixes that.
import { jsx, jsxs, Fragment } from 'react/jsx-runtime';

export { Fragment };

export function jsxDEV(type, props, key, isStaticChildren) {
  return isStaticChildren ? jsxs(type, props, key) : jsx(type, props, key);
}
