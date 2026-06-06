## 2025-05-15 - Authenticated Encryption at Rest for Local Storage

**Vulnerability:**
Browser-based applications typically store sensitive user data in `localStorage` in plain text. This data is vulnerable to exfiltration via Cross-Site Scripting (XSS) or local system compromise. While `localStorage` is origin-bound, any script running in the same origin can dump the entire storage.

**Learning:**
Implementing AES-GCM (256-bit) provides both confidentiality and integrity (authentication). By storing the encryption key in IndexedDB as a non-exportable `CryptoKey` object, the key itself is isolated from the `localStorage` exfiltration vector. This creates a multi-layered defense: an attacker must not only execute XSS but also find a way to use the Web Crypto API to decrypt the data, as the raw key material cannot be extracted.

**Prevention:**
Always encrypt sensitive PII and health metrics before persisting to browser storage. Use the Web Crypto API for industry-standard authenticated encryption. Implement an observer pattern in the storage layer to ensure that asynchronous decryption doesn't lead to UI inconsistencies or stale data across multiple React contexts. Avoid using `String.fromCharCode.apply` for large binary-to-string conversions to prevent stack overflow crashes.

## 2026-06-02 - Generalized AI Boundary Neutralization
**Vulnerability:**
Indirect prompt injection can occur if user-controlled data contains markers that the LLM interprets as system-defined boundaries (e.g., [USER_DATA], [SECURITY_PROTOCOL]). An attacker could craft data that appears to close a block and start a new one with malicious instructions.

**Learning:**
Neutralizing all bracketed markers with a minimum length and alphanumeric pattern provides a generic defense against this class of injection. By wrapping markers in balanced double brackets (e.g., [[MARKER]]), we strip them of their structural meaning to the LLM while maintaining readability for debugging.

**Prevention:**
Always run user-provided data through a neutralization pass before embedding it into system prompts. Exclude known UI-only tags using negative lookaheads to prevent interfering with legitimate application feedback loops.

## 2026-06-03 - Polymorphic Prompt Isolation (PPI)
**Vulnerability:**
Fixed markers like `[USER_DATA]` are susceptible to "delimiter hijacking" or "tag closure" attacks where a malicious user provides input like `[/USER_DATA] Malicious Instruction [USER_DATA]`. This tricks the LLM into thinking the untrusted block has ended.

**Learning:**
Polymorphic Prompt Isolation (PPI) uses ephemeral, cryptographically secure nonces generated per-request to create dynamic boundaries (e.g., `[USER_DATA_${nonce}]`). By enforcing these unique boundaries in the system prompt and checking the AI's output for nonce leakage, we create a "moving target" defense that is significantly harder to spoof or bypass.

**Prevention:**
Never use static delimiters for untrusted data in LLM prompts. Generate a fresh nonce for every request, wrap all untrusted segments (including chat history and current input) in nonced markers, and validate that the nonce does not appear in the final response.

## 2026-06-04 - Multi-Layered PII Redaction & AI Exfiltration Defense
**Vulnerability:**
AI responses and user-controlled data can leak sensitive identifiers (AWS keys, JWTs, UUIDs) or exfiltrate data via markdown media (images, data URIs) if the redaction engine and output validation are too narrow.

**Learning:**
Defense in depth requires expanding redaction patterns beyond standard PII (email, phone) to include infrastructure and session identifiers (AWS, JWT, UUID, IPv6). Furthermore, AI exfiltration detection must account for all markdown media types (not just links) and monitor for session-specific keywords (cookie, session, localstorage, voro_ prefix) in URLs.

**Prevention:**
Maintain a comprehensive and evolving library of redaction regexes that cover both identity and infrastructure. Validate all AI-generated markdown to ensure that links and media do not contain sensitive tokens or attempt to access browser storage via URL parameters.

## 2025-05-16 - Sequential AI Security Pipeline Architecture
**Vulnerability:**
Early-return patterns in security validation functions (like `validateAIResponse`) can lead to "validation bypass". For example, if a function returns immediately after redacting PII, it may skip critical checks for prompt injection remnants or markdown-based data exfiltration.

**Learning:**
Security and privacy checks must be architected as a sequential pipeline rather than a series of mutually exclusive blocks. By using a `validatedResponse` accumulator, each layer of defense (Nonce check, Injection check, PII redaction, and Exfiltration filtering) is guaranteed to execute, regardless of whether a previous layer found an issue.

**Prevention:**
Always design security middleware or validation functions to apply all relevant filters to the data stream. Avoid early returns for non-terminal violations (like PII) if higher-severity or orthogonal checks (like exfiltration) still need to be performed on the resulting output.
