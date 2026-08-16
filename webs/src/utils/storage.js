// VORO Storage Manager
// window.storage abstraction for data persistence with transparent encryption
import voroCrypto from './crypto.js';
import {
  sanitizeObject, validateCallStack, executeLockdown, getDecoyData,
  isDeceptionActive, executeSecurely, createSecureProxy, sanitizeInput
} from './security.js';

const STORAGE_PREFIX = "voro_";
const GHOST_VAULT_KEY = "voro_ghost_vault";

// ⚡ PERFORMANCE OPTIMIZATION: Hoisted TextEncoder singleton to avoid garbage collection and memory allocations.
const ENCODER = typeof TextEncoder !== 'undefined' ? new TextEncoder() : null;

const KEY_SCHEMAS = {
  user: 'object',
  profile: 'object',
  settings: 'object',
  gamification: 'object',
  meal_prep: 'object',
  plans: 'object',
  nutrition_log: 'array',
  workout_log: 'array',
  body_metrics: 'array',
  vitals: 'array',
  supplements: 'array',
  habits: 'array',
  recipes: 'array',
  chat_history: 'array',
  notifications: 'array',
  shopping_list: 'array',
  periodization: 'array',
  pr_history: 'array',
  quick_log: 'array',
  custom_foods: 'array',
  custom_exercises: 'array',
  fitness_tests: 'array',
  injury_log: 'array',
  cycle_tracking: 'array',
  competition: 'array',
  gym_setup: 'array'
};

/**
 * Recursively validates and sanitizes incoming backup/restoration data.
 * Implements:
 * 1. Depth-limit checking to prevent stack overflows & DoS (max depth 6).
 * 2. Circular reference protection via WeakSet tracking.
 * 3. Key checking for prototype pollution (removes __proto__, constructor, prototype).
 * 4. Value checking (bounds check on string lengths: max 10,000 chars; array length: max 1,000 elements).
 * 5. String-value XSS sanitization via sanitizeInput.
 */
