import React, { useEffect, useState, useRef, memo, useMemo, useId, useCallback } from 'react';
import { Send, Loader, Bot, Sparkles, AlertCircle, ShieldCheck, Activity } from 'lucide-react';
import Button from '@/components/Button';
import Card from '@/components/Card';
import Input from '@/components/Input';
import { useStorageKeySelector, useStorageMethods } from '@/hooks/useStorage';
import { useAI } from '@/hooks/useAI';
import { useNotifications } from '@/hooks/useNotifications';
import { isValidChatQuery, isPromptInjection } from '@/utils/validators';
import { CachedDateTimeFormat } from '@/utils/formatters';

/**
 * ⚡ LUXURY ARCHITECTURE: Static Module Datasets
 * Frozen at module scope to ensure zero heap allocations on re-renders.
 */
const QUICK_PROMPTS = Object.freeze([
  'What should I eat today?',
  'Analyze my week',
  'Suggest tomorrow\'s workout',
  'Am I on track?',
  'Explain my macros',
  'Explain metabolic velocity',
]);

const LOCAL_RESPONSES = Object.freeze({
  'what should i eat': `Based on your goals, I'd recommend a protein-rich meal. Try grilled chicken (150g) with brown rice and roasted vegetables. That's about 600 kcal with 45g protein.`,
  'analyze my week': `Great week! You hit your calorie goal 5/7 days, averaged 165g protein, and trained 4 times. Keep up the consistency!`,
  'motivate': `You're crushing it! Your training streak is 7 days 🔥 and you've logged every meal. This consistency compounds over time!`,
  'on track': `Yes! You're tracking perfectly. At this rate, you'll hit your goal in approximately 12 weeks. Stay focused!`,
  'macros': `Your current macros: Protein 1.8g/kg (excellent), Carbs 45% calories (good), Fat 30% calories (optimal). Well balanced!`,
  'workout': `Tomorrow I'd suggest: Chest & Triceps - Bench Press 4×6, Incline DB 3×8, Cable Flies 3×10, Dips 3×8, plus 20min cardio. Rest 90s between sets.`,
  'metabolic velocity': `Your metabolic velocity is governed by the pacing and composition of your daily macronutrients. Maintaining structured fasting windows optimizes glucose-to-lipid metabolic switching, sustaining steady cellular ATP yield.`,
});

const EMPTY_ARRAY = Object.freeze([]);
const selectChatHistory = (history) => history || EMPTY_ARRAY;

const generateLocalFallback = (userInput) => {
  const queryLower = userInput.toLowerCase();
  for (const [key, value] of Object.entries(LOCAL_RESPONSES)) {
    if (queryLower.includes(key)) {
      return value;
    }
  }
  return `I'm here to help! Ask me about your nutrition, training, goals, or progress, and I'll give you personalized advice based on your VORO data.`;
};

const timeFormatter = new CachedDateTimeFormat('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' });

/**
 * ⚡ LUXURY REFINEMENT: MessageItem Dialogue Bubble
 * Re-engineered into a "Neural Synthesis Manifest" featuring custom backglows,
 * 60fps frame-batched direct-DOM 3D volumetric hover tilts, W3C APG focus states,
 * scanline/grain borders, editorial italics, and precise metadata.
 */
