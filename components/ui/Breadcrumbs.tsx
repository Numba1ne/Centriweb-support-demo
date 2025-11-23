
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';
import { GUIDE_DATA } from '../../data/guides';

export const Breadcrumbs: React.FC = () => {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter((x) => x);

  if (pathnames.length === 0) return null;

  const getBreadcrumbName = (value: string, index: number) => {
    // Static mappings
    if (value === 'guides') return 'Guides';
    if (value === 'chat') return 'Assistant';
    if (value === 'support') return 'Support';

    // Dynamic mappings (Guides)
    if (pathnames[0] === 'guides') {
      // Is it an Area ID?
      const area = GUIDE_DATA.find(a => a.id === value);
      if (area) return area.title;

      // Is it a Guide ID?
      const guide = GUIDE_DATA.flatMap(a => a.guides).find(g => g.id === value);
      if (guide) return guide.title.length > 20 ? guide.title.substring(0, 20) + '...' : guide.title;
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
