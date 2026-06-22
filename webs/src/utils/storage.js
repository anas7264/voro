// VORO Storage Manager
// window.storage abstraction for data persistence with transparent encryption
import crypto from './crypto';
import { sanitizeObject, validateCallStack, executeLockdown, getDecoyData, isDeceptionActive } from './security';

const STORAGE_PREFIX = "voro_";
const GHOST_VAULT_KEY = "voro_ghost_vault";

// Honey-token Entrapment: Canary keys that are never used by the application.
// Any interaction with these keys triggers a system-wide security lockdown.
const CANARY_KEYS = new Set([
  'admin_session',
  'system_vault',
  'voro_internal_bypass',
  'root_config',
  'debug_override'
]);

// All storage keys
const STORAGE_KEYS = {
  user: "user",
  profile: "profile",
  nutritionLog: "nutrition_log",
  workoutLog: "workout_log",
  bodyMetrics: "body_metrics",
  gymSetup: "gym_setup",
  plans: "plans",
  vitals: "vitals",
  supplements: "supplements",
  habits: "habits",
  gamification: "gamification",
  settings: "settings",
  recipes: "recipes",
  chatHistory: "chat_history",
  notifications: "notifications",
  shoppingList: "shopping_list",
  periodization: "periodization",
  prHistory: "pr_history",
  mealPrep: "meal_prep",
  quickLog: "quick_log",
  customFoods: "custom_foods",
  customExercises: "custom_exercises",
  fitnessTests: "fitness_tests",
  injuryLog: "injury_log",
  cycleTracking: "cycle_tracking",
  competition: "competition"
};

class StorageManager {
  constructor() {
    this.isAvailable = this.checkAvailability();
    this.canaryKeys = CANARY_KEYS;
    this.encryptedKeys = new Set(Object.values(STORAGE_KEYS));
    this.listeners = new Set();
    this.cache = new Map();
    this.initialized = false;
    this.initPromise = null;
  }

  async ensureInitialized() {
    if (this.initialized) return;
    if (this.initPromise) return this.initPromise;

    this.initPromise = (async () => {
      const keys = this.list();
      for (const key of keys) {
        const value = await this.getAsync(key);
        this.cache.set(key, value);
      }
      this.initialized = true;
    })();

    return this.initPromise;
  }

  checkAvailability() {
    try {
      const test = "__storage_test__";
      localStorage.setItem(test, test);
      localStorage.removeItem(test);
      return true;
    } catch (e) {
      console.warn("localStorage not available, using in-memory storage");
      return false;
    }
  }

  // Get full key with prefix
  getFullKey(key) {
    return `${STORAGE_PREFIX}${key}`;
  }

  // Ghost Vault Management: Redirects persistence to a synthetic vault during compromise
  _ghostSet(key, value) {
    try {
      const vaultRaw = localStorage.getItem(GHOST_VAULT_KEY) || "{}";
      const vault = JSON.parse(vaultRaw);
      vault[key] = value;
      localStorage.setItem(GHOST_VAULT_KEY, JSON.stringify(vault));
      return true;
    } catch (e) {
      return false;
    }
  }

  _ghostDelete(key) {
    try {
      const vaultRaw = localStorage.getItem(GHOST_VAULT_KEY);
      if (!vaultRaw) return true;
      const vault = JSON.parse(vaultRaw);
      delete vault[key];
      localStorage.setItem(GHOST_VAULT_KEY, JSON.stringify(vault));
      return true;
    } catch (e) {
      return false;
    }
  }

  // Detects interaction with honey-token canary keys
  _checkCanary(key) {
    const baseKey = key.startsWith(STORAGE_PREFIX) ? key.replace(STORAGE_PREFIX, "") : key;
    if (this.canaryKeys.has(baseKey)) {
      console.error(`Security Sentinel: Honey-token interaction detected! Key: ${baseKey}`);
      executeLockdown();
      return true;
    }
    return false;
  }

  // Helper to determine if a key should be encrypted
  shouldEncrypt(key) {
    const baseKey = key.startsWith(STORAGE_PREFIX) ? key.replace(STORAGE_PREFIX, "") : key;
    return this.encryptedKeys.has(baseKey);
  }

