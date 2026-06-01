## 2025-05-15 - Authenticated Encryption at Rest for Local Storage

**Vulnerability:**
Browser-based applications typically store sensitive user data in `localStorage` in plain text. This data is vulnerable to exfiltration via Cross-Site Scripting (XSS) or local system compromise. While `localStorage` is origin-bound, any script running in the same origin can dump the entire storage.

**Learning:**
Implementing AES-GCM (256-bit) provides both confidentiality and integrity (authentication). By storing the encryption key in IndexedDB as a non-exportable `CryptoKey` object, the key itself is isolated from the `localStorage` exfiltration vector. This creates a multi-layered defense: an attacker must not only execute XSS but also find a way to use the Web Crypto API to decrypt the data, as the raw key material cannot be extracted.

**Prevention:**
Always encrypt sensitive PII and health metrics before persisting to browser storage. Use the Web Crypto API for industry-standard authenticated encryption. Implement an observer pattern in the storage layer to ensure that asynchronous decryption doesn't lead to UI inconsistencies or stale data across multiple React contexts. Avoid using `String.fromCharCode.apply` for large binary-to-string conversions to prevent stack overflow crashes.
