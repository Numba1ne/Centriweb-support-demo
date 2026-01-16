
import React from 'react';
import { ONBOARDING_TASKS } from '../../data/onboarding';
import { useStore } from '../../store/useStore';
import { ProgressBar } from '../ui/ProgressBar';
import { Button } from '../ui/Button';
import { CheckCircle2, Circle, Trophy, ChevronRight, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { SpotlightCard } from '../ui/SpotlightCard';
import { useNavigate } from 'react-router-dom';

export const OnboardingWidget: React.FC = () => {
  const { completedTasks, toggleTaskCompletion } = useStore();
  const navigate = useNavigate();

  const total = ONBOARDING_TASKS.length;
  const completedCount = completedTasks.length;
  const progress = (completedCount / total) * 100;
  const nextTask = ONBOARDING_TASKS.find(t => !completedTasks.includes(t.id));

  return (
    <div className="mb-10">
      <SpotlightCard className="relative overflow-hidden border-centri-500/20 bg-gradient-to-r from-slate-900 to-slate-900/50">
        {/* Decorative Background Elements */}
        <div className="absolute top-0 right-0 -mt-16 -mr-16 w-64 h-64 bg-centri-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-20 w-40 h-40 bg-purple-500/10 rounded-full blur-3xl" />

        <div className="relative z-10 p-6 md:p-8 flex flex-col md:flex-row gap-8 items-start md:items-center">
          
          {/* Left: Progress Circle / Trophy */}
          <div className="flex-shrink-0 relative">
             <div className="w-20 h-20 rounded-full bg-slate-800 border border-white/10 flex items-center justify-center shadow-xl">
                {progress === 100 ? (
                   <Trophy className="w-10 h-10 text-yellow-400 animate-pulse" />
                ) : (
                   <span className="text-2xl font-bold text-white">{Math.round(progress)}%</span>
                )}
             </div>
             {/* Circular Progress SVG could go here, simplifying for now */}
          </div>

          {/* Middle: Context */}
          <div className="flex-1 space-y-3">
            <div>
              <h2 className="text-2xl font-bold text-white tracking-tight">
                {progress === 100 ? "All Systems Go! 🚀" : "Launch Your Business"}
              </h2>
              <p className="text-slate-400 text-sm md:text-base max-w-xl">
                {progress === 100 
                  ? "You've completed all essential setup tasks. You're ready to scale." 
                  : "Complete these essential steps to get your account fully operational and start generating leads."}
              </p>
            </div>
            
            <div className="flex items-center gap-4 max-w-md">
               <ProgressBar value={progress} className="h-3 bg-slate-800/80" />
               <span className="text-xs text-slate-500 whitespace-nowrap">{completedCount} / {total} Steps</span>
            </div>
          </div>

          {/* Right: Next Action */}
          <div className="w-full md:w-auto min-w-[280px]">
             <div className="bg-slate-950/50 rounded-xl border border-white/10 p-4 backdrop-blur-sm">
                <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
                   {progress === 100 ? "Completed" : "Up Next"}
                </div>

                {nextTask ? (
                  <div className="space-y-3">
                     <div className="flex items-start gap-3">
                        <div className="mt-1 w-2 h-2 rounded-full bg-centri-500 shadow-[0_0_8px_currentColor]" />
                        <div>
                           <h4 className="text-sm font-medium text-white">{nextTask.title}</h4>
                           <p className="text-xs text-slate-500 line-clamp-1">{nextTask.description}</p>
                        </div>
                     </div>
                     <Button 
                        size="sm" 
                        className="w-full justify-between group bg-centri-600/90 hover:bg-centri-500 border-none"
                        onClick={() => {
                           if (nextTask.guideId) navigate(`/guides/getting-started/${nextTask.guideId}`); // Simple mapping fallback
                        }}
                     >
                        {nextTask.actionLabel}
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                     </Button>
                     <button 
                        onClick={() => toggleTaskCompletion(nextTask.id)}
                        className="w-full text-[10px] text-slate-500 hover:text-slate-300 transition-colors text-center"
                     >
                        Mark as done
                     </button>
                  </div>
                ) : (
                  <div className="text-center py-2">
                     <p className="text-sm text-emerald-400 mb-2">You are a CentriWeb Pro!</p>
                     <Button variant="outline" size="sm" className="w-full" onClick={() => useStore.getState().resetOnboarding()}>
                        Reset Progress (Demo)
                     </Button>
                  </div>
                )}
             </div>
          </div>

        </div>
      </SpotlightCard>
    </div>
  );
};
