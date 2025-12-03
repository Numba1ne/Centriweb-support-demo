
import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import type { LibraryGuide } from '../../types/guides';
import { getCurrentAccessToken } from '../../lib/supabaseClient';

interface GuideNavigationProps {
  currentAreaId: string;
  currentGuideId: string;
}

export const GuideNavigation: React.FC<GuideNavigationProps> = ({ currentAreaId, currentGuideId }) => {
  const [guides, setGuides] = useState<LibraryGuide[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchGuides() {
      try {
        // Get auth token for API calls
        const token = getCurrentAccessToken();
        const headers: HeadersInit = {};
        if (token) {
          headers['Authorization'] = `Bearer ${token}`;
        }
        
        const res = await fetch(`/api/content/guides?folderSlug=${currentAreaId}`, { headers });
        if (res.ok) {
          const data = await res.json();
          setGuides(data);
        }
      } catch (err) {
        console.error('Error fetching guides for navigation:', err);
      } finally {
        setLoading(false);
      }
    }
    
    fetchGuides();
  }, [currentAreaId]);

  if (loading || guides.length === 0) return null;

  const currentIndex = guides.findIndex(g => g.id === currentGuideId);
  const prevGuide = currentIndex > 0 ? guides[currentIndex - 1] : null;
  const nextGuide = currentIndex < guides.length - 1 ? guides[currentIndex + 1] : null;

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
