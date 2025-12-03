
import React, { useEffect, useState } from 'react';
import { Routes, Route, useParams, Link, Navigate } from 'react-router-dom';
import { GuideViewer } from '../components/Guide/GuideViewer';
import { SpotlightCard } from '../components/ui/SpotlightCard';
import { Book, ChevronRight, ArrowRight, LayoutGrid, Loader2 } from 'lucide-react';
import * as Icons from 'lucide-react';
import { cn } from '../lib/utils';
import { PageTransition } from '../components/Layout/PageTransition';
import { useStore } from '../store/useStore';
import { useAuth } from '../contexts/AuthContext';
import type { LibraryGuide } from '../types/guides';
import { blocksToMarkdown } from '../lib/contentUtils';
import { getCurrentAccessToken } from '../lib/supabaseClient';

// Component to render dynamic icon by name
const IconRenderer = ({ name, className }: { name: string; className?: string }) => {
  const Icon = (Icons as any)[name] || Book;
  return <Icon className={className} />;
};

// Category metadata (for icons and descriptions)
const CATEGORY_METADATA: Record<string, { iconName: string; description: string }> = {
  'getting-started': { iconName: 'Rocket', description: 'Account setup, platform basics, and quick start guides.' },
  'contacts-crm': { iconName: 'Users', description: 'Contact management, pipelines, opportunities, and smart lists.' },
  'conversations': { iconName: 'MessageCircle', description: 'Email composer, SMS, inbox, and messaging management.' },
  'phone-system': { iconName: 'Phone', description: 'Calling, phone numbers, voicemail, SMS/MMS, A2P registration.' },
  'calendars-booking': { iconName: 'Calendar', description: 'Appointment scheduling, calendar setup, and booking widgets.' },
  'automation-workflows': { iconName: 'Zap', description: 'Workflow builder, triggers, actions, and campaigns.' },
  'ai-tools': { iconName: 'Bot', description: 'Conversation AI, Workflow AI, prompting, and agents.' },
  'websites-funnels': { iconName: 'Layout', description: 'Funnel builder, websites, forms, surveys, and WordPress.' },
  'email-marketing': { iconName: 'Mail', description: 'Email campaigns, templates, deliverability, and SMTP.' },
  'social-media': { iconName: 'Share2', description: 'Social planner, ad manager, and content scheduling.' },
  'integrations': { iconName: 'Plug', description: 'Third-party connections, API, Zapier, and Marketplace apps.' },
  'reputation-reviews': { iconName: 'Star', description: 'Review management, reputation monitoring, and review requests.' },
  'memberships-communities': { iconName: 'GraduationCap', description: 'Course creation, memberships, community groups, and certificates.' },
  'payments-invoicing': { iconName: 'CreditCard', description: 'Invoices, products, subscriptions, and e-commerce.' },
  'client-portal': { iconName: 'Smartphone', description: 'Client portal setup, mobile app, SSO, and branding.' },
  'reporting-analytics': { iconName: 'BarChart', description: 'Dashboards, attribution, ad reporting, and analytics.' },
  'settings-admin': { iconName: 'Settings', description: 'Account settings, user management, and permissions.' },
};

