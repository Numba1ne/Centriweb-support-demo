
import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Sparkles, ExternalLink, Mic, MicOff, AudioWaveform } from 'lucide-react';
import { Button } from '../ui/Button';
import { ChatMessage } from '../../types';
import { sendMessageToAI } from '../../services/chatService';
import { cn } from '../../lib/utils';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

export const ChatInterface: React.FC<{ className?: string }> = ({ className }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'init',
      role: 'assistant',
      content: 'Hello. I am CentriWeb AI. You can type or speak to me regarding your account configuration.',
      timestamp: Date.now()
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping, isListening]);

  const handleSend = async () => {
    if (!input.trim()) return;
    
    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: Date.now()
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    try {
      const response = await sendMessageToAI([...messages, userMsg]);
      setMessages(prev => [...prev, response]);
    } catch (error) {
      // Error handling
    } finally {
      setIsTyping(false);
    }
  };

  const toggleVoice = () => {
    if (isListening) {
      setIsListening(false);
    } else {
      setIsListening(true);
      setTimeout(() => {
        setIsListening(false);
        setInput("How do I fix my DNS settings?");
      }, 3000);
    }
  };

  const handleAction = (action: any) => {
    if (action.type === 'open_guide') {
       navigate(`/guides`); 
    } else if (action.type === 'navigate') {
       navigate(action.payload);
    }
  };

  return (
    <div className={cn("flex flex-col h-full bg-slate-50 dark:bg-dark-bg relative transition-colors duration-300", className)}>
      
      {/* Voice Overlay Mode */}
      <AnimatePresence>
        {isListening && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-20 bg-slate-900/90 dark:bg-dark-bg/90 backdrop-blur-xl flex flex-col items-center justify-center gap-8"
          >
             <div className="relative">
                <div className="absolute inset-0 bg-centri-500 blur-3xl opacity-20 animate-pulse" />
                <div className="flex gap-1 items-center h-16">
                   {[1,2,3,4,5].map(i => (
                     <motion.div 
                       key={i}
                       animate={{ height: [20, 60, 20] }}
                       transition={{ repeat: Infinity, duration: 1, ease: "easeInOut", delay: i * 0.1 }}
                       className="w-2 bg-gradient-to-t from-centri-600 to-centri-400 rounded-full"
                     />
                   ))}
                </div>
             </div>
             <p className="text-slate-200 font-light tracking-widest text-lg uppercase">Listening...</p>
             <button 
               onClick={toggleVoice}
               className="mt-8 p-4 rounded-full bg-slate-800 border border-slate-700 hover:bg-slate-700 text-white transition-all"
             >
               <MicOff size={24} />
             </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-8" ref={scrollRef}>
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={cn(
              "flex gap-4 max-w-[85%]",
              msg.role === 'user' ? "ml-auto flex-row-reverse" : ""
            )}
          >
            <div className={cn(
              "w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-1 shadow-md",
              msg.role === 'assistant' 
                ? "bg-gradient-to-br from-centri-600 to-centri-700 text-white" 
                : "bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-300 dark:border-slate-700"
            )}>
              {msg.role === 'assistant' ? <Bot size={16} /> : <User size={16} />}
            </div>
            
            <div className="flex flex-col gap-2">
              <div className={cn(
                "p-5 rounded-2xl shadow-sm leading-relaxed text-sm font-light tracking-wide transition-colors duration-300",
                msg.role === 'assistant' 
                  ? "bg-white dark:bg-dark-card border border-slate-200 dark:border-dark-border text-slate-800 dark:text-slate-200 rounded-tl-none" 
                  : "bg-slate-800 text-white rounded-tr-none border border-slate-700"
              )}>
                {msg.content}
              </div>

              {/* Suggested Actions */}
              {msg.suggestedActions && (
                <div className="flex flex-wrap gap-2 mt-1">
                  {msg.suggestedActions.map((action, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleAction(action)}
                      className="flex items-center gap-2 px-4 py-2 rounded-lg bg-centri-50 dark:bg-centri-900/20 border border-centri-200 dark:border-centri-500/20 text-centri-700 dark:text-centri-400 text-xs hover:bg-centri-100 dark:hover:bg-centri-900/40 transition-all uppercase tracking-wider font-medium"
                    >
                      <Sparkles size={12} />
                      {action.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-full bg-centri-600 text-white flex items-center justify-center flex-shrink-0">
              <Bot size={16} />
            </div>
            <div className="bg-white dark:bg-dark-card border border-slate-200 dark:border-dark-border p-4 rounded-2xl rounded-tl-none flex items-center gap-1.5 h-[58px]">
              <span className="w-1.5 h-1.5 bg-slate-400 dark:bg-slate-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
              <span className="w-1.5 h-1.5 bg-slate-400 dark:bg-slate-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
              <span className="w-1.5 h-1.5 bg-slate-400 dark:bg-slate-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="p-4 border-t border-slate-200 dark:border-white/5 bg-white/80 dark:bg-dark-bg/80 backdrop-blur-md transition-colors duration-300">
        <div className="relative flex items-center gap-2 max-w-4xl mx-auto">
          
          <button 
            onClick={toggleVoice}
            className={cn(
              "absolute left-2 top-1.5 bottom-1.5 aspect-square flex items-center justify-center rounded-lg transition-all",
              isListening 
                ? "text-centri-500 bg-centri-50 dark:bg-centri-900/20" 
                : "text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5"
            )}
          >
            {isListening ? <AudioWaveform size={20} className="animate-pulse" /> : <Mic size={20} />}
          </button>

          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Type or speak..."
            className="w-full bg-slate-100 dark:bg-slate-900/50 border border-slate-200 dark:border-white/10 rounded-xl pl-12 pr-12 py-3.5 text-slate-900 dark:text-slate-200 placeholder-slate-500 dark:placeholder-slate-600 focus:outline-none focus:border-centri-500 focus:ring-1 focus:ring-centri-500 transition-all shadow-inner font-light"
          />
          
          <Button 
            size="sm" 
            className="absolute right-2 top-1.5 bottom-1.5 aspect-square p-0 rounded-lg bg-slate-900 dark:bg-white text-white dark:text-black hover:bg-slate-700 dark:hover:bg-slate-200 shadow-none border-none"
            onClick={handleSend}
            disabled={!input.trim() || isTyping}
          >
            <Send size={16} />
          </Button>
        </div>
        <p className="text-center text-[10px] text-slate-400 dark:text-slate-600 mt-3 uppercase tracking-widest font-medium opacity-50">
          Powered by CentriWeb Neural Engine
        </p>
      </div>
    </div>
  );
};
