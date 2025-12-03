/**
 * Dashboard Buttons Component
 * Renders dynamic dashboard buttons from agency.dashboard_buttons
 */

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { SpotlightCard } from '../ui/SpotlightCard';
import * as Icons from 'lucide-react';
import { cn } from '../../lib/utils';

const IconRenderer = ({ name, className }: { name?: string; className?: string }) => {
  if (!name) {
    const DefaultIcon = Icons.Sparkles;
    return <DefaultIcon className={className} />;
  }
  const Icon = (Icons as any)[name] || Icons.Sparkles;
  return <Icon className={className} />;
};

export const DashboardButtons: React.FC = () => {
  const { agency } = useAuth();
  const navigate = useNavigate();

  if (!agency || !agency.dashboard_buttons || agency.dashboard_buttons.length === 0) {
    return null;
  }

  const handleClick = (link: string) => {
    // Handle internal routes vs external URLs
    if (link.startsWith('http://') || link.startsWith('https://')) {
      window.open(link, '_blank', 'noopener,noreferrer');
    } else {
      navigate(link);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
      {agency.dashboard_buttons.map((button, index) => (
        <SpotlightCard
          key={index}
          className="group bg-white dark:bg-dark-card border-slate-200 dark:border-white/5 hover:border-centri-500/50 transition-all cursor-pointer"
          onClick={() => handleClick(button.link)}
        >
          <div className="p-6 flex items-center gap-4">
            <div className="p-3 bg-centri-500/10 dark:bg-centri-500/20 rounded-xl group-hover:bg-centri-500/20 dark:group-hover:bg-centri-500/30 transition-colors">
              <IconRenderer name={button.icon} className="w-6 h-6 text-centri-500" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-slate-900 dark:text-white group-hover:text-centri-600 dark:group-hover:text-centri-400 transition-colors">
                {button.label}
              </h3>
            </div>
          </div>
        </SpotlightCard>
      ))}
    </div>
  );
};