const GuidesLibrary = () => {
  const { agencyConfig } = useStore();
  const { agency } = useAuth();
  const [categories, setCategories] = useState<Array<{ folder_slug: string; folder_label: string }>>([]);
  const [guidesByCategory, setGuidesByCategory] = useState<Map<string, LibraryGuide[]>>(new Map());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        
        // Get auth token for API calls
        const token = getCurrentAccessToken();
        const headers: HeadersInit = {};
        if (token) {
          headers['Authorization'] = `Bearer ${token}`;
        }
        
        // Fetch categories
        const categoriesRes = await fetch('/api/content/categories', { headers });
        if (!categoriesRes.ok) throw new Error('Failed to fetch categories');
        const categoriesData = await categoriesRes.json();
        
        // Filter by enabled areas if agency config exists
        const enabledAreas = agencyConfig?.enabledGuideAreas;
        const filteredCategories = enabledAreas 
          ? categoriesData.filter((cat: any) => enabledAreas.includes(cat.folder_slug))
          : categoriesData;
        
        setCategories(filteredCategories);
        
        // Fetch guides for each category
        const guidesMap = new Map<string, LibraryGuide[]>();
        for (const category of filteredCategories) {
          const guidesRes = await fetch(`/api/content/guides?folderSlug=${category.folder_slug}`, { headers });
          if (guidesRes.ok) {
            const guidesData = await guidesRes.json();
            guidesMap.set(category.folder_slug, guidesData);
          }
        }
        setGuidesByCategory(guidesMap);
        
        setLoading(false);
      } catch (err: any) {
        console.error('Error fetching guides:', err);
        setError(err.message);
        setLoading(false);
      }
    }
    
    fetchData();
  }, [agencyConfig]);

  if (loading) {
    return (
      <PageTransition>
        <div className="max-w-[1600px] mx-auto pb-20 flex items-center justify-center min-h-[400px]">
          <Loader2 className="w-8 h-8 animate-spin text-centri-500" />
        </div>
      </PageTransition>
    );
  }

  if (error) {
    return (
      <PageTransition>
        <div className="max-w-[1600px] mx-auto pb-20">
          <div className="text-center text-red-400">Error: {error}</div>
        </div>
      </PageTransition>
    );
  }

  return (
    <PageTransition>
      <div className="max-w-[1600px] mx-auto pb-20">
        
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white tracking-tight mb-2">Knowledge Base</h1>
          <p className="text-slate-400">Browse detailed tutorials and documentation for your system.</p>
        </div>

        {/* The Bento Grid for Categories */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          
          {categories.map((category) => {
            const guides = guidesByCategory.get(category.folder_slug) || [];
            const metadata = CATEGORY_METADATA[category.folder_slug] || { iconName: 'Book', description: '' };
            const firstGuide = guides[0];
            
            return (
              <div key={category.folder_slug} className="h-full">
                <SpotlightCard className="group h-full bg-dark-card hover:bg-slate-900 transition-colors border-white/5">
                  <Link 
                    to={firstGuide ? `/guides/${category.folder_slug}/${firstGuide.id}` : '/guides'} 
                    className="block p-8 h-full flex flex-col"
                  >
                    <div className="flex items-start justify-between mb-8">
                      <div className="p-4 bg-slate-800/50 rounded-2xl text-slate-300 group-hover:text-white group-hover:bg-centri-600 transition-all duration-500 shadow-inner ring-1 ring-white/5 group-hover:ring-centri-500 group-hover:scale-110">
                        <IconRenderer name={metadata.iconName} className="w-8 h-8" />
                      </div>
                      <ArrowRight className="w-6 h-6 text-slate-600 group-hover:text-centri-400 group-hover:-rotate-45 transition-all duration-300" />
                    </div>
                    
                    <h2 className="text-xl font-bold text-white mb-3 tracking-tight group-hover:text-centri-300 transition-colors">
                      {category.folder_label}
                    </h2>
                    <p className="text-slate-400 text-sm leading-relaxed opacity-70 font-light mb-6 flex-1 line-clamp-3">
                      {metadata.description}
                    </p>
                    
                    <div className="pt-6 border-t border-white/5 flex items-center gap-3">
                      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                        {guides.length} {guides.length === 1 ? 'Guide' : 'Guides'}
                      </span>
                      <span className="h-px flex-1 bg-white/5"></span>
                    </div>
                  </Link>
                </SpotlightCard>
              </div>
            );
          })}

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
  const [guide, setGuide] = useState<LibraryGuide | null>(null);
  const [guides, setGuides] = useState<LibraryGuide[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    async function fetchData() {
      if (!guideId) return;
      
      try {
        setLoading(true);
        
        // Get auth token for API calls
        const token = getCurrentAccessToken();
        const headers: HeadersInit = {};
        if (token) {
          headers['Authorization'] = `Bearer ${token}`;
        }
        
        // Fetch single guide
        const guideRes = await fetch(`/api/content/guides/${guideId}`, { headers });
        if (!guideRes.ok) throw new Error('Guide not found');
        const guideData = await guideRes.json();
        setGuide(guideData);
        
        // Fetch all guides in this category for sidebar
        if (guideData.folder_slug) {
          const guidesRes = await fetch(`/api/content/guides?folderSlug=${guideData.folder_slug}`, { headers });
          if (guidesRes.ok) {
            const guidesData = await guidesRes.json();
            setGuides(guidesData);
          }
        }
        
        setLoading(false);
      } catch (err: any) {
        console.error('Error fetching guide:', err);
        setError(err.message);
        setLoading(false);
      }
    }
    
    fetchData();
  }, [guideId]);

  // Security check: Is this area enabled?
  const isEnabled = agencyConfig?.enabledGuideAreas?.includes(areaId || '') ?? true;

  if (loading) {
    return (
      <PageTransition>
        <div className="max-w-[1600px] mx-auto pb-20 flex items-center justify-center min-h-[400px]">
          <Loader2 className="w-8 h-8 animate-spin text-centri-500" />
        </div>
      </PageTransition>
    );
  }

  if (error || !guide || !isEnabled) {
    return (
      <PageTransition>
        <div className="p-12 text-center text-slate-500">Guide not found or access restricted.</div>
      </PageTransition>
    );
  }

  // Convert guide to format expected by GuideViewer
  const guideDisplay = {
    id: guide.id,
    title: guide.title,
    summary: guide.content_json && Array.isArray(guide.content_json) && guide.content_json.length > 0
      ? (guide.content_json[0] as any).content?.substring(0, 150) + '...'
      : '',
    tags: [], // Tags not in current schema
    timeToRead: '5 min', // Not in current schema
    content: blocksToMarkdown(guide.content_json as any),
    videoUrl: undefined, // Not in current schema
  };

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
                 {guide.folder_label}
              </h3>
              <nav className="space-y-4">
                {guides.map(g => (
                  <Link
                    key={g.id}
                    to={`/guides/${g.folder_slug}/${g.id}`}
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
          <GuideViewer guide={guideDisplay} />
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
