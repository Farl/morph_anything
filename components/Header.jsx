import { Fragment, jsxDEV } from "react/jsx-dev-runtime";
import React, { useState } from "react";
import {
  Upload,
  Play,
  FileOutput,
  Triangle as TriangleIcon,
  Info,
  Sparkles
} from "lucide-react";
import { AppMode } from "../types.js";
const Header = ({
  mode,
  image,
  onModeChange,
  onSelectImage,
  onLoadSample,
  canAnimate,
  onOpenExportDialog,
  isExporting,
  hasKeyframes,
  hasMultipleFrames,
  onResetToInitial
}) => {
  const [showTips, setShowTips] = useState(false);
  const isEditMode = mode === AppMode.BUILD;
  const isAnimateMode = mode === AppMode.ANIMATE;
  return /* @__PURE__ */ jsxDEV("header", { className: "relative z-50 flex items-center justify-between px-4 py-3 bg-slate-900/40 border-b border-white/5 backdrop-blur-2xl shadow-[0_10px_40px_rgba(0,0,0,0.6)] shrink-0", children: [
    /* @__PURE__ */ jsxDEV("div", { className: "flex items-center gap-2 min-w-0", children: [
      /* @__PURE__ */ jsxDEV(
        "button",
        {
          type: "button",
          onClick: onResetToInitial,
          className: "p-2 rounded-2xl bg-white/10 border border-white/10 shadow-[0_0_30px_rgba(148,163,184,0.6)] hover:bg-white/20 active:scale-95 transition",
          children: /* @__PURE__ */ jsxDEV(TriangleIcon, { className: "w-5 h-5 text-slate-100" }, void 0, false, {
            fileName: "<stdin>",
            lineNumber: 39,
            columnNumber: 11
          })
        },
        void 0,
        false,
        {
          fileName: "<stdin>",
          lineNumber: 34,
          columnNumber: 9
        }
      ),
      /* @__PURE__ */ jsxDEV("h1", { className: "hidden sm:block text-base md:text-xl font-semibold tracking-tight text-slate-50", children: "Morph Anything" }, void 0, false, {
        fileName: "<stdin>",
        lineNumber: 41,
        columnNumber: 9
      })
    ] }, void 0, true, {
      fileName: "<stdin>",
      lineNumber: 33,
      columnNumber: 7
    }),
    image && /* @__PURE__ */ jsxDEV("div", { className: "flex-1 flex items-center justify-center gap-3", children: [
      /* @__PURE__ */ jsxDEV("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsxDEV(
          "button",
          {
            type: "button",
            onClick: onLoadSample,
            className: "inline-flex items-center justify-center px-2.5 md:px-3 py-1.5 rounded-2xl bg-slate-800/80 hover:bg-slate-700 text-slate-100 border border-white/15 backdrop-blur-xl shadow-[0_0_24px_rgba(15,23,42,0.9)] cursor-pointer text-[10px] md:text-[11px] font-semibold gap-1.5 disabled:opacity-40",
            children: [
              /* @__PURE__ */ jsxDEV(Sparkles, { size: 14, className: "shrink-0" }, void 0, false, {
                fileName: "<stdin>",
                lineNumber: 57,
                columnNumber: 13
              }),
              /* @__PURE__ */ jsxDEV("span", { className: "hidden sm:inline", children: "Sample" }, void 0, false, {
                fileName: "<stdin>",
                lineNumber: 58,
                columnNumber: 13
              })
            ]
          },
          void 0,
          true,
          {
            fileName: "<stdin>",
            lineNumber: 52,
            columnNumber: 11
          }
        ),
        /* @__PURE__ */ jsxDEV(
          "button",
          {
            type: "button",
            onClick: onSelectImage,
            className: "inline-flex items-center justify-center px-2.5 md:px-3 py-1.5 rounded-2xl bg-slate-100/90 hover:bg-white text-slate-950 border border-white/20 backdrop-blur-xl shadow-[0_0_30px_rgba(148,163,184,0.7)] cursor-pointer text-[10px] md:text-[11px] font-semibold gap-2 disabled:opacity-40",
            children: [
              /* @__PURE__ */ jsxDEV(Upload, { size: 14 }, void 0, false, {
                fileName: "<stdin>",
                lineNumber: 66,
                columnNumber: 13
              }),
              /* @__PURE__ */ jsxDEV("span", { className: "hidden sm:inline", children: "Import" }, void 0, false, {
                fileName: "<stdin>",
                lineNumber: 67,
                columnNumber: 13
              })
            ]
          },
          void 0,
          true,
          {
            fileName: "<stdin>",
            lineNumber: 61,
            columnNumber: 11
          }
        )
      ] }, void 0, true, {
        fileName: "<stdin>",
        lineNumber: 50,
        columnNumber: 9
      }),
      /* @__PURE__ */ jsxDEV("div", { className: "inline-flex p-0.5 rounded-2xl bg-slate-900/80 border border-white/10 backdrop-blur-xl shadow-[0_0_30px_rgba(148,163,184,0.6)]", children: [
        /* @__PURE__ */ jsxDEV(
          "button",
          {
            onClick: () => onModeChange(AppMode.BUILD),
            disabled: !image,
            className: `px-3 md:px-4 py-1.5 rounded-2xl text-[11px] md:text-xs font-medium transition ${mode === AppMode.BUILD ? "bg-slate-100 text-slate-950 shadow-[0_0_25px_rgba(148,163,184,0.8)]" : "bg-transparent text-slate-200 hover:text-white"} disabled:opacity-40`,
            children: "Edit"
          },
          void 0,
          false,
          {
            fileName: "<stdin>",
            lineNumber: 73,
            columnNumber: 11
          }
        ),
        /* @__PURE__ */ jsxDEV(
          "button",
          {
            onClick: () => onModeChange(AppMode.ANIMATE),
            disabled: !canAnimate,
            className: `px-3 md:px-4 py-1.5 rounded-2xl text-[11px] md:text-xs font-medium transition inline-flex items-center gap-1.5 ${mode === AppMode.ANIMATE ? "bg-slate-100 text-slate-950 shadow-[0_0_25px_rgba(148,163,184,0.8)]" : "bg-transparent text-slate-200 hover:text-white"} disabled:opacity-40`,
            children: [
              /* @__PURE__ */ jsxDEV(Play, { size: 14 }, void 0, false, {
                fileName: "<stdin>",
                lineNumber: 93,
                columnNumber: 13
              }),
              "Animate"
            ]
          },
          void 0,
          true,
          {
            fileName: "<stdin>",
            lineNumber: 84,
            columnNumber: 11
          }
        )
      ] }, void 0, true, {
        fileName: "<stdin>",
        lineNumber: 72,
        columnNumber: 9
      }),
      isAnimateMode && hasKeyframes && /* @__PURE__ */ jsxDEV(
        "button",
        {
          onClick: onOpenExportDialog,
          disabled: isExporting,
          className: "inline-flex items-center justify-center px-2.5 md:px-3 py-1.5 rounded-2xl text-[10px] md:text-[11px] font-semibold text-slate-950 bg-slate-100/90 hover:bg-white disabled:opacity-40 border border-white/20 backdrop-blur-xl shadow-[0_0_40px_rgba(148,163,184,0.8)] active:scale-95 transition gap-2",
          children: [
            /* @__PURE__ */ jsxDEV(FileOutput, { size: 14, className: "shrink-0" }, void 0, false, {
              fileName: "<stdin>",
              lineNumber: 105,
              columnNumber: 13
            }),
            /* @__PURE__ */ jsxDEV("span", { className: "hidden sm:inline", children: "Export" }, void 0, false, {
              fileName: "<stdin>",
              lineNumber: 106,
              columnNumber: 13
            })
          ]
        },
        void 0,
        true,
        {
          fileName: "<stdin>",
          lineNumber: 100,
          columnNumber: 11
        }
      )
    ] }, void 0, true, {
      fileName: "<stdin>",
      lineNumber: 48,
      columnNumber: 9
    }),
    /* @__PURE__ */ jsxDEV("div", { className: "relative", children: [
      /* @__PURE__ */ jsxDEV(
        "button",
        {
          type: "button",
          onClick: () => setShowTips((v) => !v),
          className: "inline-flex items-center justify-center w-8 h-8 rounded-full border border-slate-500/70 bg-slate-900/80 text-slate-200 hover:text-white hover:bg-slate-800/90 shadow-[0_0_18px_rgba(148,163,184,0.6)]",
          children: /* @__PURE__ */ jsxDEV(Info, { size: 14 }, void 0, false, {
            fileName: "<stdin>",
            lineNumber: 119,
            columnNumber: 11
          })
        },
        void 0,
        false,
        {
          fileName: "<stdin>",
          lineNumber: 114,
          columnNumber: 9
        }
      ),
      showTips && /* @__PURE__ */ jsxDEV("div", { className: "absolute right-0 mt-2 w-64 rounded-2xl bg-slate-950/95 border border-white/10 shadow-[0_18px_40px_rgba(0,0,0,0.85)] px-3 py-3 text-[11px] text-slate-200 z-50", children: [
        isEditMode && /* @__PURE__ */ jsxDEV(Fragment, { children: [
          /* @__PURE__ */ jsxDEV("p", { className: "text-[10px] font-semibold uppercase tracking-[0.18em] mb-1 text-slate-300", children: "Edit mesh tips" }, void 0, false, {
            fileName: "<stdin>",
            lineNumber: 125,
            columnNumber: 17
          }),
          /* @__PURE__ */ jsxDEV("ul", { className: "space-y-1.5 text-slate-300", children: [
            /* @__PURE__ */ jsxDEV("li", { className: "flex gap-1.5", children: [
              /* @__PURE__ */ jsxDEV("span", { className: "mt-[2px] h-1.5 w-1.5 rounded-full bg-slate-400" }, void 0, false, {
                fileName: "<stdin>",
                lineNumber: 130,
                columnNumber: 21
              }),
              /* @__PURE__ */ jsxDEV("span", { children: [
                "Tap or click on the image to",
                " ",
                /* @__PURE__ */ jsxDEV("span", { className: "font-semibold text-slate-50", children: "add a vertex" }, void 0, false, {
                  fileName: "<stdin>",
                  lineNumber: 133,
                  columnNumber: 23
                }),
                "."
              ] }, void 0, true, {
                fileName: "<stdin>",
                lineNumber: 131,
                columnNumber: 21
              })
            ] }, void 0, true, {
              fileName: "<stdin>",
              lineNumber: 129,
              columnNumber: 19
            }),
            /* @__PURE__ */ jsxDEV("li", { className: "flex gap-1.5", children: [
              /* @__PURE__ */ jsxDEV("span", { className: "mt-[2px] h-1.5 w-1.5 rounded-full bg-slate-400" }, void 0, false, {
                fileName: "<stdin>",
                lineNumber: 140,
                columnNumber: 21
              }),
              /* @__PURE__ */ jsxDEV("span", { children: [
                "Drag a vertex to",
                " ",
                /* @__PURE__ */ jsxDEV("span", { className: "font-semibold text-slate-50", children: "move" }, void 0, false, {
                  fileName: "<stdin>",
                  lineNumber: 143,
                  columnNumber: 23
                }),
                " ",
                "it."
              ] }, void 0, true, {
                fileName: "<stdin>",
                lineNumber: 141,
                columnNumber: 21
              })
            ] }, void 0, true, {
              fileName: "<stdin>",
              lineNumber: 139,
              columnNumber: 19
            }),
            /* @__PURE__ */ jsxDEV("li", { className: "flex gap-1.5", children: [
              /* @__PURE__ */ jsxDEV("span", { className: "mt-[2px] h-1.5 w-1.5 rounded-full bg-slate-400" }, void 0, false, {
                fileName: "<stdin>",
                lineNumber: 150,
                columnNumber: 21
              }),
              /* @__PURE__ */ jsxDEV("span", { children: [
                "On desktop,",
                " ",
                /* @__PURE__ */ jsxDEV("span", { className: "font-semibold text-slate-50", children: "right-click" }, void 0, false, {
                  fileName: "<stdin>",
                  lineNumber: 153,
                  columnNumber: 23
                }),
                " ",
                "a vertex to delete. On touch, use the",
                " ",
                /* @__PURE__ */ jsxDEV("span", { className: "font-semibold text-slate-50", children: "Delete tool" }, void 0, false, {
                  fileName: "<stdin>",
                  lineNumber: 157,
                  columnNumber: 23
                }),
                " ",
                "then tap a vertex."
              ] }, void 0, true, {
                fileName: "<stdin>",
                lineNumber: 151,
                columnNumber: 21
              })
            ] }, void 0, true, {
              fileName: "<stdin>",
              lineNumber: 149,
              columnNumber: 19
            })
          ] }, void 0, true, {
            fileName: "<stdin>",
            lineNumber: 128,
            columnNumber: 17
          })
        ] }, void 0, true, {
          fileName: "<stdin>",
          lineNumber: 124,
          columnNumber: 15
        }),
        isAnimateMode && /* @__PURE__ */ jsxDEV(Fragment, { children: [
          /* @__PURE__ */ jsxDEV("p", { className: "text-[10px] font-semibold uppercase tracking-[0.18em] mb-1 text-slate-300", children: "Animate tips" }, void 0, false, {
            fileName: "<stdin>",
            lineNumber: 168,
            columnNumber: 17
          }),
          /* @__PURE__ */ jsxDEV("ul", { className: "space-y-1.5 text-slate-300", children: [
            /* @__PURE__ */ jsxDEV("li", { className: "flex gap-1.5", children: [
              /* @__PURE__ */ jsxDEV("span", { className: "mt-[2px] h-1.5 w-1.5 rounded-full bg-slate-400" }, void 0, false, {
                fileName: "<stdin>",
                lineNumber: 173,
                columnNumber: 21
              }),
              /* @__PURE__ */ jsxDEV("span", { children: [
                "Use the",
                " ",
                /* @__PURE__ */ jsxDEV("span", { className: "font-semibold text-slate-50", children: "timeline keyframes" }, void 0, false, {
                  fileName: "<stdin>",
                  lineNumber: 176,
                  columnNumber: 23
                }),
                " ",
                "to sculpt poses and control timing."
              ] }, void 0, true, {
                fileName: "<stdin>",
                lineNumber: 174,
                columnNumber: 21
              })
            ] }, void 0, true, {
              fileName: "<stdin>",
              lineNumber: 172,
              columnNumber: 19
            }),
            /* @__PURE__ */ jsxDEV("li", { className: "flex gap-1.5", children: [
              /* @__PURE__ */ jsxDEV("span", { className: "mt-[2px] h-1.5 w-1.5 rounded-full bg-slate-400" }, void 0, false, {
                fileName: "<stdin>",
                lineNumber: 183,
                columnNumber: 21
              }),
              /* @__PURE__ */ jsxDEV("span", { children: [
                "Drag on empty space to",
                " ",
                /* @__PURE__ */ jsxDEV("span", { className: "font-semibold text-slate-50", children: "box-select vertices" }, void 0, false, {
                  fileName: "<stdin>",
                  lineNumber: 186,
                  columnNumber: 23
                }),
                ", then move, scale, or rotate the selection like Figma."
              ] }, void 0, true, {
                fileName: "<stdin>",
                lineNumber: 184,
                columnNumber: 21
              })
            ] }, void 0, true, {
              fileName: "<stdin>",
              lineNumber: 182,
              columnNumber: 19
            }),
            /* @__PURE__ */ jsxDEV("li", { className: "flex gap-1.5", children: [
              /* @__PURE__ */ jsxDEV("span", { className: "mt-[2px] h-1.5 w-1.5 rounded-full bg-slate-400" }, void 0, false, {
                fileName: "<stdin>",
                lineNumber: 193,
                columnNumber: 21
              }),
              /* @__PURE__ */ jsxDEV("span", { children: [
                "Adjust the",
                " ",
                /* @__PURE__ */ jsxDEV("span", { className: "font-semibold text-slate-50", children: "duration" }, void 0, false, {
                  fileName: "<stdin>",
                  lineNumber: 196,
                  columnNumber: 23
                }),
                " ",
                "on each keyframe card to fine-tune motion speed."
              ] }, void 0, true, {
                fileName: "<stdin>",
                lineNumber: 194,
                columnNumber: 21
              })
            ] }, void 0, true, {
              fileName: "<stdin>",
              lineNumber: 192,
              columnNumber: 19
            })
          ] }, void 0, true, {
            fileName: "<stdin>",
            lineNumber: 171,
            columnNumber: 17
          })
        ] }, void 0, true, {
          fileName: "<stdin>",
          lineNumber: 167,
          columnNumber: 15
        })
      ] }, void 0, true, {
        fileName: "<stdin>",
        lineNumber: 122,
        columnNumber: 11
      })
    ] }, void 0, true, {
      fileName: "<stdin>",
      lineNumber: 113,
      columnNumber: 7
    })
  ] }, void 0, true, {
    fileName: "<stdin>",
    lineNumber: 31,
    columnNumber: 5
  });
};
var stdin_default = Header;
export {
  stdin_default as default
};
