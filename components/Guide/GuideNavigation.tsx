
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { GUIDE_DATA } from '../../data/guides';

interface GuideNavigationProps {
  currentAreaId: string;
  currentGuideId: string;
}

export const GuideNavigation: React.FC<GuideNavigationProps> = ({ currentAreaId, currentGuideId }) => {
  const area = GUIDE_DATA.find(a => a.id === currentAreaId);
  if (!area) return null;

  const currentIndex = area.guides.findIndex(g => g.id === currentGuideId);
  const prevGuide = currentIndex > 0 ? area.guides[currentIndex - 1] : null;
  const nextGuide = currentIndex < area.guides.length - 1 ? area.guides[currentIndex + 1] : null;

  if (!prevGuide && !nextGuide) return null;

  return (
    <div className="mt-20 pt-8 border-t border-slate-200 dark:border-white/5 grid grid-cols-2 gap-4">
      {prevGuide ? (
        <Link 
          to={`/guides/${currentAreaId}/${prevGuide.id}`}
          className="group flex flex-col items-start gap-2 p-4 rounded-xl hover:bg-slate-100 dark:hover:bg-white/5 transition-colors text-left"
        >
          <div className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-wider group-hover:text-centri-600 dark:group-hover:text-centri-400">
            <ArrowLeft className="w-3 h-3 group-hover:-translate-x-1 transition-transform" />
            Previous
          </div>
          <span className="text-sm font-semibold text-slate-900 dark:text-white group-hover:text-centri-600 dark:group-hover:text-centri-400 transition-colors">
            {prevGuide.title}
          </span>
        </Link>
      ) : <div />}

      {nextGuide ? (
        <Link 
          to={`/guides/${currentAreaId}/${nextGuide.id}`}
          className="group flex flex-col items-end gap-2 p-4 rounded-xl hover:bg-slate-100 dark:hover:bg-white/5 transition-colors text-right"
        >
          <div className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-wider group-hover:text-centri-600 dark:group-hover:text-centri-400">
            Next
            <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
          </div>
          <span className="text-sm font-semibold text-slate-900 dark:text-white group-hover:text-centri-600 dark:group-hover:text-centri-400 transition-colors">
            {nextGuide.title}
          </span>
        </Link>
      ) : <div />}
    </div>
  );
};