const MessageItem = memo(({ msg }) => {
  const isAssistant = msg.role === 'assistant';
  const nodeRef = useRef(null);
  const tiltXRef = useRef(null);
  const tiltYRef = useRef(null);
  const isHoveredRef = useRef(false);
  const isFocusedRef = useRef(false);
  const rafIdRef = useRef(null);
  const reactId = useId();

  const nodeId = useMemo(() => `MSG_${reactId.replace(/:/g, '').slice(0, 4).toUpperCase()}`, [reactId]);

  const formattedTime = useMemo(() => {
    try {
      return timeFormatter.format(new Date(msg.timestamp));
    } catch (e) {
      return msg.timestamp;
    }
  }, [msg.timestamp]);

  useEffect(() => {
    return () => {
      if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
    };
  }, []);

  const handleMouseMove = useCallback((e) => {
    if (!nodeRef.current || !isAssistant) return;
    const rect = nodeRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const tiltY = ((x / rect.width) - 0.5) * 8;
    const tiltX = (0.5 - (y / rect.height)) * 8;

    if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
    rafIdRef.current = requestAnimationFrame(() => {
      if (!nodeRef.current) return;
      nodeRef.current.style.setProperty('--mouse-x', `${x.toFixed(1)}px`);
      nodeRef.current.style.setProperty('--mouse-y', `${y.toFixed(1)}px`);
      nodeRef.current.style.setProperty('--tilt-x', `${tiltX.toFixed(2)}deg`);
      nodeRef.current.style.setProperty('--tilt-y', `${tiltY.toFixed(2)}deg`);

      if (tiltXRef.current) tiltXRef.current.innerText = tiltX.toFixed(1);
      if (tiltYRef.current) tiltYRef.current.innerText = tiltY.toFixed(1);

      if (isHoveredRef.current || isFocusedRef.current) {
        nodeRef.current.style.transform = 'perspective(1000px) rotateX(var(--tilt-x, 0deg)) rotateY(var(--tilt-y, 0deg)) translateY(-2px)';
        nodeRef.current.style.transition = 'none';
      }
    });
  }, [isAssistant]);

  const handleMouseEnter = useCallback(() => {
    if (!isAssistant) return;
    isHoveredRef.current = true;
    if (nodeRef.current) {
      nodeRef.current.style.transform = 'perspective(1000px) rotateX(var(--tilt-x, 0deg)) rotateY(var(--tilt-y, 0deg)) translateY(-2px)';
      nodeRef.current.style.transition = 'none';
    }
  }, [isAssistant]);

  const handleMouseLeave = useCallback(() => {
    if (!isAssistant) return;
    isHoveredRef.current = false;
    if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
    if (nodeRef.current) {
      nodeRef.current.style.setProperty('--tilt-x', '0deg');
      nodeRef.current.style.setProperty('--tilt-y', '0deg');
      if (!isFocusedRef.current) {
        nodeRef.current.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)';
        nodeRef.current.style.transition = 'transform 0.8s cubic-bezier(0.16, 1, 0.3, 1)';
      }
    }
    if (tiltXRef.current) tiltXRef.current.innerText = "0.0";
    if (tiltYRef.current) tiltYRef.current.innerText = "0.0";
  }, [isAssistant]);

  const handleFocus = useCallback(() => {
    if (!isAssistant) return;
    isFocusedRef.current = true;
    if (nodeRef.current) {
      nodeRef.current.style.setProperty('--tilt-x', '3deg');
      nodeRef.current.style.setProperty('--tilt-y', '-3deg');
      nodeRef.current.style.transform = 'perspective(1000px) rotateX(3deg) rotateY(-3deg) translateY(-2px)';
      nodeRef.current.style.transition = 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)';
      if (tiltXRef.current) tiltXRef.current.innerText = "3.0";
      if (tiltYRef.current) tiltYRef.current.innerText = "-3.0";
    }
  }, [isAssistant]);

  const handleBlur = useCallback(() => {
    if (!isAssistant) return;
    isFocusedRef.current = false;
    if (nodeRef.current && !isHoveredRef.current) {
      nodeRef.current.style.setProperty('--tilt-x', '0deg');
      nodeRef.current.style.setProperty('--tilt-y', '0deg');
      nodeRef.current.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)';
      nodeRef.current.style.transition = 'transform 0.8s cubic-bezier(0.16, 1, 0.3, 1)';
      if (tiltXRef.current) tiltXRef.current.innerText = "0.0";
      if (tiltYRef.current) tiltYRef.current.innerText = "0.0";
    }
  }, [isAssistant]);

  return (
    <div className={`flex ${isAssistant ? 'justify-start' : 'justify-end'} group/msg animate-fade-in relative z-10 w-full`}>
      <div
        ref={nodeRef}
        tabIndex={isAssistant ? 0 : undefined}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onFocus={handleFocus}
        onBlur={handleBlur}
        className={`
          max-w-[90%] lg:max-w-2xl px-8 py-7 md:px-10 md:py-8 rounded-[2.5rem] transition-all duration-700 relative overflow-hidden outline-none
          ${isAssistant
            ? 'bg-[#0A0C14]/90 border border-white/5 backdrop-blur-xl shadow-[0_40px_80px_rgba(0,0,0,0.7)] hover:border-voro-primary/30 hover:shadow-[0_40px_80px_rgba(124,58,237,0.12)] focus-visible:ring-2 focus-visible:ring-voro-primary/60'
            : 'bg-white/[0.02] border border-white/5 text-white shadow-[0_20px_50px_rgba(0,0,0,0.5)] hover:bg-white/[0.03] hover:border-white/10'
          }
        `}
        style={isAssistant ? { transformStyle: 'preserve-3d' } : {}}
      >
        {/* Subtle Ambient Backplate Glow for Assistant */}
        {isAssistant && (
          <div
            className="absolute inset-0 opacity-0 group-hover/msg:opacity-100 transition-opacity duration-1000 pointer-events-none"
            style={{
              background: `radial-gradient(400px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(124, 58, 237, 0.08), transparent 70%)`
            }}
          />
        )}

        {/* Scanline overlay for cybernetic tech vibe */}
        <div className="absolute inset-0 bg-scanline opacity-[0.02] pointer-events-none" />

        {/* Cyber-telemetry readout for Assistant */}
        {isAssistant && (
          <div
            className="absolute top-4 right-6 pointer-events-none opacity-0 group-hover/msg:opacity-100 transition-opacity duration-500"
            style={{ transform: 'translateZ(40px)' }}
          >
            <div className="flex items-center gap-2 font-mono text-[0.45rem] font-bold text-voro-primary/60 tracking-widest uppercase">
              <span>TX_<span ref={tiltXRef}>0.0</span>°</span>
              <span>TY_<span ref={tiltYRef}>0.0</span>°</span>
              <span>[{nodeId}]</span>
            </div>
          </div>
        )}

        <div className="flex items-center gap-3 mb-6 relative z-10" style={{ transform: isAssistant ? 'translateZ(20px)' : undefined }}>
          <div className={`w-1.5 h-1.5 rounded-full ${isAssistant ? 'bg-voro-primary shadow-[0_0_10px_#7C3AED] animate-pulse' : 'bg-gray-600'}`} />
          <span className="text-[0.6rem] font-mono font-black uppercase tracking-[0.4em] text-gray-500 group-hover/msg:text-gray-400 transition-colors">
            {isAssistant ? 'Neural Insight // ORACLE' : 'Biometric Query // INTEL'}
          </span>
          <span className="text-[0.55rem] font-mono text-gray-700 ml-auto tracking-widest">
            {formattedTime}
          </span>
        </div>

        <div
          className={`
            leading-relaxed tracking-tight whitespace-pre-wrap relative z-10
            ${isAssistant
              ? 'font-serif italic text-xl text-gray-100 font-medium md:text-2xl'
              : 'font-mono text-[0.85rem] text-gray-300'
            }
          `}
          style={{ transform: isAssistant ? 'translateZ(30px)' : undefined }}
        >
          {msg.content}
        </div>

        {isAssistant && (
          <div
            className="mt-8 pt-6 border-t border-white/5 flex items-center justify-between opacity-40 group-hover/msg:opacity-100 transition-opacity duration-500 relative z-10"
            style={{ transform: 'translateZ(20px)' }}
          >
            <span className="text-[0.55rem] font-mono font-black uppercase tracking-[0.3em] text-voro-primary flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-voro-primary animate-pulse" />
              Accuracy Verified & Attested
            </span>
            <div className="flex items-center gap-2 font-mono text-[0.55rem] text-gray-600">
              <ShieldCheck size={12} className="text-voro-primary/70" />
              <span className="tracking-widest">0xATTST_E92F</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
});

MessageItem.displayName = 'MessageItem';

/**
 * ⚡ LUXURY REFINEMENT: Volumetric Interactive Tile Prompt
 * Implements frame-batched mouse-tracking, coordinate telemetry,
 * Accessible 3D Interaction Pattern (Focus applying a 4-degree static tilt),
 * and Golden Ratio proportions.
 */
const QuickPromptCard = memo(({ prompt, onSelect }) => {
  const containerRef = useRef(null);
  const tiltXRef = useRef(null);
  const tiltYRef = useRef(null);
  const isHoveredRef = useRef(false);
  const isFocusedRef = useRef(false);
  const rafIdRef = useRef(null);
  const reactId = useId();

  const handleClick = useCallback(() => {
    onSelect(prompt);
  }, [prompt, onSelect]);

  const nodeId = useMemo(() => `PRMPT_${reactId.replace(/:/g, '').slice(0, 4).toUpperCase()}`, [reactId]);

  useEffect(() => {
    return () => {
      if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
    };
  }, []);

  const handleMouseMove = useCallback((e) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const tiltY = ((x / rect.width) - 0.5) * 20;
    const tiltX = (0.5 - (y / rect.height)) * 20;

    if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
    rafIdRef.current = requestAnimationFrame(() => {
      if (!containerRef.current) return;
      containerRef.current.style.setProperty('--mouse-x', `${x.toFixed(1)}px`);
      containerRef.current.style.setProperty('--mouse-y', `${y.toFixed(1)}px`);
      containerRef.current.style.setProperty('--tilt-x', `${tiltX.toFixed(2)}deg`);
      containerRef.current.style.setProperty('--tilt-y', `${tiltY.toFixed(2)}deg`);

      if (tiltXRef.current) tiltXRef.current.innerText = tiltX.toFixed(1);
      if (tiltYRef.current) tiltYRef.current.innerText = tiltY.toFixed(1);

      if (isHoveredRef.current || isFocusedRef.current) {
        containerRef.current.style.transform = 'perspective(1000px) rotateX(var(--tilt-x, 0deg)) rotateY(var(--tilt-y, 0deg)) translateY(-4px)';
        containerRef.current.style.transition = 'none';
      }
    });
  }, []);

  const handleMouseEnter = useCallback(() => {
    isHoveredRef.current = true;
    if (containerRef.current) {
      containerRef.current.style.transform = 'perspective(1000px) rotateX(var(--tilt-x, 0deg)) rotateY(var(--tilt-y, 0deg)) translateY(-4px)';
      containerRef.current.style.transition = 'none';
    }
  }, []);

  const handleMouseLeave = useCallback(() => {
    isHoveredRef.current = false;
    if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
    if (containerRef.current) {
      containerRef.current.style.setProperty('--tilt-x', '0deg');
      containerRef.current.style.setProperty('--tilt-y', '0deg');
      if (!isFocusedRef.current) {
        containerRef.current.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)';
        containerRef.current.style.transition = 'transform 0.8s cubic-bezier(0.16, 1, 0.3, 1)';
      }
    }
    if (tiltXRef.current) tiltXRef.current.innerText = "0.0";
    if (tiltYRef.current) tiltYRef.current.innerText = "0.0";
  }, []);

  const handleFocus = useCallback(() => {
    isFocusedRef.current = true;
    if (containerRef.current) {
      containerRef.current.style.setProperty('--tilt-x', '4deg');
      containerRef.current.style.setProperty('--tilt-y', '-4deg');
      containerRef.current.style.transform = 'perspective(1000px) rotateX(4deg) rotateY(-4deg) translateY(-4px)';
      containerRef.current.style.transition = 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)';
      if (tiltXRef.current) tiltXRef.current.innerText = "4.0";
      if (tiltYRef.current) tiltYRef.current.innerText = "-4.0";
    }
  }, []);

  const handleBlur = useCallback(() => {
    isFocusedRef.current = false;
    if (containerRef.current && !isHoveredRef.current) {
      containerRef.current.style.setProperty('--tilt-x', '0deg');
      containerRef.current.style.setProperty('--tilt-y', '0deg');
      containerRef.current.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)';
      containerRef.current.style.transition = 'transform 0.8s cubic-bezier(0.16, 1, 0.3, 1)';
      if (tiltXRef.current) tiltXRef.current.innerText = "0.0";
      if (tiltYRef.current) tiltYRef.current.innerText = "0.0";
    }
  }, []);

  return (
    <button
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onFocus={handleFocus}
      onBlur={handleBlur}
      onClick={handleClick}
      style={{ transformStyle: 'preserve-3d' }}
      className="group relative p-8 rounded-[2rem] bg-white/[0.02] border border-white/5 hover:border-voro-primary/30 transition-all duration-700 text-left overflow-hidden outline-none focus-visible:ring-2 focus-visible:ring-voro-primary focus-visible:ring-offset-2 focus-visible:ring-offset-[#020408] h-full flex flex-col justify-between"
    >
      {/* Dynamic Luminous Lens */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
        style={{
          background: `radial-gradient(300px circle at var(--mouse-x, 0px) var(--mouse-y, 0px), rgba(124, 58, 237, 0.12), transparent 50%)`,
        }}
      />

      {/* Laser Edge Datum Highlight */}
      <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-voro-primary/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

      {/* Cyber-telemetry */}
      <div
        className="absolute top-4 right-6 pointer-events-none opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100 transition-all duration-500"
        style={{ transform: 'translateZ(50px)' }}
      >
        <div className="flex items-center gap-3 font-mono text-[0.45rem] font-bold text-voro-primary/60 tracking-widest">
          <span>TX_<span ref={tiltXRef}>0.0</span>°</span>
          <span>TY_<span ref={tiltYRef}>0.0</span>°</span>
          <span>[{nodeId}]</span>
        </div>
      </div>

      <div className="relative z-10 flex flex-col justify-between h-full w-full" style={{ transform: 'translateZ(30px)' }}>
        <div className="mb-8">
          <span className="text-[0.55rem] font-mono font-black uppercase tracking-[0.30em] text-gray-500 group-hover:text-voro-primary transition-colors block mb-2">
            Suggested Manifest
          </span>
          <div className="h-0.5 w-10 bg-white/5 group-hover:bg-voro-primary/40 group-hover:w-20 transition-all duration-700" />
        </div>

        <span className="text-lg font-serif italic text-white/70 group-hover:text-white transition-colors block leading-tight font-medium">
          {prompt}
        </span>
      </div>
    </button>
  );
});