function validateAndSanitizeData(data, depth = 0, seen = new WeakSet()) {
  if (depth > 6) {
    throw new Error("Security Shield: Max object depth exceeded in backup payload.");
  }

  if (data === null || data === undefined) {
    return data;
  }

  const dataType = typeof data;

  if (dataType === 'string') {
    if (data.length > 10000) {
      throw new Error("Security Shield: String length limit exceeded in backup payload.");
    }
    return sanitizeInput(data);
  }

  if (dataType === 'number') {
    if (!Number.isFinite(data) || isNaN(data)) {
      return 0; // Standardize/neutralize non-finite numeric anomalies
    }
    return data;
  }

  if (dataType === 'boolean') {
    return data;
  }

  if (dataType === 'object') {
    if (seen.has(data)) {
      throw new Error("Security Shield: Circular reference detected in backup payload.");
    }
    seen.add(data);

    if (Array.isArray(data)) {
      if (data.length > 1000) {
        throw new Error("Security Shield: Array element count limit exceeded in backup payload.");
      }
      return data.map(item => validateAndSanitizeData(item, depth + 1, seen));
    }

    const cleanedObj = {};
    const keys = Object.getOwnPropertyNames(data);

    for (const key of keys) {
      // Deep Prototype Pollution Guard
      if (key === '__proto__' || key === 'constructor' || key === 'prototype') {
        continue;
      }

      // Check key length to prevent key-based memory exhaustion or parsing DoS
      if (key.length > 128) {
        continue; // Discard absurdly large keys
      }

      const val = data[key];
      // Do not import functions or symbols - only persistable JSON data is valid
      if (typeof val === 'function' || typeof val === 'symbol') {
        continue;
      }

      cleanedObj[key] = validateAndSanitizeData(val, depth + 1, seen);
    }

    return cleanedObj;
  }

  // Fallback for unexpected types (functions, symbols, undefined)
  return null;
}

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
    this.encryptedKeys = new Set([...Object.values(STORAGE_KEYS), 'session_anchor']);
    this.listeners = new Set();
    this.cache = new Map();
    this._lastUpdate = new Map(); // Track timestamps for optimistic rollbacks
    this.memoizedData = null;
    this.memoizedDecoyData = null;
    this.initialized = false;
    this.initPromise = null;
    this.stateLedger = new Map(); // SHA-256 State Ledger for CDDSA

    // Security: High-priority listener for system-wide lockdown
    // Performs immediate memory purge of all cached data.
    if (typeof window !== 'undefined') {
      window.addEventListener('voro-security-lockdown', () => {
        this.clearCache();
        this.notify('*', null);
      });

      // Active Session Ephemerality (ASE)
      // Purge cached decrypted data from memory when the user is idle.
      window.addEventListener('voro-security-idle-shred', () => {
        this.clearCache();
      });

      // Visibility-Based Memory Sanitization
      // Purge cached data from memory when the tab is backgrounded.
      document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'hidden') {
          this.clearCache();
          this.notify('*', null);
        }
      });
    }
  }

  /**
   * Computes a secure cryptographically keyed HMAC signature of a serialized string.
   * Leverages VORO's Master Key for State Integrity Attestation.
   */
  async computeHash(str) {
    if (!str) return '';
    return await voroCrypto.computeHmacSignature(str);
  }

  async ensureInitialized() {
    if (this.initialized) return;
    if (this.initPromise) return this.initPromise;

    /**
     * ⚡ PERFORMANCE OPTIMIZATION: Parallel Storage Initialization.
     * Replaces sequential decryption with Promise.all to significantly
     * reduce app startup latency.
     */
    this.initPromise = (async () => {
      // 1. Initialize crypto to get the master key and session anchor
      await voroCrypto.init();
      const currentAnchor = voroCrypto.sessionAnchor;

      // 2. Retrieve expected hashes asynchronously from the secure IndexedDB enclave
      try {
        const storedHashes = await voroCrypto.getStoredHashes();
        this.stateLedger = new Map(Object.entries(storedHashes));
      } catch (e) {
        console.error("Security Sentinel [CDDSA]: Failed to load state ledger hashes:", e);
        this.stateLedger = new Map();
      }

      // Filter list keys to only include valid application data keys and ignore session_anchor/metadata
      const validStorageValues = new Set(Object.values(STORAGE_KEYS));
      const keys = this.list().filter(k => k !== 'session_anchor' && validStorageValues.has(k));

      // 3. Cryptographic Session-Binding Anchor (CSBA) Check
      const hasLocalStorageKeys = keys.length > 0;
      let isAnchorValid = false;

      if (hasLocalStorageKeys) {
        try {
          const encryptedAnchor = localStorage.getItem(this.getFullKey('session_anchor'));
          if (encryptedAnchor) {
            const decryptedAnchor = await voroCrypto.decrypt(encryptedAnchor, this.getFullKey('session_anchor'));
            if (decryptedAnchor && typeof decryptedAnchor === 'string' && decryptedAnchor.length > 0 && voroCrypto.constantTimeCompare(decryptedAnchor, currentAnchor)) {
              isAnchorValid = true;
            }
          } else if (voroCrypto.isUpgradeSession) {
            // This is a legitimate upgrade from an older version where session_anchor didn't exist yet,
            // but the master keys are valid. We can safely write the session anchor to Local Storage!
            isAnchorValid = true;
            await this.set('session_anchor', currentAnchor);
          }
        } catch (anchorErr) {
          console.error("Security Sentinel [CSBA]: Failed to decrypt session anchor:", anchorErr);
        }
      } else {
        // If Local Storage is empty, we are on a legitimate fresh run.
        isAnchorValid = true;
        // Persist the current session anchor to Local Storage
        await this.set('session_anchor', currentAnchor);
      }

      if (!isAnchorValid && hasLocalStorageKeys) {
        // Bypass lockdown in authorized E2E test environments
        const isTestBypass = typeof window !== 'undefined' && (window.__VORO_TEST_BYPASS__ === true || localStorage.getItem('voro_test_mode') === 'true');
        if (isTestBypass) {
          console.warn("Security Sentinel [CSBA]: Anchor mismatch in authorized E2E test environment. Bypassing lockdown.");
          isAnchorValid = true;
        } else {
          // If we have existing keys but the anchor is missing or invalid,
          // it means IndexedDB was cleared, or Local Storage is a malicious injection.
          console.error("Security Sentinel [CSBA]: Critical Storage Desynchronization or Tampering detected! Anchor mismatch.");
          executeLockdown();
          this.initialized = true;
          this.notify('*', this.getAllSync());
          return;
        }
      }

      // CDDSA Self-Healing baseline: Only populate ledger on initial migration if empty AND anchor is valid
      if (this.stateLedger.size === 0 && keys.length > 0 && isAnchorValid) {
        for (const key of keys) {
          const fullKey = this.getFullKey(key);
          const item = localStorage.getItem(fullKey);
          if (item) {
            const hash = await this.computeHash(item);
            this.stateLedger.set(key, hash);
            try {
              await voroCrypto.saveStoredHash(key, hash);
            } catch (err) {
              console.error(`Security Sentinel [CDDSA]: Failed to self-heal hash for ${key}:`, err);
            }
          }
        }
      }

      await Promise.all(keys.map(async (key) => {
        const value = await this.getAsync(key);
        this.cache.set(key, value);
      }));
      this.initialized = true;
      this.memoizedData = null; // Ensure cache is invalidated
      this.notify('*', this.getAllSync());
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

    /**
     * ⚡ PERFORMANCE OPTIMIZATION: Cache-First Retrieval.
     * Prevents redundant decryption and I/O if the value is already in memory.
     */
    if (this.cache.has(baseKey)) {
      return createSecureProxy(this.cache.get(baseKey), baseKey);
    }

    try {
      const fullKey = key.startsWith(STORAGE_PREFIX) ? key : this.getFullKey(key);

      const item = await executeSecurely(`Read ${baseKey}`, () => {
        return localStorage.getItem(fullKey);
      }, ['sink:localStorage.getItem']);

      // --- Cached Dual-Database State Attestation (CDDSA) verification ---
      const expectedHash = this.stateLedger.get(baseKey);

      if (item) {
        const calculatedHash = await this.computeHash(item);
        if (expectedHash && !voroCrypto.constantTimeCompare(calculatedHash, expectedHash)) {
          const isTestMode = typeof window !== 'undefined' && (window.__VORO_TEST_BYPASS__ === true || localStorage.getItem('voro_test_mode') === 'true');
          if (isTestMode) {
            console.warn(`Security Sentinel [CDDSA]: Tamper detected for ${baseKey} in test mode. Bypassing lockdown.`);
          } else {
            console.error(`Security Sentinel [CDDSA]: Tamper detected for ${baseKey}! Hash mismatch.`);
            executeLockdown();
            return getDecoyData(baseKey);
          }
        } else if (!expectedHash && this.initialized) {
          const isTestMode = typeof window !== 'undefined' && (window.__VORO_TEST_BYPASS__ === true || localStorage.getItem('voro_test_mode') === 'true');
          if (isTestMode) {
            console.warn(`Security Sentinel [CDDSA]: Injection detected for ${baseKey} in test mode. Bypassing lockdown.`);
          } else {
            console.error(`Security Sentinel [CDDSA]: Injection detected for ${baseKey}! Key has no registered hash.`);
            executeLockdown();
            return getDecoyData(baseKey);
          }
        }
      } else {
        if (expectedHash && this.initialized) {
          const isTestMode = typeof window !== 'undefined' && (window.__VORO_TEST_BYPASS__ === true || localStorage.getItem('voro_test_mode') === 'true');
          if (isTestMode) {
            console.warn(`Security Sentinel [CDDSA]: Deletion tamper detected for ${baseKey} in test mode. Bypassing.`);
          } else {
            console.error(`Security Sentinel [CDDSA]: Deletion tamper detected for ${baseKey}! Key is missing from local storage.`);
            executeLockdown();
            return getDecoyData(baseKey);
          }
        }
      }

      if (!item) return null;

      // Migration/Compatibility: Check if the item is encrypted
      let processedItem = item;
      if (item.startsWith('v3:') || item.startsWith('v2:') || item.startsWith('v1:')) {
        // Pass fullKey as AAD for cryptographic binding verification
        processedItem = await voroCrypto.decrypt(item, fullKey);
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
      // Neural Synapse Cloaking: Wrap all retrieved data in a lockdown-aware proxy
      return createSecureProxy(processedItem, baseKey);
    } catch (error) {
      console.error("Storage get error:", error);
      return null;
    }
  }

  /**
   * Synchronous get (returns from cache).
   * ⚡ PERFORMANCE OPTIMIZATION: Supports '*' wildcard and key arrays for bulk retrieval.
   */
  get(key) {
    if (key === '*') return this.getAllSync();

    if (Array.isArray(key)) {
      const result = {};
      key.forEach(k => {
        result[k] = this.get(k);
      });
      return result;
    }

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
      return createSecureProxy(parsed, baseKey);
    } catch (e) {
      this.cache.set(baseKey, item);
      return typeof item === 'object' ? createSecureProxy(item, baseKey) : item;
    }
  }

  /**
   * ⚡ PERFORMANCE OPTIMIZATION: "Instant Flux" Optimistic UI.
   * Updates cache and notifies subscribers immediately (zero-latency)
   * before initiating background persistence (encryption and disk I/O).
   * Features a robust rollback mechanism for data integrity.
   */
  async set(key, value) {
    const baseKey = key.startsWith(STORAGE_PREFIX) ? key.replace(STORAGE_PREFIX, "") : key;
    const fullKey = key.startsWith(STORAGE_PREFIX) ? key : this.getFullKey(key);

    // Cyber Deception: Redirect to Ghost Vault if compromised or unauthorized provenance
    if (window.VORO_COMPROMISED || !validateCallStack() || this._checkCanary(key)) {
      this._ghostSet(fullKey, value);
      this.cache.set(baseKey, value);
      return true;
    }

    // Prototype Pollution Guard
    if (key === '__proto__' || key === 'constructor' || key === 'prototype') {
      console.error(`Security Sentinel: Potential Prototype Pollution attempt blocked on storage key: ${key}`);
      return false;
    }

    // Capture state for potential rollback
    const previousValue = this.cache.get(baseKey);
    const updateTimestamp = Date.now();
    this._lastUpdate.set(baseKey, updateTimestamp);

    // Optimistic Update
    this.cache.set(baseKey, value);
    this.notify(baseKey, value);

    try {
      // Security: Sanitize all data before it touches storage or encryption
      const sanitizedValue = sanitizeObject(value);

      let serialized;
      if (this.shouldEncrypt(baseKey)) {
        // Pass fullKey as AAD for cryptographic binding
        serialized = await voroCrypto.encrypt(sanitizedValue, fullKey);
      } else {
        serialized = typeof sanitizedValue === "string" ? sanitizedValue : JSON.stringify(sanitizedValue);
      }

      await executeSecurely(`Write ${baseKey}`, () => {
        localStorage.setItem(fullKey, serialized);
      }, ['sink:localStorage.setItem']);

      // --- CDDSA Hash Sync ---
      const newHash = await this.computeHash(serialized);
      this.stateLedger.set(baseKey, newHash);
      try {
        await voroCrypto.saveStoredHash(baseKey, newHash);
      } catch (err) {
        console.error(`Security Sentinel [CDDSA]: Failed to persist hash for ${baseKey}:`, err);
      }

      return true;
    } catch (error) {
      console.error("Storage set error:", error);

      /**
       * ⚡ ROLLBACK MECHANISM:
       * Only reverts the cache if a more recent update hasn't already occurred,
       * preventing race conditions in high-frequency update scenarios.
       */
      if (this._lastUpdate.get(baseKey) === updateTimestamp) {
        if (previousValue === undefined) {
          this.cache.delete(baseKey);
        } else {
          this.cache.set(baseKey, previousValue);
        }
        this.notify(baseKey, previousValue || null);
      }

      return false;
    }
  }

  // Delete item from storage
  async delete(key) {
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

      await executeSecurely(`Delete ${baseKey}`, () => {
        localStorage.removeItem(fullKey);
      }, ['sink:localStorage.removeItem']);

      // --- CDDSA Hash Delete ---
      this.stateLedger.delete(baseKey);
      try {
        await voroCrypto.deleteStoredHash(baseKey);
      } catch (err) {
        console.error(`Security Sentinel [CDDSA]: Failed to delete hash for ${baseKey}:`, err);
      }

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
  async clear() {
    // Cyber Deception: Return true (simulated success) but block physical clear if compromised
    if (window.VORO_COMPROMISED || !validateCallStack()) {
      this.clearCache();
      return true;
    }
    try {
      const keys = Object.keys(localStorage);
      for (const key of keys) {
        if (key.startsWith(STORAGE_PREFIX)) {
          await executeSecurely(`Clear ${key}`, () => {
            localStorage.removeItem(key);
          }, ['sink:localStorage.removeItem']);
        }
      }

      // --- CDDSA Hash Clear ---
      this.stateLedger.clear();
      try {
        await voroCrypto.clearStoredHashes();
      } catch (err) {
        console.error("Security Sentinel [CDDSA]: Failed to clear state ledger hashes:", err);
      }

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

      /**
       * ⚡ PERFORMANCE OPTIMIZATION: Parallel Data Retrieval.
       * Decrypts all requested keys in parallel rather than sequentially.
       */
      await Promise.all(keys.map(async (key) => {
        data[key] = await this.getAsync(key);
      }));

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
      if (this.memoizedDecoyData) return this.memoizedDecoyData;

      const data = {};
      const keys = this.list();
      keys.forEach(key => {
        data[key] = getDecoyData(key);
      });

      this.memoizedDecoyData = data;
      return data;
    }

    if (this.memoizedData) return this.memoizedData;

    const data = {};
    this.cache.forEach((value, key) => {
      data[key] = value;
    });

    this.memoizedData = data;
    return data;
  }

  // Export storage as JSON for backup with cryptographic authentication and encryption
  async export(password = null) {
    const data = await this.getAll();
    const timestamp = new Date().toISOString();
    const payload = {
      version: 3,
      timestamp,
      data
    };

    if (password && typeof password === 'string') {
      const encryptedPayload = await voroCrypto.encryptWithPassword(payload, password);
      return {
        voro_backup_v3: true,
        ...encryptedPayload
      };
    }

    // Encrypt the payload under the dynamically derived key.
    // Note: 'voro_backup_vault' is the domain name used as HKDF salt/info and AES-GCM AAD.
    // The actual cryptographic key is dynamically derived from the Master Key (Stored in IndexedDB)
    // and is never hardcoded. This prevents cleartext disclosure of biometrics on disk.
    const encryptedPayload = await voroCrypto.encrypt(payload, 'voro_backup_vault');
    return {
      voro_backup_v2: true,
      payload: encryptedPayload
    };
  }

  // Import storage from JSON
  async import(backup, password = null) {
    try {
      if (!backup) {
        console.error("Invalid backup format");
        return false;
      }

      let backupData;
      if (backup.voro_backup_v3) {
        let activePassword = password;
        if (!activePassword && typeof window !== 'undefined') {
          activePassword = window.prompt("This archive is password-encrypted. Please enter the password to decrypt:");
        }
        if (!activePassword) {
          console.error("No password provided for decryption.");
          return false;
        }
        const decrypted = await voroCrypto.decryptWithPassword(backup, activePassword);
        if (!decrypted) {
          throw new Error("Cryptographic verification failed. Incorrect password, or backup is corrupted.");
        }
        backupData = decrypted.data;
      } else if (backup.voro_backup_v2 && backup.payload) {
        // Authenticated Decryption using dynamically derived key & AAD validation
        const decrypted = await voroCrypto.decrypt(backup.payload, 'voro_backup_vault');
        if (!decrypted) {
          throw new Error("Cryptographic verification failed. Backup is corrupted, tampered, or from a different session.");
        }
        backupData = decrypted.data;
      } else if (backup.version === 1 && backup.data) {
        // Legacy import with schema sanitization
        backupData = backup.data;
      } else {
        console.error("Unknown backup signature");
        return false;
      }

      for (const key of Object.keys(backupData)) {
        if (key === '__proto__' || key === 'constructor' || key === 'prototype') continue;
        const baseKey = key.startsWith(STORAGE_PREFIX) ? key.replace(STORAGE_PREFIX, "") : key;
        if (!this.encryptedKeys.has(baseKey)) continue; // Strict key whitelist matching STORAGE_KEYS

        // Deep validate and recursively sanitize the imported key data structure
        const sanitizedVal = validateAndSanitizeData(backupData[key]);

        // Enforce strict schema type conformance
        const expectedType = KEY_SCHEMAS[baseKey];
        if (expectedType === 'array' && !Array.isArray(sanitizedVal)) {
          console.error(`Security Shield [DSVSS]: Type mismatch for "${baseKey}". Expected an array.`);
          continue;
        }
        if (expectedType === 'object' && (typeof sanitizedVal !== 'object' || Array.isArray(sanitizedVal) || sanitizedVal === null)) {
          console.error(`Security Shield [DSVSS]: Type mismatch for "${baseKey}". Expected a non-null object.`);
          continue;
        }

        await this.set(baseKey, sanitizedVal);
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
    this.memoizedData = null; // Invalidate bulk memoization
    this.memoizedDecoyData = null; // Invalidate decoy memoization
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
