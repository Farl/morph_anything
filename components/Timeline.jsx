import { jsxDEV } from "react/jsx-dev-runtime";
import React, { useState, useEffect } from "react";
import {
  Play,
  Pause,
  RotateCcw,
  Image as ImageIcon,
  X,
  ChevronRight,
  Square,
  Plus,
  Clock,
  ChevronUp,
  ChevronDown
} from "lucide-react";
import { AppMode } from "../types.js";
const DurationField = ({ value, onCommit }) => {
  const [draft, setDraft] = useState(String(value || 1e3));
  useEffect(() => {
    setDraft(String(value || 1e3));
  }, [value]);
  const clamp = (val) => Math.max(100, Math.min(5e3, val));
  const commit = () => {
    const num = parseInt(draft, 10);
    if (Number.isNaN(num)) {
      setDraft(String(value || 1e3));
      return;
    }
    const clamped = clamp(num);
    setDraft(String(clamped));
    onCommit(clamped);
  };
  return /* @__PURE__ */ jsxDEV("div", { className: "w-full flex items-center gap-1.5", children: [
    /* @__PURE__ */ jsxDEV(Clock, { className: "w-3 h-3 text-slate-400" }, void 0, false, {
      fileName: "<stdin>",
      lineNumber: 40,
      columnNumber: 7
    }),
    /* @__PURE__ */ jsxDEV(
      "input",
      {
        type: "number",
        min: 100,
        max: 5e3,
        step: 100,
        value: draft,
        onChange: (e) => setDraft(e.target.value),
        onBlur: commit,
        onKeyDown: (e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            commit();
          }
          if (e.key === "Escape") {
            e.preventDefault();
            setDraft(String(value || 1e3));
          }
        },
        className: "w-full px-2 py-0.5 rounded-md bg-slate-900/80 border border-white/15 text-[9px] text-slate-100 text-right focus:outline-none focus:ring-1 focus:ring-slate-400"
      },
      void 0,
      false,
      {
        fileName: "<stdin>",
        lineNumber: 41,
        columnNumber: 7
      }
    )
  ] }, void 0, true, {
    fileName: "<stdin>",
    lineNumber: 39,
    columnNumber: 5
  });
};
const Timeline = ({
  mode,
  keyframes,
  isPlaying,
  setIsPlaying,
  restoreBasePose,
  activeKeyframeId,
  setActiveKeyframeId,
  setVertices,
  moveKeyframe,
  addKeyframe,
  deleteKeyframe,
  updateKeyframeDuration,
  activeSegmentIndex,
  draggingKeyframeId,
  setDraggingKeyframeId,
  dragOverIndex,
  setDragOverIndex,
  showTimeline,
  onToggleTimeline
}) => {
  if (mode !== AppMode.ANIMATE) return null;
  return /* @__PURE__ */ jsxDEV(
    "footer",
    {
      className: `${showTimeline ? "h-52" : "h-16"} flex flex-col shrink-0 bg-slate-950/60 border-t border-white/5 backdrop-blur-2xl shadow-[0_-18px_60px_rgba(0,0,0,0.9)]`,
      children: [
        /* @__PURE__ */ jsxDEV("div", { className: "flex items-center justify-between px-4 py-3 bg-slate-900/50 border-b border-white/5", children: [
          /* @__PURE__ */ jsxDEV("div", { className: "flex items-center gap-2", children: /* @__PURE__ */ jsxDEV(
            "button",
            {
              onClick: () => {
                setIsPlaying(false);
                restoreBasePose();
              },
              className: "px-3 py-2 rounded-2xl font-medium text-xs md:text-sm transition border border-white/15 backdrop-blur-xl bg-slate-900/70 hover:bg-slate-800/80 text-slate-100 shadow-[0_0_20px_rgba(15,23,42,0.8)]",
              title: "Reset to base pose",
              children: "Reset"
            },
            void 0,
            false,
            {
              fileName: "<stdin>",
              lineNumber: 97,
              columnNumber: 11
            }
          ) }, void 0, false, {
            fileName: "<stdin>",
            lineNumber: 96,
            columnNumber: 9
          }),
          /* @__PURE__ */ jsxDEV("div", { className: "flex items-center justify-center", children: /* @__PURE__ */ jsxDEV(
            "button",
            {
              onClick: () => {
                setIsPlaying(false);
                onToggleTimeline();
              },
              className: "flex items-center justify-center w-8 h-8 rounded-full border border-white/20 bg-slate-900/80 text-slate-200 hover:text-white hover:bg-slate-800/90",
              title: showTimeline ? "Hide keyframes" : "Show keyframes",
              children: showTimeline ? /* @__PURE__ */ jsxDEV(ChevronDown, { size: 16 }, void 0, false, {
                fileName: "<stdin>",
                lineNumber: 122,
                columnNumber: 15
              }) : /* @__PURE__ */ jsxDEV(ChevronUp, { size: 16 }, void 0, false, {
                fileName: "<stdin>",
                lineNumber: 124,
                columnNumber: 15
              })
            },
            void 0,
            false,
            {
              fileName: "<stdin>",
              lineNumber: 112,
              columnNumber: 11
            }
          ) }, void 0, false, {
            fileName: "<stdin>",
            lineNumber: 111,
            columnNumber: 9
          }),
          /* @__PURE__ */ jsxDEV("div", { className: "flex items-center gap-3", children: /* @__PURE__ */ jsxDEV(
            "button",
            {
              onClick: () => setIsPlaying((p) => !p),
              className: `flex items-center justify-center w-9 h-9 rounded-full font-medium text-xs md:text-sm transition shadow-[0_0_30px_rgba(148,163,184,0.7)] border border-white/15 backdrop-blur-xl ${isPlaying ? "bg-slate-200 text-slate-950" : "bg-slate-100/90 text-slate-950"}`,
              title: isPlaying ? "Pause" : "Play loop",
              children: isPlaying ? /* @__PURE__ */ jsxDEV(Pause, { size: 16 }, void 0, false, {
                fileName: "<stdin>",
                lineNumber: 140,
                columnNumber: 26
              }) : /* @__PURE__ */ jsxDEV(Play, { size: 16 }, void 0, false, {
                fileName: "<stdin>",
                lineNumber: 140,
                columnNumber: 48
              })
            },
            void 0,
            false,
            {
              fileName: "<stdin>",
              lineNumber: 131,
              columnNumber: 11
            }
          ) }, void 0, false, {
            fileName: "<stdin>",
            lineNumber: 130,
            columnNumber: 9
          })
        ] }, void 0, true, {
          fileName: "<stdin>",
          lineNumber: 94,
          columnNumber: 7
        }),
        showTimeline && /* @__PURE__ */ jsxDEV("div", { className: "flex-1 flex items-center gap-4 px-4 overflow-x-auto custom-scrollbar", children: [
          keyframes.map((kf, index) => /* @__PURE__ */ jsxDEV(
            "div",
            {
              onClick: () => {
                setIsPlaying(false);
                setActiveKeyframeId(kf.id);
                setVertices(
                  (prev) => prev.map((v) => ({
                    ...v,
                    pos: { ...kf.positions[v.id] || v.pos }
                  }))
                );
              },
              draggable: true,
              onDragStart: (e) => {
                e.dataTransfer.effectAllowed = "move";
                setDraggingKeyframeId(kf.id);
              },
              onDragOver: (e) => {
                e.preventDefault();
                setDragOverIndex(index);
              },
              onDrop: (e) => {
                e.preventDefault();
                if (draggingKeyframeId) {
                  moveKeyframe(draggingKeyframeId, index);
                }
                setDragOverIndex(null);
              },
              onDragEnd: () => {
                setDraggingKeyframeId(null);
                setDragOverIndex(null);
              },
              className: `relative w-28 h-28 flex-none rounded-2xl border-2 transition-all cursor-pointer group flex flex-col items-center bg-slate-900/50 backdrop-blur-2xl overflow-hidden shadow-[0_18px_60px_rgba(15,23,42,0.85)] ${activeKeyframeId === kf.id ? "border-slate-100 shadow-[0_0_40px_rgba(148,163,184,0.9)] -translate-y-1 scale-105 z-10" : "border-white/10 hover:border-white/30"} ${activeSegmentIndex === index && isPlaying ? "after:content-[''] after:absolute after:bottom-0 after:left-0 after:right-0 after:h-1 after:bg-slate-100" : ""} ${dragOverIndex === index ? "border-dashed border-slate-100" : ""} ${draggingKeyframeId === kf.id ? "opacity-60 scale-95" : ""}`,
              children: [
                /* @__PURE__ */ jsxDEV("div", { className: "flex-1 w-full bg-slate-900/60 flex items-center justify-center overflow-hidden p-1", children: [
                  kf.preview ? /* @__PURE__ */ jsxDEV(
                    "img",
                    {
                      src: kf.preview,
                      className: "max-w-full max-h-full object-contain rounded-md",
                      alt: `Pose ${index + 1}`
                    },
                    void 0,
                    false,
                    {
                      fileName: "<stdin>",
                      lineNumber: 197,
                      columnNumber: 17
                    }
                  ) : /* @__PURE__ */ jsxDEV(ImageIcon, { className: "w-7 h-7 text-slate-500 opacity-50" }, void 0, false, {
                    fileName: "<stdin>",
                    lineNumber: 203,
                    columnNumber: 17
                  }),
                  /* @__PURE__ */ jsxDEV("div", { className: "absolute top-1.5 left-1.5 bg-black/60 backdrop-blur px-1.5 py-0.5 rounded-full text-[8px] font-semibold text-slate-50 border border-white/20", children: index + 1 }, void 0, false, {
                    fileName: "<stdin>",
                    lineNumber: 205,
                    columnNumber: 15
                  })
                ] }, void 0, true, {
                  fileName: "<stdin>",
                  lineNumber: 195,
                  columnNumber: 13
                }),
                /* @__PURE__ */ jsxDEV(
                  "button",
                  {
                    onClick: (e) => {
                      e.stopPropagation();
                      setIsPlaying(false);
                      deleteKeyframe(kf.id);
                    },
                    className: "absolute top-1.5 right-1.5 p-1 rounded-full bg-black/60 text-slate-300 hover:text-slate-50 hover:bg-rose-500/80 transition-all z-20",
                    title: "Remove keyframe",
                    children: /* @__PURE__ */ jsxDEV(X, { size: 10 }, void 0, false, {
                      fileName: "<stdin>",
                      lineNumber: 220,
                      columnNumber: 15
                    })
                  },
                  void 0,
                  false,
                  {
                    fileName: "<stdin>",
                    lineNumber: 210,
                    columnNumber: 13
                  }
                ),
                index < keyframes.length - 1 && /* @__PURE__ */ jsxDEV("div", { className: "absolute -right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none group-hover:text-slate-100 transition-colors", children: /* @__PURE__ */ jsxDEV(ChevronRight, { size: 18 }, void 0, false, {
                  fileName: "<stdin>",
                  lineNumber: 225,
                  columnNumber: 17
                }) }, void 0, false, {
                  fileName: "<stdin>",
                  lineNumber: 224,
                  columnNumber: 15
                }),
                /* @__PURE__ */ jsxDEV(
                  "div",
                  {
                    className: "w-full px-2 py-1.5 border-t border-white/10 bg-slate-950/40 flex items-center justify-center",
                    onClick: (e) => e.stopPropagation(),
                    children: /* @__PURE__ */ jsxDEV(
                      DurationField,
                      {
                        value: kf.duration || 1e3,
                        onCommit: (val) => updateKeyframeDuration(kf.id, val)
                      },
                      void 0,
                      false,
                      {
                        fileName: "<stdin>",
                        lineNumber: 233,
                        columnNumber: 15
                      }
                    )
                  },
                  void 0,
                  false,
                  {
                    fileName: "<stdin>",
                    lineNumber: 229,
                    columnNumber: 13
                  }
                )
              ]
            },
            kf.id,
            true,
            {
              fileName: "<stdin>",
              lineNumber: 148,
              columnNumber: 11
            }
          )),
          /* @__PURE__ */ jsxDEV(
            "button",
            {
              type: "button",
              onClick: () => {
                setIsPlaying(false);
                addKeyframe();
              },
              className: "relative w-28 h-28 flex-none rounded-2xl border-2 border-dashed border-white/20 hover:border-white/40 bg-slate-900/40 backdrop-blur-2xl flex items-center justify-center shadow-[0_18px_60px_rgba(15,23,42,0.85)] text-slate-200 hover:text-slate-50 transition",
              children: /* @__PURE__ */ jsxDEV(Plus, { size: 20 }, void 0, false, {
                fileName: "<stdin>",
                lineNumber: 251,
                columnNumber: 11
              })
            },
            void 0,
            false,
            {
              fileName: "<stdin>",
              lineNumber: 242,
              columnNumber: 9
            }
          ),
          /* @__PURE__ */ jsxDEV("div", { className: "min-w-[40px] h-full" }, void 0, false, {
            fileName: "<stdin>",
            lineNumber: 254,
            columnNumber: 9
          })
        ] }, void 0, true, {
          fileName: "<stdin>",
          lineNumber: 146,
          columnNumber: 9
        })
      ]
    },
    void 0,
    true,
    {
      fileName: "<stdin>",
      lineNumber: 89,
      columnNumber: 5
    }
  );
};
var stdin_default = Timeline;
export {
  stdin_default as default
};
