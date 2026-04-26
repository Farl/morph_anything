import React, {
  useState,
  useRef,
  useCallback,
  useEffect,
  useMemo,
  useLayoutEffect,
} from "react";
import { Delaunay } from "d3-delaunay";
import { AppMode } from "../types.js";
import { drawWarpedTriangle } from "../utils/warp.js";
import {
  saveSession,
  loadSession,
  saveLastSessionKey,
  loadLastSessionKey,
} from "../utils/storage.js";
import {
  exportMp4WithMediaRecorder,
  exportGifFromAnimation,
  exportStillFrameFromAnimation,
} from "../utils/exporters.js";
import { GpuWarpRenderer } from "../utils/gpuRenderer.js";
import { saveImageBlob, loadImageBlob } from "../utils/imageStore.js";

const SAMPLE_WEBSIM_MAN_VERTICES = [
  {
    "id": 1770569961448.8816,
    "pos": {
      "x": 0.3882591093117409,
      "y": 0.01670843776106934
    },
    "uv": {
      "x": 0.3882591093117409,
      "y": 0.01670843776106934
    }
  },
  {
    "id": 1770569963751.5154,
    "pos": {
      "x": 0.6295546558704453,
      "y": 0.018379281537176273
    },
    "uv": {
      "x": 0.6295546558704453,
      "y": 0.018379281537176273
    }
  },
  {
    "id": 1770569968394.364,
    "pos": {
      "x": 0.754251012145749,
      "y": 0.11194653299916457
    },
    "uv": {
      "x": 0.754251012145749,
      "y": 0.11194653299916457
    }
  },
  {
    "id": 1770569969758.4216,
    "pos": {
      "x": 0.2651821862348178,
      "y": 0.11528822055137844
    },
    "uv": {
      "x": 0.2651821862348178,
      "y": 0.11528822055137844
    }
  },
  {
    "id": 1770569971210.1877,
    "pos": {
      "x": 0.5080971659919028,
      "y": 0.2071846282372598
    },
    "uv": {
      "x": 0.5080971659919028,
      "y": 0.2071846282372598
    }
  },
  {
    "id": 1770569973176.9578,
    "pos": {
      "x": 0.7850202429149797,
      "y": 0.2573099415204678
    },
    "uv": {
      "x": 0.7850202429149797,
      "y": 0.2573099415204678
    }
  },
  {
    "id": 1770569975117.956,
    "pos": {
      "x": 0.245748987854251,
      "y": 0.27401837928153716
    },
    "uv": {
      "x": 0.245748987854251,
      "y": 0.27401837928153716
    }
  },
  {
    "id": 1770569978900.757,
    "pos": {
      "x": 0.23117408906882592,
      "y": 0.3893065998329156
    },
    "uv": {
      "x": 0.23117408906882592,
      "y": 0.3893065998329156
    }
  },
  {
    "id": 1770569980127.6792,
    "pos": {
      "x": 0.2635627530364372,
      "y": 0.5480367585630743
    },
    "uv": {
      "x": 0.2635627530364372,
      "y": 0.5480367585630743
    }
  },
  {
    "id": 1770569981101.4773,
    "pos": {
      "x": 0.2975708502024291,
      "y": 0.5781119465329991
    },
    "uv": {
      "x": 0.2975708502024291,
      "y": 0.5781119465329991
    }
  },
  {
    "id": 1770569982261.806,
    "pos": {
      "x": 0.33643724696356275,
      "y": 0.7101086048454469
    },
    "uv": {
      "x": 0.33643724696356275,
      "y": 0.7101086048454469
    }
  },
  {
    "id": 1770569983583.298,
    "pos": {
      "x": 0.44979757085020244,
      "y": 0.8370927318295739
    },
    "uv": {
      "x": 0.44979757085020244,
      "y": 0.8370927318295739
    }
  },
  {
    "id": 1770569984808.2112,
    "pos": {
      "x": 0.58582995951417,
      "y": 0.8437761069340016
    },
    "uv": {
      "x": 0.58582995951417,
      "y": 0.8437761069340016
    }
  },
  {
    "id": 1770569986259.7688,
    "pos": {
      "x": 0.7202429149797571,
      "y": 0.6700083542188805
    },
    "uv": {
      "x": 0.7202429149797571,
      "y": 0.6700083542188805
    }
  },
  {
    "id": 1770569987201.8914,
    "pos": {
      "x": 0.7364372469635627,
      "y": 0.5513784461152882
    },
    "uv": {
      "x": 0.7364372469635627,
      "y": 0.5513784461152882
    }
  },
  {
    "id": 1770569989764.3835,
    "pos": {
      "x": 0.7785425101214575,
      "y": 0.5179615705931495
    },
    "uv": {
      "x": 0.7785425101214575,
      "y": 0.5179615705931495
    }
  },
  {
    "id": 1770569991251.4563,
    "pos": {
      "x": 0.7995951417004049,
      "y": 0.37761069340016706
    },
    "uv": {
      "x": 0.7995951417004049,
      "y": 0.37761069340016706
    }
  },
  {
    "id": 1770569995327.517,
    "pos": {
      "x": 0.33643724696356275,
      "y": 0.29908103592314117
    },
    "uv": {
      "x": 0.33643724696356275,
      "y": 0.29908103592314117
    }
  },
  {
    "id": 1770569998910.9424,
    "pos": {
      "x": 0.4708502024291498,
      "y": 0.35756056808688386
    },
    "uv": {
      "x": 0.4708502024291498,
      "y": 0.35756056808688386
    }
  },
  {
    "id": 1770569999889.0986,
    "pos": {
      "x": 0.5502024291497976,
      "y": 0.3642439431913116
    },
    "uv": {
      "x": 0.5502024291497976,
      "y": 0.3642439431913116
    }
  },
  {
    "id": 1770570002591.518,
    "pos": {
      "x": 0.6765182186234818,
      "y": 0.3157894736842105
    },
    "uv": {
      "x": 0.6765182186234818,
      "y": 0.3157894736842105
    }
  },
  {
    "id": 1770570007127.022,
    "pos": {
      "x": 0.28785425101214573,
      "y": 0.46616541353383456
    },
    "uv": {
      "x": 0.28785425101214573,
      "y": 0.46616541353383456
    }
  },
  {
    "id": 1770570008293.813,
    "pos": {
      "x": 0.48218623481781375,
      "y": 0.41604010025062654
    },
    "uv": {
      "x": 0.48218623481781375,
      "y": 0.41604010025062654
    }
  },
  {
    "id": 1770570009327.3147,
    "pos": {
      "x": 0.5404858299595142,
      "y": 0.4177109440267335
    },
    "uv": {
      "x": 0.5404858299595142,
      "y": 0.4177109440267335
    }
  },
  {
    "id": 1770570011274.3228,
    "pos": {
      "x": 0.7348178137651822,
      "y": 0.4527986633249791
    },
    "uv": {
      "x": 0.7348178137651822,
      "y": 0.4527986633249791
    }
  },
  {
    "id": 1770570012490.3777,
    "pos": {
      "x": 0.5809716599190283,
      "y": 0.5162907268170426
    },
    "uv": {
      "x": 0.5809716599190283,
      "y": 0.5162907268170426
    }
  },
  {
    "id": 1770570013497.5405,
    "pos": {
      "x": 0.511336032388664,
      "y": 0.556390977443609
    },
    "uv": {
      "x": 0.511336032388664,
      "y": 0.556390977443609
    }
  },
  {
    "id": 1770570014465.4216,
    "pos": {
      "x": 0.4352226720647773,
      "y": 0.5179615705931495
    },
    "uv": {
      "x": 0.4352226720647773,
      "y": 0.5179615705931495
    }
  },
  {
    "id": 1770570020093.5576,
    "pos": {
      "x": 0.40445344129554656,
      "y": 0.606516290726817
    },
    "uv": {
      "x": 0.40445344129554656,
      "y": 0.606516290726817
    }
  },
  {
    "id": 1770570022585.9746,
    "pos": {
      "x": 0.46275303643724697,
      "y": 0.581453634085213
    },
    "uv": {
      "x": 0.46275303643724697,
      "y": 0.581453634085213
    }
  },
  {
    "id": 1770570023737.2646,
    "pos": {
      "x": 0.5566801619433198,
      "y": 0.5847953216374269
    },
    "uv": {
      "x": 0.5566801619433198,
      "y": 0.5847953216374269
    }
  },
  {
    "id": 1770570024744.2522,
    "pos": {
      "x": 0.6295546558704453,
      "y": 0.606516290726817
    },
    "uv": {
      "x": 0.6295546558704453,
      "y": 0.606516290726817
    }
  },
  {
    "id": 1770570029194.0244,
    "pos": {
      "x": 0.44008097165991905,
      "y": 0.6967418546365914
    },
    "uv": {
      "x": 0.44008097165991905,
      "y": 0.6967418546365914
    }
  },
  {
    "id": 1770570030636.8528,
    "pos": {
      "x": 0.4676113360323887,
      "y": 0.7802840434419381
    },
    "uv": {
      "x": 0.4676113360323887,
      "y": 0.7802840434419381
    }
  },
  {
    "id": 1770570033085.963,
    "pos": {
      "x": 0.5178137651821862,
      "y": 0.8521303258145363
    },
    "uv": {
      "x": 0.5178137651821862,
      "y": 0.8521303258145363
    }
  },
  {
    "id": 1770570033961.0994,
    "pos": {
      "x": 0.5566801619433198,
      "y": 0.7852965747702589
    },
    "uv": {
      "x": 0.5566801619433198,
      "y": 0.7852965747702589
    }
  },
  {
    "id": 1770570035337.941,
    "pos": {
      "x": 0.5809716599190283,
      "y": 0.6917293233082706
    },
    "uv": {
      "x": 0.5809716599190283,
      "y": 0.6917293233082706
    }
  },
  {
    "id": 1770570039015.0288,
    "pos": {
      "x": 0.4546558704453441,
      "y": 0.631578947368421
    },
    "uv": {
      "x": 0.4546558704453441,
      "y": 0.631578947368421
    }
  },
  {
    "id": 1770570039999.5598,
    "pos": {
      "x": 0.5615384615384615,
      "y": 0.6299081035923141
    },
    "uv": {
      "x": 0.5615384615384615,
      "y": 0.6299081035923141
    }
  },
  {
    "id": 1770570050507.0784,
    "pos": {
      "x": 0.35748987854251013,
      "y": 0.40100250626566414
    },
    "uv": {
      "x": 0.35748987854251013,
      "y": 0.40100250626566414
    }
  },
  {
    "id": 1770570052276.1162,
    "pos": {
      "x": 0.402834008097166,
      "y": 0.37092731829573933
    },
    "uv": {
      "x": 0.402834008097166,
      "y": 0.37092731829573933
    }
  },
  {
    "id": 1770570056782.3267,
    "pos": {
      "x": 0.5680161943319838,
      "y": 0.4093567251461988
    },
    "uv": {
      "x": 0.5680161943319838,
      "y": 0.4093567251461988
    }
  },
  {
    "id": 1770570057641.0806,
    "pos": {
      "x": 0.6214574898785425,
      "y": 0.3893065998329156
    },
    "uv": {
      "x": 0.6214574898785425,
      "y": 0.3893065998329156
    }
  },
  {
    "id": 1770570058423.7007,
    "pos": {
      "x": 0.6684210526315789,
      "y": 0.40267335004177107
    },
    "uv": {
      "x": 0.6684210526315789,
      "y": 0.40267335004177107
    }
  },
  {
    "id": 1770570066258.417,
    "pos": {
      "x": 0.4433198380566802,
      "y": 0.4126984126984127
    },
    "uv": {
      "x": 0.4433198380566802,
      "y": 0.4126984126984127
    }
  },
  {
    "id": 1770570067725.2366,
    "pos": {
      "x": 0.4012145748987854,
      "y": 0.42606516290726815
    },
    "uv": {
      "x": 0.4012145748987854,
      "y": 0.42606516290726815
    }
  },
  {
    "id": 1770570071182.1526,
    "pos": {
      "x": 0.6230769230769231,
      "y": 0.4143692564745196
    },
    "uv": {
      "x": 0.6230769230769231,
      "y": 0.4143692564745196
    }
  },
  {
    "id": 1770570085125.9395,
    "pos": {
      "x": 0.3639676113360324,
      "y": 0.4928989139515455
    },
    "uv": {
      "x": 0.3639676113360324,
      "y": 0.4928989139515455
    }
  },
  {
    "id": 1770570086607.3835,
    "pos": {
      "x": 0.6603238866396761,
      "y": 0.5029239766081871
    },
    "uv": {
      "x": 0.6603238866396761,
      "y": 0.5029239766081871
    }
  }
];

