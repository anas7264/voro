import React, { useEffect, useState } from 'react';
import { Send, Loader } from 'lucide-react';
import Button from '@/components/Button';
import Card from '@/components/Card';
import Input from '@/components/Input';
import { useStorage } from '@/hooks/useStorage';
import { useApp } from '@/hooks/useAppContext';

const AICoach = () => {
  const { getStorage, setStorage } = useStorage();
  const { user } = useApp();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

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
    if (!text.trim()) return;

    const userMessage = { role: 'user', content: text, timestamp: new Date().toISOString() };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInput('');
    setLoading(true);

    // Simulate AI response
    setTimeout(() => {
      const aiResponse = {
        role: 'assistant',
        content: generateAIResponse(text),
        timestamp: new Date().toISOString(),
      };
      const finalMessages = [...updatedMessages, aiResponse];
      setMessages(finalMessages);
      setStorage('voro_chat_history', finalMessages);
      setLoading(false);
    }, 1000);
  };

  const generateAIResponse = (userInput) => {
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
    <div className="min-h-screen bg-voro-surface p-4 md:p-8 flex flex-col">
      <div className="max-w-4xl mx-auto w-full flex flex-col h-screen">
        <h1 className="text-3xl font-bold text-white mb-6">AI Coach</h1>

        {/* Chat Area */}
        <div className="flex-1 overflow-y-auto mb-6 space-y-4">
          {messages.length === 0 && (
            <Card className="p-8 text-center">
              <div className="text-5xl mb-4">🤖</div>
              <h2 className="text-2xl font-bold text-white mb-2">Welcome to VORO AI Coach</h2>
              <p className="text-gray-400 mb-6">I'm your personal AI fitness and nutrition coach. Ask me anything about your goals, progress, and training.</p>
              
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {quickPrompts.map((prompt, idx) => (
                  <Button
                    key={idx}
                    variant="secondary"
                    size="sm"
                    onClick={() => handleSendMessage(prompt)}
                    className="text-xs text-left"
                  >
                    {prompt}
                  </Button>
                ))}
              </div>
            </Card>
          )}

          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-xs lg:max-w-md px-4 py-3 rounded-lg ${
                  msg.role === 'user'
                    ? 'bg-voro-primary text-white'
                    : 'bg-voro-card border border-voro-border text-gray-200'
                }`}
              >
                {msg.content}
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex justify-start">
              <div className="bg-voro-card border border-voro-border px-4 py-3 rounded-lg text-gray-400 flex items-center gap-2">
                <Loader size={16} className="animate-spin" />
                Thinking...
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
