
import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { Guide } from '../../types';
import { Clock, ThumbsUp, ThumbsDown, PlayCircle, Maximize2, Minimize2, CheckCircle } from 'lucide-react';
import { Button } from '../ui/Button';
import { SpotlightCard } from '../ui/SpotlightCard';
import { TableOfContents } from './TableOfContents';
import { GuideNavigation } from './GuideNavigation';
import { cn } from '../../lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '../../store/useStore';
import { useParams } from 'react-router-dom';

export const GuideViewer: React.FC<{ guide: Guide }> = ({ guide }) => {
  const [feedback, setFeedback] = useState<'yes' | 'no' | null>(null);
  const [zenMode, setZenMode] = useState(false);
  const { markGuideAsViewed } = useStore();
  const { areaId } = useParams();

  // Track view on mount
  useEffect(() => {
    markGuideAsViewed(guide.id);
  }, [guide.id, markGuideAsViewed]);

  const handleFeedback = (val: 'yes' | 'no') => {
    setFeedback(val);
    // In production, send this to backend/n8n
    console.log(`Feedback for guide ${guide.id}: ${val}`);
  };

  return (
    <div className={cn(
        "relative transition-all duration-700",
        zenMode ? "z-50" : ""
    )}>
      
      {/* Zen Mode Backdrop */}
      <AnimatePresence>
        {zenMode && (
            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-white/95 dark:bg-dark-bg/95 backdrop-blur-xl z-[-1]" 
            />
        )}
      </AnimatePresence>

      <div className="flex flex-col xl:flex-row gap-12">
        {/* Main Content Column */}
        <div className={cn(
            "flex-1 min-w-0 transition-all duration-500",
            zenMode ? "max-w-3xl mx-auto xl:max-w-4xl" : ""
        )}>
          <div className="animate-fade-in">
            {/* Header Actions */}
            <div className="flex justify-between items-start mb-8">
                <div className="flex items-center gap-3">
                    {guide.tags && guide.tags.length > 0 ? (
                        guide.tags.map(tag => (
                            <span key={tag} className="px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-white/10 text-slate-500 dark:text-slate-400 text-[10px] font-bold uppercase tracking-widest shadow-sm">
                            {tag}
                            </span>
                        ))
                    ) : (
                        <span className="px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-white/10 text-slate-500 dark:text-slate-400 text-[10px] font-bold uppercase tracking-widest shadow-sm">
                        {guide.folder_label}
                        </span>
                    )}
                </div>
                <button
                    onClick={() => setZenMode(!zenMode)}
                    className="text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors p-2 rounded-full hover:bg-slate-100 dark:hover:bg-white/5"
                    title={zenMode ? "Exit Zen Mode" : "Enter Zen Mode"}
                >
                    {zenMode ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
                </button>
            </div>

            <h1 className="text-4xl md:text-6xl font-bold text-slate-900 dark:text-white mb-6 tracking-tighter leading-[0.9]">{guide.title}</h1>
            <p className="text-xl text-slate-500 dark:text-slate-400 leading-relaxed font-light tracking-wide max-w-3xl">{guide.summary}</p>
            
            <div className="flex items-center gap-6 mt-8 text-xs font-mono text-slate-400 dark:text-slate-500 border-b border-slate-200 dark:border-white/5 pb-8 uppercase tracking-widest">
              {guide.timeToRead && (
                <div className="flex items-center gap-2">
                  <Clock className="w-3 h-3" />
                  <span>{guide.timeToRead} READ</span>
                </div>
              )}
              <div className="hidden sm:block">
                UPDATED: {guide.updated_at ? new Date(guide.updated_at).toLocaleDateString() : new Date().toLocaleDateString()}
              </div>
            </div>

            {/* Video Embed (Optional) */}
            {guide.videoUrl && (
              <SpotlightCard className="my-12 aspect-video group cursor-pointer border-slate-200 dark:border-white/10 overflow-hidden relative">
                 <div className="absolute inset-0 bg-slate-100 dark:bg-slate-900 flex items-center justify-center">
                    {/* Placeholder for thumbnail */}
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-200 dark:from-slate-950 to-transparent opacity-80" />
                 </div>
                 <div className="absolute inset-0 flex items-center justify-center group-hover:bg-black/20 transition-colors">
                   <div className="flex flex-col items-center gap-6 transition-transform duration-500 group-hover:scale-105">
                      <div className="w-20 h-20 rounded-full bg-white/40 dark:bg-white/5 backdrop-blur-md flex items-center justify-center border border-white/20 shadow-[0_0_40px_rgba(255,255,255,0.1)] group-hover:bg-white/20 dark:group-hover:bg-white/10">
                         <PlayCircle className="w-8 h-8 text-slate-900 dark:text-white fill-white/20" />
                      </div>
                      <p className="text-slate-900 dark:text-white font-medium tracking-widest text-xs uppercase">Watch Tutorial</p>
                   </div>
                 </div>
              </SpotlightCard>
            )}

            {/* Content - Editorial Style */}
            <article className="prose prose-lg max-w-none mb-16 dark:prose-invert prose-headings:tracking-tight prose-headings:font-bold prose-p:leading-8 prose-a:text-centri-500 prose-a:no-underline hover:prose-a:text-centri-600 dark:hover:prose-a:text-centri-400 prose-img:rounded-2xl prose-img:shadow-2xl prose-hr:border-slate-200 dark:prose-hr:border-white/5">
              <ReactMarkdown
                components={{
                  h1: ({node, ...props}) => <h1 className="text-3xl mt-16 mb-8" {...props} />,
                  h2: ({node, ...props}) => <h2 className="text-2xl mt-16 mb-6 pb-4 border-b border-slate-200 dark:border-white/5 flex items-center gap-3" {...props}><span className="w-2 h-2 bg-centri-500" />{props.children}</h2>,
                  p: ({node, ...props}) => <p className="mb-8 text-slate-600 dark:text-slate-300/90 font-light" {...props} />,
                  ul: ({node, ...props}) => <ul className="space-y-3 my-8" {...props} />,
                  li: ({node, ...props}) => <li className="flex items-baseline gap-4 text-slate-600 dark:text-slate-300" {...props}><span className="mt-2.5 w-1 h-1 rounded-full bg-centri-500 flex-shrink-0 opacity-50" /><span>{props.children}</span></li>,
                  blockquote: ({node, ...props}) => <blockquote className="border-l-2 border-centri-500 pl-6 italic text-slate-500 dark:text-slate-400 my-8" {...props} />,
                  table: ({node, ...props}) => (
                    <div className="my-8 overflow-x-auto">
                      <table className="min-w-full border-collapse border border-slate-200 dark:border-white/10 rounded-lg overflow-hidden" {...props} />
                    </div>
                  ),
                  thead: ({node, ...props}) => <thead className="bg-slate-100 dark:bg-slate-800/50" {...props} />,
                  tbody: ({node, ...props}) => <tbody className="divide-y divide-slate-200 dark:divide-white/5" {...props} />,
                  tr: ({node, ...props}) => <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors" {...props} />,
                  th: ({node, ...props}) => (
                    <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 border-b border-slate-200 dark:border-white/10" {...props} />
                  ),
                  td: ({node, ...props}) => (
                    <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-300/90" {...props} />
                  ),
                }}
              >
                {guide.content}
              </ReactMarkdown>
            </article>

            {/* Feedback Section - Industrial */}
            <div className="mb-16 p-px bg-gradient-to-r from-slate-200 dark:from-white/5 to-transparent rounded-2xl">
                <div className="bg-slate-50 dark:bg-slate-900/80 rounded-2xl p-8 backdrop-blur-sm flex flex-col sm:flex-row items-center justify-between gap-6 border border-slate-200 dark:border-transparent">
                <div>
                    <h4 className="text-slate-900 dark:text-white font-bold tracking-tight mb-1">Feedback Required</h4>
                    <p className="text-sm text-slate-500 dark:text-slate-400 font-mono">Was this module effective?</p>
                </div>
                
                {!feedback ? (
                    <div className="flex gap-3">
                    <Button variant="secondary" size="sm" onClick={() => handleFeedback('yes')} className="bg-white dark:bg-white/5 hover:bg-slate-100 dark:hover:bg-white/10 border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-200">
                        <ThumbsUp className="w-4 h-4 mr-2" /> AFFIRMATIVE
                    </Button>
                    <Button variant="secondary" size="sm" onClick={() => handleFeedback('no')} className="bg-white dark:bg-white/5 hover:bg-slate-100 dark:hover:bg-white/10 border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-200">
                        <ThumbsDown className="w-4 h-4 mr-2" /> NEGATIVE
                    </Button>
                    </div>
                ) : (
                    <div className="flex items-center text-emerald-500 dark:text-emerald-400 animate-fade-in bg-emerald-50 dark:bg-emerald-900/20 px-6 py-2 rounded-full border border-emerald-200 dark:border-emerald-500/30">
                        <CheckCircle className="w-4 h-4 mr-2" /> <span className="text-xs font-bold tracking-widest uppercase">Feedback Logged</span>
                    </div>
                )}
                </div>
            </div>

            {/* Next/Prev Navigation */}
            {areaId && <GuideNavigation currentAreaId={areaId} currentGuideId={guide.id} />}

          </div>
        </div>

        {/* Table of Contents (Right Sidebar) */}
        {!zenMode && <TableOfContents content={guide.content} />}

      </div>
    </div>
  );
};
