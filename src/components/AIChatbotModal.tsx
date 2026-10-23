import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, X, Sparkles, Swords, Shield, RotateCcw, MessageSquare, ChevronDown } from 'lucide-react';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

interface AIChatbotModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AIChatbotModal: React.FC<AIChatbotModalProps> = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome-1',
      role: 'assistant',
      content:
        "**Stand up, THE Vanguard!** Welcome to Card Capital! I'm your **Vanguard ZERO AI Battle Tactician**.\n\nAsk me anything about Zero's 40-card construction, Intercept defense, Sentinel activations, trigger spreads, or clan strategies!",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const quickQuestions = [
    'How does Intercept work in Zero?',
    'What trigger spread is best for Royal Paladin?',
    'How do Auto-Sentinels activate?',
    'Explain Dragonic Overlord skill',
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleSendMessage = async (textToSend?: string) => {
    const text = textToSend || inputValue.trim();
    if (!text || isLoading) return;

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, userMessage].map((m) => ({
            role: m.role,
            content: m.content,
          })),
        }),
      });

      if (!response.ok) {
        throw new Error(`Server returned ${response.status}`);
      }

      const data = await response.json();
      const botReply: ChatMessage = {
        id: `bot-${Date.now()}`,
        role: 'assistant',
        content: data.reply || "Stand up, THE Vanguard! Ready for the next turn.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, botReply]);
    } catch (err) {
      console.error('Chatbot error:', err);
      const errorMessage: ChatMessage = {
        id: `err-${Date.now()}`,
        role: 'assistant',
        content:
          "My communication circuit encountered a glitch, but here's a quick tactical reminder: Always keep Grade 2 units on your Front-Left and Front-Right circles to maintain your **Intercept Barrier** and protect your Vanguard!",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-60 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg h-[92vh] sm:h-[620px] bg-slate-900 border border-slate-700/80 rounded-t-2xl sm:rounded-2xl shadow-2xl flex flex-col overflow-hidden">
        {/* Header Bar */}
        <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-slate-950 via-indigo-950/60 to-slate-950 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center shadow-md shadow-cyan-500/20 text-white">
              <Bot className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="font-bold text-white text-sm">Capital AI Tactician</h3>
                <span className="text-[9px] font-mono font-bold text-cyan-300 bg-cyan-950/80 border border-cyan-500/40 px-1 rounded">
                  GEMINI
                </span>
              </div>
              <p className="text-[10px] text-slate-400">Cardfight!! Vanguard ZERO Guide & Strategy</p>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => {
                setMessages([
                  {
                    id: `reset-${Date.now()}`,
                    role: 'assistant',
                    content: "Tactical log cleared! How can I assist your next cardfight?",
                    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                  },
                ]);
              }}
              title="Reset Chat"
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
              title="Close Chat"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Messages List Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 font-sans text-xs">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}
            >
              <div className="flex items-center gap-1 text-[10px] text-slate-500 mb-1 px-1 font-mono">
                <span>{msg.role === 'user' ? 'You' : 'Capital AI'}</span>
                <span>·</span>
                <span>{msg.timestamp}</span>
              </div>

              <div
                className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 leading-relaxed ${
                  msg.role === 'user'
                    ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-tr-none shadow-md'
                    : 'bg-slate-950/90 text-slate-200 border border-slate-800 rounded-tl-none shadow-sm'
                }`}
              >
                <div className="space-y-1.5 whitespace-pre-wrap">
                  {msg.content.split('\n\n').map((para, i) => (
                    <p key={i}>{para}</p>
                  ))}
                </div>
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex flex-col items-start">
              <div className="flex items-center gap-1 text-[10px] text-slate-500 mb-1 px-1 font-mono">
                <span>Capital AI</span>
                <span>·</span>
                <span className="text-cyan-400 animate-pulse">Calculating strategy...</span>
              </div>
              <div className="bg-slate-950/90 border border-slate-800 rounded-2xl rounded-tl-none px-4 py-3 flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-bounce" />
                <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-bounce [animation-delay:0.2s]" />
                <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-bounce [animation-delay:0.4s]" />
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Suggested Queries */}
        <div className="px-3 py-2 bg-slate-950/60 border-t border-slate-800 flex items-center gap-1.5 overflow-x-auto text-[11px] no-scrollbar">
          <span className="text-slate-500 whitespace-nowrap text-[10px] font-mono mr-1">Ask:</span>
          {quickQuestions.map((q, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(q)}
              disabled={isLoading}
              className="px-2.5 py-1 rounded-full bg-slate-800/80 hover:bg-slate-800 text-slate-300 hover:text-cyan-300 border border-slate-700/80 transition-colors whitespace-nowrap flex-shrink-0 cursor-pointer disabled:opacity-50"
            >
              {q}
            </button>
          ))}
        </div>

        {/* Input Text Box */}
        <div className="p-3 bg-slate-950 border-t border-slate-800 flex items-end gap-2">
          <textarea
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask Capital AI about rules, deck builds, or card skills..."
            rows={1}
            disabled={isLoading}
            className="flex-1 bg-slate-900 border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 resize-none max-h-24 leading-relaxed"
          />

          <button
            onClick={() => handleSendMessage()}
            disabled={!inputValue.trim() || isLoading}
            className="p-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white transition-all shadow-md shadow-cyan-500/20 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed flex-shrink-0"
            title="Send Message"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
