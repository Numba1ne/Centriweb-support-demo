
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { SpotlightCard } from '../ui/SpotlightCard';
import { Wrench, ExternalLink } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { cn } from '../../lib/utils';
import * as Icons from 'lucide-react';

const IconRenderer = ({ name, className }: { name?: string; className?: string }) => {
  if (!name) {
    const DefaultIcon = Icons.Link2;
    return <DefaultIcon className={className} />;
  }
  const Icon = (Icons as any)[name] || Icons.Link2;
  return <Icon className={className} />;
};

export const AccountInsights: React.FC = () => {
  const { agency } = useAuth();
  const navigate = useNavigate();

  // Default demo buttons if agency doesn't have dashboard_buttons configured
  const defaultButtons = [
    {
      label: 'Google Calendar',
      icon: 'Calendar',
      link: 'https://app.gohighlevel.com/integrations/google-calendar',
      description: 'Manage your appointment calendar settings',
    },
    {
      label: 'Stripe',
      icon: 'CreditCard',
      link: 'https://app.gohighlevel.com/integrations/stripe',
      description: 'Payment processing and invoicing',
    },
    {
      label: 'Facebook/IG',
      icon: 'Facebook',
      link: 'https://app.gohighlevel.com/integrations/facebook',
      description: 'Social media integrations and messaging',
    },
    {
      label: 'QuickBooks',
      icon: 'FileText',
      link: 'https://app.gohighlevel.com/integrations/quickbooks',
      description: 'Accounting and financial tracking',
    },
    {
      label: 'Review Widgets',
      icon: 'Star',
      link: 'https://app.gohighlevel.com/reputation/reviews',
      description: 'Reputation management and reviews',
    },
  ];

  const buttons = agency?.dashboard_buttons && agency.dashboard_buttons.length > 0
    ? agency.dashboard_buttons
    : defaultButtons;

  const handleClick = (link: string) => {
    // Handle internal routes vs external URLs
    if (link.startsWith('http://') || link.startsWith('https://')) {
      window.open(link, '_blank', 'noopener,noreferrer');
    } else {
      navigate(link);
    }
  };

  return (
    <SpotlightCard className="h-full bg-slate-900/30 border-white/5 overflow-hidden flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-white/5 bg-slate-900/50">
        <div className="flex items-center gap-2 mb-2">
          <Wrench className="w-5 h-5 text-centri-400" />
          <h3 className="font-bold text-white tracking-tight">Connections & Shortcuts</h3>
        </div>
        <p className="text-xs text-slate-400 ml-7">Quick links to manage your GoHighLevel settings</p>
      </div>

      {/* Connections List */}
      <div className="flex-1 p-6 overflow-y-auto">
        <div className="space-y-3">
          {buttons.map((button, index) => (
            <div
              key={index}
              onClick={() => handleClick(button.link)}
              className="group flex items-center gap-4 p-4 rounded-lg hover:bg-white/5 transition-all cursor-pointer border border-transparent hover:border-white/5"
            >
              {/* Icon */}
              <div className="flex-shrink-0">
                <div className="p-2 bg-slate-800/50 rounded-lg group-hover:bg-centri-500/10 transition-colors">
                  <IconRenderer name={button.icon} className="w-5 h-5 text-slate-400 group-hover:text-centri-400 transition-colors" />
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-semibold text-slate-200 group-hover:text-white transition-colors mb-1">
                  {button.label}
                </h4>
                {button.description && (
                  <p className="text-xs text-slate-500 line-clamp-1">
                    {button.description}
                  </p>
                )}
              </div>

              {/* External Link Icon */}
              <div className="flex-shrink-0">
                <ExternalLink className="w-4 h-4 text-slate-600 group-hover:text-centri-400 transition-colors" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </SpotlightCard>
  );
};