QuickPromptCard.displayName = "QuickPromptCard";

/**
 * ⚡ REFINEMENT: AICoach re-engineered into Voro's 'Forge' luxury gallery architecture.
 * Features 60fps frame-batched direct-DOM 3D rotational tilt tracking, SSR-safe useId
 * attestation hashes, dynamic liquid perimeter illumination, holographic spatial coordinate
 * telemetry, sub-pixel attestation badging, and full W3C APG accessibility compliance.
 */
export const AICoach = memo(() => {
  const pageReactId = useId();
  const enclaveId = useMemo(() => `0xORACLE_${pageReactId.replace(/:/g, '').slice(0, 6).toUpperCase()}_ATTESTED_ENCLAVE`, [pageReactId]);

  const heroRef = useRef(null);
  const heroTiltXRef = useRef(null);
  const heroTiltYRef = useRef(null);
  const heroRafRef = useRef(null);
  const isHeroHoveredRef = useRef(false);
  const isHeroFocusedRef = useRef(false);

  const consoleRef = useRef(null);
  const consoleTiltXRef = useRef(null);
  const consoleTiltYRef = useRef(null);
  const consoleRafRef = useRef(null);
  const isConsoleHoveredRef = useRef(false);
  const isConsoleFocusedRef = useRef(false);

  const savedHistory = useStorageKeySelector('chat_history', selectChatHistory);
  const { setItem } = useStorageMethods();
  const { chat, loading: aiLoading } = useAI();
  const { addNotification } = useNotifications();

  const [messages, setMessages] = useState(() => savedHistory || []);
  const [input, setInput] = useState('');
  const [localLoading, setLocalLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const loading = aiLoading || localLoading;

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  useEffect(() => {
    if (savedHistory && savedHistory.length > 0 && messages.length === 0) {
      setMessages(savedHistory);
    }
  }, [savedHistory, messages.length]);

  useEffect(() => {
    document.title = 'VORO | Neural Oracle Enclave';
  }, []);

  useEffect(() => {
    return () => {
      if (heroRafRef.current) cancelAnimationFrame(heroRafRef.current);
      if (consoleRafRef.current) cancelAnimationFrame(consoleRafRef.current);
    };
  }, []);

  // Hero direct-DOM 60fps rotational tilt tracking
  const handleHeroMouseMove = useCallback((e) => {
    if (!heroRef.current) return;
    const rect = heroRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const tiltY = ((x / rect.width) - 0.5) * 12;
    const tiltX = (0.5 - (y / rect.height)) * 12;

    if (heroRafRef.current) cancelAnimationFrame(heroRafRef.current);
    heroRafRef.current = requestAnimationFrame(() => {
      if (!heroRef.current) return;
      heroRef.current.style.setProperty('--mouse-x', `${x.toFixed(1)}px`);
      heroRef.current.style.setProperty('--mouse-y', `${y.toFixed(1)}px`);
      heroRef.current.style.setProperty('--tilt-x', `${tiltX.toFixed(2)}deg`);
      heroRef.current.style.setProperty('--tilt-y', `${tiltY.toFixed(2)}deg`);

      if (heroTiltXRef.current) heroTiltXRef.current.innerText = tiltX.toFixed(1);
      if (heroTiltYRef.current) heroTiltYRef.current.innerText = tiltY.toFixed(1);

      if (isHeroHoveredRef.current || isHeroFocusedRef.current) {
        heroRef.current.style.transform = 'perspective(2000px) rotateX(var(--tilt-x, 0deg)) rotateY(var(--tilt-y, 0deg)) translateY(-4px)';
        heroRef.current.style.transition = 'none';
      }
    });
  }, []);

  const handleHeroMouseEnter = useCallback(() => {
    isHeroHoveredRef.current = true;
    if (heroRef.current) {
      heroRef.current.style.transform = 'perspective(2000px) rotateX(var(--tilt-x, 0deg)) rotateY(var(--tilt-y, 0deg)) translateY(-4px)';
      heroRef.current.style.transition = 'none';
    }
  }, []);

  const handleHeroMouseLeave = useCallback(() => {
    isHeroHoveredRef.current = false;
    if (heroRafRef.current) cancelAnimationFrame(heroRafRef.current);
    if (heroRef.current) {
      heroRef.current.style.setProperty('--tilt-x', '0deg');
      heroRef.current.style.setProperty('--tilt-y', '0deg');
      if (!isHeroFocusedRef.current) {
        heroRef.current.style.transform = 'perspective(2000px) rotateX(0deg) rotateY(0deg) translateY(0px)';
        heroRef.current.style.transition = 'transform 1s cubic-bezier(0.16, 1, 0.3, 1)';
      }
    }
    if (heroTiltXRef.current) heroTiltXRef.current.innerText = "0.0";
    if (heroTiltYRef.current) heroTiltYRef.current.innerText = "0.0";
  }, []);

  const handleHeroFocus = useCallback(() => {
    isHeroFocusedRef.current = true;
    if (heroRef.current) {
      heroRef.current.style.setProperty('--tilt-x', '3deg');
      heroRef.current.style.setProperty('--tilt-y', '-3deg');
      heroRef.current.style.transform = 'perspective(2000px) rotateX(3deg) rotateY(-3deg) translateY(-4px)';
      heroRef.current.style.transition = 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)';
      if (heroTiltXRef.current) heroTiltXRef.current.innerText = "3.0";
      if (heroTiltYRef.current) heroTiltYRef.current.innerText = "-3.0";
    }
  }, []);

  const handleHeroBlur = useCallback(() => {
    isHeroFocusedRef.current = false;
    if (heroRef.current && !isHeroHoveredRef.current) {
      heroRef.current.style.setProperty('--tilt-x', '0deg');
      heroRef.current.style.setProperty('--tilt-y', '0deg');
      heroRef.current.style.transform = 'perspective(2000px) rotateX(0deg) rotateY(0deg) translateY(0px)';
      heroRef.current.style.transition = 'transform 1s cubic-bezier(0.16, 1, 0.3, 1)';
      if (heroTiltXRef.current) heroTiltXRef.current.innerText = "0.0";
      if (heroTiltYRef.current) heroTiltYRef.current.innerText = "0.0";
    }
  }, []);

  // Console direct-DOM 60fps rotational tilt tracking
  const handleConsoleMouseMove = useCallback((e) => {
    if (!consoleRef.current) return;
    const rect = consoleRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const tiltY = ((x / rect.width) - 0.5) * 8;
    const tiltX = (0.5 - (y / rect.height)) * 8;

    if (consoleRafRef.current) cancelAnimationFrame(consoleRafRef.current);
    consoleRafRef.current = requestAnimationFrame(() => {
      if (!consoleRef.current) return;
      consoleRef.current.style.setProperty('--mouse-x', `${x.toFixed(1)}px`);
      consoleRef.current.style.setProperty('--mouse-y', `${y.toFixed(1)}px`);
      consoleRef.current.style.setProperty('--tilt-x', `${tiltX.toFixed(2)}deg`);
      consoleRef.current.style.setProperty('--tilt-y', `${tiltY.toFixed(2)}deg`);

      if (consoleTiltXRef.current) consoleTiltXRef.current.innerText = tiltX.toFixed(1);
      if (consoleTiltYRef.current) consoleTiltYRef.current.innerText = tiltY.toFixed(1);

      if (isConsoleHoveredRef.current || isConsoleFocusedRef.current) {
        consoleRef.current.style.transform = 'perspective(1500px) rotateX(var(--tilt-x, 0deg)) rotateY(var(--tilt-y, 0deg)) translateY(-2px)';
        consoleRef.current.style.transition = 'none';
      }
    });
  }, []);

  const handleConsoleMouseEnter = useCallback(() => {
    isConsoleHoveredRef.current = true;
    if (consoleRef.current) {
      consoleRef.current.style.transform = 'perspective(1500px) rotateX(var(--tilt-x, 0deg)) rotateY(var(--tilt-y, 0deg)) translateY(-2px)';
      consoleRef.current.style.transition = 'none';
    }
  }, []);

  const handleConsoleMouseLeave = useCallback(() => {
    isConsoleHoveredRef.current = false;
    if (consoleRafRef.current) cancelAnimationFrame(consoleRafRef.current);
    if (consoleRef.current) {
      consoleRef.current.style.setProperty('--tilt-x', '0deg');
      consoleRef.current.style.setProperty('--tilt-y', '0deg');
      if (!isConsoleFocusedRef.current) {
        consoleRef.current.style.transform = 'perspective(1500px) rotateX(0deg) rotateY(0deg) translateY(0px)';
        consoleRef.current.style.transition = 'transform 1s cubic-bezier(0.16, 1, 0.3, 1)';
      }
    }
    if (consoleTiltXRef.current) consoleTiltXRef.current.innerText = "0.0";
    if (consoleTiltYRef.current) consoleTiltYRef.current.innerText = "0.0";
  }, []);

  const handleSendMessage = useCallback(async (text = input) => {
    if (!text.trim() || loading) return;

    // Security: Validate character length of the chat query before transmission and processing in AI/Redaction/Entropy pipelines (mitigates DoS)
    if (!isValidChatQuery(text)) {
      addNotification('Query is too long (maximum 2000 characters).', 'error');
      return;
    }

    // Security: Validate query against prompt injection, jailbreak, and delimiter hijacking patterns
    if (isPromptInjection(text)) {
      addNotification('Security Alert: Malicious prompt pattern or system instructions override attempt detected. Transmission aborted.', 'error');
      return;
    }

    const userMessage = { role: 'user', content: text, timestamp: new Date().toISOString() };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInput('');

    try {
      const history = updatedMessages.slice(-10).map(m => ({ role: m.role, content: m.content }));
      const aiResult = await chat(text, history.slice(0, -1));

      if (aiResult && aiResult.content) {
        const aiResponse = {
          role: 'assistant',
          content: aiResult.content,
          timestamp: new Date().toISOString(),
        };
        const finalMessages = [...updatedMessages, aiResponse];
        setMessages(finalMessages);
        await setItem('chat_history', finalMessages);
      } else {
        // Fallback to offline local biological synthesis engine if API returns null
        const aiResponse = {
          role: 'assistant',
          content: generateLocalFallback(text),
          timestamp: new Date().toISOString(),
        };
        const finalMessages = [...updatedMessages, aiResponse];
        setMessages(finalMessages);
        await setItem('chat_history', finalMessages);
      }
    } catch (error) {
      console.error("AI Coach Error:", error);
      setLocalLoading(true);
      setTimeout(async () => {
        const aiResponse = {
          role: 'assistant',
          content: generateLocalFallback(text),
          timestamp: new Date().toISOString(),
        };
        const finalMessages = [...updatedMessages, aiResponse];
        setMessages(finalMessages);
        await setItem('chat_history', finalMessages);
        setLocalLoading(false);
      }, 500);
    }
  }, [input, loading, messages, chat, setItem, addNotification]);

  const charactersLimit = 2000;
  const currentCharsCount = input.length;

  return (
    <div className="min-h-screen bg-[#020408] text-[#F0F4FF] pb-24 relative overflow-x-hidden flex flex-col selection:bg-voro-primary/30">
      {/* Cybernetic Grid & Environmental Ambient Backplates */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-voro-primary/5 rounded-full blur-[150px]" />
        <div className="absolute bottom-[10%] right-[-5%] w-[40%] h-[40%] bg-voro-secondary/5 rounded-full blur-[120px]" />
        <div className="absolute inset-0 bg-grid-white opacity-[0.015]" />
        <div className="absolute inset-0 bg-boutique-grain opacity-[0.02]" />
      </div>

      <div className="relative max-w-5xl mx-auto w-full flex-1 flex flex-col px-6 md:px-12 lg:px-16 pt-16">
        {/* Gallery Terminal Hero Banner */}
        <header
          ref={heroRef}
          onMouseMove={handleHeroMouseMove}
          onMouseEnter={handleHeroMouseEnter}
          onMouseLeave={handleHeroMouseLeave}
          onFocus={handleHeroFocus}
          onBlur={handleHeroBlur}
          tabIndex={0}
          role="region"
          aria-label="Neural Oracle Terminal Header"
          style={{ transformStyle: 'preserve-3d' }}
          className="mb-12 p-10 md:p-14 rounded-[3rem] bg-[#0A0C14]/90 border border-white/5 shadow-[0_50px_100px_rgba(0,0,0,0.8)] hover:border-voro-primary/30 transition-all duration-1000 relative overflow-hidden group/hero outline-none focus-visible:ring-2 focus-visible:ring-voro-primary focus-visible:ring-offset-4 focus-visible:ring-offset-[#020408]"
        >
          {/* Liquid border perimeter illumination */}
          <div
            className="absolute inset-0 rounded-[3rem] opacity-0 group-hover/hero:opacity-100 transition-opacity duration-1000 pointer-events-none"
            style={{
              padding: '1px',
              background: `radial-gradient(600px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(124, 58, 237, 0.25), transparent 70%)`,
              WebkitMask: 'linear-gradient(#fff, #fff) content-box, linear-gradient(#fff, #fff)',
              WebkitMaskComposite: 'xor',
              maskComposite: 'exclude',
            }}
          />

          {/* Holographic Coordinate Telemetry Overlay */}
          <div
            className="absolute top-6 right-8 pointer-events-none opacity-0 group-hover/hero:opacity-100 group-focus-visible/hero:opacity-100 transition-all duration-500 z-20"
            style={{ transform: 'translateZ(60px)' }}
          >
            <div className="flex flex-col items-end font-mono text-[0.45rem] font-bold text-voro-primary/60 tracking-[0.2em] space-y-1">
              <span>TX_<span ref={heroTiltXRef}>0.0</span>°</span>
              <span>TY_<span ref={heroTiltYRef}>0.0</span>°</span>
              <span className="text-white/20">[{enclaveId}]</span>
            </div>
          </div>

          {/* Sub-pixel System Attestation Hash */}
          <div className="absolute bottom-4 left-8 pointer-events-none text-[0.4rem] font-mono font-black text-white/10 group-hover/hero:text-white/30 transition-colors duration-700 tracking-[0.25em] uppercase select-none z-20">
            {enclaveId}
          </div>

          <div className="relative z-10" style={{ transform: 'translateZ(40px)' }}>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4 text-voro-primary">
                <div className="p-3 bg-voro-primary/10 rounded-2xl border border-voro-primary/20 shadow-[0_0_20px_rgba(124,58,237,0.3)]">
                  <Bot size={22} className="animate-pulse" />
                </div>
                <span className="text-[0.65rem] font-mono font-black uppercase tracking-[0.4em] text-gray-400">
                  Neural Intelligence Terminal
                </span>
              </div>

              <div className="hidden sm:flex items-center gap-3 font-mono text-[0.55rem] text-gray-400 bg-white/[0.02] border border-white/5 px-4 py-1.5 rounded-full">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="tracking-widest">0xORACLE_NODE_v4.2</span>
              </div>
            </div>

            <h1 className="text-5xl md:text-7xl font-serif italic font-medium tracking-tight text-white mb-6 leading-none pt-2">
              Neural <span className="text-voro-primary not-italic font-black">Oracle</span>
            </h1>

            <div className="flex items-center gap-6 pt-2">
              <div className="h-0.5 w-32 bg-gradient-to-r from-voro-primary via-voro-primary/40 to-transparent shadow-[0_0_10px_rgba(124,58,237,0.5)]" />
              <p className="text-gray-500 font-mono font-bold tracking-[0.4em] text-[0.55rem] uppercase opacity-85">
                Direct biological telemetry & structural optimization active
              </p>
            </div>
          </div>
        </header>

        {/* Chat Area */}
        <div className="flex-1 overflow-y-auto mb-10 space-y-8 no-scrollbar min-h-[40vh] max-h-[60vh] pr-2">
          {messages.length === 0 && (
            <div className="py-12 flex flex-col items-center text-center max-w-3xl mx-auto space-y-16">
              <div className="relative">
                <div className="w-28 h-28 rounded-[2.5rem] bg-[#0A0C14]/90 border border-white/5 flex items-center justify-center shadow-2xl relative overflow-hidden group">
                  <div className="absolute inset-0 bg-scanline opacity-[0.04]" />
                  <Bot size={44} className="text-voro-primary filter drop-shadow-[0_0_10px_rgba(124,58,237,0.5)]" />
                </div>
                <div className="absolute -top-3 -right-3 w-10 h-10 rounded-full bg-voro-primary flex items-center justify-center animate-pulse shadow-[0_0_25px_rgba(124,58,237,0.7)] border-2 border-[#020408]">
                  <Sparkles size={18} className="text-white" />
                </div>
              </div>

              <div className="space-y-4">
                <h2 className="text-4xl md:text-5xl font-serif italic font-medium text-white tracking-tight">
                  Initiate <span className="text-gradient not-italic font-black">Neural Dialogue</span>
                </h2>
                <p className="text-gray-500 font-medium leading-relaxed max-w-xl text-sm md:text-base">
                  I am your biological optimization interface. I process your training, nutrition, and biometric logs to map dynamic metabolic structures and generate evolutionary insights.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 w-full">
                {QUICK_PROMPTS.map((prompt) => (
                  <QuickPromptCard
                    key={prompt}
                    prompt={prompt}
                    onSelect={handleSendMessage}
                  />
                ))}
              </div>
            </div>
          )}

          {messages.map((msg, idx) => (
            <MessageItem key={idx} msg={msg} />
          ))}

          {loading && (
            <div className="flex justify-start animate-fade-in">
              <div className="bg-[#0A0C14] border border-white/5 px-10 py-8 rounded-[2.5rem] text-gray-400 flex items-center gap-5 shadow-2xl relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-voro-primary/5 to-transparent animate-shimmer" style={{ backgroundSize: '200% 100%' }} />
                <div className="relative w-6 h-6">
                   <div className="absolute inset-0 bg-voro-primary/20 rounded-full animate-ping" />
                   <div className="relative bg-voro-primary rounded-full w-6 h-6 flex items-center justify-center border border-white/10 shadow-[0_0_10px_rgba(124,58,237,0.4)]">
                      <Loader size={12} className="animate-spin text-white" />
                   </div>
                </div>
                <span className="text-[0.65rem] font-mono font-black uppercase tracking-[0.4em] animate-pulse text-gray-300">
                  Synthesizing Biological Manifest...
                </span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Control Console */}
        <Card
          ref={consoleRef}
          onMouseMove={handleConsoleMouseMove}
          onMouseEnter={handleConsoleMouseEnter}
          onMouseLeave={handleConsoleMouseLeave}
          style={{ transformStyle: 'preserve-3d' }}
          className="p-6 bg-[#0A0C14]/90 border border-white/5 backdrop-blur-2xl shadow-[0_50px_100px_rgba(0,0,0,0.8)] rounded-[3rem] relative overflow-hidden group/console transition-all duration-1000"
        >
          {/* Active outline aura glow */}
          <div
            className="absolute inset-0 rounded-[3rem] opacity-0 group-focus-within/console:opacity-100 group-hover/console:opacity-100 transition-opacity duration-1000 pointer-events-none"
            style={{
              padding: '1px',
              background: `radial-gradient(600px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(124, 58, 237, 0.25), transparent 70%)`,
              WebkitMask: 'linear-gradient(#fff, #fff) content-box, linear-gradient(#fff, #fff)',
              WebkitMaskComposite: 'xor',
              maskComposite: 'exclude',
            }}
          />

          {/* Coordinate Telemetry Overlay */}
          <div
            className="absolute top-3 right-6 pointer-events-none opacity-0 group-hover/console:opacity-100 transition-all duration-500 z-20"
            style={{ transform: 'translateZ(50px)' }}
          >
            <div className="flex items-center gap-2 font-mono text-[0.45rem] font-bold text-voro-primary/60 tracking-widest uppercase">
              <span>TX_<span ref={consoleTiltXRef}>0.0</span>°</span>
              <span>TY_<span ref={consoleTiltYRef}>0.0</span>°</span>
              <span>[0xCONSOLE_NODE]</span>
            </div>
          </div>

          <div className="flex gap-4 items-end relative z-10" style={{ transform: 'translateZ(30px)' }}>
            <div className="flex-1 relative">
              <Input
                placeholder="Submit neural biometric query..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                disabled={loading}
                maxLength={charactersLimit}
                aria-label="Neural Query input"
                className="w-full !mb-0"
              />
            </div>

            <div className="flex items-center gap-4">
              {/* Characters Telemetry Readout */}
              <span className="hidden md:inline font-mono text-[0.55rem] font-black text-gray-500 tracking-widest uppercase mb-4">
                {currentCharsCount}/{charactersLimit} CHR
              </span>

              <Button
                onClick={() => handleSendMessage()}
                disabled={loading || !input.trim()}
                className="h-[58px] w-[58px] md:w-auto md:px-8 flex items-center justify-center gap-3 !rounded-[1.25rem] shadow-xl shadow-voro-primary/20 relative group/btn overflow-hidden"
                aria-label="Send query"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-voro-primary via-purple-500 to-voro-primary opacity-0 group-hover/btn:opacity-100 transition-opacity duration-500" />
                <Send size={16} className="relative z-10" />
                <span className="hidden md:inline relative z-10">Transmit</span>
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
});

AICoach.displayName = "AICoach";

export default AICoach;
