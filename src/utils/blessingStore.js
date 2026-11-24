import { weddingConfig } from '../data/weddingConfig';

/**
 * Blessing Wall Persistence Adapter
 * ---------------------------------
 * Currently backed by localStorage (with safe in-memory fallback for restricted
 * in-app webviews). Replace the `storageAdapter` implementation with Firebase
 * Firestore or Supabase calls without changing any UI component code.
 */

const STORAGE_KEY = 'nepali_wedding_blessings_v1';
let memoryFallback = null;

function readRawStored() {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : null;
  } catch {
    return memoryFallback;
  }
}

function writeRawStored(items) {
  memoryFallback = items;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch {
    // Gracefully fall back to memory if in-app browser blocks storage
  }
}

export const blessingStore = {
  /**
   * Loads guest blessings merged with curated default wishes.
   */
  getAll() {
    const stored = readRawStored();
    if (!stored || stored.length === 0) {
      return [...weddingConfig.defaultBlessings];
    }
    return stored;
  },

  /**
   * Prepends a new guest blessing and persists the updated list.
   */
  add({ name, relation = '', message, tag = '' }) {
    const existing = this.getAll();
    const newEntry = {
      id: `wish-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      name: name.trim(),
      relation: relation.trim(),
      message: message.trim(),
      tag: tag.trim(),
      createdAt: new Date().toISOString(),
      isNew: true,
    };
    const updated = [newEntry, ...existing];
    writeRawStored(updated);
    return { entry: newEntry, list: updated };
  },
};
