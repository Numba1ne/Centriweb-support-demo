
import React from 'react';
import { Link } from 'react-router-dom';
import { Clock, ArrowRight, Sparkles } from 'lucide-react';
import { useStore } from '../../store/useStore';
import { GUIDE_DATA } from '../../data/guides';
import { SpotlightCard } from '../ui/SpotlightCard';

export const RecentlyViewed: React.FC = () => {
  const { viewedGuides, agencyConfig } = useStore();

  // Helper to find a full guide object by ID
  const findGuide = (id: string) => {
    for (const area of GUIDE_DATA) {
      const guide = area.guides.find(g => g.id === id);
      if (guide) return { ...guide, areaId: area.id, areaTitle: area.title };
    }
    return null;
  };

  let displayGuides: any[] = [];
  let title = "";
  let icon = null;

  // 1. Filter History against Current Agency Permissions
  // This is crucial for multi-tenancy: If Sub-Account A has "Phone" enabled but Sub-Account B doesn't,
  // we shouldn't show Phone guides in history when viewing Sub-Account B.
  const validHistory = viewedGuides
    .map(id => findGuide(id))
    .filter(guide => {
      if (!guide) return false;
      // Check if this guide's area is enabled for the current agency/sub-account context
      return agencyConfig?.enabledGuideAreas.includes(guide.areaId);
    });

  if (validHistory.length > 0) {
    // Show User History
    title = "Jump back in";
    icon = <Clock className="w-4 h-4 text-slate-500" />;
    displayGuides = validHistory.slice(0, 3);
  } else {
    // 2. Fallback: Show "Getting Started" if no history or history was filtered out
    title = "Suggested for you";
    icon = <Sparkles className="w-4 h-4 text-centri-500" />;
    const gettingStarted = GUIDE_DATA.find(area => area.id === 'getting-started');
    
    // Only show fallback if "getting-started" is actually enabled for this agency
    if (gettingStarted && agencyConfig?.enabledGuideAreas.includes('getting-started')) {
      displayGuides = gettingStarted.guides
        .map(g => ({ ...g, areaId: gettingStarted.id, areaTitle: gettingStarted.title }))
        .slice(0, 3);
    }
  }

  if (displayGuides.length === 0) return null;

  return (
    <div className="mb-12">
      <div className="flex items-center gap-2 mb-4 px-1">
        {icon}
        <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider">{title}</h3>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {displayGuides.map((guide: any) => (
          <SpotlightCard key={guide.id} className="group bg-white dark:bg-dark-card border-slate-200 dark:border-white/5 h-full">
            <Link to={`/guides/${guide.areaId}/${guide.id}`} className="block p-5 h-full flex flex-col">
              <div className="flex justify-between items-start mb-2">
                <span className="text-[10px] font-bold text-centri-500 uppercase tracking-widest bg-centri-50 dark:bg-centri-900/20 px-2 py-1 rounded">
                  {guide.areaTitle}
                </span>
                <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-centri-400 group-hover:-rotate-45 transition-all" />
              </div>
              <h4 className="font-semibold text-slate-900 dark:text-white line-clamp-1 group-hover:text-centri-600 dark:group-hover:text-centri-400 transition-colors mb-1">
                {guide.title}
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-auto line-clamp-2 font-light">
                {guide.summary}
              </p>
            </Link>
          </SpotlightCard>
        ))}
      </div>
    </div>
  );
};
