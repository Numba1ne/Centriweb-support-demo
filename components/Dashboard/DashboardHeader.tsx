
import React from 'react';
import { motion } from 'framer-motion';

export const DashboardHeader: React.FC = () => {
  const hour = new Date().getHours();
  let greeting = 'Good Morning';
  if (hour >= 12) greeting = 'Good Afternoon';
  if (hour >= 17) greeting = 'Good Evening';

  return (
    <div className="flex flex-col gap-1">
      <motion.div 
        initial={{ opacity: 0, y: 5 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="flex items-center gap-2"
      >
        <span className="h-px w-8 bg-centri-500/50"></span>
        <span className="text-xs font-bold uppercase tracking-[0.2em] text-centri-400">System Active</span>
      </motion.div>
      
      <motion.h1 
        initial={{ opacity: 0, filter: 'blur(5px)' }}
        animate={{ opacity: 1, filter: 'blur(0px)' }}
        transition={{ duration: 1, delay: 0.1 }}
        className="text-4xl md:text-5xl font-semibold text-white tracking-tighter"
      >
        {greeting}.
      </motion.h1>
      
      <motion.p 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 0.3 }}
        className="text-slate-400 text-sm md:text-base font-light tracking-wide max-w-md"
      >
        Your operational command center is ready.
      </motion.p>
    </div>
  );
};
