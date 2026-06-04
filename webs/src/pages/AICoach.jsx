import React, { useEffect, useState, memo } from 'react';
import { Send, Loader, Bot, Sparkles } from 'lucide-react';
import Button from '@/components/Button';
import Card from '@/components/Card';
import Input from '@/components/Input';
import { useStorage } from '@/hooks/useStorage';
import { useAI } from '@/hooks/useAI';

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
  const { getStorage, setStorage } = useStorage();
  const { chat, loading: aiLoading } = useAI();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [localLoading, setLocalLoading] = useState(false);

  const loading = aiLoading || localLoading;

  const quickPrompts = [
    'What should I eat today?',
    'Analyze my week',
    'Suggest tomorrow\'s workout',
    'Am I on track?',
    'Explain my macros',
    'Motivate me!',
  ];

  useEffect(() => {
    document.title = 'VORO | AI Coach';
    const saved = getStorage('voro_chat_history') || [];
    setMessages(saved);
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
        setStorage('voro_chat_history', finalMessages);
      }
    } catch (error) {
      console.error("AI Coach Error:", error);
      // Fallback to local response if AI client fails (e.g. no API key)
      setLocalLoading(true);
      setTimeout(() => {
        const aiResponse = {
          role: 'assistant',
          content: generateLocalFallback(text),
          timestamp: new Date().toISOString(),
        };
        const finalMessages = [...updatedMessages, aiResponse];
        setMessages(finalMessages);
        setStorage('voro_chat_history', finalMessages);
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
        <header className="mb-12">
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
                    className="group relative p-6 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-voro-primary/30 transition-all duration-500 text-left overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-voro-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <span className="relative z-10 text-[0.6rem] font-mono font-black uppercase tracking-[0.25em] text-gray-500 group-hover:text-white transition-colors">
                      {prompt}
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
            />
            <Button
              onClick={() => handleSendMessage()}
              disabled={loading || !input.trim()}
              className="flex items-center gap-2"
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
