// VORO Crypto Utility
// Authenticated Encryption at Rest (AES-GCM) using Web Crypto API

const DB_NAME = 'VORO_SECURE_STORAGE';
const STORE_NAME = 'KEYS';
const KEY_NAME = 'MASTER_KEY';
const ALGO = 'AES-GCM';
const KEY_SIZE = 256;

class CryptoManager {
  constructor() {
    this.key = null;
    this.initialized = false;
  }

  // Initialize the crypto manager (load or generate key)
  async init() {
    if (this.initialized) return;

    try {
      this.key = await this.getOrGenerateKey();
      this.initialized = true;
    } catch (error) {
      console.error('Failed to initialize VORO Crypto:', error);
      throw error;
    }
  }

  // Get key from IndexedDB or generate a new one
  async getOrGenerateKey() {
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
        const getRequest = store.get(KEY_NAME);

        getRequest.onsuccess = async () => {
          if (getRequest.result) {
            resolve(getRequest.result);
          } else {
            // Generate new non-exportable key
            try {
              const newKey = await window.crypto.subtle.generateKey(
                { name: ALGO, length: KEY_SIZE },
                false, // Not exportable for maximum security
                ['encrypt', 'decrypt']
              );

              const putRequest = store.put(newKey, KEY_NAME);
              putRequest.onsuccess = () => resolve(newKey);
              putRequest.onerror = () => reject(new Error('Failed to store encryption key'));
            } catch (err) {
              reject(err);
            }
          }
        };

        getRequest.onerror = () => reject(new Error('Failed to retrieve encryption key'));
      };

      request.onerror = () => reject(new Error('Failed to open secure key store'));
    });
  }

  /**
   * Encrypt data
   * @param {any} data - Data to encrypt (string or object)
   * @returns {Promise<string>} Base64 encoded encrypted string
   */
  async encrypt(data) {
    if (data === null || data === undefined) return data;

    await this.init();

    const encoder = new TextEncoder();
    const encodedData = encoder.encode(typeof data === 'string' ? data : JSON.stringify(data));

    // Generate 12-byte IV for AES-GCM
    const iv = window.crypto.getRandomValues(new Uint8Array(12));

    const ciphertext = await window.crypto.subtle.encrypt(
      { name: ALGO, iv },
      this.key,
      encodedData
    );

    // Combine IV and ciphertext for storage: [IV (12 bytes)][Ciphertext]
    const combined = new Uint8Array(iv.length + ciphertext.byteLength);
    combined.set(iv);
    combined.set(new Uint8Array(ciphertext), iv.length);

    // Safety: Use a loop-based conversion to avoid stack overflow for large payloads
    let binary = '';
    const bytes = new Uint8Array(combined);
    for (let i = 0; i < bytes.byteLength; i++) {
      binary += String.fromCharCode(bytes[i]);
    }

    // Return base64 encoded string with 'v1:' prefix
    return 'v1:' + btoa(binary);
  }

  /**
   * Decrypt data
   * @param {string} encryptedData - Encrypted string from storage
   * @returns {Promise<any>} Decrypted data
   */
  async decrypt(encryptedData) {
    if (typeof encryptedData !== 'string' || !encryptedData.startsWith('v1:')) {
      return encryptedData; // Not encrypted or unknown version
    }

    await this.init();

    try {
      const binaryString = atob(encryptedData.slice(3));
      const bytes = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }

      const iv = bytes.slice(0, 12);
      const ciphertext = bytes.slice(12);

      const decrypted = await window.crypto.subtle.decrypt(
        { name: ALGO, iv },
        this.key,
        ciphertext
      );

      const decoded = new TextDecoder().decode(decrypted);

      try {
        return JSON.parse(decoded);
      } catch (e) {
        return decoded;
      }
    } catch (error) {
      console.error('Decryption failed:', error);
      return null;
    }
  }
}

const cryptoManager = new CryptoManager();
export default cryptoManager;
