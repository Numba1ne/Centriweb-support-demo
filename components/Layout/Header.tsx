
import React from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { motion, LayoutGroup } from 'framer-motion';
import { useStore } from '../../store/useStore';
import { useAuth } from '../../contexts/AuthContext';
import { 
  Menu,
  Hexagon,
  Search,
  Bell,
  Command,
  Sun,
  Moon
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { MobileNav } from './MobileNav';

interface TabProps {
  to: string;
  label: string;
  isActive: boolean;
}

const NavTab: React.FC<TabProps> = ({ to, label, isActive }) => (
  <NavLink to={to} className="relative px-1 py-4 group">
    <span className={cn(
      "relative z-10 text-sm font-medium transition-colors duration-200",
      isActive ? "text-slate-900 dark:text-white" : "text-slate-500 dark:text-slate-400 group-hover:text-slate-700 dark:group-hover:text-slate-200"
    )}>
      {label}
    </span>
    {isActive && (
      <motion.div
        layoutId="active-tab"
        className="absolute bottom-0 left-0 right-0 h-[2px] bg-centri-500 shadow-[0_0_10px_rgba(var(--primary-500),0.5)]"
        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
      />
    )}
  </NavLink>
);

export const Header: React.FC = () => {
  const { toggleMobileMenu, setSearchOpen, theme, toggleTheme } = useStore();
  const { agency } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const tabs = [
    { id: 'dashboard', path: '/dashboard', label: 'Dashboard' },
    { id: 'guides', path: '/guides', label: 'Guides' },
    { id: 'chat', path: '/chat', label: 'AI Assistant' },
    { id: 'support', path: '/support', label: 'Support Tickets' },
  ];

  return (
    <>
      <header className="sticky top-0 z-40 w-full bg-white/80 dark:bg-dark-bg/95 backdrop-blur-md border-b border-slate-200 dark:border-white/5 transition-colors duration-300">
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <div className="flex h-14 items-center justify-between">
            
            {/* Left: Branding & Tabs (GHL Style) */}
            <div className="flex items-center gap-8">
              
              {/* Dynamic Branding */}
              <div className="flex items-center gap-3 cursor-pointer group" onClick={() => navigate('/')}>
                {agency?.branding_config?.logoUrl ? (
                   <img src={agency.branding_config.logoUrl} alt="Logo" className="h-8 object-contain" />
                ) : (
                   <Hexagon className="w-6 h-6 text-centri-600 dark:text-centri-500 fill-centri-500/10 transition-transform duration-300 group-hover:rotate-90" />
                )}
                <span className="font-bold tracking-tight text-slate-900 dark:text-white text-lg hidden sm:block">
                  {agency?.branding_config?.companyName || agency?.name || 'CentriWeb'}
                </span>
              </div>

              {/* Vertical Divider */}
              <div className="h-4 w-px bg-slate-200 dark:bg-white/10 hidden md:block"></div>

              {/* Desktop Tabs */}
              <div className="hidden md:flex items-center gap-6">
                <LayoutGroup>
                  {tabs.map((tab) => (
                    <NavTab 
                      key={tab.id}
                      to={tab.path}
                      label={tab.label}
                      isActive={location.pathname.startsWith(tab.path)}
                    />
                  ))}
                </LayoutGroup>
              </div>
            </div>

            {/* Right: Utility Bar */}
            <div className="flex items-center gap-3 md:gap-4">
              
              {/* Search Field (Desktop) */}
              <div 
                onClick={() => setSearchOpen(true)}
                className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-slate-100 dark:bg-slate-900/50 hover:bg-slate-200 dark:hover:bg-slate-800 border border-slate-200 dark:border-white/5 hover:border-slate-300 dark:hover:border-white/10 rounded-md cursor-pointer transition-colors group"
              >
                <Search className="w-3.5 h-3.5 text-slate-500 dark:text-slate-500 group-hover:text-slate-700 dark:group-hover:text-slate-300" />
                <span className="text-xs text-slate-500 dark:text-slate-500 font-medium group-hover:text-slate-700 dark:group-hover:text-slate-400">Search...</span>
                <div className="flex items-center gap-0.5 ml-4">
                  <Command className="w-3 h-3 text-slate-400 dark:text-slate-600" />
                  <span className="text-[10px] text-slate-400 dark:text-slate-600 font-mono">K</span>
                </div>
              </div>

              {/* Theme Toggle */}
              <button 
                onClick={toggleTheme}
                className="p-2 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors rounded-full hover:bg-slate-100 dark:hover:bg-white/5"
                title="Toggle Theme"
              >
                {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>

              {/* Mobile Search Icon */}
              <button 
                onClick={() => setSearchOpen(true)}
                className="md:hidden p-2 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              >
                <Search className="w-5 h-5" />
              </button>

              {/* Notification Dot */}
              <button className="relative p-2 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">
                <Bell className="w-5 h-5" />
                <span className="absolute top-2 right-2 w-1.5 h-1.5 bg-centri-500 rounded-full"></span>
              </button>

              {/* Mobile Menu Trigger */}
              <button 
                className="md:hidden p-2 text-slate-500 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"
                onClick={toggleMobileMenu}
              >
                <Menu className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <MobileNav />
    </>
  );
};
