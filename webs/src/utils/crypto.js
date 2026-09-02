// VORO Crypto Utility
// Authenticated Encryption at Rest (AES-GCM) using Web Crypto API
import sentinel from './security.js';
const {
  validateCallStack, executeSecurely, createSecureProxy, registerSecureKey,
  _TEncoderEncode, _TDecoderDecode, _Uint8Fill, _Uint8Set, _Uint8Slice,
  _call, _slice
} = sentinel;

const DB_NAME = 'VORO_SECURE_STORAGE';
const STORE_NAME = 'KEYS';
const KEY_NAME = 'MASTER_KEY';
const HKDF_KEY_NAME = 'HKDF_BASE_KEY';
const SESSION_ANCHOR_NAME = 'SESSION_ANCHOR';
const ALGO = 'AES-GCM';
const KEY_SIZE = 256;

// ⚡ PERFORMANCE OPTIMIZATION: Hoisted TextEncoder/TextDecoder singletons to avoid garbage collection and memory allocations.
const ENCODER = typeof TextEncoder !== 'undefined' ? new TextEncoder() : null;
const DECODER = typeof TextDecoder !== 'undefined' ? new TextDecoder() : null;

class CryptoManager {
  constructor() {
    this.key = null;
    this.hkdfKey = null;
    this._hmacKey = null;
    this.sessionAnchor = null;
    this.isUpgradeSession = false;
    this.domainKeyCache = new Map();
    this.initialized = false;
    this.initPromise = null;

    // Security: High-priority listener for system-wide lockdown
    // Performs atomic cryptographic shredding of master keys from memory.
    if (typeof window !== 'undefined') {
      window.addEventListener('voro-security-lockdown', () => {
        this.shredKeys();
      });

      // Active Session Ephemerality (ASE)
      // Purge sensitive keys from memory when the user is idle.
      window.addEventListener('voro-security-idle-shred', () => {
        this.shredKeys();
      });

      // Visibility-Based Memory Sanitization
      // Purge sensitive keys from memory when the tab is backgrounded.
      document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'hidden') {
          this.shredKeys();
        }
      });
    }
  }

  /**
   * Atomic Cryptographic Shredding
   * Immediately purges sensitive keys from memory to prevent exfiltration during compromise.
   */
  shredKeys() {
    this.key = null;
    this.hkdfKey = null;
    this._hmacKey = null;
    this.sessionAnchor = null;
    this.isUpgradeSession = false;
    this.domainKeyCache.clear();
    this.initialized = false;
    this.initPromise = null;
    console.warn("Security Sentinel: Cryptographic keys have been shredded from memory.");
  }

  // Initialize the crypto manager (load or generate keys)
  async init() {
    if (this.initialized) return;
    if (this.initPromise) return this.initPromise;

    /**
     * ⚡ PERFORMANCE OPTIMIZATION: Singleton Initialization Promise.
     * Prevents race conditions and redundant IndexedDB/HKDF operations
     * when multiple storage keys are initialized in parallel.
     */
    this.initPromise = (async () => {
      try {
        const keys = await this.getOrGenerateKeys();
        this.key = keys.masterKey;
        this.hkdfKey = keys.hkdfKey;
        this.sessionAnchor = keys.sessionAnchor;
        this.initialized = true;
      } catch (error) {
        this.initPromise = null; // Allow retry on failure
        console.error('Failed to initialize VORO Crypto:', error);
        throw error;
      }
    })();

    return this.initPromise;
  }

  // Get keys from IndexedDB or generate new ones
  async getOrGenerateKeys() {
    return await executeSecurely("Retrieve Master Keys", () => {
      return new Promise((resolve, reject) => {
        const request = indexedDB.open(DB_NAME, 1);

        request.onupgradeneeded = (event) => {
          const db = event.target.result;
          if (!db.objectStoreNames.contains(STORE_NAME)) {
            db.createObjectStore(STORE_NAME);
          }
        };

        request.onsuccess = (event) => {
          const db = event.target.result;
          const transaction = db.transaction(STORE_NAME, 'readwrite');
          const store = transaction.objectStore(STORE_NAME);

          const getMaster = store.get(KEY_NAME);
          const getHKDF = store.get(HKDF_KEY_NAME);

          let masterKey, hkdfKey;

          getMaster.onsuccess = async () => {
            masterKey = getMaster.result;

            getHKDF.onsuccess = async () => {
              hkdfKey = getHKDF.result;

              const getAnchor = store.get(SESSION_ANCHOR_NAME);
              getAnchor.onsuccess = async () => {
                let sessionAnchor = getAnchor.result;

                if (masterKey && hkdfKey && sessionAnchor) {
                  // Enclave: Register retrieved keys and resolve handles
                  resolve({
                    masterKey: registerSecureKey(masterKey),
                    hkdfKey: registerSecureKey(hkdfKey),
                    sessionAnchor
                  });
                } else {
                  // Generate missing keys
                  try {
                    if (masterKey && !sessionAnchor) {
                      this.isUpgradeSession = true;
                    }
                    if (!masterKey) {
                      masterKey = await window.crypto.subtle.generateKey(
                        { name: ALGO, length: KEY_SIZE },
                        false,
                        ['encrypt', 'decrypt']
                      );
                      await new Promise((res, rej) => {
                        const putMaster = store.put(masterKey, KEY_NAME);
                        putMaster.onsuccess = res;
                        putMaster.onerror = rej;
                      });
                    }

                    if (!hkdfKey) {
                      // Generate random entropy for HKDF
                      const entropy = window.crypto.getRandomValues(new Uint8Array(32));
                      hkdfKey = await window.crypto.subtle.importKey(
                        'raw',
                        entropy,
                        'HKDF',
                        false,
                        ['deriveKey']
                      );

                      // Memory Hygiene: Atomically shred entropy buffer after key import
                      entropy.fill(0);
                      await new Promise((res, rej) => {
                        const putHKDF = store.put(hkdfKey, HKDF_KEY_NAME);
                        putHKDF.onsuccess = res;
                        putHKDF.onerror = rej;
                      });
                    }

                    if (!sessionAnchor) {
                      const anchorBytes = window.crypto.getRandomValues(new Uint8Array(32));
                      sessionAnchor = Array.from(anchorBytes).map(b => b.toString(16).padStart(2, '0')).join('');
                      anchorBytes.fill(0);
                      await new Promise((res, rej) => {
                        const putAnchor = store.put(sessionAnchor, SESSION_ANCHOR_NAME);
                        putAnchor.onsuccess = res;
                        putAnchor.onerror = rej;
                      });
                    }

                    // Enclave: Register generated keys and resolve handles
                    resolve({
                      masterKey: registerSecureKey(masterKey),
                      hkdfKey: registerSecureKey(hkdfKey),
                      sessionAnchor
                    });
                  } catch (err) {
                    reject(err);
                  }
                }
              };
              getAnchor.onerror = () => reject(new Error('Failed to retrieve session anchor'));
            };
          };

          getMaster.onerror = () => reject(new Error('Failed to retrieve master key'));
        };

        request.onerror = () => reject(new Error('Failed to open secure key store'));
      });
    }, ['sink:indexedDB.open', 'requirement:user-presence', 'sink:crypto.subtle.generateKey', 'sink:crypto.subtle.importKey', 'sink:crypto.subtle.encrypt', 'sink:crypto.subtle.decrypt', 'sink:crypto.subtle.deriveKey']);
  }

  /**
   * Derives a domain-specific key using HKDF.
   * This ensures cryptographic isolation between different storage buckets.
   */
  async deriveDomainKey(domain) {
    if (window.VORO_COMPROMISED || !validateCallStack()) {
      this.key = null;
      this.hkdfKey = null;
      this.domainKeyCache.clear();
      throw new Error("Security Sentinel: Cryptographic operations blocked due to environment compromise or unauthorized provenance.");
    }

    if (this.domainKeyCache.has(domain)) {
      return this.domainKeyCache.get(domain);
    }

    await this.init();
    const infoBuffer = _call.call(_TEncoderEncode, ENCODER, domain);

    const derivedKey = await executeSecurely(`Derive Key [${domain}]`, async () => {
      return await window.crypto.subtle.deriveKey(
        {
          name: 'HKDF',
          salt: new Uint8Array(), // Static salt is acceptable in this context as HKDF key is unique
          info: infoBuffer,
          hash: 'SHA-256'
        },
        this.hkdfKey,
        { name: ALGO, length: KEY_SIZE },
        false,
        ['encrypt', 'decrypt']
      );
    }, ['sink:crypto.subtle.deriveKey']);

    // Heap Hygiene: Shred the temporary info buffer
    _call.call(_Uint8Fill, infoBuffer, 0);

    // Enclave: Register derived key and store handle
    const handle = registerSecureKey(derivedKey);
    this.domainKeyCache.set(domain, handle);
    return handle;
  }

  /**
   * Derives a stable HMAC key for State Integrity.
   */
  async deriveHmacKey() {
    await this.init();
    if (this._hmacKey) return this._hmacKey;

    const infoBuffer = _call.call(_TEncoderEncode, ENCODER, "voro_state_integrity_hmac");
    this._hmacKey = await executeSecurely("Derive HMAC State Key", async () => {
      return await window.crypto.subtle.deriveKey(
        {
          name: 'HKDF',
          salt: new Uint8Array(),
          info: infoBuffer,
          hash: 'SHA-256'
        },
        this.hkdfKey,
        { name: 'HMAC', hash: 'SHA-256', length: 256 },
        false,
        ['sign', 'verify']
      );
    }, ['sink:crypto.subtle.deriveKey']);

    _call.call(_Uint8Fill, infoBuffer, 0);
    return this._hmacKey;
  }

  /**
   * Computes a keyed HMAC-SHA-256 signature of a given string.
   * This provides cryptographic state integrity verification.
   */
  async computeHmacSignature(str) {
    if (!str) return '';
    try {
      const hmacKey = await this.deriveHmacKey();
      const data = ENCODER.encode(str);
      const signatureBuffer = await window.crypto.subtle.sign(
        'HMAC',
        hmacKey,
        data
      );
      const signatureArray = Array.from(new Uint8Array(signatureBuffer));
      return signatureArray.map(b => b.toString(16).padStart(2, '0')).join('');
    } catch (e) {
      console.error("Security Sentinel: HMAC signature generation failed:", e);
      // Deterministic fallback if WebCrypto is unavailable or errors
      let hash = 0;
      for (let i = 0; i < str.length; i++) {
        hash = (hash << 5) - hash + str.charCodeAt(i);
        hash |= 0;
      }
      return 'fallback_' + Math.abs(hash).toString(16);
    }
  }

  /**
   * Constant-time string comparator to prevent timing side-channel attacks.
   */
  constantTimeCompare(a, b) {
    if (typeof a !== 'string' || typeof b !== 'string') return false;
    if (a.length !== b.length) {
      // Dummy loop to keep timing uniform
      let dummyResult = 0;
      const dummy = a;
      for (let i = 0; i < dummy.length; i++) {
        dummyResult |= dummy.charCodeAt(i) ^ dummy.charCodeAt(i);
      }
      return false;
    }
    let result = 0;
    for (let i = 0; i < a.length; i++) {
      result |= a.charCodeAt(i) ^ b.charCodeAt(i);
    }
    return result === 0;
  }

  /**
   * Encrypt data with Hierarchical Key Isolation (v3)
   * @param {any} data - Data to encrypt
   * @param {string} domain - Storage key for domain isolation and binding
   * @returns {Promise<string>} Base64 encoded encrypted string
   */
  async encrypt(data, domain = null) {
    if (data === null || data === undefined) return data;

    if (window.VORO_COMPROMISED || !validateCallStack()) {
      this.key = null;
      this.hkdfKey = null;
      throw new Error("Security Sentinel: Encryption blocked due to environment compromise or unauthorized provenance.");
    }

    await this.init();

    const rawString = typeof data === 'string' ? data : JSON.stringify(data);
    const encodedData = _call.call(_TEncoderEncode, ENCODER, rawString);
    const iv = new Uint8Array(12);
    window.crypto.getRandomValues(iv);

    // For v3 (domain isolated), we derive a key specifically for this domain
    // If no domain provided, we fallback to v2/v1 (though storage should always provide domain)
    const useV3 = !!domain;
    const encryptionKey = useV3 ? await this.deriveDomainKey(domain) : this.key;

    const algorithm = { name: ALGO, iv };
    let aadBuffer = null;
    if (domain) {
      aadBuffer = _call.call(_TEncoderEncode, ENCODER, domain);
      algorithm.additionalData = aadBuffer;
    }

    const ciphertext = await executeSecurely(`Encrypt [${domain || 'master'}]`, async () => {
      return await window.crypto.subtle.encrypt(
        algorithm,
        encryptionKey,
        encodedData
      );
    }, ['sink:crypto.subtle.encrypt']);

    // Heap Hygiene: Shred plain-text and AAD buffers
    _call.call(_Uint8Fill, encodedData, 0);
    if (aadBuffer) _call.call(_Uint8Fill, aadBuffer, 0);

    const combined = new Uint8Array(iv.length + ciphertext.byteLength);
    _call.call(_Uint8Set, combined, iv);
    _call.call(_Uint8Set, combined, new Uint8Array(ciphertext), iv.length);

    let binary = '';
    const bytes = new Uint8Array(combined);
    for (let i = 0; i < bytes.byteLength; i++) {
      binary += String.fromCharCode(bytes[i]);
    }

    // Shred IV and combined buffer
    _call.call(_Uint8Fill, iv, 0);
    _call.call(_Uint8Fill, combined, 0);

    // v3: HKDF Isolated + AAD Bound
    // v2: Master Key + AAD Bound
    // v1: Master Key Only
    const prefix = useV3 ? 'v3:' : (domain ? 'v2:' : 'v1:');
    return prefix + btoa(binary);
  }

  /**
   * Decrypt data handling multiple version schemes
   * @param {string} encryptedData - Encrypted string from storage
   * @param {string} domain - Domain key for verification
   * @returns {Promise<any>} Decrypted data
   */
  async decrypt(encryptedData, domain = null) {
    if (typeof encryptedData !== 'string') return encryptedData;

    if (window.VORO_COMPROMISED || !validateCallStack()) {
      this.key = null;
      this.hkdfKey = null;
      throw new Error("Security Sentinel: Decryption blocked due to environment compromise or unauthorized provenance.");
    }

    let version = 0;
    if (encryptedData.startsWith('v3:')) version = 3;
    else if (encryptedData.startsWith('v2:')) version = 2;
    else if (encryptedData.startsWith('v1:')) version = 1;
    else return encryptedData;

    await this.init();

    try {
      const binaryString = atob(_call.call(_slice, encryptedData, 3));
      const bytes = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }

      const iv = _call.call(_Uint8Slice, bytes, 0, 12);
      const ciphertext = _call.call(_Uint8Slice, bytes, 12);

      const decryptionKey = (version === 3 && domain)
        ? await this.deriveDomainKey(domain)
        : this.key;

      const algorithm = { name: ALGO, iv };
      let aadBuffer = null;
      if ((version === 2 || version === 3) && domain) {
        aadBuffer = _call.call(_TEncoderEncode, ENCODER, domain);
        algorithm.additionalData = aadBuffer;
      }

      const decryptedBuffer = await executeSecurely(`Decrypt [${domain || 'master'}]`, async () => {
        return await window.crypto.subtle.decrypt(
          algorithm,
          decryptionKey,
          ciphertext
        );
      }, ['sink:crypto.subtle.decrypt']);

      // Heap Hygiene: Shred sensitive buffers
      _call.call(_Uint8Fill, bytes, 0);
      _call.call(_Uint8Fill, iv, 0);
      if (aadBuffer) _call.call(_Uint8Fill, aadBuffer, 0);

      const decrypted = new Uint8Array(decryptedBuffer);
      const decoded = _call.call(_TDecoderDecode, DECODER, decrypted);

      // Final shred of the decrypted plain-text buffer
      _call.call(_Uint8Fill, decrypted, 0);
      try {
        const parsed = JSON.parse(decoded);
        // Neural Synapse Cloaking: Wrap the sensitive decrypted object in a lockdown-aware proxy
        return createSecureProxy(parsed, domain);
      } catch (e) {
        return decoded;
      }
    } catch (error) {
      console.error(`Decryption failed (v${version}). Potential tampering or domain mismatch.`, error);
      return null;
    }
  }

  /**
   * Encrypts data using a password-derived key (PBKDF2 + AES-GCM)
   * This allows secure multi-device backups.
   */
  async encryptWithPassword(data, password) {
    if (!password || typeof password !== 'string') {
      throw new Error("Security Sentinel: Password must be a non-empty string.");
    }

    if (window.VORO_COMPROMISED || !validateCallStack()) {
      throw new Error("Security Sentinel: Encryption blocked due to environment compromise or unauthorized provenance.");
    }

    const encoder = new TextEncoder();
    const rawString = typeof data === 'string' ? data : JSON.stringify(data);
    const encodedData = _call.call(_TEncoderEncode, encoder, rawString);

    const salt = new Uint8Array(32);
    window.crypto.getRandomValues(salt);

    const iv = new Uint8Array(12);
    window.crypto.getRandomValues(iv);

    const encodedPassword = _call.call(_TEncoderEncode, encoder, password);

    // Derive key using executeSecurely with necessary capabilities
    const derivedKey = await executeSecurely("Derive Password Key", async () => {
      const passwordKey = await window.crypto.subtle.importKey(
        'raw',
        encodedPassword,
        'PBKDF2',
        false,
        ['deriveKey']
      );
      return await window.crypto.subtle.deriveKey(
        {
          name: 'PBKDF2',
          salt,
          iterations: 100000,
          hash: 'SHA-256'
        },
        passwordKey,
        { name: ALGO, length: KEY_SIZE },
        false,
        ['encrypt', 'decrypt']
      );
    }, ['sink:crypto.subtle.importKey', 'sink:crypto.subtle.deriveKey']);

    // Perform encryption
    const ciphertext = await executeSecurely("Encrypt with Password Key", async () => {
      return await window.crypto.subtle.encrypt(
        { name: ALGO, iv },
        derivedKey,
        encodedData
      );
    }, ['sink:crypto.subtle.encrypt']);

    // Heap Hygiene: Shred sensitive buffers
    _call.call(_Uint8Fill, encodedData, 0);
    _call.call(_Uint8Fill, encodedPassword, 0);

    // Convert ciphertext, salt, and iv to appropriate return formats
    const saltHex = Array.from(salt).map(b => b.toString(16).padStart(2, '0')).join('');
    const ivHex = Array.from(iv).map(b => b.toString(16).padStart(2, '0')).join('');

    // base64 encode the ciphertext
    const ciphertextBytes = new Uint8Array(ciphertext);
    let binary = '';
    for (let i = 0; i < ciphertextBytes.byteLength; i++) {
      binary += String.fromCharCode(ciphertextBytes[i]);
    }
    const ciphertextBase64 = btoa(binary);

    _call.call(_Uint8Fill, salt, 0);
    _call.call(_Uint8Fill, iv, 0);
    _call.call(_Uint8Fill, ciphertextBytes, 0);

    return {
      salt: saltHex,
      iv: ivHex,
      iterations: 100000,
      ciphertext: ciphertextBase64
    };
  }

  /**
   * Decrypts data using a password-derived key (PBKDF2 + AES-GCM)
   */
  async decryptWithPassword(encryptedPayload, password) {
    if (!password || typeof password !== 'string') {
      throw new Error("Security Sentinel: Password must be a non-empty string.");
    }
    if (!encryptedPayload || typeof encryptedPayload !== 'object') {
      throw new Error("Security Sentinel: Invalid encrypted payload format.");
    }

    const { salt: saltHex, iv: ivHex, iterations, ciphertext: ciphertextBase64 } = encryptedPayload;

    if (!saltHex || !ivHex || !ciphertextBase64) {
      throw new Error("Security Sentinel: Missing cryptographic parameters in payload.");
    }

    let iterCount = 100000;
    if (iterations !== undefined && iterations !== null) {
      if (typeof iterations !== 'number' || !Number.isInteger(iterations) || iterations < 10000 || iterations > 1000000) {
        console.warn("Security Sentinel: Invalid or untrusted PBKDF2 iteration count in backup payload.");
        return null;
      }
      iterCount = iterations;
    }

    if (window.VORO_COMPROMISED || !validateCallStack()) {
      throw new Error("Security Sentinel: Decryption blocked due to environment compromise or unauthorized provenance.");
    }

    try {
      const encoder = new TextEncoder();
      const encodedPassword = _call.call(_TEncoderEncode, encoder, password);

      // Convert salt and iv from hex
      const salt = new Uint8Array(saltHex.length / 2);
      for (let i = 0; i < salt.length; i++) {
        salt[i] = parseInt(saltHex.substring(i * 2, i * 2 + 2), 16);
      }

      const iv = new Uint8Array(ivHex.length / 2);
      for (let i = 0; i < iv.length; i++) {
        iv[i] = parseInt(ivHex.substring(i * 2, i * 2 + 2), 16);
      }

      // Convert ciphertext from base64
      const binaryString = atob(ciphertextBase64);
      const ciphertext = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++) {
        ciphertext[i] = binaryString.charCodeAt(i);
      }

      // Derive key using executeSecurely
      const derivedKey = await executeSecurely("Derive Password Key for Decryption", async () => {
        const passwordKey = await window.crypto.subtle.importKey(
          'raw',
          encodedPassword,
          'PBKDF2',
          false,
          ['deriveKey']
        );
        return await window.crypto.subtle.deriveKey(
          {
            name: 'PBKDF2',
            salt,
            iterations: iterCount,
            hash: 'SHA-256'
          },
          passwordKey,
          { name: ALGO, length: KEY_SIZE },
          false,
          ['encrypt', 'decrypt']
        );
      }, ['sink:crypto.subtle.importKey', 'sink:crypto.subtle.deriveKey']);

      // Perform decryption
      const decryptedBuffer = await executeSecurely("Decrypt with Password Key", async () => {
        return await window.crypto.subtle.decrypt(
          { name: ALGO, iv },
          derivedKey,
          ciphertext
        );
      }, ['sink:crypto.subtle.decrypt']);

      // Heap Hygiene: Shred sensitive buffers
      _call.call(_Uint8Fill, encodedPassword, 0);
      _call.call(_Uint8Fill, salt, 0);
      _call.call(_Uint8Fill, iv, 0);
      _call.call(_Uint8Fill, ciphertext, 0);

      const decryptedBytes = new Uint8Array(decryptedBuffer);
      const decoder = new TextDecoder();
      const decoded = _call.call(_TDecoderDecode, decoder, decryptedBytes);

      // Final shred of the decrypted plain-text bytes
      _call.call(_Uint8Fill, decryptedBytes, 0);

      try {
        const parsed = JSON.parse(decoded);
        return createSecureProxy(parsed, 'voro_backup_vault');
      } catch (e) {
        return decoded;
      }
    } catch (error) {
      console.error("Password-based decryption failed. Potential tampering or incorrect password.", error);
      return null;
    }
  }

  /**
   * Retrieves all state hashes from IndexedDB in a single transaction.
   */
  async getStoredHashes() {
    return await executeSecurely("Retrieve State Hashes", () => {
      return new Promise((resolve, reject) => {
        const request = indexedDB.open(DB_NAME, 1);
        request.onupgradeneeded = (event) => {
          const db = event.target.result;
          if (!db.objectStoreNames.contains(STORE_NAME)) {
            db.createObjectStore(STORE_NAME);
          }
        };
        request.onsuccess = (event) => {
          const db = event.target.result;
          const transaction = db.transaction(STORE_NAME, 'readonly');
          const store = transaction.objectStore(STORE_NAME);

          const hashes = {};
          const cursorRequest = store.openCursor();

          cursorRequest.onsuccess = (e) => {
            const cursor = e.target.result;
            if (cursor) {
              const key = cursor.key;
              if (typeof key === 'string' && key.startsWith('hash_')) {
                hashes[key.replace('hash_', '')] = cursor.value;
              }
              cursor.continue();
            } else {
              resolve(hashes);
            }
          };

          cursorRequest.onerror = () => {
            reject(new Error('Failed to retrieve state ledger hashes'));
          };
        };
        request.onerror = () => {
          reject(new Error('Failed to open state store'));
        };
      });
    }, ['sink:indexedDB.open']);
  }

  /**
   * Persists a state hash to IndexedDB.
   */
  async saveStoredHash(key, hash) {
    return await executeSecurely(`Save State Hash [${key}]`, () => {
      return new Promise((resolve, reject) => {
        const request = indexedDB.open(DB_NAME, 1);
        request.onupgradeneeded = (event) => {
          const db = event.target.result;
          if (!db.objectStoreNames.contains(STORE_NAME)) {
            db.createObjectStore(STORE_NAME);
          }
        };
        request.onsuccess = (event) => {
          const db = event.target.result;
          const transaction = db.transaction(STORE_NAME, 'readwrite');
          const store = transaction.objectStore(STORE_NAME);
          const putRequest = store.put(hash, `hash_${key}`);

          putRequest.onsuccess = () => resolve(true);
          putRequest.onerror = () => reject(new Error(`Failed to save state hash for key: ${key}`));
        };
        request.onerror = () => reject(new Error('Failed to open state store'));
      });
    }, ['sink:indexedDB.open']);
  }

  /**
   * Removes a state hash from IndexedDB.
   */
  async deleteStoredHash(key) {
    return await executeSecurely(`Delete State Hash [${key}]`, () => {
      return new Promise((resolve, reject) => {
        const request = indexedDB.open(DB_NAME, 1);
        request.onupgradeneeded = (event) => {
          const db = event.target.result;
          if (!db.objectStoreNames.contains(STORE_NAME)) {
            db.createObjectStore(STORE_NAME);
          }
        };
        request.onsuccess = (event) => {
          const db = event.target.result;
          const transaction = db.transaction(STORE_NAME, 'readwrite');
          const store = transaction.objectStore(STORE_NAME);
          const deleteRequest = store.delete(`hash_${key}`);

          deleteRequest.onsuccess = () => resolve(true);
          deleteRequest.onerror = () => reject(new Error(`Failed to delete state hash for key: ${key}`));
        };
        request.onerror = () => reject(new Error('Failed to open state store'));
      });
    }, ['sink:indexedDB.open']);
  }

  /**
   * Clears all state hashes from IndexedDB.
   */
  async clearStoredHashes() {
    return await executeSecurely("Clear State Hashes", () => {
      return new Promise((resolve, reject) => {
        const request = indexedDB.open(DB_NAME, 1);
        request.onupgradeneeded = (event) => {
          const db = event.target.result;
          if (!db.objectStoreNames.contains(STORE_NAME)) {
            db.createObjectStore(STORE_NAME);
          }
        };
        request.onsuccess = (event) => {
          const db = event.target.result;
          const transaction = db.transaction(STORE_NAME, 'readwrite');
          const store = transaction.objectStore(STORE_NAME);

          const keysToDelete = [];
          const cursorRequest = store.openCursor();

          cursorRequest.onsuccess = (e) => {
            const cursor = e.target.result;
            if (cursor) {
              const key = cursor.key;
              if (typeof key === 'string' && key.startsWith('hash_')) {
                keysToDelete.push(key);
              }
              cursor.continue();
            } else {
              const deletePromises = keysToDelete.map(k => {
                return new Promise((res, rej) => {
                  const req = store.delete(k);
                  req.onsuccess = res;
                  req.onerror = rej;
                });
              });
              Promise.all(deletePromises)
                .then(() => resolve(true))
                .catch(reject);
            }
          };
          cursorRequest.onerror = () => reject(new Error('Failed to scan store for clear'));
        };
        request.onerror = () => reject(new Error('Failed to open state store'));
      });
    }, ['sink:indexedDB.open']);
  }
}

const cryptoManager = new CryptoManager();
export default cryptoManager;
