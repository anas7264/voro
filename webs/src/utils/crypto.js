// VORO Crypto Utility
// Authenticated Encryption at Rest (AES-GCM) using Web Crypto API
import { validateCallStack, executeSecurely } from './security';

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
    console.warn("Security Sentinel: Cryptographic keys have been shredded from memory.");
  }

  // Initialize the crypto manager (load or generate keys)
  async init() {
    if (this.initialized) return;

    try {
      const keys = await this.getOrGenerateKeys();
      this.key = keys.masterKey;
      this.hkdfKey = keys.hkdfKey;
      this.initialized = true;
    } catch (error) {
      console.error('Failed to initialize VORO Crypto:', error);
      throw error;
    }
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
                resolve({ masterKey, hkdfKey });
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

                  resolve({ masterKey, hkdfKey });
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
    }, ['sink:indexedDB', 'requirement:user-presence']);
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
    const infoBuffer = encoder.encode(domain);
    const derivedKey = await window.crypto.subtle.deriveKey(
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

    // Heap Hygiene: Shred the temporary info buffer
    infoBuffer.fill(0);

    this.domainKeyCache.set(domain, derivedKey);
    return derivedKey;
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
    const encodedData = encoder.encode(rawString);
    const iv = new Uint8Array(12);
    window.crypto.getRandomValues(iv);

    // For v3 (domain isolated), we derive a key specifically for this domain
    // If no domain provided, we fallback to v2/v1 (though storage should always provide domain)
    const useV3 = !!domain;
    const encryptionKey = useV3 ? await this.deriveDomainKey(domain) : this.key;

    const algorithm = { name: ALGO, iv };
    let aadBuffer = null;
    if (domain) {
      aadBuffer = encoder.encode(domain);
      algorithm.additionalData = aadBuffer;
    }

    const ciphertext = await window.crypto.subtle.encrypt(
      algorithm,
      encryptionKey,
      encodedData
    );

    // Heap Hygiene: Shred plain-text and AAD buffers
    encodedData.fill(0);
    if (aadBuffer) aadBuffer.fill(0);

    const combined = new Uint8Array(iv.length + ciphertext.byteLength);
    combined.set(iv);
    combined.set(new Uint8Array(ciphertext), iv.length);

    let binary = '';
    const bytes = new Uint8Array(combined);
    for (let i = 0; i < bytes.byteLength; i++) {
      binary += String.fromCharCode(bytes[i]);
    }

    // Shred IV and combined buffer
    iv.fill(0);
    combined.fill(0);

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
      const binaryString = atob(encryptedData.slice(3));
      const bytes = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }

      const iv = bytes.slice(0, 12);
      const ciphertext = bytes.slice(12);

      const decryptionKey = (version === 3 && domain)
        ? await this.deriveDomainKey(domain)
        : this.key;

      const algorithm = { name: ALGO, iv };
      let aadBuffer = null;
      if ((version === 2 || version === 3) && domain) {
        aadBuffer = new TextEncoder().encode(domain);
        algorithm.additionalData = aadBuffer;
      }

      const decryptedBuffer = await window.crypto.subtle.decrypt(
        algorithm,
        decryptionKey,
        ciphertext
      );

      // Heap Hygiene: Shred sensitive buffers
      bytes.fill(0);
      iv.fill(0);
      if (aadBuffer) aadBuffer.fill(0);

      const decrypted = new Uint8Array(decryptedBuffer);
      const decoded = new TextDecoder().decode(decrypted);

      // Final shred of the decrypted plain-text buffer
      decrypted.fill(0);
      try {
        return JSON.parse(decoded);
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
