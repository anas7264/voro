import React, { Component } from "react";
import { AlertTriangle, ShieldAlert, RotateCcw, Cpu, Sparkles } from "lucide-react";
import sentinel from "../utils/security";

const { redactData, executeLockdown } = sentinel || {};

// Robust fallback redaction helper in case sentinel or redactData is not yet fully initialized/bound
const safeRedact = (data) => {
  if (!data) return "";
  if (redactData) {
    try {
      return redactData(data);
    } catch (e) {
      // Fallback below
    }
  }
  if (typeof data !== "string") {
    try {
      data = String(data);
    } catch (e) {
      return "[UNREADABLE_ERROR]";
    }
  }
  // Comprehensive secure regex list to scrub sensitive data from leakage at error display surfaces
  return data
    .replace(/[\w.-]+@[\w.-]+\.\w+/g, "[REDACTED_EMAIL]")
    .replace(/\b[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\b/gi, "[REDACTED_UUID]")
    .replace(/sk_(?:live|test)_[A-Za-z0-9]+/g, "[REDACTED_STRIPE]")
    .replace(/eyJ[\w=-]+\.eyJ[\w=-]+\.[\w-_.+/=]*/g, "[REDACTED_JWT]")
    .replace(/\bsk-ant-api03-[a-zA-Z0-9\-_]{93,}/g, "[REDACTED_CLAUDE]")
    .replace(/\bsk-(?:proj-)?[a-zA-Z0-9\-_]{20,}\b/g, "[REDACTED_OPENAI]")
    .replace(/(https?:\/\/|www\.)[^\s)\]]+/gi, "[REDACTED_URL]");
};

const safeLockdown = () => {
  if (executeLockdown) {
    try {
      executeLockdown();
    } catch (e) {
      // Fallback
    }
  } else if (typeof window !== "undefined") {
    window.VORO_COMPROMISED = true;
    window.VORO_DECEPTION_ACTIVE = true;
    if (window.dispatchEvent) {
      window.dispatchEvent(new CustomEvent("voro-security-lockdown"));
    }
  }
};

/**
 * RASP Security Inspection
 * Inspects exception context at runtime for injection, bypass, or prototype pollution markers.
 * If threat signature identified, triggers immediate System Lockdown.
 */
const analyzeErrorForTampering = (error, errorInfo) => {
  if (!error) return false;
  const message = String(error.message || "").toLowerCase();
  const stack = String(error.stack || "").toLowerCase();
  const componentStack = errorInfo && errorInfo.componentStack ? String(errorInfo.componentStack).toLowerCase() : "";

  const suspiciousPatterns = [
    "__proto__",
    "constructor.prototype",
    "eval at",
    "<anonymous>",
    "chrome-extension:",
    "moz-extension:",
    "ignore system instructions",
    "override system",
    "voro_internal_bypass"
  ];

  for (const pattern of suspiciousPatterns) {
    if (message.includes(pattern) || stack.includes(pattern) || componentStack.includes(pattern)) {
      console.error(`Security Sentinel [RASP]: Tamper-induced crash or suspicious signature detected: "${pattern}". Executing secure lockdown.`);
      safeLockdown();
      return true;
    }
  }
  return false;
};

/**
 * SecureErrorBoundary Class Component
 *
 * Re-engineered to the VORO premium 'Forge' luxury system aesthetic.
 * Integrates comprehensive Zero-Information Leakage redaction, RASP active analysis,
 * an Accessible 3D Interaction Pattern on hover/focus, and automatic cache-shredding self-healing.
 *
 * Functions both as:
 * 1. A React class-based Error Boundary wrapping children nodes.
 * 2. A presentation-only component receiving an "error" prop (fully backward-compatible).
 */
