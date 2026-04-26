import { saveImageFromDataUrl } from "./imageStore.js";

const PREFIX = "morph-any-session-";
const LAST_KEY = `${PREFIX}__last_image__`;

// Backward compatibility with older "facemorph" saves
const LEGACY_PREFIX = "facemorph-session-";
const LEGACY_LAST_KEY = `${LEGACY_PREFIX}__last_image__`;

/**
 * @param {string} key
 * @param {any} data
 */
export function saveSession(key, data) {
  try {
    const payload = JSON.stringify(data);
    localStorage.setItem(PREFIX + key, payload);
  } catch (e) {
    console.warn("Failed to save session", e);
  }
}

/**
 * @param {string} key
 * @returns {Promise<any|null>}
 */
export async function loadSession(key) {
  try {
    // Try new prefix first
    const newKey = PREFIX + key;
    const legacyKey = LEGACY_PREFIX + key;

    let raw = localStorage.getItem(newKey);
    let isLegacy = false;

    if (!raw) {
      // Fallback to legacy prefix for backward compatibility
      raw = localStorage.getItem(legacyKey);
      if (raw) {
        isLegacy = true;
      }
    }

    if (!raw) return null;

    let data = JSON.parse(raw);

    // Migration: older saves may contain imageDataUrl (base64) in localStorage.
    // Convert that once into an IndexedDB blob, strip it from the session data,
    // and re-save without the base64 payload.
    if (data && data.imageDataUrl) {
      try {
        await saveImageFromDataUrl(key, data.imageDataUrl);
      } catch (e) {
        console.warn("Error migrating imageDataUrl for session:", key, e);
      }

      delete data.imageDataUrl;

      try {
        const cleaned = JSON.stringify(data);
        localStorage.setItem(newKey, cleaned);
        if (isLegacy) {
          localStorage.removeItem(legacyKey);
        }
      } catch (e) {
        console.warn("Failed to save migrated session without imageDataUrl", e);
      }
    } else if (isLegacy) {
      // No imageDataUrl, but still on legacy prefix: migrate key name only.
      try {
        localStorage.setItem(newKey, raw);
        localStorage.removeItem(legacyKey);
      } catch (e) {
        console.warn("Failed to migrate legacy session key", e);
      }
    }

    return data;
  } catch (e) {
    console.warn("Failed to load session", e);
    return null;
  }
}

/**
 * Remember which image/session key was used last.
 * @param {string} key
 */
export function saveLastSessionKey(key) {
  try {
    localStorage.setItem(LAST_KEY, key);
  } catch (e) {
    console.warn("Failed to save last session key", e);
  }
}

/**
 * Load the last image/session key that was used.
 * @returns {Promise<string|null>}
 */
export async function loadLastSessionKey() {
  try {
    let key = localStorage.getItem(LAST_KEY);
    if (key) return key;

    // Fallback to legacy last key if the new one is missing
    const legacyKey = localStorage.getItem(LEGACY_LAST_KEY);
    if (!legacyKey) return null;

    // Migrate legacy last key to new key and delete old reference
    try {
      localStorage.setItem(LAST_KEY, legacyKey);
      localStorage.removeItem(LEGACY_LAST_KEY);
    } catch (e) {
      console.warn("Failed to migrate legacy last session key", e);
    }

    return legacyKey || null;
  } catch (e) {
    console.warn("Failed to load last session key", e);
    return null;
  }
}