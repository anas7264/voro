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

## 2026-06-09 - Exfiltration Sink Monitoring in RASP
**Vulnerability:**
Runtime Self-Protection (RASP) systems often focus only on core execution primitives (eval, Function) or storage access (localStorage). This leaves the application vulnerable to monkey-patched exfiltration sinks (XMLHttpRequest, WebSocket, sendBeacon) where a malicious script could intercept and redirect sensitive data without triggering execution-based alerts.

**Learning:**
Hardening RASP requires monitoring not just how code runs, but where data goes. By including exfiltration-capable APIs like `XMLHttpRequest`, `WebSocket`, and `navigator.sendBeacon` in the integrity attestation list, the Security Sentinel can detect environment-level tampering aimed at silent data theft. Additionally, monitoring the `Proxy` global detects more sophisticated shadowing techniques used to bypass standard property checks.

**Prevention:**
Always include network-bound and redirection APIs in runtime integrity checks. Use native-code verification to ensure these sinks haven't been replaced with wrapper functions that forward data to third-party origins.

## 2026-06-10 - Distributed Lockdown Inconsistency
**Vulnerability:**
Single-tab lockdown mechanisms are vulnerable to "session-pivoting" where an attacker, after triggering a security sink in one tab (e.g., via a blocked CSP violation or RASP check), can continue their activities in other open tabs of the same application that haven't yet reached the same execution branch.

**Learning:**
Security state must be treated as a global, cross-tab primitive. Relying on local event listeners or shared state that requires a page reload is insufficient for active defense. Implementing a dedicated 'Security Nexus' via `BroadcastChannel` allows for near-instantaneous synchronization of the `VORO_COMPROMISED` state, ensuring that a detection in one context atomically neutralizes the entire origin's session across all open tabs.

**Prevention:**
Always implement a cross-tab synchronization layer for critical security states (lockdown, session termination, key shredding). Use `BroadcastChannel` for low-latency, same-origin signaling to ensure that the application's defensive posture is unified and leaves no un-neutralized execution contexts for an attacker to pivot into.

## 2025-05-14 - Active Defense Suite (Honey-tokens & Active CSP)
**Learning**: Implementing deception-based security (Honey-tokens) and transforming passive browser protections (CSP) into active security sinks significantly hardens applications against automated probing and XSS-based exfiltration. By shifting from passive blocking to active environment neutralization, the cost for an attacker to maintain persistence or exfiltrate data increases exponentially.

**Action**: Added `CANARY_KEYS` to `StorageManager` and a `securitypolicyviolation` listener to `security.js` to trigger an immediate, system-wide lockdown (shredding keys, purging cache, wiping session storage) upon detection of unauthorized exploration or injection attempts.

## 2025-05-17 - Precision in Secret Redaction Patterns

**Vulnerability:**
Broad regex patterns intended to catch secrets can lead to significant functional degradation and developer confusion if they collide with non-sensitive identifiers.

**Learning:**
A generic 40-character alphanumeric regex (`\b[A-Za-z0-9/+=]{40}\b`) intended to catch AWS Secret Access Keys will trigger high false-positives against Git commit hashes, SHA-1 checksums, and other common 40-character blobs ubiquitous in development environments. Redaction must favor high-precision patterns with unique prefixes (like `github_pat_` or `sk_live_`) or use proximity-based heuristics to ensure data integrity is maintained for non-sensitive technical identifiers.

**Prevention:**
Always validate new redaction patterns against common non-sensitive identifiers (Git hashes, UUIDs, Base64 padding). Avoid length-only detection for secrets without a known, constant prefix.
