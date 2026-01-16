
// Navigation & Core
export type NavItem = 'guides' | 'chat' | 'support';

// Branding & White Labeling
export interface HelpTopic {
  id: string;
  label: string;
  tags: string[];
  description: string;
}

export interface AgencyConfig {
  id: string;
  name: string;
  logoUrl?: string; // If undefined, show Text
  colors: {
    primary: string; // Hex code, e.g., '#ef4444'
  };
  helpTopics: HelpTopic[];
  enabledGuideAreas: string[]; // List of IDs (e.g. 'contacts-crm') to show
}

// Guides Module
export interface GuideStep {
  title: string;
  content: string; // Markdown supported
}

export interface Guide {
  id: string;
  title: string;
  summary: string;
  tags: string[];
  timeToRead: string;
  videoUrl?: string; // Loom or YouTube embed
  content: string; // Main body content (Markdown)
  relatedGuideIds?: string[];
}

export interface GuideArea {
  id: string;
  title: string;
  iconName: string; // Lucide icon name
  description: string;
  guides: Guide[];
}

// Chat Module
export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: number;
  suggestedActions?: {
    type: 'open_guide' | 'navigate';
    payload: string; // ID or Path
    label: string;
  }[];
}

export interface ChatContext {
  currentPath: string;
  userHistory?: string[];
  ghlData?: AccountMetrics; // Injected GHL Context
}

// Onboarding / Gamification
export interface OnboardingTask {
  id: string;
  title: string;
  description: string;
  guideId?: string; // Opens a specific guide
  actionLabel: string;
  category: 'setup' | 'marketing' | 'operations';
}

// GHL Marketplace / Live Data
export interface IntegrationStatus {
  id: 'stripe' | 'google' | 'facebook' | 'quickbooks';
  name: string;
  connected: boolean;
  lastSync?: string;
}

export interface AccountMetrics {
  // Infrastructure Health (The stuff that causes tickets)
  a2pStatus: 'verified' | 'pending' | 'failed' | 'unregistered';
  emailDnsStatus: 'verified' | 'failed' | 'propagating';
  workflowErrorRate: number; // Percentage of failed workflow executions
  
  // Connection Health
  integrations: IntegrationStatus[];
  
  // System Alerts
  criticalAlerts: string[]; // e.g. "Credit Card Failed", "Twilio Quota Exceeded"
}

// Global State
export interface AppState {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  
  // Agency Config
  agencyConfig: AgencyConfig | null;
  setAgencyConfig: (config: AgencyConfig) => void;

  sidebarOpen: boolean;
  toggleSidebar: () => void;
  mobileMenuOpen: boolean;
  toggleMobileMenu: () => void;
  searchOpen: boolean;
  setSearchOpen: (open: boolean) => void;
  
  // History
  viewedGuides: string[]; 
  markGuideAsViewed: (id: string) => void;

  // Onboarding
  completedTasks: string[];
  toggleTaskCompletion: (taskId: string) => void;
  resetOnboarding: () => void;
}
