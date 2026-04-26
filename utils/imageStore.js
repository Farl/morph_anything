// Image storage moved out of localStorage into IndexedDB to avoid saving large base64 strings.
// (Requested: do not store image base64 in localStorage; migrate old data and handle failures.)

const DB_NAME = "morph-any-image-db";
const DB_VERSION = 1;
const STORE_NAME = "images";

function openImageDB() {
  return new Promise((resolve, reject) => {
    try {
      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onupgradeneeded = (event) => {
        const db = request.result;
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          db.createObjectStore(STORE_NAME);
        }
      };

      request.onsuccess = () => {
        resolve(request.result);
      };

      request.onerror = () => {
        console.warn("IndexedDB open error for image store:", request.error);
        reject(request.error);
      };
    } catch (e) {
      console.warn("IndexedDB not available for image store:", e);
      reject(e);
    }
  });
}

export async function saveImageBlob(key, blob) {
  if (!blob) return;
  try {
    const db = await openImageDB();
    const tx = db.transaction(STORE_NAME, "readwrite");
    const store = tx.objectStore(STORE_NAME);
    store.put(blob, key);
    return new Promise((resolve, reject) => {
      tx.oncomplete = () => resolve();
      tx.onerror = () => {
        console.warn("Failed to save image blob to IndexedDB:", tx.error);
        reject(tx.error);
      };
      tx.onabort = () => {
        console.warn("Image blob transaction aborted:", tx.error);
        reject(tx.error);
      };
    });
  } catch (e) {
    console.warn("Error saving image blob:", e);
  }
}

export async function loadImageBlob(key) {
  try {
    const db = await openImageDB();
    const tx = db.transaction(STORE_NAME, "readonly");
    const store = tx.objectStore(STORE_NAME);
    const request = store.get(key);
    return new Promise((resolve, reject) => {
      request.onsuccess = () => {
        resolve(request.result || null);
      };
      request.onerror = () => {
        console.warn("Failed to load image blob from IndexedDB:", request.error);
        reject(request.error);
      };
    });
  } catch (e) {
    console.warn("Error loading image blob:", e);
    return null;
  }
}

export async function saveImageFromDataUrl(key, dataUrl) {
  if (!dataUrl) return;
  try {
    // Use fetch to convert data URL -> Blob, then store in IndexedDB.
    const res = await fetch(dataUrl);
    if (!res.ok) {
      console.warn("Failed to fetch data URL for migration:", res.status, res.statusText);
      return;
    }
    const blob = await res.blob();
    await saveImageBlob(key, blob);
  } catch (e) {
    console.warn("Failed to migrate imageDataUrl to IndexedDB:", e);
  }
}