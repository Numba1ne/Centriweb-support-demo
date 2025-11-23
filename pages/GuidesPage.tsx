
import React from 'react';
import { Routes, Route, useParams, Link, Navigate } from 'react-router-dom';
import { GUIDE_DATA } from '../data/guides';
import { GuideViewer } from '../components/Guide/GuideViewer';
import { SpotlightCard } from '../components/ui/SpotlightCard';
import { Book, ChevronRight, ArrowRight, LayoutGrid } from 'lucide-react';
import * as Icons from 'lucide-react';
import { cn } from '../lib/utils';
import { PageTransition } from '../components/Layout/PageTransition';
import { useStore } from '../store/useStore';

// Component to render dynamic icon by name
const IconRenderer = ({ name, className }: { name: string; className?: string }) => {
  const Icon = (Icons as any)[name] || Book;
  return <Icon className={className} />;
};

const GuidesLibrary = () => {
  const { agencyConfig } = useStore();
  
  // Filter guides based on agency settings
  const visibleAreas = GUIDE_DATA.filter(area => 
    agencyConfig?.enabledGuideAreas?.includes(area.id) ?? true
  );

  return (
    <PageTransition>
      <div className="max-w-[1600px] mx-auto pb-20">
        
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white tracking-tight mb-2">Knowledge Base</h1>
          <p className="text-slate-400">Browse detailed tutorials and documentation for your system.</p>
        </div>

        {/* The Bento Grid for Categories */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          
          {visibleAreas.map((area, idx) => (
            <div key={area.id} className="h-full">
              <SpotlightCard className="group h-full bg-dark-card hover:bg-slate-900 transition-colors border-white/5">
                <Link to={`/guides/${area.id}/${area.guides[0].id}`} className="block p-8 h-full flex flex-col">
                  <div className="flex items-start justify-between mb-8">
                    <div className="p-4 bg-slate-800/50 rounded-2xl text-slate-300 group-hover:text-white group-hover:bg-centri-600 transition-all duration-500 shadow-inner ring-1 ring-white/5 group-hover:ring-centri-500 group-hover:scale-110">
                      <IconRenderer name={area.iconName} className="w-8 h-8" />
                    </div>
                    <ArrowRight className="w-6 h-6 text-slate-600 group-hover:text-centri-400 group-hover:-rotate-45 transition-all duration-300" />
                  </div>
                  
                  <h2 className="text-xl font-bold text-white mb-3 tracking-tight group-hover:text-centri-300 transition-colors">{area.title}</h2>
                  <p className="text-slate-400 text-sm leading-relaxed opacity-70 font-light mb-6 flex-1 line-clamp-3">{area.description}</p>
                  
                  <div className="pt-6 border-t border-white/5 flex items-center gap-3">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                      {area.guides.length} Guides
                    </span>
                    <span className="h-px flex-1 bg-white/5"></span>
                  </div>
                </Link>
              </SpotlightCard>
            </div>
          ))}

          {/* Fallback / Search Promo Tile */}
          <div className="h-full flex flex-col justify-center items-center p-8 rounded-2xl border border-dashed border-slate-800 text-slate-600 hover:border-slate-700 hover:text-slate-400 transition-colors cursor-pointer group bg-slate-900/10 hover:bg-slate-900/30">
             <LayoutGrid className="w-10 h-10 mb-4 opacity-50 group-hover:scale-110 transition-transform" />
             <span className="text-xs font-bold uppercase tracking-widest">More Coming Soon</span>
          </div>

        </div>
      </div>
    </PageTransition>
  );
};

const GuideDetailWrapper = () => {
  const { areaId, guideId } = useParams();
  const { agencyConfig } = useStore();
  
  // Security check: Is this area enabled?
  const isEnabled = agencyConfig?.enabledGuideAreas?.includes(areaId || '') ?? true;
  
  const area = GUIDE_DATA.find(a => a.id === areaId);
  const guide = area?.guides.find(g => g.id === guideId);

  if (!area || !guide || !isEnabled) return <div className="p-12 text-center text-slate-500">Guide not found or access restricted.</div>;

  return (
    <PageTransition>
      <div className="max-w-[1600px] mx-auto flex flex-col lg:flex-row gap-12 pb-20">
        {/* Left Sidebar (Desktop Nav) - Sticky and Minimal */}
        <div className="hidden lg:block w-64 flex-shrink-0">
          <div className="sticky top-24">
            <Link to="/guides" className="flex items-center text-slate-500 hover:text-white mb-8 text-xs font-medium uppercase tracking-wider group transition-colors pl-1">
              <div className="w-6 h-6 rounded-full border border-slate-700 flex items-center justify-center mr-3 group-hover:border-white transition-colors">
                 <ChevronRight className="w-3 h-3 rotate-180" />
              </div>
              All Categories
            </Link>
            
            <div className="pl-4 border-l border-white/5">
              <h3 className="font-bold text-white mb-6 flex items-center gap-2 text-xs uppercase tracking-[0.15em] opacity-50">
                 {area.title}
              </h3>
              <nav className="space-y-4">
                {area.guides.map(g => (
                  <Link
                    key={g.id}
                    to={`/guides/${area.id}/${g.id}`}
                    className={cn(
                      "block text-sm transition-all relative",
                      g.id === guideId 
                        ? "text-centri-400 font-medium translate-x-2" 
                        : "text-slate-500 hover:text-slate-300 hover:translate-x-1"
                    )}
                  >
                    {g.title}
                    {g.id === guideId && <span className="absolute -left-6 top-1.5 w-1 h-1 bg-centri-500 rounded-full shadow-[0_0_10px_#0ea5e9]" />}
                  </Link>
                ))}
              </nav>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 min-w-0">
          <GuideViewer guide={guide} />
        </div>
      </div>
    </PageTransition>
  );
};

export const GuidesPage = () => {
  return (
    <Routes>
      <Route index element={<GuidesLibrary />} />
      <Route path=":areaId/:guideId" element={<GuideDetailWrapper />} />
      <Route path="*" element={<Navigate to="/guides" replace />} />
    </Routes>
  );
};