  // Get item from storage asynchronously
  async getAsync(key) {
    if (this._checkCanary(key)) return null;

    const baseKey = key.startsWith(STORAGE_PREFIX) ? key.replace(STORAGE_PREFIX, "") : key;

    // Honey-Routing: Serve synthetic decoys if compromised or provenance is unauthorized
    if (window.VORO_COMPROMISED || !validateCallStack()) {
      return getDecoyData(baseKey);
    }

    try {

      const fullKey = key.startsWith(STORAGE_PREFIX) ? key : this.getFullKey(key);
      const item = localStorage.getItem(fullKey);

      if (!item) return null;

      // Migration/Compatibility: Check if the item is encrypted
      let processedItem = item;
      if (item.startsWith('v3:') || item.startsWith('v2:') || item.startsWith('v1:')) {
        // Pass fullKey as AAD for cryptographic binding verification
        processedItem = await crypto.decrypt(item, fullKey);
      } else {
        // Fallback for legacy plain-text data
        try {
          processedItem = JSON.parse(item);
        } catch (e) {
          // Return raw string if JSON parsing fails
        }
      }

      // Update cache
      this.cache.set(baseKey, processedItem);
      return processedItem;
    } catch (error) {
      console.error("Storage get error:", error);
      return null;
    }
  }

  // Synchronous get (returns from cache)
  get(key) {
    if (this._checkCanary(key)) return null;

    const baseKey = key.startsWith(STORAGE_PREFIX) ? key.replace(STORAGE_PREFIX, "") : key;

    // Honey-Routing: Serve synthetic decoys if compromised or provenance is unauthorized
    if (window.VORO_COMPROMISED || !validateCallStack()) {
      return getDecoyData(baseKey);
    }

    if (this.cache.has(baseKey)) {
      return this.cache.get(baseKey);
    }

    // Fallback to synchronous localStorage read if not in cache (only works for non-encrypted)
    const fullKey = key.startsWith(STORAGE_PREFIX) ? key : this.getFullKey(key);
    const item = localStorage.getItem(fullKey);

    if (!item) return null;

    if (item.startsWith('v1:') || item.startsWith('v2:') || item.startsWith('v3:')) {
      // Encrypted data cannot be read synchronously if not cached
      return null;
    }

    try {
      const parsed = JSON.parse(item);
      this.cache.set(baseKey, parsed);
      return parsed;
    } catch (e) {
      this.cache.set(baseKey, item);
      return item;
    }
  }

  // Set item in storage
  async set(key, value) {
    // Cyber Deception: Redirect to Ghost Vault if compromised or unauthorized provenance
    if (window.VORO_COMPROMISED || !validateCallStack() || this._checkCanary(key)) {
      const baseKey = key.startsWith(STORAGE_PREFIX) ? key.replace(STORAGE_PREFIX, "") : key;
      const fullKey = key.startsWith(STORAGE_PREFIX) ? key : this.getFullKey(key);
      this._ghostSet(fullKey, value);
      this.cache.set(baseKey, value);
      return true;
    }

    // Prototype Pollution Guard
    if (key === '__proto__' || key === 'constructor' || key === 'prototype') {
      console.error(`Security Sentinel: Potential Prototype Pollution attempt blocked on storage key: ${key}`);
      return false;
    }

    try {
      const baseKey = key.startsWith(STORAGE_PREFIX) ? key.replace(STORAGE_PREFIX, "") : key;

      const fullKey = key.startsWith(STORAGE_PREFIX) ? key : this.getFullKey(key);

      // Security: Sanitize all data before it touches storage or encryption
      const sanitizedValue = sanitizeObject(value);

      let serialized;
      if (this.shouldEncrypt(baseKey)) {
        // Pass fullKey as AAD for cryptographic binding
        serialized = await crypto.encrypt(sanitizedValue, fullKey);
      } else {
        serialized = typeof sanitizedValue === "string" ? sanitizedValue : JSON.stringify(sanitizedValue);
      }

      localStorage.setItem(fullKey, serialized);

      // Update cache and notify listeners
      this.cache.set(baseKey, value);
      this.notify(baseKey, value);

      return true;
    } catch (error) {
      console.error("Storage set error:", error);
      return false;
    }
  }

  // Delete item from storage
  delete(key) {
    // Cyber Deception: Redirect to Ghost Vault if compromised or unauthorized provenance
    if (window.VORO_COMPROMISED || !validateCallStack() || this._checkCanary(key)) {
      const baseKey = key.startsWith(STORAGE_PREFIX) ? key.replace(STORAGE_PREFIX, "") : key;
      const fullKey = key.startsWith(STORAGE_PREFIX) ? key : this.getFullKey(key);
      this._ghostDelete(fullKey);
      this.cache.delete(baseKey);
      return true;
    }
    try {
      const baseKey = key.startsWith(STORAGE_PREFIX) ? key.replace(STORAGE_PREFIX, "") : key;
      const fullKey = key.startsWith(STORAGE_PREFIX) ? key : this.getFullKey(key);
      localStorage.removeItem(fullKey);

      this.cache.delete(baseKey);
      this.notify(baseKey, null);

      return true;
    } catch (error) {
      console.error("Storage delete error:", error);
      return false;
    }
  }

