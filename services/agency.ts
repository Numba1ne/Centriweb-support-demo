
import { AgencyConfig } from '../types';

// ============================================================================
// AGENCY CONFIGURATION SERVICE
// ============================================================================

const DEFAULT_ENABLED_AREAS = [
  'getting-started',
  'contacts-crm',
  'conversations',
  'phone-system',
  'calendars-booking',
  'automation-workflows',
  'ai-tools',
  'websites-funnels',
  'email-marketing',
  'social-media',
  'integrations',
  'reputation-reviews',
  'memberships-communities',
  'payments-invoicing',
  'client-portal',
  'reporting-analytics',
  'settings-admin'
];

const DEFAULT_CONFIG: AgencyConfig = {
  id: 'centriweb-default',
  name: 'CentriWeb',
  colors: {
    primary: '#0ea5e9', // Sky Blue
  },
  helpTopics: [
    { 
      id: 'leads', 
      label: 'Getting More Leads', 
      tags: ['marketing', 'forms', 'facebook'],
      description: 'Forms, funnels, and ad integration'
    },
    { 
      id: 'payments', 
      label: 'Collecting Payments', 
      tags: ['stripe', 'products', 'invoices'],
      description: 'Invoicing and payment gateways'
    },
    { 
      id: 'calendar', 
      label: 'Fixing my Calendar', 
      tags: ['calendars', 'appointments', 'sync'],
      description: 'Availability and sync issues'
    },
    { 
      id: 'automation', 
      label: 'Automating Emails', 
      tags: ['workflows', 'campaigns', 'triggers'],
      description: 'Workflows and auto-responders'
    },
    { 
      id: 'crm', 
      label: 'Managing Contacts', 
      tags: ['contacts', 'smart lists', 'import'],
      description: 'Lists, tags, and imports'
    },
  ],
  enabledGuideAreas: DEFAULT_ENABLED_AREAS
};

const MOCK_AGENCY_RED: AgencyConfig = {
  id: 'agency-red',
  name: 'RedRocket Marketing',
  colors: {
    primary: '#ef4444', // Red
  },
  helpTopics: [
    { 
        id: 'seo', 
        label: 'Improving SEO', 
        tags: ['marketing', 'sites'],
        description: 'Ranking higher on Google'
    },
    { 
        id: 'reputation', 
        label: 'Getting Reviews', 
        tags: ['reputation', 'marketing'],
        description: 'Managing Google Reviews'
    },
  ],
  // RedRocket doesn't offer AI or Memberships
  enabledGuideAreas: DEFAULT_ENABLED_AREAS.filter(area => 
    area !== 'ai-tools' && area !== 'memberships-communities'
  )
};

// Now accepts an optional locationId (Sub-Account ID)
export const fetchAgencyConfig = async (locationId?: string): Promise<AgencyConfig> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // Logic: In a real app, you would send the `locationId` to your backend.
      // The backend looks up which Agency owns that location and returns the branding.
      
      // Simulation:
      // If we see a specific location ID (e.g. from the URL params), we could switch configs.
      // Or check the URL query params as before.
      
      const isRed = window.location.hash.includes('agency=red') || locationId === 'red-account-123';
      
      if (isRed) resolve(MOCK_AGENCY_RED);
      
      resolve(DEFAULT_CONFIG);
    }, 100);
  });
};

export const hexToRgb = (hex: string) => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? 
    `${parseInt(result[1], 16)} ${parseInt(result[2], 16)} ${parseInt(result[3], 16)}` 
    : '14 165 233';
};
