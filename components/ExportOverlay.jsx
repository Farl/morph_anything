import { jsxDEV } from "react/jsx-dev-runtime";
import React from "react";
import { Film } from "lucide-react";
const ExportOverlay = ({ isExporting }) => {
  if (!isExporting) return null;
  return /* @__PURE__ */ jsxDEV("div", { className: "fixed inset-0 z-50 flex flex-col items-center justify-center gap-6 bg-slate-950/90 backdrop-blur-3xl", children: [
    /* @__PURE__ */ jsxDEV("div", { className: "relative", children: [
      /* @__PURE__ */ jsxDEV("div", { className: "w-20 h-20 border-4 border-white/10 border-t-white/70 rounded-full animate-spin" }, void 0, false, {
        fileName: "<stdin>",
        lineNumber: 10,
        columnNumber: 9
      }),
      /* @__PURE__ */ jsxDEV(
        Film,
        {
          className: "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-slate-100 animate-pulse",
          size: 32
        },
        void 0,
        false,
        {
          fileName: "<stdin>",
          lineNumber: 11,
          columnNumber: 9
        }
      )
    ] }, void 0, true, {
      fileName: "<stdin>",
      lineNumber: 9,
      columnNumber: 7
    }),
    /* @__PURE__ */ jsxDEV("div", { className: "text-center max-w-xs px-4", children: [
      /* @__PURE__ */ jsxDEV("h2", { className: "text-2xl font-semibold text-slate-50 tracking-[0.18em] uppercase mb-3", children: "Rendering" }, void 0, false, {
        fileName: "<stdin>",
        lineNumber: 17,
        columnNumber: 9
      }),
      /* @__PURE__ */ jsxDEV("div", { className: "h-1.5 w-full bg-slate-800/80 rounded-full overflow-hidden mb-3", children: /* @__PURE__ */ jsxDEV(
        "div",
        {
          className: "h-full bg-slate-100 animate-progress-indet",
          style: { width: "60%" }
        },
        void 0,
        false,
        {
          fileName: "<stdin>",
          lineNumber: 21,
          columnNumber: 11
        }
      ) }, void 0, false, {
        fileName: "<stdin>",
        lineNumber: 20,
        columnNumber: 9
      }),
      /* @__PURE__ */ jsxDEV("p", { className: "text-slate-200 text-xs font-medium leading-relaxed", children: "Encoding your animation into a video. This may take a few seconds depending on the length of your loop." }, void 0, false, {
        fileName: "<stdin>",
        lineNumber: 26,
        columnNumber: 9
      })
    ] }, void 0, true, {
      fileName: "<stdin>",
      lineNumber: 16,
      columnNumber: 7
    })
  ] }, void 0, true, {
    fileName: "<stdin>",
    lineNumber: 8,
    columnNumber: 5
  });
};
var stdin_default = ExportOverlay;
export {
  stdin_default as default
};
