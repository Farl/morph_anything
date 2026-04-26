import { Fragment, jsxDEV } from "react/jsx-dev-runtime";
import React, { useState, useEffect } from "react";
const ExportDialog = ({
  isOpen,
  onClose,
  hasMultipleFrames,
  isExporting,
  canExportVideo,
  onExportMp4,
  onExportGif,
  onExportJpg
}) => {
  const [destination, setDestination] = useState("comment");
  const [websimAvailable, setWebsimAvailable] = useState(false);
  useEffect(() => {
    setWebsimAvailable(typeof window !== "undefined" && !!window.websim);
  }, []);
  useEffect(() => {
    if (!isOpen) return;
    setDestination("comment");
  }, [isOpen]);
  if (!isOpen) return null;
  const handleExport = async (fn, dest) => {
    await fn(dest);
    onClose();
  };
  return /* @__PURE__ */ jsxDEV("div", { className: "fixed inset-0 z-40 flex items-end md:items-center justify-center bg-black/60 backdrop-blur-md", children: /* @__PURE__ */ jsxDEV("div", { className: "w-full md:max-w-md md:rounded-3xl rounded-t-3xl bg-slate-950/95 border border-white/10 shadow-[0_18px_60px_rgba(0,0,0,0.9)] overflow-hidden", children: [
    /* @__PURE__ */ jsxDEV("div", { className: "flex items-center justify-between px-4 py-3 border-b border-white/10", children: [
      /* @__PURE__ */ jsxDEV("h2", { className: "text-xs font-semibold uppercase tracking-[0.2em] text-slate-200", children: [
        "Export ",
        hasMultipleFrames ? "Animation" : "Frame"
      ] }, void 0, true, {
        fileName: "<stdin>",
        lineNumber: 37,
        columnNumber: 11
      }),
      /* @__PURE__ */ jsxDEV(
        "button",
        {
          onClick: onClose,
          className: "text-slate-400 hover:text-slate-100 text-xs px-2 py-1 rounded-lg bg-slate-900/60",
          children: "Close"
        },
        void 0,
        false,
        {
          fileName: "<stdin>",
          lineNumber: 40,
          columnNumber: 11
        }
      )
    ] }, void 0, true, {
      fileName: "<stdin>",
      lineNumber: 36,
      columnNumber: 9
    }),
    /* @__PURE__ */ jsxDEV("div", { className: "px-4 py-3 space-y-3", children: [
      hasMultipleFrames ? /* @__PURE__ */ jsxDEV(Fragment, { children: [
        canExportVideo && /* @__PURE__ */ jsxDEV(
          "button",
          {
            disabled: isExporting,
            onClick: () => handleExport(onExportMp4, "file"),
            className: "w-full flex items-center justify-between px-3 py-2.5 rounded-2xl bg-slate-100/95 text-slate-950 text-xs font-semibold border border-white/15 shadow-[0_0_30px_rgba(148,163,184,0.85)] disabled:opacity-40 active:scale-[0.99] transition",
            children: [
              /* @__PURE__ */ jsxDEV("span", { children: "MP4" }, void 0, false, {
                fileName: "<stdin>",
                lineNumber: 57,
                columnNumber: 19
              }),
              /* @__PURE__ */ jsxDEV("span", { className: "text-[10px] uppercase tracking-[0.16em] text-slate-700", children: "Video" }, void 0, false, {
                fileName: "<stdin>",
                lineNumber: 58,
                columnNumber: 19
              })
            ]
          },
          void 0,
          true,
          {
            fileName: "<stdin>",
            lineNumber: 52,
            columnNumber: 17
          }
        ),
        /* @__PURE__ */ jsxDEV(
          "button",
          {
            disabled: isExporting,
            onClick: () => handleExport(onExportGif, destination),
            className: "w-full flex items-center justify-between px-3 py-2.5 rounded-2xl bg-slate-100/95 text-slate-950 text-xs font-semibold border border-white/15 shadow-[0_0_30px_rgba(148,163,184,0.85)] disabled:opacity-40 active:scale-[0.99] transition",
            children: [
              /* @__PURE__ */ jsxDEV("span", { children: "Animated GIF" }, void 0, false, {
                fileName: "<stdin>",
                lineNumber: 68,
                columnNumber: 17
              }),
              /* @__PURE__ */ jsxDEV("span", { className: "text-[10px] uppercase tracking-[0.16em] text-slate-700", children: "Loop" }, void 0, false, {
                fileName: "<stdin>",
                lineNumber: 69,
                columnNumber: 17
              })
            ]
          },
          void 0,
          true,
          {
            fileName: "<stdin>",
            lineNumber: 63,
            columnNumber: 15
          }
        )
      ] }, void 0, true, {
        fileName: "<stdin>",
        lineNumber: 50,
        columnNumber: 13
      }) : /* @__PURE__ */ jsxDEV(Fragment, { children: /* @__PURE__ */ jsxDEV(
        "button",
        {
          disabled: isExporting,
          onClick: () => handleExport(onExportJpg, destination),
          className: "w-full flex items-center justify-between px-3 py-2.5 rounded-2xl bg-slate-100/95 text-slate-950 text-xs font-semibold border border-white/15 shadow-[0_0_30px_rgba(148,163,184,0.85)] disabled:opacity-40 active:scale-[0.99] transition",
          children: [
            /* @__PURE__ */ jsxDEV("span", { children: "JPG Still" }, void 0, false, {
              fileName: "<stdin>",
              lineNumber: 81,
              columnNumber: 17
            }),
            /* @__PURE__ */ jsxDEV("span", { className: "text-[10px] uppercase tracking-[0.16em] text-slate-700", children: "Single Frame" }, void 0, false, {
              fileName: "<stdin>",
              lineNumber: 82,
              columnNumber: 17
            })
          ]
        },
        void 0,
        true,
        {
          fileName: "<stdin>",
          lineNumber: 76,
          columnNumber: 15
        }
      ) }, void 0, false, {
        fileName: "<stdin>",
        lineNumber: 75,
        columnNumber: 13
      }),
      websimAvailable && /* @__PURE__ */ jsxDEV("div", { className: "mt-2 px-2 py-1.5 rounded-2xl bg-slate-900/80 border border-white/10", children: [
        /* @__PURE__ */ jsxDEV("p", { className: "text-[10px] text-slate-300 mb-1 font-semibold uppercase tracking-[0.16em]", children: "Destination" }, void 0, false, {
          fileName: "<stdin>",
          lineNumber: 91,
          columnNumber: 15
        }),
        /* @__PURE__ */ jsxDEV("div", { className: "flex items-center justify-between rounded-full bg-slate-950/70 p-0.5", children: [
          /* @__PURE__ */ jsxDEV(
            "button",
            {
              type: "button",
              onClick: () => setDestination("file"),
              className: `flex-1 px-2 py-1.5 rounded-full text-[10px] font-semibold transition ${destination === "file" ? "bg-slate-100 text-slate-950 shadow-[0_0_14px_rgba(148,163,184,0.7)]" : "bg-transparent text-slate-400 hover:text-slate-200"}`,
              children: "Save file"
            },
            void 0,
            false,
            {
              fileName: "<stdin>",
              lineNumber: 95,
              columnNumber: 17
            }
          ),
          /* @__PURE__ */ jsxDEV(
            "button",
            {
              type: "button",
              onClick: () => setDestination("comment"),
              disabled: !websimAvailable,
              className: `flex-1 px-2 py-1.5 rounded-full text-[10px] font-semibold transition ${destination === "comment" ? "bg-slate-100 text-slate-950 shadow-[0_0_14px_rgba(148,163,184,0.7)]" : "bg-transparent text-slate-400 hover:text-slate-200"} disabled:opacity-40`,
              children: "Post to comments"
            },
            void 0,
            false,
            {
              fileName: "<stdin>",
              lineNumber: 106,
              columnNumber: 17
            }
          )
        ] }, void 0, true, {
          fileName: "<stdin>",
          lineNumber: 94,
          columnNumber: 15
        }),
        /* @__PURE__ */ jsxDEV("p", { className: "mt-1 text-[9px] text-slate-400", children: "Videos are downloaded only; images and GIFs can be sent to comments." }, void 0, false, {
          fileName: "<stdin>",
          lineNumber: 119,
          columnNumber: 15
        })
      ] }, void 0, true, {
        fileName: "<stdin>",
        lineNumber: 90,
        columnNumber: 13
      }),
      !websimAvailable && /* @__PURE__ */ jsxDEV("p", { className: "text-[10px] text-slate-500", children: "Tip: Log in to WebSim to enable posting exports directly to comments." }, void 0, false, {
        fileName: "<stdin>",
        lineNumber: 126,
        columnNumber: 13
      })
    ] }, void 0, true, {
      fileName: "<stdin>",
      lineNumber: 48,
      columnNumber: 9
    })
  ] }, void 0, true, {
    fileName: "<stdin>",
    lineNumber: 35,
    columnNumber: 7
  }) }, void 0, false, {
    fileName: "<stdin>",
    lineNumber: 34,
    columnNumber: 5
  });
};
var stdin_default = ExportDialog;
export {
  stdin_default as default
};
