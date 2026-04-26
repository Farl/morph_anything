import { Fragment, jsxDEV } from "react/jsx-dev-runtime";
import React from "react";
import { PlusCircle, Trash, Plus, RotateCw, X } from "lucide-react";
import { AppMode } from "./types.js";
import Header from "./components/Header.jsx";
import Sidebar from "./components/Sidebar.jsx";
import Timeline from "./components/Timeline.jsx";
import ExportOverlay from "./components/ExportOverlay.jsx";
import ExportDialog from "./components/ExportDialog.jsx";
import { useMorphApp } from "./hooks/useMorphApp.js";
const App = () => {
  const {
    mode,
    image,
    vertices,
    keyframes,
    activeKeyframeId,
    isPlaying,
    activeSegmentIndex,
    isExporting,
    isExportDialogOpen,
    draggingKeyframeId,
    dragOverIndex,
    editTool,
    dragId,
    showTimeline,
    canvasRef,
    containerRef,
    workspaceRef,
    fileInputRef,
    setVertices,
    setIsPlaying,
    setActiveKeyframeId,
    setDraggingKeyframeId,
    setDragOverIndex,
    setEditTool,
    handleImageUpload,
    handleImageDrop,
    handleContainerClick,
    handleContainerMouseDown,
    handleContainerTouchStart,
    handleVertexMouseDown,
    handleVertexTouchStart,
    handleMouseMove,
    handleDragMove,
    stopDragging,
    handleModeTabClick,
    addKeyframe,
    deleteKeyframe,
    moveKeyframe,
    updateKeyframeDuration,
    restoreBasePose,
    containerStyle,
    handleSelectImage,
    openExportDialog,
    closeExportDialog,
    exportMp4,
    exportGif,
    exportJpg,
    currentTriangles,
    selectedVertexIds,
    selectionRect,
    selectionBounds,
    handleSelectionHandleMouseDown,
    toggleTimelineVisibility,
    stopPlayback,
    loadSampleWebsimMan,
    pasteFromClipboard,
    resetToInitialScreen
  } = useMorphApp();
  return /* @__PURE__ */ jsxDEV(
    "div",
    {
      className: "flex flex-col h-full text-slate-50 font-sans bg-[radial-gradient(circle_at_top,_#1f2937_0,_#020617_55%,_#000000_100%)]",
      onDragOver: (e) => {
        e.preventDefault();
      },
      onDrop: handleImageDrop,
      children: [
        /* @__PURE__ */ jsxDEV(
          "input",
          {
            ref: fileInputRef,
            type: "file",
            className: "hidden",
            accept: "image/*",
            onChange: handleImageUpload
          },
          void 0,
          false,
          {
            fileName: "<stdin>",
            lineNumber: 82,
            columnNumber: 7
          }
        ),
        /* @__PURE__ */ jsxDEV(
          Header,
          {
            mode,
            image,
            onModeChange: handleModeTabClick,
            onSelectImage: handleSelectImage,
            onLoadSample: loadSampleWebsimMan,
            canAnimate: !!image && vertices && vertices.length >= 3,
            onOpenExportDialog: openExportDialog,
            isExporting,
            hasKeyframes: keyframes && keyframes.length > 0,
            hasMultipleFrames: keyframes && keyframes.length > 1,
            onResetToInitial: resetToInitialScreen
          },
          void 0,
          false,
          {
            fileName: "<stdin>",
            lineNumber: 90,
            columnNumber: 7
          }
        ),
        /* @__PURE__ */ jsxDEV("main", { className: "flex-1 flex overflow-hidden", children: [
          /* @__PURE__ */ jsxDEV(
            Sidebar,
            {
              mode
            },
            void 0,
            false,
            {
              fileName: "<stdin>",
              lineNumber: 105,
              columnNumber: 9
            }
          ),
          /* @__PURE__ */ jsxDEV(
            "div",
            {
              ref: workspaceRef,
              className: "flex-1 flex flex-col items-center justify-center bg-transparent gap-3",
              children: [
                /* @__PURE__ */ jsxDEV(
                  "div",
                  {
                    ref: containerRef,
                    style: containerStyle,
                    className: "relative overflow-hidden select-none bg-black/90",
                    onMouseDown: handleContainerMouseDown,
                    onClick: handleContainerClick,
                    onMouseMove: handleMouseMove,
                    onMouseUp: stopDragging,
                    onTouchStart: handleContainerTouchStart,
                    onTouchMove: (e) => {
                      if (e.touches && e.touches.length > 0) {
                        e.preventDefault();
                        const t = e.touches[0];
                        handleDragMove(t.clientX, t.clientY);
                      }
                    },
                    onTouchEnd: stopDragging,
                    onTouchCancel: stopDragging,
                    onContextMenu: (e) => e.preventDefault(),
                    children: [
                      image && /* @__PURE__ */ jsxDEV(Fragment, { children: [
                        /* @__PURE__ */ jsxDEV(
                          "img",
                          {
                            src: image.src,
                            draggable: false,
                            className: `absolute inset-0 w-full h-full object-contain select-none pointer-events-none transition-opacity duration-700 ${mode === AppMode.ANIMATE ? "opacity-10" : "opacity-70"}`,
                            alt: "Reference"
                          },
                          void 0,
                          false,
                          {
                            fileName: "<stdin>",
                            lineNumber: 136,
                            columnNumber: 17
                          }
                        ),
                        !isPlaying && !isExporting && /* @__PURE__ */ jsxDEV(Fragment, { children: [
                          /* @__PURE__ */ jsxDEV(
                            "svg",
                            {
                              className: "absolute inset-0 w-full h-full z-10 pointer-events-none",
                              viewBox: "0 0 100 100",
                              preserveAspectRatio: "none",
                              children: currentTriangles.map((tri) => {
                                const v0 = vertices.find(
                                  (v) => v.id === tri.indices[0]
                                );
                                const v1 = vertices.find(
                                  (v) => v.id === tri.indices[1]
                                );
                                const v2 = vertices.find(
                                  (v) => v.id === tri.indices[2]
                                );
                                if (!v0 || !v1 || !v2) return null;
                                return /* @__PURE__ */ jsxDEV(
                                  "polygon",
                                  {
                                    points: `${v0.pos.x * 100},${v0.pos.y * 100} ${v1.pos.x * 100},${v1.pos.y * 100} ${v2.pos.x * 100},${v2.pos.y * 100}`,
                                    fill: mode === AppMode.BUILD ? "rgba(148, 163, 184, 0.08)" : "none",
                                    stroke: mode === AppMode.BUILD ? "rgba(148, 163, 184, 0.65)" : "rgba(248, 250, 252, 0.07)",
                                    strokeWidth: "0.12"
                                  },
                                  tri.id,
                                  false,
                                  {
                                    fileName: "<stdin>",
                                    lineNumber: 163,
                                    columnNumber: 27
                                  }
                                );
                              })
                            },
                            void 0,
                            false,
                            {
                              fileName: "<stdin>",
                              lineNumber: 146,
                              columnNumber: 21
                            }
                          ),
                          vertices.map((v) => {
                            const isSelected = selectedVertexIds.includes(v.id);
                            return /* @__PURE__ */ jsxDEV(
                              "div",
                              {
                                onMouseDown: (e) => handleVertexMouseDown(v.id, e),
                                onTouchStart: (e) => handleVertexTouchStart(v.id, e),
                                className: `absolute w-3 h-3 -ml-[6px] -mt-[6px] rounded-full border shadow-lg cursor-grab active:cursor-grabbing z-30 transition-transform hover:scale-125 ${dragId === v.id ? "bg-slate-100 border-slate-900 ring-4 ring-slate-100/30 scale-110" : isSelected ? "bg-emerald-300 border-emerald-900 ring-2 ring-emerald-400/60 opacity-100" : "bg-slate-200/80 border-slate-900/60 hover:opacity-100 opacity-80"}`,
                                style: {
                                  left: `${v.pos.x * 100}%`,
                                  top: `${v.pos.y * 100}%`
                                }
                              },
                              v.id,
                              false,
                              {
                                fileName: "<stdin>",
                                lineNumber: 189,
                                columnNumber: 25
                              }
                            );
                          }),
                          selectionRect && /* @__PURE__ */ jsxDEV(
                            "div",
                            {
                              className: "absolute border border-emerald-400/80 bg-emerald-400/10 pointer-events-none z-40",
                              style: {
                                left: `${Math.min(
                                  selectionRect.x0,
                                  selectionRect.x1
                                )}px`,
                                top: `${Math.min(
                                  selectionRect.y0,
                                  selectionRect.y1
                                )}px`,
                                width: `${Math.abs(
                                  selectionRect.x1 - selectionRect.x0
                                )}px`,
                                height: `${Math.abs(
                                  selectionRect.y1 - selectionRect.y0
                                )}px`
                              }
                            },
                            void 0,
                            false,
                            {
                              fileName: "<stdin>",
                              lineNumber: 210,
                              columnNumber: 23
                            }
                          ),
                          selectionBounds && /* @__PURE__ */ jsxDEV(
                            "div",
                            {
                              className: "absolute pointer-events-none z-40",
                              style: {
                                left: `${selectionBounds.minX * 100}%`,
                                top: `${selectionBounds.minY * 100}%`,
                                width: `${(selectionBounds.maxX - selectionBounds.minX) * 100}%`,
                                height: `${(selectionBounds.maxY - selectionBounds.minY) * 100}%`
                              },
                              children: [
                                /* @__PURE__ */ jsxDEV(
                                  "div",
                                  {
                                    className: "absolute inset-0 border border-emerald-400/80 rounded-[3px] pointer-events-auto cursor-move",
                                    onMouseDown: (e) => {
                                      e.stopPropagation();
                                      e.preventDefault();
                                      handleSelectionHandleMouseDown(
                                        "translate",
                                        e.clientX,
                                        e.clientY
                                      );
                                    },
                                    onTouchStart: (e) => {
                                      const t = e.touches[0];
                                      e.stopPropagation();
                                      handleSelectionHandleMouseDown(
                                        "translate",
                                        t.clientX,
                                        t.clientY
                                      );
                                    }
                                  },
                                  void 0,
                                  false,
                                  {
                                    fileName: "<stdin>",
                                    lineNumber: 249,
                                    columnNumber: 25
                                  }
                                ),
                                [
                                  { key: "tl", x: 0, y: 0 },
                                  { key: "tr", x: 1, y: 0 },
                                  { key: "br", x: 1, y: 1 },
                                  { key: "bl", x: 0, y: 1 }
                                ].map((h) => /* @__PURE__ */ jsxDEV(
                                  "div",
                                  {
                                    className: "absolute w-3 h-3 -ml-[6px] -mt-[6px] bg-emerald-300 border border-emerald-900 rounded-sm shadow pointer-events-auto",
                                    style: {
                                      left: `${h.x * 100}%`,
                                      top: `${h.y * 100}%`
                                    },
                                    onMouseDown: (e) => {
                                      e.stopPropagation();
                                      e.preventDefault();
                                      handleSelectionHandleMouseDown(
                                        "scale",
                                        e.clientX,
                                        e.clientY
                                      );
                                    },
                                    onTouchStart: (e) => {
                                      const t = e.touches[0];
                                      e.stopPropagation();
                                      handleSelectionHandleMouseDown(
                                        "scale",
                                        t.clientX,
                                        t.clientY
                                      );
                                    }
                                  },
                                  h.key,
                                  false,
                                  {
                                    fileName: "<stdin>",
                                    lineNumber: 278,
                                    columnNumber: 27
                                  }
                                )),
                                /* @__PURE__ */ jsxDEV(
                                  "div",
                                  {
                                    className: "absolute w-5 h-5 -mt-6 left-1/2 -ml-2.5 bg-slate-950/90 border border-emerald-300 rounded-full shadow pointer-events-auto flex items-center justify-center",
                                    onMouseDown: (e) => {
                                      e.stopPropagation();
                                      e.preventDefault();
                                      handleSelectionHandleMouseDown(
                                        "rotate",
                                        e.clientX,
                                        e.clientY
                                      );
                                    },
                                    onTouchStart: (e) => {
                                      const t = e.touches[0];
                                      e.stopPropagation();
                                      handleSelectionHandleMouseDown(
                                        "rotate",
                                        t.clientX,
                                        t.clientY
                                      );
                                    },
                                    children: /* @__PURE__ */ jsxDEV(RotateCw, { className: "w-3 h-3 text-emerald-300" }, void 0, false, {
                                      fileName: "<stdin>",
                                      lineNumber: 328,
                                      columnNumber: 27
                                    })
                                  },
                                  void 0,
                                  false,
                                  {
                                    fileName: "<stdin>",
                                    lineNumber: 307,
                                    columnNumber: 25
                                  }
                                )
                              ]
                            },
                            void 0,
                            true,
                            {
                              fileName: "<stdin>",
                              lineNumber: 233,
                              columnNumber: 23
                            }
                          )
                        ] }, void 0, true, {
                          fileName: "<stdin>",
                          lineNumber: 145,
                          columnNumber: 19
                        }),
                        mode === AppMode.ANIMATE && /* @__PURE__ */ jsxDEV(
                          "canvas",
                          {
                            ref: canvasRef,
                            className: "absolute inset-0 w-full h-full pointer-events-none z-0"
                          },
                          void 0,
                          false,
                          {
                            fileName: "<stdin>",
                            lineNumber: 336,
                            columnNumber: 19
                          }
                        )
                      ] }, void 0, true, {
                        fileName: "<stdin>",
                        lineNumber: 135,
                        columnNumber: 15
                      }),
                      !image && /* @__PURE__ */ jsxDEV(
                        "div",
                        {
                          onClick: (e) => {
                            e.stopPropagation();
                            handleSelectImage();
                          },
                          className: "absolute inset-0 flex flex-col items-center justify-center text-slate-500 bg-gradient-to-b from-slate-900/80 via-slate-900/60 to-black/90 cursor-pointer",
                          children: [
                            /* @__PURE__ */ jsxDEV("div", { className: "flex-1 flex flex-col items-center justify-center", children: [
                              /* @__PURE__ */ jsxDEV(PlusCircle, { size: 40, className: "opacity-30 mb-2" }, void 0, false, {
                                fileName: "<stdin>",
                                lineNumber: 352,
                                columnNumber: 19
                              }),
                              /* @__PURE__ */ jsxDEV("span", { className: "text-[10px] font-semibold uppercase tracking-[0.22em] text-center px-6", children: "Tap to import or drop an image to start" }, void 0, false, {
                                fileName: "<stdin>",
                                lineNumber: 353,
                                columnNumber: 19
                              })
                            ] }, void 0, true, {
                              fileName: "<stdin>",
                              lineNumber: 351,
                              columnNumber: 17
                            }),
                            /* @__PURE__ */ jsxDEV("div", { className: "w-full pb-4 flex items-center justify-center gap-2", children: [
                              /* @__PURE__ */ jsxDEV(
                                "button",
                                {
                                  type: "button",
                                  onClick: (e) => {
                                    e.stopPropagation();
                                    loadSampleWebsimMan();
                                  },
                                  className: "inline-flex items-center justify-center px-3 py-1.5 rounded-2xl bg-slate-800/90 hover:bg-slate-700 text-slate-100 border border-white/15 backdrop-blur-xl shadow-[0_0_24px_rgba(15,23,42,0.9)] cursor-pointer text-[10px] font-semibold gap-1.5",
                                  children: [
                                    /* @__PURE__ */ jsxDEV(PlusCircle, { size: 14, className: "shrink-0 opacity-70" }, void 0, false, {
                                      fileName: "<stdin>",
                                      lineNumber: 367,
                                      columnNumber: 21
                                    }),
                                    /* @__PURE__ */ jsxDEV("span", { children: "Load sample" }, void 0, false, {
                                      fileName: "<stdin>",
                                      lineNumber: 368,
                                      columnNumber: 21
                                    })
                                  ]
                                },
                                void 0,
                                true,
                                {
                                  fileName: "<stdin>",
                                  lineNumber: 359,
                                  columnNumber: 19
                                }
                              ),
                              /* @__PURE__ */ jsxDEV(
                                "button",
                                {
                                  type: "button",
                                  onClick: (e) => {
                                    e.stopPropagation();
                                    pasteFromClipboard();
                                  },
                                  className: "inline-flex items-center justify-center px-3 py-1.5 rounded-2xl bg-slate-800/90 hover:bg-slate-700 text-slate-100 border border-white/15 backdrop-blur-xl shadow-[0_0_24px_rgba(15,23,42,0.9)] cursor-pointer text-[10px] font-semibold gap-1.5",
                                  children: [
                                    /* @__PURE__ */ jsxDEV(Plus, { size: 14, className: "shrink-0 opacity-70" }, void 0, false, {
                                      fileName: "<stdin>",
                                      lineNumber: 378,
                                      columnNumber: 21
                                    }),
                                    /* @__PURE__ */ jsxDEV("span", { children: "Paste from clipboard" }, void 0, false, {
                                      fileName: "<stdin>",
                                      lineNumber: 379,
                                      columnNumber: 21
                                    })
                                  ]
                                },
                                void 0,
                                true,
                                {
                                  fileName: "<stdin>",
                                  lineNumber: 370,
                                  columnNumber: 19
                                }
                              )
                            ] }, void 0, true, {
                              fileName: "<stdin>",
                              lineNumber: 358,
                              columnNumber: 17
                            })
                          ]
                        },
                        void 0,
                        true,
                        {
                          fileName: "<stdin>",
                          lineNumber: 344,
                          columnNumber: 15
                        }
                      )
                    ]
                  },
                  void 0,
                  true,
                  {
                    fileName: "<stdin>",
                    lineNumber: 113,
                    columnNumber: 11
                  }
                ),
                mode === AppMode.BUILD && image && /* @__PURE__ */ jsxDEV("div", { className: "mt-2 px-3 w-full flex justify-center", children: /* @__PURE__ */ jsxDEV("div", { className: "inline-flex items-center gap-1 px-1.5 py-1 rounded-2xl bg-slate-900/90 border border-white/15 shadow-[0_10px_30px_rgba(15,23,42,0.9)] backdrop-blur-2xl text-[9px]", children: [
                  /* @__PURE__ */ jsxDEV(
                    "button",
                    {
                      type: "button",
                      onClick: (e) => {
                        e.stopPropagation();
                        stopPlayback();
                        setEditTool("ADD");
                      },
                      className: `px-2.5 py-1 rounded-2xl font-semibold uppercase tracking-[0.18em] flex items-center gap-1 ${editTool === "ADD" ? "bg-slate-100 text-slate-950 shadow-[0_0_18px_rgba(148,163,184,0.8)]" : "bg-transparent text-slate-200 hover:text-white"}`,
                      children: [
                        /* @__PURE__ */ jsxDEV(Plus, { size: 11 }, void 0, false, {
                          fileName: "<stdin>",
                          lineNumber: 403,
                          columnNumber: 19
                        }),
                        "Add"
                      ]
                    },
                    void 0,
                    true,
                    {
                      fileName: "<stdin>",
                      lineNumber: 389,
                      columnNumber: 17
                    }
                  ),
                  /* @__PURE__ */ jsxDEV(
                    "button",
                    {
                      type: "button",
                      onClick: (e) => {
                        e.stopPropagation();
                        stopPlayback();
                        setEditTool("DELETE");
                      },
                      className: `px-2.5 py-1 rounded-2xl font-semibold uppercase tracking-[0.18em] flex items-center gap-1 ${editTool === "DELETE" ? "bg-rose-500/90 text-slate-950 shadow-[0_0_18px_rgba(248,113,113,0.9)]" : "bg-transparent text-slate-200 hover:text-white"}`,
                      children: [
                        /* @__PURE__ */ jsxDEV(X, { size: 11 }, void 0, false, {
                          fileName: "<stdin>",
                          lineNumber: 420,
                          columnNumber: 19
                        }),
                        "Delete"
                      ]
                    },
                    void 0,
                    true,
                    {
                      fileName: "<stdin>",
                      lineNumber: 406,
                      columnNumber: 17
                    }
                  ),
                  vertices.length > 0 && /* @__PURE__ */ jsxDEV(
                    "button",
                    {
                      type: "button",
                      onClick: (e) => {
                        e.stopPropagation();
                        stopPlayback();
                        setVertices([]);
                      },
                      className: "px-2.5 py-1 rounded-2xl font-semibold uppercase tracking-[0.18em] flex items-center gap-1 bg-slate-800/90 text-slate-100 hover:bg-slate-700/90",
                      children: [
                        /* @__PURE__ */ jsxDEV(Trash, { size: 11 }, void 0, false, {
                          fileName: "<stdin>",
                          lineNumber: 434,
                          columnNumber: 21
                        }),
                        "Clear"
                      ]
                    },
                    void 0,
                    true,
                    {
                      fileName: "<stdin>",
                      lineNumber: 424,
                      columnNumber: 19
                    }
                  )
                ] }, void 0, true, {
                  fileName: "<stdin>",
                  lineNumber: 388,
                  columnNumber: 15
                }) }, void 0, false, {
                  fileName: "<stdin>",
                  lineNumber: 387,
                  columnNumber: 13
                })
              ]
            },
            void 0,
            true,
            {
              fileName: "<stdin>",
              lineNumber: 109,
              columnNumber: 9
            }
          )
        ] }, void 0, true, {
          fileName: "<stdin>",
          lineNumber: 104,
          columnNumber: 7
        }),
        /* @__PURE__ */ jsxDEV(
          Timeline,
          {
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
            onToggleTimeline: toggleTimelineVisibility
          },
          void 0,
          false,
          {
            fileName: "<stdin>",
            lineNumber: 444,
            columnNumber: 7
          }
        ),
        /* @__PURE__ */ jsxDEV(
          ExportDialog,
          {
            isOpen: isExportDialogOpen,
            onClose: closeExportDialog,
            hasMultipleFrames: keyframes && keyframes.length > 1,
            isExporting,
            canExportVideo: typeof MediaRecorder !== "undefined",
            onExportMp4: () => exportMp4(false),
            onExportGif: (destination) => exportGif({
              postToComments: destination === "comment",
              download: destination === "file"
            }),
            onExportJpg: (destination) => exportJpg({
              postToComments: destination === "comment",
              download: destination === "file"
            })
          },
          void 0,
          false,
          {
            fileName: "<stdin>",
            lineNumber: 466,
            columnNumber: 7
          }
        ),
        /* @__PURE__ */ jsxDEV(ExportOverlay, { isExporting }, void 0, false, {
          fileName: "<stdin>",
          lineNumber: 487,
          columnNumber: 7
        })
      ]
    },
    void 0,
    true,
    {
      fileName: "<stdin>",
      lineNumber: 75,
      columnNumber: 5
    }
  );
};
var stdin_default = App;
export {
  stdin_default as default
};
