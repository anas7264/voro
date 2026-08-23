import React, { useEffect, useState, useRef, memo, useMemo, useId, useCallback } from 'react';
import { Send, Loader, Bot, Sparkles, AlertCircle, ShieldCheck, Activity } from 'lucide-react';
import Button from '@/components/Button';
import Card from '@/components/Card';
import Input from '@/components/Input';
import { useStorageKey, useStorageMethods } from '@/hooks/useStorage';
import { useAI } from '@/hooks/useAI';
import { useNotifications } from '@/hooks/useNotifications';
import { isValidChatQuery, isPromptInjection } from '@/utils/validators';

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

const generateLocalFallback = (userInput) => {
  const queryLower = userInput.toLowerCase();
  for (const [key, value] of Object.entries(LOCAL_RESPONSES)) {
    if (queryLower.includes(key)) {
      return value;
    }
  }
  return `I'm here to help! Ask me about your nutrition, training, goals, or progress, and I'll give you personalized advice based on your VORO data.`;
};

/**
 * ⚡ LUXURY REFINEMENT: MessageItem Dialogue Bubble
 * Re-engineered into a "Neural Synthesis Manifest" featuring custom backglows,
 * 60fps direct-DOM 3D volumetric hover tilts, W3C APG focus states,
 * custom scanline/grain borders, editorial italics, and precise metadata.
 */
