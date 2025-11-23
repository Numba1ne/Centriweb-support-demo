
import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X, FileText, ArrowRight, CornerDownLeft, Hash } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Fuse from 'fuse.js';
import { useStore } from '../../store/useStore';
import { GUIDE_DATA } from '../../data/guides';
import { cn } from '../../lib/utils';

export const CommandMenu: React.FC = () => {
  const { searchOpen, setSearchOpen, agencyConfig } = useStore();
  const [query, setQuery] = useState('');
  const [groupedResults, setGroupedResults] = useState<Record<string, any[]>>({});
  const navigate = useNavigate();

  // Dynamically build index based on enabled areas
  const fuse = useMemo(() => {
    const enabledAreas = agencyConfig?.enabledGuideAreas || [];
    
    // Filter data first
    const searchIndex = GUIDE_DATA
      .filter(area => enabledAreas.includes(area.id))
      .flatMap((area) =>
        area.guides.map((guide) => ({
          ...guide,
          areaName: area.title,
          areaId: area.id,
        }))
      );

    return new Fuse(searchIndex, {
      keys: ['title', 'summary', 'tags', 'areaName'],
      threshold: 0.4,
    });
  }, [agencyConfig]);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setSearchOpen(true);
      }
      if (e.key === 'Escape') {
        setSearchOpen(false);
      }
    };
    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, [setSearchOpen]);

  useEffect(() => {
    if (query.trim() === '') {
      setGroupedResults({});
    } else {
      const results = fuse.search(query).map((r) => r.item).slice(0, 8);
      
      // Smart Grouping: Group results by Area Name
      const groups = results.reduce((acc, item) => {
        if (!acc[item.areaName]) {
          acc[item.areaName] = [];
        }
        acc[item.areaName].push(item);
        return acc;
      }, {} as Record<string, any[]>);

      setGroupedResults(groups);
    }
  }, [query, fuse]);

  const handleSelect = (item: any) => {
    setSearchOpen(false);
    setQuery('');
    navigate(`/guides/${item.areaId}/${item.id}`);
  };

  if (!searchOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-start justify-center pt-[10vh] px-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setSearchOpen(false)}
          className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm"
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.98, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.98, y: 10 }}
          className="relative w-full max-w-2xl bg-white dark:bg-dark-card border border-slate-200 dark:border-dark-border rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[70vh]"
        >
          {/* Header Input */}
          <div className="flex items-center px-4 py-4 border-b border-slate-100 dark:border-white/5 shrink-0">
            <Search className="w-5 h-5 text-slate-400" />
            <input
              autoFocus
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search guides, tutorials, and help..."
              className="w-full px-4 bg-transparent text-lg text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none font-light"
            />
            <button onClick={() => setSearchOpen(false)} className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded text-slate-400 transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>
          
          {/* Results Area */}
          <div className="overflow-y-auto p-2 scrollbar-hide">
            {query === '' && (
              <div className="py-12 text-center">
                <div className="w-12 h-12 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
                   <Search className="w-6 h-6 text-slate-400" />
                </div>
                <p className="text-slate-500 dark:text-slate-400 text-sm">Type to search the knowledge base...</p>
                <div className="flex justify-center gap-2 mt-4">
                   <span className="px-2 py-1 rounded bg-slate-100 dark:bg-slate-800 text-[10px] text-slate-500 font-mono">CRM</span>
                   <span className="px-2 py-1 rounded bg-slate-100 dark:bg-slate-800 text-[10px] text-slate-500 font-mono">Email</span>
                   <span className="px-2 py-1 rounded bg-slate-100 dark:bg-slate-800 text-[10px] text-slate-500 font-mono">Setup</span>
                </div>
              </div>
            )}
            
            {query !== '' && Object.keys(groupedResults).length === 0 && (
              <div className="py-12 text-center text-slate-500">
                <p className="text-sm">No results found for "{query}"</p>
              </div>
            )}

            <div className="space-y-4 pb-2">
              {Object.entries(groupedResults).map(([areaName, items]) => (
                <div key={areaName}>
                  <div className="px-3 py-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest sticky top-0 bg-white/95 dark:bg-dark-card/95 backdrop-blur-sm z-10">
                    {areaName}
                  </div>
                  <div className="space-y-1">
                    {items.map((item: any) => (
                      <button
                        key={item.id}
                        onClick={() => handleSelect(item)}
                        className="w-full flex items-center gap-4 p-3 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800/50 group transition-all text-left border border-transparent hover:border-slate-200 dark:hover:border-white/5"
                      >
                        <div className="flex-shrink-0 p-2 bg-slate-100 dark:bg-slate-800 rounded-md text-slate-500 dark:text-slate-400 group-hover:bg-centri-50 dark:group-hover:bg-centri-900/30 group-hover:text-centri-600 dark:group-hover:text-centri-400 transition-colors">
                          <FileText className="w-4 h-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-medium text-slate-700 dark:text-slate-200 group-hover:text-centri-600 dark:group-hover:text-centri-400 truncate">
                            {item.title}
                          </h4>
                          <div className="flex items-center gap-2 mt-0.5">
                            {item.tags.slice(0, 3).map((tag: string) => (
                               <span key={tag} className="text-[10px] text-slate-400 flex items-center gap-1">
                                  <Hash className="w-2.5 h-2.5 opacity-50" /> {tag}
                               </span>
                            ))}
                          </div>
                        </div>
                        <CornerDownLeft className="w-4 h-4 text-slate-300 dark:text-slate-600 group-hover:text-centri-500 opacity-0 group-hover:opacity-100 transition-all transform translate-x-2 group-hover:translate-x-0" />
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Footer */}
          <div className="bg-slate-50 dark:bg-slate-900/50 px-4 py-3 border-t border-slate-100 dark:border-white/5 flex justify-between items-center text-[10px] text-slate-400 uppercase tracking-wider font-medium shrink-0">
             <span>CentriWeb Intelligence</span>
             <div className="flex items-center gap-4">
                <span className="flex items-center gap-1.5"><kbd className="font-sans bg-white dark:bg-slate-800 px-1.5 py-0.5 rounded border border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-300">↵</kbd> Select</span>
                <span className="flex items-center gap-1.5"><kbd className="font-sans bg-white dark:bg-slate-800 px-1.5 py-0.5 rounded border border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-300">Esc</kbd> Close</span>
             </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
