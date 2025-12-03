
import React from 'react';
import { PageTransition } from '../components/Layout/PageTransition';
import { DashboardHeader } from '../components/Dashboard/DashboardHeader';
import { AccountInsights } from '../components/Dashboard/AccountInsights';
import { ContextSelector } from '../components/Dashboard/ContextSelector';
import { DashboardButtons } from '../components/Dashboard/DashboardButtons';
import { RecentlyViewed } from '../components/Dashboard/RecentlyViewed';
import { SpotlightCard } from '../components/ui/SpotlightCard';

export const DashboardPage = () => {
  return (
    <PageTransition>
      <div className="max-w-[1600px] mx-auto pb-20">
        
        {/* Cinematic Header */}
        <div className="mb-10 pt-4">
          <DashboardHeader />
        </div>
        
        {/* Personalized "Jump Back In" Strip (or Suggested) */}
        <RecentlyViewed />

        {/* Dynamic Dashboard Buttons */}
        <DashboardButtons />

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Main Action Area (Quick Help) */}
          <div className="lg:col-span-8 flex flex-col gap-8">
             <SpotlightCard className="flex-1 flex flex-col justify-center p-8 md:p-12 bg-gradient-to-br from-white to-slate-50 dark:from-slate-900/50 dark:to-slate-900/20 border-slate-200 dark:border-white/5 relative overflow-hidden min-h-[400px]">
                {/* Background Decor */}
                <div className="absolute top-0 right-0 p-32 bg-centri-500/5 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none" />
                
                <div className="max-w-3xl relative z-10">
                    <h2 className="text-3xl md:text-5xl font-bold text-slate-900 dark:text-white mb-6 tracking-tighter">How can we help?</h2>
                    <p className="text-slate-500 dark:text-slate-400 mb-10 text-lg font-light leading-relaxed max-w-2xl">
                        Select a topic below to instantly filter relevant guides, verify your settings, and get back to business.
                    </p>
                    <ContextSelector />
                </div>
             </SpotlightCard>
          </div>

          {/* System Health (Right Sidebar) */}
          <div className="lg:col-span-4 flex flex-col h-full min-h-[400px]">
             <AccountInsights />
          </div>

        </div>
      </div>
    </PageTransition>
  );
};