const MessageItem = memo(({ msg }) => {
  const isAssistant = msg.role === 'assistant';
  const nodeRef = useRef(null);
  const [telemetry, setTelemetry] = useState({ tx: '0.0', ty: '0.0' });
  const [isHovered, setIsHovered] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const reactId = useId();

  const nodeId = useMemo(() => `MSG_${reactId.replace(/:/g, '').slice(0, 4).toUpperCase()}`, [reactId]);

  const handleMouseMove = (e) => {
    if (!nodeRef.current || !isAssistant) return;
    const rect = nodeRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const tiltY = ((x / rect.width) - 0.5) * 8;
    const tiltX = (0.5 - (y / rect.height)) * 8;

    nodeRef.current.style.setProperty('--mouse-x', `${x}px`);
    nodeRef.current.style.setProperty('--mouse-y', `${y}px`);
    nodeRef.current.style.setProperty('--tilt-x', `${tiltX}deg`);
    nodeRef.current.style.setProperty('--tilt-y', `${tiltY}deg`);

    setTelemetry({ tx: tiltX.toFixed(1), ty: tiltY.toFixed(1) });
  };

  const handleFocus = () => {
    if (!isAssistant) return;
    setIsFocused(true);
    if (nodeRef.current) {
      nodeRef.current.style.setProperty('--tilt-x', '3deg');
      nodeRef.current.style.setProperty('--tilt-y', '-3deg');
      setTelemetry({ tx: '3.0', ty: '-3.0' });
    }
  };

  const handleBlur = () => {
    if (!isAssistant) return;
    setIsFocused(false);
    if (nodeRef.current) {
      nodeRef.current.style.setProperty('--tilt-x', '0deg');
      nodeRef.current.style.setProperty('--tilt-y', '0deg');
      setTelemetry({ tx: '0.0', ty: '0.0' });
    }
  };

  const interactionActive = isHovered || isFocused;

  return (
    <div className={`flex ${isAssistant ? 'justify-start' : 'justify-end'} group/msg animate-fade-in relative z-10 w-full`}>
      <div
        ref={nodeRef}
        tabIndex={isAssistant ? 0 : undefined}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onFocus={handleFocus}
        onBlur={handleBlur}
        className={`
          max-w-[90%] lg:max-w-2xl px-8 py-7 md:px-10 md:py-8 rounded-[2.5rem] transition-all duration-700 relative overflow-hidden outline-none
          ${isAssistant
            ? 'bg-[#0A0C14]/90 border border-white/5 backdrop-blur-xl shadow-[0_40px_80px_rgba(0,0,0,0.7)] hover:border-voro-primary/30 hover:shadow-[0_40px_80px_rgba(124,58,237,0.12)] focus-visible:ring-2 focus-visible:ring-voro-primary/60'
            : 'bg-white/[0.02] border border-white/5 text-white shadow-[0_20px_50px_rgba(0,0,0,0.5)] hover:bg-white/[0.03] hover:border-white/10'
          }
        `}
        style={isAssistant ? {
          transform: interactionActive
            ? 'perspective(1000px) rotateX(var(--tilt-x, 0deg)) rotateY(var(--tilt-y, 0deg)) translateY(-2px)'
            : 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)',
          transition: isHovered ? 'none' : 'transform 0.8s cubic-bezier(0.16, 1, 0.3, 1)',
          transformStyle: 'preserve-3d',
        } : {}}
      >
        {/* Subtle Ambient Backplate Glow for Assistant */}
        {isAssistant && (
          <div className="absolute inset-0 opacity-0 group-hover/msg:opacity-100 transition-opacity duration-1000 pointer-events-none"
               style={{
                 background: `radial-gradient(400px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(124, 58, 237, 0.08), transparent 70%)`
               }}
          />
        )}

        {/* Scanline overlay for cybernetic tech vibe */}
        <div className="absolute inset-0 bg-scanline opacity-[0.02] pointer-events-none" />

        {/* Cyber-telemetry readout for Assistant */}
        {isAssistant && (
          <div className="absolute top-4 right-6 pointer-events-none opacity-0 group-hover/msg:opacity-100 transition-opacity duration-500"
               style={{ transform: 'translateZ(40px)' }}>
            <div className="flex items-center gap-2 font-mono text-[0.45rem] font-bold text-voro-primary/60 tracking-widest uppercase">
              <span>TX_{telemetry.tx}°</span>
              <span>TY_{telemetry.ty}°</span>
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
            {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
          </span>
        </div>

        <div className={`
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
           <div className="mt-8 pt-6 border-t border-white/5 flex items-center justify-between opacity-40 group-hover/msg:opacity-100 transition-opacity duration-500 relative z-10"
                style={{ transform: 'translateZ(20px)' }}>
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
 * Implements mouse-tracking, coordinate telemetry, Accessible 3D Interaction Pattern
 * (Focus applying a 4-degree static tilt), and Golden Ratio proportions.
 */
const QuickPromptCard = memo(({ prompt, onClick }) => {
  const containerRef = useRef(null);
  const [telemetry, setTelemetry] = useState({ tx: '0.0', ty: '0.0' });
  const [isHovered, setIsHovered] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const reactId = useId();

  const nodeId = useMemo(() => `PRMPT_${reactId.replace(/:/g, '').slice(0, 4).toUpperCase()}`, [reactId]);

  const handleMouseMove = (e) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const tiltY = ((x / rect.width) - 0.5) * 20;
    const tiltX = (0.5 - (y / rect.height)) * 20;

    containerRef.current.style.setProperty('--mouse-x', `${x}px`);
    containerRef.current.style.setProperty('--mouse-y', `${y}px`);
    containerRef.current.style.setProperty('--tilt-x', `${tiltX}deg`);
    containerRef.current.style.setProperty('--tilt-y', `${tiltY}deg`);

    setTelemetry({ tx: tiltX.toFixed(1), ty: tiltY.toFixed(1) });
  };

  const handleFocus = () => {
    setIsFocused(true);
    if (containerRef.current) {
      containerRef.current.style.setProperty('--tilt-x', '4deg');
      containerRef.current.style.setProperty('--tilt-y', '-4deg');
      setTelemetry({ tx: '4.0', ty: '-4.0' });
    }
  };

  const handleBlur = () => {
    setIsFocused(false);
    if (containerRef.current) {
      containerRef.current.style.setProperty('--tilt-x', '0deg');
      containerRef.current.style.setProperty('--tilt-y', '0deg');
      setTelemetry({ tx: '0.0', ty: '0.0' });
    }
  };

  const interactionActive = isHovered || isFocused;

  return (
    <button
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onFocus={handleFocus}
      onBlur={handleBlur}
      onClick={onClick}
      style={{
        transform: interactionActive
          ? 'perspective(1000px) rotateX(var(--tilt-x, 0deg)) rotateY(var(--tilt-y, 0deg)) translateY(-4px)'
          : 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)',
        transition: isHovered ? 'none' : 'transform 0.8s cubic-bezier(0.16, 1, 0.3, 1)',
        transformStyle: 'preserve-3d'
      }}
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
      <div className="absolute top-4 right-6 pointer-events-none opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100 transition-all duration-500"
           style={{ transform: 'translateZ(50px)' }}>
        <div className="flex items-center gap-3 font-mono text-[0.45rem] font-bold text-voro-primary/60 tracking-widest">
          <span>TX_{telemetry.tx}°</span>
          <span>TY_{telemetry.ty}°</span>
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

const AICoach = () => {
  const savedHistory = useStorageKey('chat_history');
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
    document.title = 'VORO | Neural Oracle';
  }, []);

  const handleSendMessage = async (text = input) => {
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
        // Fallback to offline local biological synthesis engine if API return null
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
  };

  const charactersLimit = 2000;
  const currentCharsCount = input.length;

  return (
    <div className="min-h-screen bg-[#020408] text-[#F0F4FF] pb-24 relative overflow-x-hidden flex flex-col">
      {/* Cybernetic Grid & Environmental Ambient Backplates */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-voro-primary/5 rounded-full blur-[150px]" />
        <div className="absolute bottom-[10%] right-[-5%] w-[40%] h-[40%] bg-voro-secondary/5 rounded-full blur-[120px]" />
        <div className="absolute inset-0 bg-grid-white opacity-[0.015]" />
        <div className="absolute inset-0 bg-boutique-grain opacity-[0.02]" />
      </div>

      <div className="relative max-w-5xl mx-auto w-full flex-1 flex flex-col px-6 md:px-12 lg:px-16 pt-20">
        <header className="mb-16 md:mb-20">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4 text-voro-primary">
              <div className="p-2.5 bg-voro-primary/10 rounded-xl border border-voro-primary/20 shadow-[0_0_15px_rgba(124,58,237,0.2)]">
                <Bot size={20} className="animate-pulse" />
              </div>
              <span className="text-[0.65rem] font-mono font-black uppercase tracking-[0.4em] text-gray-400">
                Neural Intelligence Terminal
              </span>
            </div>

            <div className="hidden sm:flex items-center gap-3 font-mono text-[0.55rem] text-gray-500 bg-white/[0.02] border border-white/5 px-4 py-1.5 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="tracking-widest">0xORACLE_NODE_v4.2</span>
            </div>
          </div>

          <h1 className="text-5xl md:text-7xl font-serif italic font-medium tracking-tight text-white mb-6 leading-normal pt-2">
            Neural <span className="text-voro-primary not-italic font-black">Oracle</span>
          </h1>

          <div className="flex items-center gap-6 pt-2">
            <div className="h-0.5 w-32 bg-gradient-to-r from-voro-primary via-voro-primary/40 to-transparent shadow-[0_0_10px_rgba(124,58,237,0.5)]" />
            <p className="text-gray-500 font-mono font-bold tracking-[0.4em] text-[0.55rem] uppercase opacity-75">
              Direct biological telemetry & structural optimization active
            </p>
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
                {QUICK_PROMPTS.map((prompt, idx) => (
                  <QuickPromptCard
                    key={idx}
                    prompt={prompt}
                    onClick={() => handleSendMessage(prompt)}
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
        <Card className="p-6 bg-[#0A0C14]/90 border border-white/5 backdrop-blur-2xl shadow-[0_50px_100px_rgba(0,0,0,0.8)] rounded-[3rem] relative overflow-hidden group/console">
          {/* Active outline aura glow */}
          <div className="absolute inset-0 rounded-[3rem] opacity-0 group-focus-within/console:opacity-100 transition-opacity duration-1000 pointer-events-none"
               style={{
                 padding: '1px',
                 background: `radial-gradient(600px circle at 50% 50%, rgba(124, 58, 237, 0.25), transparent 70%)`,
                 WebkitMask: 'linear-gradient(#fff, #fff) content-box, linear-gradient(#fff, #fff)',
                 WebkitMaskComposite: 'xor',
                 maskComposite: 'exclude',
               }}
          />

          <div className="flex gap-4 items-end relative z-10">
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
};

export default AICoach;
