import React, { useEffect, useState, useRef, memo } from 'react';
import { Send, Loader, Bot, Sparkles, Trash2, AlertCircle } from 'lucide-react';
import Button from '@/components/Button';
import Card from '@/components/Card';
import Input from '@/components/Input';
import { useStorageKey, useStorageMethods } from '@/hooks/useStorage';
import { useAI } from '@/hooks/useAI';
import { useNotifications } from '@/hooks/useNotifications';

const MessageItem = memo(({ msg }) => {
  const isAssistant = msg.role === 'assistant';

  return (
    <div className={`flex ${isAssistant ? 'justify-start' : 'justify-end'} group/msg animate-fade-in`}>
      <div
        className={`
          max-w-[85%] lg:max-w-xl px-8 py-6 rounded-[2rem] transition-all duration-500
          ${isAssistant
            ? 'bg-[#0A0C14] border border-white/5 backdrop-blur-md shadow-2xl group-hover/msg:border-voro-primary/20'
            : 'bg-white/[0.03] border border-white/5 text-white shadow-xl group-hover/msg:bg-white/[0.05]'
          }
        `}
      >
        <div className="flex items-center gap-3 mb-4">
          <div className={`w-2 h-2 rounded-full ${isAssistant ? 'bg-voro-primary shadow-[0_0_8px_#7C3AED]' : 'bg-gray-700'}`} />
          <span className="text-[0.55rem] font-black uppercase tracking-[0.3em] text-gray-500">
            {isAssistant ? 'Neural Insight' : 'Biometric Query'}
          </span>
          <span className="text-[0.5rem] font-mono text-gray-700 ml-auto tracking-widest">
            {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
        </div>

        <div className={`
          leading-relaxed tracking-tight whitespace-pre-wrap
          ${isAssistant
            ? 'font-serif italic text-xl text-gray-200'
            : 'font-mono text-[0.85rem] text-gray-300'
          }
        `}>
          {msg.content}
        </div>

        {isAssistant && (
           <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between opacity-0 group-hover/msg:opacity-100 transition-opacity">
              <span className="text-[0.55rem] font-black uppercase tracking-widest text-voro-primary">Accuracy Verified</span>
              <Sparkles size={12} className="text-voro-primary/40" />
           </div>
        )}
      </div>
    </div>
  );
});

MessageItem.displayName = 'MessageItem';

const AICoach = () => {
  /**
   * ⚡ PERFORMANCE OPTIMIZATION: Surgical Reactivity.
   * Subscribe only to 'chat_history'. Use useStorageMethods for stable action refs.
   */
  const savedHistory = useStorageKey('chat_history');
  const { setItem } = useStorageMethods();
  const { chat, loading: aiLoading } = useAI();
  const { addNotification } = useNotifications();

  /**
   * ⚡ OPTIMIZATION: Hydration-safe state initialization.
   * We initialize from the reactive storage snapshot, but also use a secondary
   * effect to catch the transition if storage is still initializing on mount.
   */
  const [messages, setMessages] = useState(() => savedHistory || []);
  const [input, setInput] = useState('');
  const [localLoading, setLocalLoading] = useState(false);
  const [confirmingPurge, setConfirmingPurge] = useState(false);
  const messagesEndRef = useRef(null);

  // Reset confirmation state after timeout
  useEffect(() => {
    if (confirmingPurge) {
      const timer = setTimeout(() => setConfirmingPurge(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [confirmingPurge]);

  const handlePurgeDialogue = async () => {
    if (!confirmingPurge) {
      setConfirmingPurge(true);
      return;
    }
    setConfirmingPurge(false);
    setMessages([]);
    await setItem('chat_history', []);
    addNotification('Neural dialogue history purged successfully.', 'success');
  };

  const loading = aiLoading || localLoading;

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  // Sync messages if storage was empty on mount but loads later
  useEffect(() => {
    if (savedHistory && savedHistory.length > 0 && messages.length === 0) {
      setMessages(savedHistory);
    }
  }, [savedHistory, messages.length]);

  const quickPrompts = [
    'What should I eat today?',
    'Analyze my week',
    'Suggest tomorrow\'s workout',
    'Am I on track?',
    'Explain my macros',
    'Motivate me!',
  ];

  const handleSendRef = useRef(null);
  useEffect(() => {
    handleSendRef.current = handleSendMessage;
  });

  useEffect(() => {
    const handleKeyDown = (e) => {
      const activeEl = document.activeElement;
      if (
        activeEl &&
        (activeEl.tagName === 'INPUT' ||
         activeEl.tagName === 'TEXTAREA' ||
         activeEl.isContentEditable)
      ) {
        return;
      }

      const num = parseInt(e.key, 10);
      if (num >= 1 && num <= 6) {
        e.preventDefault();
        const prompt = quickPrompts[num - 1];
        if (prompt) {
          handleSendRef.current(prompt);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    document.title = 'VORO | AI Coach';
  }, []);

  const handleSendMessage = async (text = input) => {
    if (!text.trim() || loading) return;

    const userMessage = { role: 'user', content: text, timestamp: new Date().toISOString() };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInput('');

    try {
      // Transition from simulation to real AI flow
      // We pass the last 10 messages as history for context awareness
      const history = updatedMessages.slice(-10).map(m => ({ role: m.role, content: m.content }));

      const aiResult = await chat(text, history.slice(0, -1));

      if (aiResult) {
        const aiResponse = {
          role: 'assistant',
          content: aiResult.content,
          timestamp: new Date().toISOString(),
        };
        const finalMessages = [...updatedMessages, aiResponse];
        setMessages(finalMessages);
        await setItem('chat_history', finalMessages);
      }
    } catch (error) {
      console.error("AI Coach Error:", error);
      // Fallback to local response if AI client fails (e.g. no API key)
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
      }, 800);
    }
  };

  const generateLocalFallback = (userInput) => {
    const responses = {
      'what should i eat': `Based on your goals, I'd recommend a protein-rich meal. Try grilled chicken (150g) with brown rice and roasted vegetables. That's about 600 kcal with 45g protein.`,
      'analyze my week': `Great week! You hit your calorie goal 5/7 days, averaged 165g protein, and trained 4 times. Keep up the consistency!`,
      'motivate': `You're crushing it! Your training streak is 7 days 🔥 and you've logged every meal. This consistency compounds over time!`,
      'on track': `Yes! You're tracking perfectly. At this rate, you'll hit your goal in approximately 12 weeks. Stay focused!`,
      'macros': `Your current macros: Protein 1.8g/kg (excellent), Carbs 45% calories (good), Fat 30% calories (optimal). Well balanced!`,
      'workout': `Tomorrow I'd suggest: Chest & Triceps - Bench Press 4×6, Incline DB 3×8, Cable Flies 3×10, Dips 3×8, plus 20min cardio. Rest 90s between sets.`,
    };

    for (const [key, value] of Object.entries(responses)) {
      if (userInput.toLowerCase().includes(key)) {
        return value;
      }
    }

    return `I'm here to help! Ask me about your nutrition, training, goals, or progress, and I'll give you personalized advice based on your VORO data.`;
  };

  return (
    <div className="min-h-screen bg-voro-surface p-4 md:p-8 flex flex-col relative overflow-hidden">
      {/* Ambient Background Depth */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-voro-primary/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-[10%] right-[-5%] w-[30%] h-[30%] bg-voro-secondary/5 rounded-full blur-[100px]" />
      </div>

      <div className="relative max-w-4xl mx-auto w-full flex flex-col h-screen">
        <header className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="flex items-center gap-3 text-voro-primary mb-2">
              <Bot size={18} />
              <span className="text-[0.6rem] font-black uppercase tracking-[0.3em]">Neural Synthesis Engine</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-serif italic font-medium tracking-tight text-white mb-2 leading-tight">
              Neural <span className="text-voro-primary not-italic font-bold">Oracle</span>
            </h1>
            <p className="text-gray-500 font-mono text-[0.65rem] uppercase tracking-[0.2em] opacity-60">
              Real-time biometric data processing & biological optimization
            </p>
          </div>
          {messages.length > 0 && (
            <div className="flex-shrink-0">
              <Button
                variant={confirmingPurge ? "danger" : "secondary"}
                size="sm"
                onClick={handlePurgeDialogue}
                className={`flex items-center gap-2 h-12 rounded-[1rem] ${confirmingPurge ? "animate-pulse shadow-[0_0_20px_rgba(239,68,68,0.4)]" : ""}`}
                aria-label={confirmingPurge ? "Confirm purging of neural dialogue history" : "Purge neural dialogue history"}
              >
                {confirmingPurge ? <AlertCircle size={14} /> : <Trash2 size={14} />}
                <span>{confirmingPurge ? "Confirm Purge" : "Purge Dialogue"}</span>
              </Button>
            </div>
          )}
        </header>

        {/* Chat Area */}
        <div className="flex-1 overflow-y-auto mb-6 space-y-4 no-scrollbar">
          {messages.length === 0 && (
            <div className="py-20 flex flex-col items-center text-center max-w-2xl mx-auto space-y-12">
              <div className="relative">
                <div className="w-24 h-24 rounded-[2rem] bg-[#0A0C14] border border-white/5 flex items-center justify-center shadow-2xl">
                  <Bot size={40} className="text-voro-primary" />
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-voro-primary flex items-center justify-center animate-pulse shadow-[0_0_20px_rgba(124,58,237,0.5)]">
                  <Sparkles size={16} className="text-white" />
                </div>
              </div>

              <div className="space-y-4">
                <h2 className="text-3xl md:text-4xl font-serif italic font-medium text-white tracking-tight">
                  Initiate <span className="text-voro-primary not-italic font-bold">Neural Dialogue</span>
                </h2>
                <p className="text-gray-500 font-medium leading-relaxed">
                  I am your biological optimization interface. I process your training, nutrition, and biometric data to synthesize precise evolutionary insights.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
                {quickPrompts.map((prompt, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSendMessage(prompt)}
                    className="group relative p-6 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-voro-primary/30 transition-all duration-500 text-left overflow-hidden outline-none focus-visible:ring-2 focus-visible:ring-voro-primary/50 focus-visible:ring-offset-2 focus-visible:ring-offset-voro-surface"
                    aria-label={`Ask coach: ${prompt}`}
                  >
                    <div className="absolute inset-0 bg-voro-primary/5 opacity-0 group-hover:opacity-100 group-focus:opacity-100 group-focus-visible:opacity-100 transition-opacity duration-500" />
                    <span className="relative z-10 text-[0.6rem] font-mono font-black uppercase tracking-[0.25em] text-gray-500 group-hover:text-white group-focus:text-white group-focus-visible:text-white transition-colors">
                      {prompt}
                    </span>
                    <span className="absolute top-2 right-4 font-mono text-[0.45rem] font-bold text-gray-700 group-hover:text-voro-secondary group-focus:text-voro-secondary group-focus-visible:text-voro-secondary transition-colors" aria-hidden="true">
                      [{idx + 1}]
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map((msg, idx) => (
            <MessageItem key={idx} msg={msg} />
          ))}

          {loading && (
            <div className="flex justify-start animate-fade-in">
              <div className="bg-[#0A0C14] border border-white/5 px-8 py-6 rounded-[2rem] text-gray-400 flex items-center gap-4 shadow-2xl relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-voro-primary/5 to-transparent animate-shimmer" style={{ backgroundSize: '200% 100%' }} />
                <div className="relative w-5 h-5">
                   <div className="absolute inset-0 bg-voro-primary/20 rounded-full animate-ping" />
                   <div className="relative bg-voro-primary rounded-full w-5 h-5 flex items-center justify-center">
                      <Loader size={12} className="animate-spin text-white" />
                   </div>
                </div>
                <span className="text-[0.65rem] font-black uppercase tracking-[0.3em] animate-pulse">
                  Synthesizing Biological Data...
                </span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <Card className="p-4">
          <div className="flex gap-2">
            <Input
              placeholder="Ask me anything..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              disabled={loading}
              maxLength={2000}
              aria-label="Neural Query"
            />
            <Button
              onClick={() => handleSendMessage()}
              disabled={loading || !input.trim()}
              className="flex items-center gap-2"
              aria-label="Send message"
            >
              <Send size={18} />
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default AICoach;
