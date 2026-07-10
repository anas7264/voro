// VORO Crypto Utility
// Authenticated Encryption at Rest (AES-GCM) using Web Crypto API
import sentinel from './security';
const {
  validateCallStack, executeSecurely, createSecureProxy, registerSecureKey,
  _TEncoderEncode, _TDecoderDecode, _Uint8Fill, _Uint8Set, _Uint8Slice,
  _call, _slice
} = sentinel;

const DB_NAME = 'VORO_SECURE_STORAGE';
const STORE_NAME = 'KEYS';
const KEY_NAME = 'MASTER_KEY';
const HKDF_KEY_NAME = 'HKDF_BASE_KEY';
const ALGO = 'AES-GCM';
const KEY_SIZE = 256;

class CryptoManager {
  constructor() {
    this.key = null;
    this.hkdfKey = null;
    this.domainKeyCache = new Map();
    this.initialized = false;
    this.initPromise = null;

    // Security: High-priority listener for system-wide lockdown
    // Performs atomic cryptographic shredding of master keys from memory.
    if (typeof window !== 'undefined') {
      window.addEventListener('voro-security-lockdown', () => {
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

              if (masterKey && hkdfKey) {
                // Enclave: Register retrieved keys and resolve handles
                resolve({
                  masterKey: registerSecureKey(masterKey),
                  hkdfKey: registerSecureKey(hkdfKey)
                });
              } else {
                // Generate missing keys
                try {
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

                  // Enclave: Register generated keys and resolve handles
                  resolve({
                    masterKey: registerSecureKey(masterKey),
                    hkdfKey: registerSecureKey(hkdfKey)
                  });
                } catch (err) {
                  reject(err);
                }
              }
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
    const encoder = new TextEncoder();
    const infoBuffer = _call.call(_TEncoderEncode, encoder, domain);

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

    const encoder = new TextEncoder();
    const rawString = typeof data === 'string' ? data : JSON.stringify(data);
    const encodedData = _call.call(_TEncoderEncode, encoder, rawString);
    const iv = new Uint8Array(12);
    window.crypto.getRandomValues(iv);

    // For v3 (domain isolated), we derive a key specifically for this domain
    // If no domain provided, we fallback to v2/v1 (though storage should always provide domain)
    const useV3 = !!domain;
    const encryptionKey = useV3 ? await this.deriveDomainKey(domain) : this.key;

    const algorithm = { name: ALGO, iv };
    let aadBuffer = null;
    if (domain) {
      aadBuffer = _call.call(_TEncoderEncode, encoder, domain);
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
        const encoder = new TextEncoder();
        aadBuffer = _call.call(_TEncoderEncode, encoder, domain);
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
      const decoder = new TextDecoder();
      const decoded = _call.call(_TDecoderDecode, decoder, decrypted);

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
}

const cryptoManager = new CryptoManager();
export default cryptoManager;
