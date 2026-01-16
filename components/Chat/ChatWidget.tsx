
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, X, ChevronDown, Sparkles } from 'lucide-react';
import { ChatInterface } from './ChatInterface';
import { cn } from '../../lib/utils';
import { useStore } from '../../store/useStore';

export const ChatWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { agencyConfig } = useStore();

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="mb-4 w-[90vw] md:w-[400px] h-[600px] max-h-[80vh] bg-white dark:bg-dark-card border border-slate-200 dark:border-dark-border rounded-2xl shadow-2xl overflow-hidden flex flex-col"
          >
            {/* Widget Header */}
            <div className="flex items-center justify-between p-4 border-b border-slate-100 dark:border-white/5 bg-slate-50/80 dark:bg-slate-900/50 backdrop-blur-sm">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="font-semibold text-slate-900 dark:text-white text-sm">
                  {agencyConfig?.name || 'CentriWeb'} AI
                </span>
                <span className="px-1.5 py-0.5 rounded bg-centri-100 dark:bg-centri-900/30 text-centri-700 dark:text-centri-400 text-[10px] font-bold uppercase tracking-wider">
                  Beta
                </span>
              </div>
              <div className="flex items-center gap-1">
                 <button 
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 rounded-lg hover:bg-slate-200 dark:hover:bg-white/10 text-slate-500 dark:text-slate-400 transition-colors"
                 >
                   <ChevronDown className="w-4 h-4" />
                 </button>
              </div>
            </div>
            
            {/* Chat Content */}
            <div className="flex-1 overflow-hidden relative">
               <ChatInterface className="h-full bg-white dark:bg-dark-bg" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className={cn(
          "group flex items-center gap-2 px-4 py-4 rounded-full shadow-[0_8px_30px_rgba(0,0,0,0.12)] dark:shadow-[0_0_30px_rgba(var(--primary-500),0.3)] transition-all duration-300",
          isOpen 
            ? "bg-slate-200 dark:bg-slate-800 text-slate-900 dark:text-white pr-4" 
            : "bg-centri-600 text-white pr-6"
        )}
      >
        <div className="relative">
           {isOpen ? (
             <X className="w-6 h-6" />
           ) : (
             <MessageSquare className="w-6 h-6 fill-current" />
           )}
           {!isOpen && (
             <span className="absolute -top-1 -right-1 flex h-3 w-3">
               <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
               <span className="relative inline-flex rounded-full h-3 w-3 bg-white"></span>
             </span>
           )}
        </div>
        
        {!isOpen && (
           <span className="font-semibold text-sm">Ask AI</span>
        )}
      </motion.button>
    </div>
  );
};
