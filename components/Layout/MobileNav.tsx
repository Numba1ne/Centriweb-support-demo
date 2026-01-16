
import React from 'react';
import { NavLink } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, MessageSquare, LifeBuoy, X, Search, ChevronRight } from 'lucide-react';
import { useStore } from '../../store/useStore';
import { cn } from '../../lib/utils';

const menuVariants = {
  closed: {
    opacity: 0,
    y: -20,
    transition: { staggerChildren: 0.05, staggerDirection: -1 }
  },
  open: {
    opacity: 1,
    y: 0,
    transition: { staggerChildren: 0.07, delayChildren: 0.1 }
  }
};

const itemVariants = {
  closed: { opacity: 0, x: -20 },
  open: { opacity: 1, x: 0 }
};

const MobileNavItem = ({ to, icon: Icon, label, description, onClick }: any) => (
  <motion.div variants={itemVariants}>
    <NavLink
      to={to}
      onClick={onClick}
      className={({ isActive }) =>
        cn(
          "flex items-center gap-4 p-4 rounded-2xl transition-all",
          isActive 
            ? "bg-white/10 border border-white/10 shadow-lg" 
            : "bg-slate-900/50 border border-white/5"
        )
      }
    >
      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-centri-600 to-centri-800 flex items-center justify-center text-white shadow-inner">
        <Icon className="w-5 h-5" />
      </div>
      <div className="flex-1">
        <div className="font-semibold text-white text-lg">{label}</div>
        <div className="text-slate-400 text-xs">{description}</div>
      </div>
      <ChevronRight className="w-5 h-5 text-slate-600" />
    </NavLink>
  </motion.div>
);

export const MobileNav: React.FC = () => {
  const { mobileMenuOpen, toggleMobileMenu, setSearchOpen } = useStore();

  return (
    <AnimatePresence>
      {mobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-dark-bg/95 backdrop-blur-xl flex flex-col"
        >
          {/* Header inside modal */}
          <div className="h-16 flex items-center justify-between px-6 border-b border-white/5 bg-dark-bg/50">
            <span className="font-bold text-lg text-white tracking-tight">Menu</span>
            <button 
              onClick={toggleMobileMenu}
              className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-800 text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto p-6">
            <motion.div
              variants={menuVariants}
              initial="closed"
              animate="open"
              exit="closed"
              className="space-y-6"
            >
              {/* Search Trigger */}
              <motion.button
                variants={itemVariants}
                onClick={() => { toggleMobileMenu(); setSearchOpen(true); }}
                className="w-full flex items-center gap-3 p-3 rounded-xl bg-slate-800/80 text-slate-400 mb-8 border border-transparent focus:border-centri-500 outline-none"
              >
                <Search className="w-5 h-5" />
                <span className="text-base font-medium">Search guides & help...</span>
              </motion.button>

              <div className="space-y-3">
                <div className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Navigation</div>
                <MobileNavItem 
                  to="/guides" 
                  icon={BookOpen} 
                  label="Guides Library" 
                  description="Tutorials, documentation, and walkthroughs"
                  onClick={toggleMobileMenu}
                />
                <MobileNavItem 
                  to="/chat" 
                  icon={MessageSquare} 
                  label="AI Assistant" 
                  description="Ask questions and get instant answers"
                  onClick={toggleMobileMenu}
                />
                <MobileNavItem 
                  to="/support" 
                  icon={LifeBuoy} 
                  label="Support Team" 
                  description="Submit tickets and view status"
                  onClick={toggleMobileMenu}
                />
              </div>

              <motion.div variants={itemVariants} className="pt-8 border-t border-white/5">
                <div className="flex items-center gap-3 px-2">
                  <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  </div>
                  <div className="text-sm">
                    <div className="text-white font-medium">System Status</div>
                    <div className="text-emerald-500">All systems operational</div>
                  </div>
                </div>
              </motion.div>

            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
