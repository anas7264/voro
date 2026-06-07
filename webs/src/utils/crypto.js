// VORO Crypto Utility
// Authenticated Encryption at Rest (AES-GCM) using Web Crypto API

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
    this.initialized = false;
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
  }

  /**
   * Derives a domain-specific key using HKDF.
   * This ensures cryptographic isolation between different storage buckets.
   */
  async deriveDomainKey(domain) {
    if (window.VORO_COMPROMISED) {
      this.key = null;
      this.hkdfKey = null;
      throw new Error("Security Sentinel: Cryptographic operations blocked due to environment compromise.");
    }

    await this.init();
    const encoder = new TextEncoder();
    return await window.crypto.subtle.deriveKey(
      {
        name: 'HKDF',
        salt: new Uint8Array(), // Static salt is acceptable in this context as HKDF key is unique
        info: encoder.encode(domain),
        hash: 'SHA-256'
      },
      this.hkdfKey,
      { name: ALGO, length: KEY_SIZE },
      false,
      ['encrypt', 'decrypt']
    );
  }

  /**
   * Encrypt data with Hierarchical Key Isolation (v3)
   * @param {any} data - Data to encrypt
   * @param {string} domain - Storage key for domain isolation and binding
   * @returns {Promise<string>} Base64 encoded encrypted string
   */
  async encrypt(data, domain = null) {
    if (data === null || data === undefined) return data;

    if (window.VORO_COMPROMISED) {
      this.key = null;
      this.hkdfKey = null;
      throw new Error("Security Sentinel: Encryption blocked due to environment compromise.");
    }

    await this.init();

    const encoder = new TextEncoder();
    const encodedData = encoder.encode(typeof data === 'string' ? data : JSON.stringify(data));
    const iv = window.crypto.getRandomValues(new Uint8Array(12));

    // For v3 (domain isolated), we derive a key specifically for this domain
    // If no domain provided, we fallback to v2/v1 (though storage should always provide domain)
    const useV3 = !!domain;
    const encryptionKey = useV3 ? await this.deriveDomainKey(domain) : this.key;

    const algorithm = { name: ALGO, iv };
    if (domain) {
      algorithm.additionalData = encoder.encode(domain);
    }

    const ciphertext = await window.crypto.subtle.encrypt(
      algorithm,
      encryptionKey,
      encodedData
    );

    const combined = new Uint8Array(iv.length + ciphertext.byteLength);
    combined.set(iv);
    combined.set(new Uint8Array(ciphertext), iv.length);

    let binary = '';
    const bytes = new Uint8Array(combined);
    for (let i = 0; i < bytes.byteLength; i++) {
      binary += String.fromCharCode(bytes[i]);
    }

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

    if (window.VORO_COMPROMISED) {
      this.key = null;
      this.hkdfKey = null;
      throw new Error("Security Sentinel: Decryption blocked due to environment compromise.");
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
      if ((version === 2 || version === 3) && domain) {
        algorithm.additionalData = new TextEncoder().encode(domain);
      }

      const decrypted = await window.crypto.subtle.decrypt(
        algorithm,
        decryptionKey,
        ciphertext
      );

      const decoded = new TextDecoder().decode(decrypted);
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