  // Check if key exists
  exists(key) {
    if (this._checkCanary(key)) return false;
    try {
      const fullKey = key.startsWith(STORAGE_PREFIX) ? key : this.getFullKey(key);
      return localStorage.getItem(fullKey) !== null;
    } catch (error) {
      console.error("Storage exists error:", error);
      return false;
    }
  }

  // Clear all VORO storage
  clear() {
    // Cyber Deception: Return true (simulated success) but block physical clear if compromised
    if (window.VORO_COMPROMISED || !validateCallStack()) {
      this.clearCache();
      return true;
    }
    try {
      const keys = Object.keys(localStorage);
      keys.forEach(key => {
        if (key.startsWith(STORAGE_PREFIX)) {
          localStorage.removeItem(key);
        }
      });

      this.clearCache();
      this.notify('*', null);

      return true;
    } catch (error) {
      console.error("Storage clear error:", error);
      return false;
    }
  }

  // Clear in-memory cache
  clearCache() {
    this.cache.clear();
  }

  // List all VORO storage keys
  list() {
    // Zero-Trust Provenance: Mask real keys if unauthorized
    if (window.VORO_COMPROMISED || !validateCallStack()) {
      return ['user', 'profile', 'nutrition_log', 'workout_log', 'settings'];
    }

    try {
      const keys = [];
      const storageKeys = Object.keys(localStorage);
      storageKeys.forEach(key => {
        if (key.startsWith(STORAGE_PREFIX)) {
          keys.push(key.replace(STORAGE_PREFIX, ""));
        }
      });
      return keys;
    } catch (error) {
      console.error("Storage list error:", error);
      return [];
    }
  }

  // Get all VORO storage data
  async getAll() {
    // Honey-Routing for bulk data
    if (window.VORO_COMPROMISED || !validateCallStack()) {
      const data = {};
      const keys = this.list();
      keys.forEach(key => {
        data[key] = getDecoyData(key);
      });
      return data;
    }

    try {
      const data = {};
      const keys = this.list();
      for (const key of keys) {
        data[key] = await this.getAsync(key);
      }
      return data;
    } catch (error) {
      console.error("Storage getAll error:", error);
      return {};
    }
  }

  // Get all data synchronously from cache
  getAllSync() {
    // Honey-Routing for bulk data
    if (window.VORO_COMPROMISED || !validateCallStack()) {
      const data = {};
      const keys = this.list();
      keys.forEach(key => {
        data[key] = getDecoyData(key);
      });
      return data;
    }

    const data = {};
    this.cache.forEach((value, key) => {
      data[key] = value;
    });
    return data;
  }

  // Export storage as JSON for backup
  async export() {
    const data = await this.getAll();
    const timestamp = new Date().toISOString();
    return {
      version: 1,
      timestamp,
      data
    };
  }

  // Import storage from JSON
  async import(backup) {
    try {
      if (!backup.data || backup.version !== 1) {
        console.error("Invalid backup format");
        return false;
      }

      for (const key of Object.keys(backup.data)) {
        await this.set(key, backup.data[key]);
      }

      return true;
    } catch (error) {
      console.error("Storage import error:", error);
      return false;
    }
  }

  // Append to array in storage
  async append(key, value) {
    try {
      const existing = await this.getAsync(key) || [];
      if (!Array.isArray(existing)) {
        console.error(`Storage item ${key} is not an array`);
        return false;
      }

      const updated = [...existing, value];
      return await this.set(key, updated);
    } catch (error) {
      console.error("Storage append error:", error);
      return false;
    }
  }

  // Update object in storage (shallow merge)
  async update(key, updates) {
    try {
      const existing = await this.getAsync(key) || {};
      const updated = { ...existing, ...updates };
      return await this.set(key, updated);
    } catch (error) {
      console.error("Storage update error:", error);
      return false;
    }
  }

  // Get storage size in bytes
  async getSize() {
    try {
      let total = 0;
      const keys = this.list();
      for (const key of keys) {
        const fullKey = this.getFullKey(key);
        const item = localStorage.getItem(fullKey);
        if (item) total += item.length;
      }
      return total;
    } catch (error) {
      console.error("Storage size error:", error);
      return 0;
    }
  }

  // Get storage size formatted
  async getSizeFormatted() {
    const bytes = await this.getSize();
    if (bytes === 0) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return ((bytes / Math.pow(k, i)).toFixed(2) + " " + sizes[i]);
  }

  // Observer Pattern Implementation
  subscribe(callback) {
    this.listeners.add(callback);
    return () => this.listeners.delete(callback);
  }

  notify(key, value) {
    this.listeners.forEach(callback => callback(key, value));
  }
}

// Create singleton instance
const storage = new StorageManager();

// Make available globally
if (typeof window !== "undefined") {
  window.storage = storage;
}

export default storage;
export { StorageManager, STORAGE_KEYS };
