
import React from 'react';
import { Search, HelpCircle, ArrowRight } from 'lucide-react';
import { useStore } from '../../store/useStore';
import { cn } from '../../lib/utils';

export const ContextSelector: React.FC = () => {
  const { setSearchOpen, agencyConfig } = useStore();

  const handleSelect = (tag: string) => {
    setSearchOpen(true); 
  };

  const topics = agencyConfig?.helpTopics || [];

  return (
    <div>
       <div className="flex items-center gap-2 mb-6">
          <div className="p-1.5 bg-centri-500/10 rounded-lg">
            <HelpCircle className="w-5 h-5 text-centri-400" />
          </div>
          <h3 className="text-lg font-semibold text-white tracking-tight">I'm trying to...</h3>
       </div>
       
       <div className="flex flex-wrap gap-3">
          {topics.map((opt) => (
             <button
                key={opt.id}
                onClick={() => handleSelect(opt.tags[0])}
                className="group relative px-5 py-3 rounded-xl bg-slate-800/50 dark:bg-slate-800/50 border border-slate-700 hover:border-centri-500/50 text-slate-300 hover:text-white transition-all duration-300 shadow-sm hover:shadow-[0_0_20px_rgba(var(--primary-500),0.15)] active:scale-95 text-left flex items-center gap-3 overflow-hidden"
             >
                <div className="absolute inset-0 bg-centri-600/0 group-hover:bg-centri-600/10 transition-colors duration-300" />
                <span className="relative z-10 text-sm font-medium">{opt.label}</span>
                <ArrowRight className="w-3.5 h-3.5 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 text-centri-400" />
             </button>
          ))}
          
          <button 
            onClick={() => setSearchOpen(true)}
            className="px-5 py-3 rounded-xl border border-dashed border-slate-700 text-slate-500 text-sm hover:text-slate-300 hover:border-slate-500 transition-colors flex items-center gap-2 hover:bg-white/5"
          >
            <Search className="w-3.5 h-3.5" /> 
            <span>Something else</span>
          </button>
       </div>
    </div>
  );
};