export class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      isHovered: false,
      isFocused: false,
      isDetailsOpen: false
    };

    this.buttonRef = React.createRef();
    this.txRef = React.createRef();
    this.tyRef = React.createRef();
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({ error, errorInfo });
    analyzeErrorForTampering(error, errorInfo);
  }

  handleMouseMove = (e) => {
    const button = this.buttonRef.current;
    if (!button) return;
    const rect = button.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Direct DOM-based 3D coordinate transformation calculations (max 12 degrees)
    const tiltY = ((x / rect.width) - 0.5) * 24;
    const tiltX = (0.5 - (y / rect.height)) * 24;

    button.style.setProperty("--mouse-x", `${x}px`);
    button.style.setProperty("--mouse-y", `${y}px`);
    button.style.setProperty("--tilt-x", `${tiltX}deg`);
    button.style.setProperty("--tilt-y", `${tiltY}deg`);

    if (this.txRef.current) this.txRef.current.innerText = tiltX.toFixed(1);
    if (this.tyRef.current) this.tyRef.current.innerText = tiltY.toFixed(1);
  };

  handleFocus = () => {
    this.setState({ isFocused: true });
    const button = this.buttonRef.current;
    if (button) {
      // Apply immediate static 4-degree tilt on keyboard focus for visual confirmation
      button.style.setProperty("--tilt-x", "4deg");
      button.style.setProperty("--tilt-y", "-4deg");
      if (this.txRef.current) this.txRef.current.innerText = "4.0";
      if (this.tyRef.current) this.tyRef.current.innerText = "-4.0";
    }
  };

  handleBlur = () => {
    this.setState({ isFocused: false });
    const button = this.buttonRef.current;
    if (button) {
      button.style.setProperty("--tilt-x", "0deg");
      button.style.setProperty("--tilt-y", "0deg");
    }
  };

  handleSecureReset = () => {
    try {
      // 1. Shred memory caches immediately to prevent leakage
      if (typeof window !== "undefined" && window.storage) {
        window.storage.clearCache();
      }
      // 2. Perform a clean self-healing page reload
      if (typeof window !== "undefined") {
        window.location.reload();
      }
    } catch (e) {
      if (typeof window !== "undefined") {
        window.location.href = "/";
      }
    }
  };

  render() {
    const activeError = this.props.error || this.state.error;
    const activeHasError = this.props.error !== undefined || this.state.hasError;

    if (activeHasError) {
      // Apply full redaction to prevent raw keys, biometrics, or stack details leaking to DOM
      const redactedMessage = safeRedact(activeError ? (activeError.message || String(activeError)) : "An unexpected error occurred");
      const redactedStack = safeRedact(activeError ? (activeError.stack || "") : "");
      const redactedComponentStack = safeRedact(this.state.errorInfo ? (this.state.errorInfo.componentStack || "") : "");

      const interactionActive = this.state.isHovered || this.state.isFocused;

      return (
        <div className="min-h-screen bg-[#020408] text-[#F0F4FF] flex items-center justify-center p-6 relative overflow-hidden font-sans">
          {/* Cybernetic ambient background lights */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
            <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-[#EF4444]/5 rounded-full blur-[150px]" />
            <div className="absolute bottom-[10%] right-[-5%] w-[40%] h-[40%] bg-[#7C3AED]/5 rounded-full blur-[120px]" />
            <div className="absolute inset-0 bg-grid-white opacity-[0.015]" />
            <div className="absolute inset-0 bg-boutique-grain opacity-[0.02]" />
          </div>

          <div className="relative max-w-2xl w-full z-10 space-y-10 animate-scale-in">
            {/* Header Telemetry Branding */}
            <div className="flex items-center justify-between border-b border-white/5 pb-6">
              <div className="flex items-center gap-3 text-[#EF4444]">
                <ShieldAlert size={20} className="animate-pulse" />
                <span className="text-[0.65rem] font-mono font-black uppercase tracking-[0.4em] text-gray-500">
                  SYSTEM SHIELD ACTIVE
                </span>
              </div>
              <span className="text-[0.55rem] font-mono text-gray-700 tracking-[0.3em] uppercase">
                CODE // VORO_RASP_SHLD
              </span>
            </div>

            {/* Symmetrical Luxury Callout Card */}
            <div className="bg-[#0A0C14]/90 border border-white/5 p-10 rounded-[2.5rem] shadow-[0_40px_80px_rgba(0,0,0,0.7)] backdrop-blur-xl relative overflow-hidden space-y-8">
              <div className="absolute inset-0 bg-scanline opacity-[0.02] pointer-events-none" />

              <div className="space-y-4">
                <h1 className="text-4xl md:text-5xl font-serif italic font-medium text-white tracking-tight">
                  System <span className="text-[#EF4444] not-italic font-black">Anomaly</span> Detected
                </h1>
                <p className="text-gray-400 font-mono text-xs leading-relaxed tracking-tight">
                  VORO's Neural Shield intercepted an unexpected runtime exception. The active environment was dynamically decoupled to protect your cryptographic keys and biological records from cross-origin exfiltration.
                </p>
              </div>

              {/* Redacted Message Banner */}
              <div className="p-6 rounded-2xl bg-red-500/5 border border-red-500/10 flex items-start gap-4">
                <AlertTriangle size={18} className="text-[#EF4444] mt-0.5 flex-shrink-0" />
                <div className="space-y-1">
                  <span className="text-[0.55rem] font-mono font-black uppercase tracking-widest text-[#EF4444]/70 block">
                    INTERCEPTED EXCEPTION
                  </span>
                  <p className="text-sm font-mono text-gray-300 leading-normal font-bold">
                    {redactedMessage}
                  </p>
                </div>
              </div>

              {/* Collapsible Secure Diagnostics Terminal */}
              <div className="space-y-3">
                <button
                  onClick={() => this.setState(prev => ({ isDetailsOpen: !prev }))}
                  className="text-[0.55rem] font-mono font-black text-gray-500 hover:text-voro-primary uppercase tracking-[0.3em] flex items-center gap-2 transition-colors outline-none focus-visible:ring-1 focus-visible:ring-voro-primary focus-visible:ring-offset-1 focus-visible:ring-offset-[#0A0C14]"
                >
                  <Cpu size={10} />
                  {this.state.isDetailsOpen ? "[-] HIDE SECURE TELEMETRY" : "[+] REVEAL SECURE TELEMETRY"}
                </button>

                {this.state.isDetailsOpen && (
                  <div className="p-6 rounded-2xl bg-[#030408] border border-white/5 font-mono text-[0.65rem] text-gray-500 space-y-4 overflow-x-auto max-h-48 no-scrollbar relative animate-fade-in">
                    <div className="absolute top-4 right-4 pointer-events-none">
                      <span className="text-[0.5rem] text-gray-800 tracking-widest uppercase">REDACTED_DUMP_V3</span>
                    </div>
                    {redactedStack && (
                      <div className="space-y-1">
                        <span className="text-[#7C3AED] font-bold block">// SCRUBBED CALLSTACK:</span>
                        <pre className="whitespace-pre-wrap leading-relaxed text-gray-600">{redactedStack}</pre>
                      </div>
                    )}
                    {redactedComponentStack && (
                      <div className="space-y-1 pt-3 border-t border-white/5">
                        <span className="text-[#7C3AED] font-bold block">// COMPONENT STACK:</span>
                        <pre className="whitespace-pre-wrap leading-relaxed text-gray-600">{redactedComponentStack}</pre>
                      </div>
                    )}
                    {!redactedStack && !redactedComponentStack && (
                      <p className="text-gray-700 italic">No diagnostic stack telemetry available in this context.</p>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Premium Interactive 3D Reset Action */}
            <div className="flex flex-col items-center justify-center space-y-6 pt-4">
              <button
                ref={this.buttonRef}
                onMouseMove={this.handleMouseMove}
                onMouseEnter={() => this.setState({ isHovered: true })}
                onMouseLeave={() => this.setState({ isHovered: false })}
                onFocus={this.handleFocus}
                onBlur={this.handleBlur}
                onClick={this.handleSecureReset}
                style={{
                  transform: interactionActive
                    ? "perspective(1000px) rotateX(var(--tilt-x, 0deg)) rotateY(var(--tilt-y, 0deg)) translateY(-4px)"
                    : "perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)",
                  transition: this.state.isHovered ? "none" : "transform 0.8s cubic-bezier(0.16, 1, 0.3, 1)",
                  transformStyle: "preserve-3d"
                }}
                className="group relative px-10 py-5 rounded-2xl bg-white/5 border border-white/5 hover:border-voro-primary/30 transition-all duration-700 overflow-hidden outline-none focus-visible:ring-2 focus-visible:ring-voro-primary focus-visible:ring-offset-2 focus-visible:ring-offset-[#020408]"
              >
                {/* Dynamic radial gradient shine */}
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
                  style={{
                    background: "radial-gradient(150px circle at var(--mouse-x, 0px) var(--mouse-y, 0px), rgba(124, 58, 237, 0.15), transparent 60%)"
                  }}
                />

                <div className="relative z-10 flex items-center gap-3 font-mono text-xs font-black uppercase tracking-[0.3em] text-white" style={{ transform: "translateZ(20px)" }}>
                  <RotateCcw size={14} className="group-hover:rotate-[-45deg] transition-transform duration-500" />
                  <span>Execute Secure System Reset</span>
                </div>
              </button>

              {/* Direct-DOM Telemetry Overlay */}
              <div className="flex items-center gap-4 font-mono text-[0.45rem] font-bold text-gray-700 tracking-widest uppercase">
                <Sparkles size={8} className="text-voro-primary animate-pulse" />
                <span>ACTIVE_TILT: TX_<span ref={this.txRef}>0.0</span>° TY_<span ref={this.tyRef}>0.0</span>°</span>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
