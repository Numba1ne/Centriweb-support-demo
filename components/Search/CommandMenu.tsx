
import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X, FileText, ArrowRight, CornerDownLeft, Hash, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Fuse from 'fuse.js';
import { useStore } from '../../store/useStore';
import { cn } from '../../lib/utils';
import type { LibraryGuide } from '../../types/guides';
import { getCurrentAccessToken } from '../../lib/supabaseClient';

interface SearchGuide {
  id: string;
  title: string;
  summary?: string;
  areaName: string;
  areaId: string;
}

export const CommandMenu: React.FC = () => {
  const { searchOpen, setSearchOpen, agencyConfig } = useStore();
  const [query, setQuery] = useState('');
  const [groupedResults, setGroupedResults] = useState<Record<string, SearchGuide[]>>({});
  const [allGuides, setAllGuides] = useState<SearchGuide[]>([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Fetch all guides for search index
  useEffect(() => {
    async function fetchAllGuides() {
      try {
        setLoading(true);
        
        // Get auth token for API calls
        const token = getCurrentAccessToken();
        const headers: HeadersInit = {};
        if (token) {
          headers['Authorization'] = `Bearer ${token}`;
        }
        
        // Fetch categories first
        const categoriesRes = await fetch('/api/content/categories', { headers });
        if (!categoriesRes.ok) return;
        const categories = await categoriesRes.json();
        
        // Filter by enabled areas
        const enabledAreas = agencyConfig?.enabledGuideAreas;
        const filteredCategories = enabledAreas 
          ? categories.filter((cat: any) => enabledAreas.includes(cat.folder_slug))
          : categories;
        
        // Fetch guides for each category
        const guides: SearchGuide[] = [];
        for (const category of filteredCategories) {
          const guidesRes = await fetch(`/api/content/guides?folderSlug=${category.folder_slug}`, { headers });
          if (guidesRes.ok) {
            const categoryGuides: LibraryGuide[] = await guidesRes.json();
            categoryGuides.forEach(guide => {
              guides.push({
                id: guide.id,
                title: guide.title,
                summary: undefined, // content_json not included in list endpoint
                areaName: category.folder_label,
                areaId: category.folder_slug,
              });
            });
          }
        }
        
        setAllGuides(guides);
      } catch (err) {
        console.error('Error fetching guides for search:', err);
      } finally {
        setLoading(false);
      }
    }
    
    if (searchOpen) {
      fetchAllGuides();
    }
  }, [searchOpen, agencyConfig]);

  // Build search index
  const fuse = useMemo(() => {
    return new Fuse(allGuides, {
      keys: ['title', 'summary', 'areaName'],
      threshold: 0.4,
    });
  }, [allGuides]);

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
      }, {} as Record<string, SearchGuide[]>);

      setGroupedResults(groups);
    }
  }, [query, fuse]);

  const handleSelect = (item: SearchGuide) => {
    setSearchOpen(false);
    setQuery('');
    navigate(`/guides/${item.areaId}/${item.id}`);
  };

  if (!searchOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-start justify-center pt-[20vh] px-4"
        onClick={() => setSearchOpen(false)}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
          className="w-full max-w-2xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-white/10 overflow-hidden"
        >
          {/* Search Input */}
          <div className="flex items-center gap-3 p-4 border-b border-slate-200 dark:border-white/5">
            <Search className="w-5 h-5 text-slate-400" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search guides..."
              className="flex-1 bg-transparent text-slate-900 dark:text-white placeholder-slate-400 outline-none text-lg"
              autoFocus
            />
            {loading && <Loader2 className="w-4 h-4 animate-spin text-slate-400" />}
            <button
              onClick={() => setSearchOpen(false)}
              className="p-1 hover:bg-slate-100 dark:hover:bg-white/5 rounded"
            >
              <X className="w-4 h-4 text-slate-400" />
            </button>
          </div>

          {/* Results */}
          <div className="max-h-[400px] overflow-y-auto p-2">
            {query.trim() === '' ? (
              <div className="p-8 text-center text-slate-500">
                <Hash className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">Start typing to search guides...</p>
              </div>
            ) : Object.keys(groupedResults).length === 0 ? (
              <div className="p-8 text-center text-slate-500">
                <FileText className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">No results found</p>
              </div>
            ) : (
              Object.entries(groupedResults).map(([areaName, items]) => (
                <div key={areaName} className="mb-4">
                  <div className="px-3 py-2 text-xs font-bold text-slate-500 uppercase tracking-wider">
                    {areaName}
                  </div>
                  {items.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => handleSelect(item)}
                      className="w-full flex items-start gap-3 p-3 rounded-lg hover:bg-slate-100 dark:hover:bg-white/5 transition-colors text-left group"
                    >
                      <FileText className="w-4 h-4 text-slate-400 mt-0.5 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-slate-900 dark:text-white group-hover:text-centri-600 dark:group-hover:text-centri-400 transition-colors">
                          {item.title}
                        </div>
                        {item.summary && (
                          <div className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-1">
                            {item.summary}
                          </div>
                        )}
                      </div>
                      <ArrowRight className="w-4 h-4 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
                    </button>
                  ))}
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          <div className="px-4 py-2 border-t border-slate-200 dark:border-white/5 flex items-center justify-between text-xs text-slate-500">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                <CornerDownLeft className="w-3 h-3" />
                <span>Select</span>
              </div>
              <div className="flex items-center gap-1">
                <kbd className="px-1.5 py-0.5 bg-slate-100 dark:bg-slate-800 rounded">Esc</kbd>
                <span>Close</span>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