export function useMorphApp() {
  const [mode, setMode] = useState(AppMode.BUILD);
  const [image, setImage] = useState(null);
  const [imageName, setImageName] = useState("");
  const [aspectRatio, setAspectRatio] = useState(1);

  const [vertices, setVertices] = useState([]);
  const [lockedTriangles, setLockedTriangles] = useState([]);

  const [keyframes, setKeyframes] = useState([]);
  const [activeKeyframeId, setActiveKeyframeId] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackTime, setPlaybackTime] = useState(0);
  const [activeSegmentIndex, setActiveSegmentIndex] = useState(0);
  const [isExporting, setIsExporting] = useState(false);
  const [isExportDialogOpen, setIsExportDialogOpen] = useState(false);

  const [draggingKeyframeId, setDraggingKeyframeId] = useState(null);
  const [dragOverIndex, setDragOverIndex] = useState(null);
  const [showTimeline, setShowTimeline] = useState(true);

  const [editTool, setEditTool] = useState("ADD");

  const [selectedVertexIds, setSelectedVertexIds] = useState([]);
  const [selectionRect, setSelectionRect] = useState(null);
  const selectionStartRef = useRef(null);
  const isSelectingRef = useRef(false);
  const transformModeRef = useRef(null); // "translate" | "scale" | "rotate" | null
  const dragStartMouseRef = useRef(null);
  const originalVerticesRef = useRef(null);
  const transformCenterRef = useRef(null);

  const [dragId, setDragId] = useState(null);
  const isDraggingRef = useRef(false);

  const selectionBounds = useMemo(() => {
    if (!vertices || !vertices.length || !selectedVertexIds.length) return null;
    const selected = vertices.filter((v) => selectedVertexIds.includes(v.id));
    if (selected.length < 2) return null;

    let minX = Infinity;
    let maxX = -Infinity;
    let minY = Infinity;
    let maxY = -Infinity;

    selected.forEach((v) => {
      if (v.pos.x < minX) minX = v.pos.x;
      if (v.pos.x > maxX) maxX = v.pos.x;
      if (v.pos.y < minY) minY = v.pos.y;
      if (v.pos.y > maxY) maxY = v.pos.y;
    });

    if (!Number.isFinite(minX) || !Number.isFinite(maxX)) return null;

    const centerX = (minX + maxX) / 2;
    const centerY = (minY + maxY) / 2;

    return { minX, maxX, minY, maxY, centerX, centerY };
  }, [vertices, selectedVertexIds]);
  const playbackRef = useRef(null);
  const playStateRef = useRef({
    segmentIndex: 0,
    elapsed: 0,
  });

  const stopPlayback = useCallback(() => {
    // Stop any ongoing playback loop and reset playback-related state.
    if (playbackRef.current) {
      cancelAnimationFrame(playbackRef.current);
      playbackRef.current = null;
    }
    playStateRef.current = { segmentIndex: 0, elapsed: 0 };
    lastTimestampRef.current = null;
    setIsPlaying(false);
    setActiveSegmentIndex(0);
    setPlaybackTime(0);
  }, []);

  // Ensure keyframes always have a complete positions map (and no preview) for all vertices.
  const normalizeKeyframes = useCallback((frames, verts) => {
    if (!frames || !frames.length || !verts || !verts.length) return [];
    return frames.map((k) => {
      const { preview, ...rest } = k || {};
      const positions = {};
      verts.forEach((v) => {
        const existingPos = (k && k.positions && k.positions[v.id]) || v.pos || v.uv;
        positions[v.id] = { x: existingPos.x, y: existingPos.y };
      });
      return {
        ...rest,
        positions,
      };
    });
  }, []);
  const lastTimestampRef = useRef(null);

  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const workspaceRef = useRef(null);
  const fileInputRef = useRef(null);
  const gpuRendererRef = useRef(null);
  const [workspaceSize, setWorkspaceSize] = useState({
    width: 0,
    height: 0,
  });

  // Generate a preview image for a given keyframe using an offscreen canvas,
  // so previews don't depend on the main canvas/playback state.
  const generatePreviewForKeyframe = useCallback(
    (kf) => {
      if (!image || !vertices || vertices.length === 0 || !kf) return null;

      const previewSize = 180;
      const ar = aspectRatio || 1;
      const width =
        ar >= 1 ? previewSize : Math.round(previewSize * ar);
      const height =
        ar >= 1 ? Math.round(previewSize / ar) : previewSize;

      const canvas = document.createElement("canvas");
      canvas.width = Math.max(1, width);
      canvas.height = Math.max(1, height);
      const ctx = canvas.getContext("2d");
      if (!ctx) return null;

      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Decide which triangles to use: prefer lockedTriangles, otherwise
      // compute a temporary Delaunay triangulation for this keyframe.
      let tris = lockedTriangles && lockedTriangles.length ? lockedTriangles : null;

      if (!tris) {
        const points = vertices.map((v) => {
          const p = kf.positions?.[v.id] || v.pos || v.uv;
          return [p.x, p.y];
        });
        if (points.length >= 3) {
          const delaunay = Delaunay.from(points);
          const t = [];
          for (let i = 0; i < delaunay.triangles.length; i += 3) {
            const i1 = delaunay.triangles[i];
            const i2 = delaunay.triangles[i + 1];
            const i3 = delaunay.triangles[i + 2];
            if (vertices[i1] && vertices[i2] && vertices[i3]) {
              t.push({
                indices: [vertices[i1].id, vertices[i2].id, vertices[i3].id],
              });
            }
          }
          tris = t;
        }
      }

      if (!tris || !tris.length) return null;

      const vMap = new Map(vertices.map((v) => [v.id, v]));

      tris.forEach((tri) => {
        const v0 = vMap.get(tri.indices[0]);
        const v1 = vMap.get(tri.indices[1]);
        const v2 = vMap.get(tri.indices[2]);
        if (!v0 || !v1 || !v2) return;

        const p0 = kf.positions?.[v0.id] || v0.pos || v0.uv;
        const p1 = kf.positions?.[v1.id] || v1.pos || v1.uv;
        const p2 = kf.positions?.[v2.id] || v2.pos || v2.uv;

        const uvSet = [
          { x: v0.uv.x * image.width, y: v0.uv.y * image.height },
          { x: v1.uv.x * image.width, y: v1.uv.y * image.height },
          { x: v2.uv.x * image.width, y: v2.uv.y * image.height },
        ];
        const destSet = [
          { x: p0.x * canvas.width, y: p0.y * canvas.height },
          { x: p1.x * canvas.width, y: p1.y * canvas.height },
          { x: p2.x * canvas.width, y: p2.y * canvas.height },
        ];

        drawWarpedTriangle(ctx, image, uvSet, destSet);
      });

      try {
        return canvas.toDataURL("image/jpeg", 0.6);
      } catch {
        return null;
      }
    },
    [image, vertices, lockedTriangles, aspectRatio]
  );

  const restoreBasePose = useCallback(() => {
    setIsPlaying(false);
    setVertices((prev) => {
      const updated = prev.map((v) => ({
        ...v,
        pos: { ...v.uv },
      }));

      if (mode === AppMode.ANIMATE && activeKeyframeId) {
        const posMap = {};
        updated.forEach((v) => {
          posMap[v.id] = { ...v.pos };
        });

        setTimeout(() => {
          const preview = generatePreviewForKeyframe({ positions: posMap });
          setKeyframes((prevK) =>
            prevK.map((k) =>
              k.id === activeKeyframeId
                ? {
                    ...k,
                    positions: posMap,
                    preview: preview || k.preview,
                  }
                : k
            )
          );
        }, 10);
      }

      return updated;
    });
    setActiveSegmentIndex(0);
    setPlaybackTime(0);
  }, [mode, activeKeyframeId, generatePreviewForKeyframe]);

  // Strip previews before saving to localStorage to avoid large data URLs
  const sanitizeKeyframesForSave = useCallback((frames) => {
    if (!frames) return [];
    return frames.map((k) => {
      const { preview, ...rest } = k;
      return rest;
    });
  }, []);

  useEffect(() => {
    if (!imageName || !image || vertices.length === 0) return;

    // Note: we intentionally do NOT store image base64/data URLs in localStorage anymore
    // (they are now stored as blobs in IndexedDB instead – see utils/imageStore.js).
    const sessionData = {
      imageName,
      vertices,
      lockedTriangles,
      keyframes: sanitizeKeyframesForSave(keyframes),
    };
    saveSession(imageName, sessionData);
    saveLastSessionKey(imageName);
  }, [vertices, lockedTriangles, keyframes, imageName, image, sanitizeKeyframesForSave]);

  useEffect(() => {
    if (mode !== AppMode.BUILD || keyframes.length === 0) return;

    setKeyframes((prevKeyframes) =>
      prevKeyframes.map((kf) => {
        const newPositions = {};
        vertices.forEach((v) => {
          const existing = kf.positions?.[v.id];
          newPositions[v.id] = existing
            ? { ...existing }
            : { x: v.pos.x, y: v.pos.y };
        });
        return {
          ...kf,
          positions: newPositions,
        };
      })
    );
  }, [vertices, mode, keyframes.length]);

  // Auto-load last used image/session on first mount
  useEffect(() => {
    let cancelled = false;
    (async () => {
      const lastKey = await loadLastSessionKey();
      if (!lastKey) return;
      const existing = await loadSession(lastKey);
      if (!existing) return;
      if (cancelled) return;

      // Load image blob from IndexedDB using the session key.
      const blob = await loadImageBlob(existing.imageName || lastKey);
      if (!blob) return;
      if (cancelled) return;

      const objectUrl = URL.createObjectURL(blob);
      const img = new Image();
      img.onload = () => {
        if (cancelled) return;
        setImage(img);
        setImageName(existing.imageName || lastKey);
        setAspectRatio(img.width / img.height);

        const verts = existing.vertices || [];
        setVertices(verts);
        setLockedTriangles(existing.lockedTriangles || []);

        // Normalize legacy keyframes so every vertex has positions and previews are dropped
        const normalizedKeyframes = normalizeKeyframes(
          existing.keyframes || [],
          verts
        );
        setKeyframes(normalizedKeyframes);

        const hasLocked =
          existing.lockedTriangles && existing.lockedTriangles.length > 0;
        setMode(hasLocked ? AppMode.ANIMATE : AppMode.BUILD);
        if (normalizedKeyframes.length > 0) {
          setActiveKeyframeId(normalizedKeyframes[0].id);
        }
      };
      img.src = objectUrl;
    })();

    return () => {
      cancelled = true;
    };
  }, [normalizeKeyframes]);

  const processImageFile = async (file) => {
    if (!file) return;
    // Importing a new image should always stop playback.
    stopPlayback();
    const name = file.name;
    const existing = await loadSession(name);

    // Store the raw image blob in IndexedDB instead of saving base64 in localStorage.
    try {
      await saveImageBlob(name, file);
    } catch (e) {
      console.warn("Failed to persist image blob for session:", name, e);
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target.result;
      const img = new Image();
      img.onload = () => {
        setImage(img);
        setImageName(name);
        setAspectRatio(img.width / img.height);

        if (existing) {
          const verts = existing.vertices || [];
          setVertices(verts);
          setLockedTriangles(existing.lockedTriangles || []);

          // Normalize loaded keyframes: drop previews and ensure full positions map
          const normalizedKeyframes = normalizeKeyframes(
            existing.keyframes || [],
            verts
          );
          setKeyframes(normalizedKeyframes);

          const hasLocked =
            existing.lockedTriangles && existing.lockedTriangles.length > 0;
          setMode(hasLocked ? AppMode.ANIMATE : AppMode.BUILD);
          if (normalizedKeyframes.length > 0) {
            setActiveKeyframeId(normalizedKeyframes[0].id);
          }
        } else {
          setMode(AppMode.BUILD);
          setVertices([]);
          setLockedTriangles([]);
          setKeyframes([]);
        }

        // Remember this as the last used session and persist metadata only,
        // with image bytes stored separately in IndexedDB (no base64 in localStorage).
        const sessionData = {
          imageName: name,
          vertices: existing?.vertices || [],
          lockedTriangles: existing?.lockedTriangles || [],
          keyframes: sanitizeKeyframesForSave(
            normalizeKeyframes(existing?.keyframes || [], existing?.vertices || [])
          ),
        };
        saveSession(name, sessionData);
        saveLastSessionKey(name);
      };
      img.src = dataUrl;
    };
    reader.readAsDataURL(file);
  };

  const pasteFromClipboard = async () => {
    try {
      if (!navigator.clipboard || !navigator.clipboard.read) {
        alert("Clipboard image paste is not supported in this browser.");
        return;
      }
      const items = await navigator.clipboard.read();
      for (const item of items) {
        const type = item.types.find((t) => t.startsWith("image/"));
        if (type) {
          const blob = await item.getType(type);
          const file = new File([blob], "pasted-image.png", { type: blob.type });
          await processImageFile(file);
          return;
        }
      }
      alert("No image found in clipboard.");
    } catch (e) {
      console.warn("Failed to paste image from clipboard", e);
      alert("Unable to access clipboard image.");
    }
  };

  const loadSampleWebsimMan = useCallback(async () => {
    // Loading the sample should behave like importing a new image.
    stopPlayback();

    const sampleName = "websim-man.png";
    const img = new Image();
    img.onload = async () => {
      setImage(img);
      setImageName(sampleName);
      setAspectRatio(img.width / img.height);

      // Apply provided sample vertices and reset animation state.
      setVertices(SAMPLE_WEBSIM_MAN_VERTICES);
      setLockedTriangles([]);
      setKeyframes([]);
      setActiveKeyframeId(null);
      setMode(AppMode.BUILD);

      // Try to persist the sample image blob in IndexedDB so the session is restorable.
      try {
        const res = await fetch("/websim-man.png");
        if (res.ok) {
          const blob = await res.blob();
          await saveImageBlob(sampleName, blob);
        }
      } catch (e) {
        console.warn("Failed to cache sample image blob", e);
      }

      const sessionData = {
        imageName: sampleName,
        vertices: SAMPLE_WEBSIM_MAN_VERTICES,
        lockedTriangles: [],
        keyframes: [],
      };
      saveSession(sampleName, sessionData);
      saveLastSessionKey(sampleName);
    };
    img.src = "/websim-man.png";
  }, [stopPlayback, setVertices, setLockedTriangles, setKeyframes, setActiveKeyframeId, setMode, setImage, setImageName, setAspectRatio]);

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    processImageFile(file);
  };

  const handleImageDrop = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    const file = e.dataTransfer?.files?.[0];
    if (!file) return;
    processImageFile(file);
  };

  useEffect(() => {
    const handlePaste = (e) => {
      if (!e.clipboardData) return;

      const items = e.clipboardData.items || [];
      let imageFile = null;

      for (let i = 0; i < items.length; i++) {
        const item = items[i];
        if (item.kind === "file" && item.type.startsWith("image/")) {
          imageFile = item.getAsFile();
          break;
        }
      }

      if (!imageFile) {
        const files = e.clipboardData.files || [];
        if (files.length && files[0].type.startsWith("image/")) {
          imageFile = files[0];
        }
      }

      if (imageFile) {
        e.preventDefault();
        processImageFile(imageFile);
      }
    };

    window.addEventListener("paste", handlePaste);
    return () => window.removeEventListener("paste", handlePaste);
  }, []);

  // When a rectangle selection was active and the user presses down outside
  // the canvas, force-end the selection so subsequent interactions behave normally.
  useEffect(() => {
    const handleWindowMouseDown = (e) => {
      if (!containerRef.current) return;
      const containerEl = containerRef.current;
      if (!containerEl.contains(e.target) && isSelectingRef.current) {
        stopDragging();
      }
    };

    window.addEventListener("mousedown", handleWindowMouseDown);
    return () => window.removeEventListener("mousedown", handleWindowMouseDown);
  }, []);

  const handleContainerClick = (e) => {
    if (!containerRef.current || !image) return;

    // If user just clicked (no drag/selection)
    if (!isDraggingRef.current && !isSelectingRef.current) {
      // If we are in build mode and using Add tool AND nothing is selected, add a vertex
      if (
        mode === AppMode.BUILD &&
        editTool === "ADD" &&
        selectedVertexIds.length === 0
      ) {
        const rect = containerRef.current.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width;
        const y = (e.clientY - rect.top) / rect.height;

        const threshold = 15;
        const isTooClose = vertices.some((v) => {
          const dx = (v.pos.x - x) * rect.width;
          const dy = (v.pos.y - y) * rect.height;
          return Math.sqrt(dx * dx + dy * dy) < threshold;
        });
        if (!isTooClose) {
          const newVertex = {
            id: Date.now() + Math.random(),
            pos: { x, y },
            uv: { x, y },
          };
          setVertices((prev) => [...prev, newVertex]);
        }
      } else {
        // Clicking empty space clears selection (when there is one)
        if (selectedVertexIds.length > 0) {
          setSelectedVertexIds([]);
        }
      }
    }
  };

  const handleVertexMouseDown = (id, e) => {
    e.stopPropagation();
    if (isPlaying) setIsPlaying(false);

    if (mode === AppMode.BUILD && (e.button === 2 || editTool === "DELETE")) {
      setVertices((prev) => prev.filter((v) => v.id !== id));
      return;
    }

    // Update selection: clicking a vertex selects it, or toggles if already selected
    if (!selectedVertexIds.includes(id)) {
      setSelectedVertexIds([id]);
    }

    const isGroup =
      selectedVertexIds.includes(id) && selectedVertexIds.length > 1;

    if (isGroup && containerRef.current) {
      // Setup group translate transform (Figma-style: drag selection to move)
      const rect = containerRef.current.getBoundingClientRect();
      const pts = vertices.filter((v) => selectedVertexIds.includes(v.id));
      const center = pts.reduce(
        (acc, v) => ({
          x: acc.x + v.pos.x,
          y: acc.y + v.pos.y,
        }),
        { x: 0, y: 0 }
      );
      center.x /= pts.length;
      center.y /= pts.length;

      transformCenterRef.current = {
        x: center.x,
        y: center.y,
        px: rect.left + center.x * rect.width,
        py: rect.top + center.y * rect.height,
      };

      dragStartMouseRef.current = { x: e.clientX, y: e.clientY };
      originalVerticesRef.current = vertices.map((v) => ({
        id: v.id,
        pos: { ...v.pos },
      }));

      transformModeRef.current = "translate";
    } else {
      transformModeRef.current = null;
      dragStartMouseRef.current = null;
      originalVerticesRef.current = null;
    }

    setDragId(id);
    isDraggingRef.current = false;

    addGlobalMouseListeners();
    addGlobalTouchListeners();
  };

  const handleVertexTouchStart = (id, e) => {
    e.preventDefault();
    e.stopPropagation();
    if (isPlaying) setIsPlaying(false);

    if (mode === AppMode.BUILD && editTool === "DELETE") {
      setVertices((prev) => prev.filter((v) => v.id !== id));
      return;
    }

    // On touch, selecting a vertex selects it (no multi-select UX for now)
    if (!selectedVertexIds.includes(id)) {
      setSelectedVertexIds([id]);
    }

    transformModeRef.current = null;
    dragStartMouseRef.current = null;
    originalVerticesRef.current = null;

    setDragId(id);
    isDraggingRef.current = false;

    addGlobalMouseListeners();
    addGlobalTouchListeners();
  };

  const handleDragMove = (clientX, clientY) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();

    // Selection rectangle drag
    if (isSelectingRef.current) {
      isDraggingRef.current = true;
      const start = selectionStartRef.current;
      if (!start) return;
      const x0 = start.x;
      const y0 = start.y;
      const x1 = clientX - rect.left;
      const y1 = clientY - rect.top;
      setSelectionRect({
        x0,
        y0,
        x1,
        y1,
      });
      return;
    }

    if (dragId === null) return;
    isDraggingRef.current = true;

    const x = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
    const y = Math.max(0, Math.min(1, (clientY - rect.top) / rect.height));

    const modeTransform = transformModeRef.current;
    const center = transformCenterRef.current;
    const startMouse = dragStartMouseRef.current;
    const originals = originalVerticesRef.current;
    const hasGroup =
      modeTransform &&
      center &&
      startMouse &&
      Array.isArray(originals) &&
      selectedVertexIds.length > 1 &&
      selectedVertexIds.includes(dragId);

    if (!hasGroup) {
      // Single vertex drag
      setVertices((prev) =>
        prev.map((v) =>
          v.id === dragId
            ? {
                ...v,
                pos: { x, y },
                ...(mode === AppMode.BUILD ? { uv: { x, y } } : {}),
              }
            : v
        )
      );
      return;
    }

    // Group transform
    const dxPx = clientX - startMouse.x;
    const dyPx = clientY - startMouse.y;

    setVertices((prev) => {
      const rectNow = containerRef.current.getBoundingClientRect();
      const width = rectNow.width || 1;
      const height = rectNow.height || 1;

      const result = prev.map((v) => {
        if (!selectedVertexIds.includes(v.id)) return v;
        const original = originals.find((ov) => ov.id === v.id);
        if (!original) return v;

        let newPos = { ...original.pos };

        if (modeTransform === "translate") {
          const dx = dxPx / width;
          const dy = dyPx / height;
          newPos = {
            x: Math.max(0, Math.min(1, original.pos.x + dx)),
            y: Math.max(0, Math.min(1, original.pos.y + dy)),
          };
        } else if (modeTransform === "scale") {
          const startVector = {
            x: startMouse.x - center.px,
            y: startMouse.y - center.py,
          };
          const currentVector = {
            x: clientX - center.px,
            y: clientY - center.py,
          };
          const startDist =
            Math.hypot(startVector.x, startVector.y) || 1e-5;
          const currentDist =
            Math.hypot(currentVector.x, currentVector.y) || startDist;
          const scale = currentDist / startDist;

          const ox = (original.pos.x - center.x) * scale;
          const oy = (original.pos.y - center.y) * scale;
          newPos = {
            x: Math.max(0, Math.min(1, center.x + ox)),
            y: Math.max(0, Math.min(1, center.y + oy)),
          };
        } else if (modeTransform === "rotate") {
          const rectNow = containerRef.current.getBoundingClientRect();
          const width = rectNow.width || 1;
          const height = rectNow.height || 1;

          const startAngle = Math.atan2(
            startMouse.y - center.py,
            startMouse.x - center.px
          );
          const currentAngle = Math.atan2(
            clientY - center.py,
            clientX - center.px
          );
          const delta = currentAngle - startAngle;

          // Work in screen space so rotation keeps aspect ratio,
          // then convert back to normalized coordinates.
          const centerScreenX = center.x * width;
          const centerScreenY = center.y * height;
          const originalScreenX = original.pos.x * width;
          const originalScreenY = original.pos.y * height;

          const ox = originalScreenX - centerScreenX;
          const oy = originalScreenY - centerScreenY;

          const cos = Math.cos(delta);
          const sin = Math.sin(delta);

          const rx = ox * cos - oy * sin;
          const ry = ox * sin + oy * cos;

          const rotatedScreenX = centerScreenX + rx;
          const rotatedScreenY = centerScreenY + ry;

          newPos = {
            x: Math.max(0, Math.min(1, rotatedScreenX / width)),
            y: Math.max(0, Math.min(1, rotatedScreenY / height)),
          };
        }

        return {
          ...v,
          pos: newPos,
          ...(mode === AppMode.BUILD ? { uv: { ...newPos } } : {}),
        };
      });

      return result;
    });
  };

  const handleMouseMove = (e) => {
    handleDragMove(e.clientX, e.clientY);
  };

  const handleWindowTouchMove = (e) => {
    if (e.touches && e.touches.length > 0) {
      e.preventDefault();
      const t = e.touches[0];
      handleDragMove(t.clientX, t.clientY);
    }
  };

  const handleWindowTouchEnd = () => {
    stopDragging();
  };

  const addGlobalMouseListeners = () => {
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", stopDragging);
  };

  const addGlobalTouchListeners = () => {
    window.addEventListener("touchmove", handleWindowTouchMove, {
      passive: false,
    });
    window.addEventListener("touchend", handleWindowTouchEnd);
    window.addEventListener("touchcancel", handleWindowTouchEnd);
  };

  const stopDragging = () => {
    // Finish selection rectangle and compute selected vertices
    if (isSelectingRef.current && selectionRect && containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const xMin = Math.min(selectionRect.x0, selectionRect.x1);
      const xMax = Math.max(selectionRect.x0, selectionRect.x1);
      const yMin = Math.min(selectionRect.y0, selectionRect.y1);
      const yMax = Math.max(selectionRect.y0, selectionRect.y1);

      const newlySelected = vertices
        .filter((v) => {
          const px = v.pos.x * rect.width;
          const py = v.pos.y * rect.height;
          return px >= xMin && px <= xMax && py >= yMin && py <= yMax;
        })
        .map((v) => v.id);

      setSelectedVertexIds(newlySelected);
      setSelectionRect(null);
      isSelectingRef.current = false;
    }

    if (dragId !== null && mode === AppMode.ANIMATE && activeKeyframeId) {
      const posMap = {};
      vertices.forEach((v) => {
        posMap[v.id] = { ...v.pos };
      });

      setTimeout(() => {
        const preview = generatePreviewForKeyframe({ positions: posMap });
        setKeyframes((prev) =>
          prev.map((k) =>
            k.id === activeKeyframeId
              ? {
                  ...k,
                  positions: posMap,
                  preview: preview || k.preview,
                }
              : k
          )
        );
      }, 10);
    }
    setDragId(null);
    transformModeRef.current = null;
    dragStartMouseRef.current = null;
    originalVerticesRef.current = null;
    transformCenterRef.current = null;

    window.removeEventListener("mousemove", handleMouseMove);
    window.removeEventListener("mouseup", stopDragging);
    window.removeEventListener("touchmove", handleWindowTouchMove);
    window.removeEventListener("touchend", handleWindowTouchEnd);
    window.removeEventListener("touchcancel", handleWindowTouchEnd);

    setTimeout(() => {
      isDraggingRef.current = false;
    }, 100);
  };

  const handleSelectionHandleMouseDown = (mode, clientX, clientY) => {
    if (!containerRef.current || selectedVertexIds.length < 2) return;

    const rect = containerRef.current.getBoundingClientRect();
    const pts = vertices.filter((v) => selectedVertexIds.includes(v.id));
    if (!pts.length) return;

    const center = pts.reduce(
      (acc, v) => ({
        x: acc.x + v.pos.x,
        y: acc.y + v.pos.y,
      }),
      { x: 0, y: 0 }
    );
    center.x /= pts.length;
    center.y /= pts.length;

    transformCenterRef.current = {
      x: center.x,
      y: center.y,
      px: rect.left + center.x * rect.width,
      py: rect.top + center.y * rect.height,
    };

    dragStartMouseRef.current = { x: clientX, y: clientY };
    originalVerticesRef.current = vertices.map((v) => ({
      id: v.id,
      pos: { ...v.pos },
    }));

    transformModeRef.current = mode; // "scale" or "rotate"
    // Use any selected vertex id as the drag anchor for group transform
    const anchorId = selectedVertexIds[0];
    setDragId(anchorId);
    isDraggingRef.current = false;

    addGlobalMouseListeners();
    addGlobalTouchListeners();
  };

  const startAnimating = () => {
    if (!image) return;
    if (!vertices || vertices.length < 3) return;

    const points = vertices.map((v) => [v.pos.x, v.pos.y]);
    const delaunay = Delaunay.from(points);
    const tris = [];
    for (let i = 0; i < delaunay.triangles.length; i += 3) {
      tris.push({
        id: `tri-locked-${i}`,
        indices: [
          vertices[delaunay.triangles[i]].id,
          vertices[delaunay.triangles[i + 1]].id,
          vertices[delaunay.triangles[i + 2]].id,
        ],
      });
    }
    setLockedTriangles(tris);
    setMode(AppMode.ANIMATE);

    if (keyframes.length === 0) {
      setTimeout(() => addKeyframe(), 100);
    }
  };

  // Handle switching between Edit and Animate modes
  const handleModeTabClick = (targetMode) => {
    if (targetMode === mode) return;

    // Changing mode should always stop playback.
    stopPlayback();

    if (targetMode === AppMode.BUILD) {
      // When switching back to edit mode, just restore the visible mesh
      // to the base (UV) pose without overwriting any keyframe poses.
      setVertices((prev) =>
        prev.map((v) => ({
          ...v,
          pos: { ...v.uv },
        }))
      );
      setActiveSegmentIndex(0);
      setPlaybackTime(0);
      setMode(AppMode.BUILD);
      return;
    }

    // Enter animate mode: lock mesh and switch mode
    startAnimating();

    // After locking the mesh, restore the pose of the currently selected
    // keyframe (or the first keyframe) so it doesn't get overwritten by
    // the last edit-mode pose.
    if (targetMode === AppMode.ANIMATE && keyframes.length > 0) {
      const existingActive =
        activeKeyframeId &&
        keyframes.find((k) => k.id === activeKeyframeId);
      const targetKf = existingActive || keyframes[0];

      setVertices((prev) =>
        prev.map((v) => ({
          ...v,
          pos: {
            ...(targetKf.positions?.[v.id] || v.pos),
          },
        }))
      );
      setActiveKeyframeId(targetKf.id);
    }

    // Ensure the warped image is rendered as soon as we enter Animate mode
    if (targetMode === AppMode.ANIMATE) {
      setTimeout(() => {
        renderWarp();
      }, 50);
    }
  };

  const handleContainerMouseDown = (e) => {
    if (!containerRef.current) return;

    // Start rectangle selection when dragging on empty space
    if (e.button === 0) {
      const rect = containerRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      isSelectingRef.current = true;
      selectionStartRef.current = { x, y };
      setSelectionRect({ x0: x, y0: y, x1: x, y1: y });

      addGlobalMouseListeners();
      addGlobalTouchListeners();
      return;
    }
  };

  const handleContainerTouchStart = (e) => {
    if (!containerRef.current) return;
    if (!e.touches || e.touches.length === 0) return;

    const t = e.touches[0];
    const rect = containerRef.current.getBoundingClientRect();
    const x = t.clientX - rect.left;
    const y = t.clientY - rect.top;

    isSelectingRef.current = true;
    selectionStartRef.current = { x, y };
    setSelectionRect({ x0: x, y0: y, x1: x, y1: y });

    e.preventDefault();
    addGlobalMouseListeners();
    addGlobalTouchListeners();
  };

  const addKeyframe = () => {
    // Editing keyframes should always stop playback.
    stopPlayback();
    const posMap = {};
    vertices.forEach((v) => {
      posMap[v.id] = { ...v.pos };
    });

    const preview = generatePreviewForKeyframe({ positions: posMap });
    const newKf = {
      id: String(Date.now()),
      positions: posMap,
      duration: 1000,
      preview: preview || undefined,
    };
    setKeyframes((prev) => [...prev, newKf]);
    setActiveKeyframeId(newKf.id);
  };

  const deleteKeyframe = (id) => {
    // Editing keyframes should always stop playback.
    stopPlayback();
    setKeyframes((prev) => prev.filter((k) => k.id !== id));
    if (activeKeyframeId === id) setActiveKeyframeId(null);
  };

  const updatePlayback = useCallback(
    (timestamp) => {
      if (!keyframes || keyframes.length < 2) return;

      if (lastTimestampRef.current == null) {
        lastTimestampRef.current = timestamp;
      }
      const dt = timestamp - lastTimestampRef.current;
      lastTimestampRef.current = timestamp;

      const playState = playStateRef.current;
      let segmentIndex = playState.segmentIndex;
      let elapsed = playState.elapsed + dt;

      let currentKf = keyframes[segmentIndex];
      let nextIndex = (segmentIndex + 1) % keyframes.length;
      let nextKf = keyframes[nextIndex];

      if (!currentKf || !nextKf) {
        playbackRef.current = requestAnimationFrame(updatePlayback);
        return;
      }

      const segDuration = currentKf.duration || 1;

      while (elapsed >= segDuration) {
        elapsed -= segDuration;
        segmentIndex = (segmentIndex + 1) % keyframes.length;
        currentKf = keyframes[segmentIndex];
        nextIndex = (segmentIndex + 1) % keyframes.length;
        nextKf = keyframes[nextIndex];
      }

      const t = segDuration > 0 ? elapsed / segDuration : 0;

      setVertices((prev) =>
        prev.map((v) => {
          const p1 = currentKf.positions[v.id];
          const p2 = nextKf.positions[v.id];
          if (!p1 || !p2) return v;
          return {
            ...v,
            pos: {
              x: p1.x + (p2.x - p1.x) * t,
              y: p1.y + (p2.y - p1.y) * t,
            },
          };
        })
      );

      playStateRef.current = {
        segmentIndex,
        elapsed,
      };

      setActiveSegmentIndex(segmentIndex);
      setPlaybackTime(elapsed);

      playbackRef.current = requestAnimationFrame(updatePlayback);
    },
    [keyframes]
  );

  useEffect(() => {
    if (isPlaying) {
      playStateRef.current = { segmentIndex: 0, elapsed: 0 };
      lastTimestampRef.current = null;
      setActiveSegmentIndex(0);
      setPlaybackTime(0);
      if (playbackRef.current) {
        cancelAnimationFrame(playbackRef.current);
      }
      playbackRef.current = requestAnimationFrame(updatePlayback);
    } else if (playbackRef.current) {
      cancelAnimationFrame(playbackRef.current);
      playbackRef.current = null;
    }
    return () => {
      if (playbackRef.current) cancelAnimationFrame(playbackRef.current);
    };
  }, [isPlaying, updatePlayback]);

  const currentTriangles = useMemo(() => {
    if (mode === AppMode.ANIMATE) return lockedTriangles || [];
    if (!vertices || vertices.length < 3) return [];

    const points = vertices.map((v) => [v.pos.x, v.pos.y]);
    const delaunay = Delaunay.from(points);
    const tris = [];
    for (let i = 0; i < delaunay.triangles.length; i += 3) {
      const i1 = delaunay.triangles[i];
      const i2 = delaunay.triangles[i + 1];
      const i3 = delaunay.triangles[i + 2];
      if (vertices[i1] && vertices[i2] && vertices[i3]) {
        tris.push({
          id: `tri-${i}`,
          indices: [vertices[i1].id, vertices[i2].id, vertices[i3].id],
        });
      }
    }
    return tris;
  }, [vertices, mode, lockedTriangles]);

  const renderWarp = useCallback(() => {
    if (
      !canvasRef.current ||
      !image ||
      mode !== AppMode.ANIMATE ||
      !containerRef.current
    )
      return;

    const rect = containerRef.current.getBoundingClientRect();
    const cssWidth = Math.max(1, rect.width);
    const cssHeight = Math.max(1, rect.height);
    const dpr = window.devicePixelRatio || 1;

    const width = Math.max(1, Math.floor(cssWidth * dpr));
    const height = Math.max(1, Math.floor(cssHeight * dpr));

    if (
      canvasRef.current.width !== width ||
      canvasRef.current.height !== height
    ) {
      canvasRef.current.width = width;
      canvasRef.current.height = height;
    }

    // Use CPU 2D canvas rendering for reliability (GPU path can be flaky across browsers)
    const ctx = canvasRef.current.getContext("2d");
    if (!ctx) return;

    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, width, height);

    const vMap = new Map(vertices.map((v) => [v.id, v]));

    (lockedTriangles || []).forEach((tri) => {
      const v0 = vMap.get(tri.indices[0]);
      const v1 = vMap.get(tri.indices[1]);
      const v2 = vMap.get(tri.indices[2]);
      if (!v0 || !v1 || !v2) return;

      const uvSet = [
        { x: v0.uv.x * image.width, y: v0.uv.y * image.height },
        { x: v1.uv.x * image.width, y: v1.uv.y * image.height },
        { x: v2.uv.x * image.width, y: v2.uv.y * image.height },
      ];
      const destSet = [
        { x: v0.pos.x * width, y: v0.pos.y * height },
        { x: v1.pos.x * width, y: v1.pos.y * height },
        { x: v2.pos.x * width, y: v2.pos.y * height },
      ];

      drawWarpedTriangle(ctx, image, uvSet, destSet);
    });
  }, [image, vertices, lockedTriangles, mode, aspectRatio]);

  useEffect(() => {
    if (mode === AppMode.ANIMATE) renderWarp();
  }, [vertices, mode, renderWarp]);

  useLayoutEffect(() => {
    if (!workspaceRef.current) return;
    const observer = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (!entry) return;
      const { width, height } = entry.contentRect;
      setWorkspaceSize({ width, height });
    });
    observer.observe(workspaceRef.current);
    return () => observer.disconnect();
  }, []);

 // Ensure every keyframe gains a preview as soon as we have enough data,
 // but avoid nested state updates that can cause a max update depth error.
 useEffect(() => {
   if (!image || !vertices.length || !keyframes.length) return;

   let changed = false;
   const next = keyframes.map((k) => {
     if (k.preview) return k;
     const preview = generatePreviewForKeyframe(k);
     if (preview) {
       changed = true;
       return { ...k, preview };
     }
     return k;
   });

   if (changed) {
     setKeyframes(next);
   }
 }, [image, vertices, lockedTriangles, keyframes, generatePreviewForKeyframe]);

  const moveKeyframe = useCallback(
    (id, toIndex) => {
      // Reordering keyframes should stop playback.
      stopPlayback();
      setKeyframes((prev) => {
        const fromIndex = prev.findIndex((k) => k.id === id);
        if (fromIndex === -1 || fromIndex === toIndex) return prev;
        const updated = [...prev];
        const [item] = updated.splice(fromIndex, 1);
        updated.splice(toIndex, 0, item);
        return updated;
      });
    },
    [setKeyframes, stopPlayback]
  );

  const exportMp4 = async () => {
    if (!canvasRef.current || !keyframes || keyframes.length === 0) return;
    // Exporting should always stop normal playback first.
    stopPlayback();
    if (!("MediaRecorder" in window)) {
      alert("MediaRecorder not supported in this browser.");
      return;
    }

    const totalDuration = keyframes.reduce(
      (acc, k) => acc + (k.duration || 0),
      0
    );

    setIsExporting(true);
    exportMp4WithMediaRecorder(
      canvasRef.current,
      imageName,
      totalDuration,
      () => {
        setIsPlaying(true);
        setPlaybackTime(0);
        setActiveSegmentIndex(0);
        playStateRef.current = { segmentIndex: 0, elapsed: 0 };
        lastTimestampRef.current = null;
      },
      () => {
        setIsExporting(false);
        setIsPlaying(false);
      }
    );
  };

  const exportGif = async ({ postToComments = false, download = true } = {}) => {
    if (!containerRef.current || !keyframes || keyframes.length === 0) return;
    // Exporting should always stop normal playback first.
    stopPlayback();
    const rect = containerRef.current.getBoundingClientRect();
    const sizePx = { width: rect.width, height: rect.height };

    setIsExporting(true);
    try {
      await exportGifFromAnimation(
        image,
        imageName,
        keyframes,
        lockedTriangles,
        vertices,
        sizePx,
        { postToComments, download }
      );
    } finally {
      setIsExporting(false);
    }
  };

  const exportJpg = async ({ postToComments = false, download = true } = {}) => {
    if (!containerRef.current || !keyframes || keyframes.length === 0) return;
    // Exporting should always stop normal playback first.
    stopPlayback();
    const rect = containerRef.current.getBoundingClientRect();
    const sizePx = { width: rect.width, height: rect.height };

    const activeIndex =
      keyframes.findIndex((k) => k.id === activeKeyframeId) === -1
        ? 0
        : keyframes.findIndex((k) => k.id === activeKeyframeId);

    setIsExporting(true);
    try {
      await exportStillFrameFromAnimation(
        image,
        imageName,
        keyframes,
        lockedTriangles,
        vertices,
        sizePx,
        {
          format: "image/jpeg",
          extension: "jpg",
          keyframeIndex: activeIndex,
          postToComments,
          download,
        }
      );
    } finally {
      setIsExporting(false);
    }
  };

  const updateKeyframeDuration = useCallback(
    (id, durationMs) => {
      // Changing timing should always stop playback.
      stopPlayback();
      setKeyframes((prev) =>
        prev.map((k) => (k.id === id ? { ...k, duration: durationMs } : k))
      );
    },
    [setKeyframes, stopPlayback]
  );

  const openExportDialog = () => {
    // Opening export options should pause playback.
    stopPlayback();
    setIsExportDialogOpen(true);
  };
  const closeExportDialog = () => setIsExportDialogOpen(false);

  const resetToInitialScreen = useCallback(() => {
    // Going back to the initial screen should stop any playback
    stopPlayback();
    setImage(null);
    setImageName("");
    setVertices([]);
    setLockedTriangles([]);
    setKeyframes([]);
    setActiveKeyframeId(null);
    setMode(AppMode.BUILD);
  }, [stopPlayback]);

  const containerStyle = useMemo(() => {
    if (!image || !workspaceSize.width || !workspaceSize.height) {
      return { width: "320px", height: "320px" };
    }

    const maxWidth = workspaceSize.width * 0.95;
    const maxHeight = workspaceSize.height * 0.95;

    const width = Math.min(maxWidth, maxHeight * aspectRatio);

    return { width: `${width}px`, aspectRatio: aspectRatio || 1 };
  }, [image, aspectRatio, workspaceSize]);

  const handleSelectImage = () => {
    // Opening the file picker should stop playback.
    stopPlayback();
    fileInputRef.current?.click();
  };

  const toggleTimelineVisibility = () => {
    // Toggling the timeline is a UI action; ensure playback is stopped.
    stopPlayback();
    setShowTimeline((v) => !v);
  };

  return {
    // state
    mode,
    image,
    imageName,
    aspectRatio,
    vertices,
    lockedTriangles,
    keyframes,
    activeKeyframeId,
    isPlaying,
    playbackTime,
    activeSegmentIndex,
    isExporting,
    draggingKeyframeId,
    dragOverIndex,
    showTimeline,
    editTool,
    dragId,
    workspaceSize,
    currentTriangles,
    isExportDialogOpen,
    selectedVertexIds,
    selectionRect,
    selectionBounds,

    // refs
    canvasRef,
    containerRef,
    workspaceRef,
    fileInputRef,

    // setters and handlers
    setMode,
    setVertices,
    setLockedTriangles,
    setKeyframes,
    setActiveKeyframeId,
    setIsPlaying,
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
    renderWarp,
    exportMp4,
    exportGif,
    exportJpg,
    containerStyle,
    handleSelectImage,
    openExportDialog,
    closeExportDialog,
    setSelectedVertexIds,
    handleSelectionHandleMouseDown,
    toggleTimelineVisibility,
    stopPlayback,
    loadSampleWebsimMan,
    pasteFromClipboard,
    resetToInitialScreen,
  };
}