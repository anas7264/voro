// VORO Storage Manager
// window.storage abstraction for data persistence

const STORAGE_PREFIX = "voro_";

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

  // Get item from storage
  get(key) {
    try {
      if (!STORAGE_KEYS[key] && !key.startsWith(STORAGE_PREFIX)) {
        console.warn(`Unknown storage key: ${key}`);
        return null;
      }

      const fullKey = key.startsWith(STORAGE_PREFIX) ? key : this.getFullKey(key);
      const item = localStorage.getItem(fullKey);

      if (!item) return null;

      try {
        return JSON.parse(item);
      } catch (e) {
        console.error(`Failed to parse storage item ${fullKey}:`, e);
        return item; // Return raw string if JSON parsing fails
      }
    } catch (error) {
      console.error("Storage get error:", error);
      return null;
    }
  }

  // Set item in storage
  set(key, value) {
    try {
      if (!STORAGE_KEYS[key] && !key.startsWith(STORAGE_PREFIX)) {
        console.warn(`Unknown storage key: ${key}`);
        return false;
      }

      const fullKey = key.startsWith(STORAGE_PREFIX) ? key : this.getFullKey(key);
      const serialized = typeof value === "string" ? value : JSON.stringify(value);

      localStorage.setItem(fullKey, serialized);
      return true;
    } catch (error) {
      console.error("Storage set error:", error);
      return false;
    }
  }

  // Delete item from storage
  delete(key) {
    try {
      const fullKey = key.startsWith(STORAGE_PREFIX) ? key : this.getFullKey(key);
      localStorage.removeItem(fullKey);
      return true;
    } catch (error) {
      console.error("Storage delete error:", error);
      return false;
    }
  }

  // Check if key exists
  exists(key) {
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
    try {
      const keys = Object.keys(localStorage);
      keys.forEach(key => {
        if (key.startsWith(STORAGE_PREFIX)) {
          localStorage.removeItem(key);
        }
      });
      return true;
    } catch (error) {
      console.error("Storage clear error:", error);
      return false;
    }
  }

  // List all VORO storage keys
  list() {
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
  getAll() {
    try {
      const data = {};
      const keys = this.list();
      keys.forEach(key => {
        data[key] = this.get(key);
      });
      return data;
    } catch (error) {
      console.error("Storage getAll error:", error);
      return {};
    }
  }

  // Export storage as JSON for backup
  export() {
    const data = this.getAll();
    const timestamp = new Date().toISOString();
    return {
      version: 1,
      timestamp,
      data
    };
  }

  // Import storage from JSON
  import(backup) {
    try {
      if (!backup.data || backup.version !== 1) {
        console.error("Invalid backup format");
        return false;
      }

      Object.keys(backup.data).forEach(key => {
        this.set(key, backup.data[key]);
      });

      return true;
    } catch (error) {
      console.error("Storage import error:", error);
      return false;
    }
  }

  // Append to array in storage
  append(key, value) {
    try {
      const existing = this.get(key) || [];
      if (!Array.isArray(existing)) {
        console.error(`Storage item ${key} is not an array`);
        return false;
      }

      existing.push(value);
      return this.set(key, existing);
    } catch (error) {
      console.error("Storage append error:", error);
      return false;
    }
  }

  // Update object in storage (shallow merge)
  update(key, updates) {
    try {
      const existing = this.get(key) || {};
      const updated = { ...existing, ...updates };
      return this.set(key, updated);
    } catch (error) {
      console.error("Storage update error:", error);
      return false;
    }
  }

  // Get storage size in bytes
  getSize() {
    try {
      let total = 0;
      const keys = this.list();
      keys.forEach(key => {
        const value = this.get(key);
        total += JSON.stringify(value).length;
      });
      return total;
    } catch (error) {
      console.error("Storage size error:", error);
      return 0;
    }
  }

  // Get storage size formatted
  getSizeFormatted() {
    const bytes = this.getSize();
    if (bytes === 0) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return ((bytes / Math.pow(k, i)).toFixed(2) + " " + sizes[i]);
  }

  // Clear old entries (for maintenance)
  clearOldEntries(key, maxAge = 90) {
    try {
      const data = this.get(key);
      if (!Array.isArray(data)) return false;

      const now = Date.now();
      const filtered = data.filter(item => {
        if (!item.timestamp) return true;
        const age = (now - new Date(item.timestamp).getTime()) / (1000 * 60 * 60 * 24);
        return age <= maxAge;
      });

      if (filtered.length < data.length) {
        return this.set(key, filtered);
      }
      return true;
    } catch (error) {
      console.error("Clear old entries error:", error);
      return false;
    }
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
