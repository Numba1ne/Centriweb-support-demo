
import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';
import { getCurrentAccessToken } from '../../lib/supabaseClient';

interface BreadcrumbCache {
  categories: Map<string, string>; // folder_slug -> folder_label
  guides: Map<string, { title: string; folder_slug: string }>; // guide_id -> { title, folder_slug }
}

export const Breadcrumbs: React.FC = () => {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter((x) => x);
  const [cache, setCache] = useState<BreadcrumbCache>({
    categories: new Map(),
    guides: new Map(),
  });

  // Fetch categories and guides for breadcrumb lookup
  useEffect(() => {
    async function fetchBreadcrumbData() {
      try {
        // Get auth token for API calls
        const token = getCurrentAccessToken();
        const headers: HeadersInit = {};
        if (token) {
          headers['Authorization'] = `Bearer ${token}`;
        }
        
        // Fetch categories
        const categoriesRes = await fetch('/api/content/categories', { headers });
        if (categoriesRes.ok) {
          const categories = await categoriesRes.json();
          const categoryMap = new Map<string, string>();
          categories.forEach((cat: any) => {
            categoryMap.set(cat.folder_slug, cat.folder_label);
          });
          
          // Fetch guides for each category
          const guideMap = new Map<string, { title: string; folder_slug: string }>();
          for (const category of categories) {
            const guidesRes = await fetch(`/api/content/guides?folderSlug=${category.folder_slug}`, { headers });
            if (guidesRes.ok) {
              const guides = await guidesRes.json();
              guides.forEach((guide: any) => {
                guideMap.set(guide.id, {
                  title: guide.title,
                  folder_slug: guide.folder_slug,
                });
              });
            }
          }
          
          setCache({
            categories: categoryMap,
            guides: guideMap,
          });
        }
      } catch (err) {
        console.error('Error fetching breadcrumb data:', err);
      }
    }
    
    fetchBreadcrumbData();
  }, []);

  if (pathnames.length === 0) return null;

  const getBreadcrumbName = (value: string, index: number) => {
    // Static mappings
    if (value === 'guides') return 'Guides';
    if (value === 'chat') return 'Assistant';
    if (value === 'support') return 'Support';

    // Dynamic mappings (Guides)
    if (pathnames[0] === 'guides') {
      // Is it an Area ID (folder_slug)?
      const categoryLabel = cache.categories.get(value);
      if (categoryLabel) return categoryLabel;

      // Is it a Guide ID?
      const guide = cache.guides.get(value);
      if (guide) {
        const title = guide.title.length > 20 ? guide.title.substring(0, 20) + '...' : guide.title;
        return title;
      }
    }

    // Fallback: capitalize
    return value.charAt(0).toUpperCase() + value.slice(1).replace(/-/g, ' ');
  };

  return (
    <nav className="hidden md:flex items-center text-xs text-slate-500 border-l border-white/10 pl-4 h-6">
      <Link to="/" className="hover:text-white transition-colors">
        <Home className="w-3 h-3" />
      </Link>
      {pathnames.map((value, index) => {
        const to = `/${pathnames.slice(0, index + 1).join('/')}`;
        const isLast = index === pathnames.length - 1;
        const name = getBreadcrumbName(value, index);

        return (
          <div key={to} className="flex items-center">
            <ChevronRight className="w-3 h-3 mx-1 text-slate-600" />
            {isLast ? (
              <span className="font-medium text-slate-300">{name}</span>
            ) : (
              <Link to={to} className="hover:text-white transition-colors">
                {name}
              </Link>
            )}
          </div>
        );
      })}
    </nav>
  );
};
