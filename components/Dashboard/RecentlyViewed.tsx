
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Clock, ArrowRight, Sparkles } from 'lucide-react';
import { useStore } from '../../store/useStore';
import { SpotlightCard } from '../ui/SpotlightCard';
import type { LibraryGuide } from '../../types/guides';
import { getCurrentAccessToken } from '../../lib/supabaseClient';

interface GuideDisplay {
  id: string;
  title: string;
  summary?: string;
  areaId: string;
  areaTitle: string;
}

export const RecentlyViewed: React.FC = () => {
  const { viewedGuides, agencyConfig } = useStore();
  const [allGuides, setAllGuides] = useState<Map<string, GuideDisplay>>(new Map());
  const [loading, setLoading] = useState(true);

  // Fetch all guides and build lookup map
  useEffect(() => {
    async function fetchAllGuides() {
      try {
        // Get auth token for API calls
        const token = getCurrentAccessToken();
        const headers: HeadersInit = {};
        if (token) {
          headers['Authorization'] = `Bearer ${token}`;
        }
        
        // Fetch categories
        const categoriesRes = await fetch('/api/content/categories', { headers });
        if (!categoriesRes.ok) return;
        const categories = await categoriesRes.json();
        
        // Filter by enabled areas
        const enabledAreas = agencyConfig?.enabledGuideAreas;
        const filteredCategories = enabledAreas 
          ? categories.filter((cat: any) => enabledAreas.includes(cat.folder_slug))
          : categories;
        
        // Fetch guides for each category
        const guidesMap = new Map<string, GuideDisplay>();
        for (const category of filteredCategories) {
          const guidesRes = await fetch(`/api/content/guides?folderSlug=${category.folder_slug}`, { headers });
          if (guidesRes.ok) {
            const categoryGuides: LibraryGuide[] = await guidesRes.json();
            categoryGuides.forEach(guide => {
              guidesMap.set(guide.id, {
                id: guide.id,
                title: guide.title,
                summary: undefined, // content_json not included in list endpoint
                areaId: category.folder_slug,
                areaTitle: category.folder_label,
              });
            });
          }
        }
        
        setAllGuides(guidesMap);
      } catch (err) {
        console.error('Error fetching guides:', err);
      } finally {
        setLoading(false);
      }
    }
    
    fetchAllGuides();
  }, [agencyConfig]);

  // Helper to find a guide by ID
  const findGuide = (id: string): GuideDisplay | null => {
    return allGuides.get(id) || null;
  };

  let displayGuides: GuideDisplay[] = [];
  let title = "";
  let icon = null;

  // Filter history against current agency permissions
  const validHistory = viewedGuides
    .map(id => findGuide(id))
    .filter((guide): guide is GuideDisplay => {
      if (!guide) return false;
      return agencyConfig?.enabledGuideAreas?.includes(guide.areaId) ?? true;
    });

  if (validHistory.length > 0) {
    // Show User History
    title = "Jump back in";
    icon = <Clock className="w-4 h-4 text-slate-500" />;
    displayGuides = validHistory.slice(0, 3);
  } else if (!loading) {
    // Fallback: Show "Getting Started" if no history
    title = "Suggested for you";
    icon = <Sparkles className="w-4 h-4 text-centri-500" />;
    
    // Find getting-started guides
    const gettingStartedGuides = Array.from(allGuides.values())
      .filter(g => g.areaId === 'getting-started')
      .slice(0, 3);
    
    if (gettingStartedGuides.length > 0 && (agencyConfig?.enabledGuideAreas?.includes('getting-started') ?? true)) {
      displayGuides = gettingStartedGuides;
    }
  }

  if (loading || displayGuides.length === 0) return null;

  return (
    <div className="mb-12">
      <div className="flex items-center gap-2 mb-4 px-1">
        {icon}
        <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider">{title}</h3>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {displayGuides.map((guide) => (
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
              {guide.summary && (
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-auto line-clamp-2 font-light">
                  {guide.summary}
                </p>
              )}
            </Link>
          </SpotlightCard>
        ))}
      </div>
    </div>
  );
};
