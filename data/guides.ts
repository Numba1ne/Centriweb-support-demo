
import { GuideArea } from '../types';

// ============================================================================
// CONFIGURATION: DASHBOARD "HOW CAN WE HELP" BUTTONS
// ============================================================================
export const HELP_TOPICS = [
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
];

// ============================================================================
// GUIDE CONTENT (17 CATEGORIES)
// ============================================================================

export const GUIDE_DATA: GuideArea[] = [
  {
    id: 'getting-started',
    title: 'Getting Started',
    iconName: 'Rocket',
    description: 'Account setup, platform basics, and quick start guides.',
    guides: [
      {
        id: 'platform-overview',
        title: 'Platform Overview',
        summary: 'A high-level tour of the CentriWeb dashboard and core features.',
        tags: ['basics', 'dashboard', 'navigation'],
        timeToRead: '5 min',
        content: `# Welcome to CentriWeb\n\nCentriWeb is your all-in-one growth engine. This guide will walk you through the main interface.\n\n## The Dashboard\nThe dashboard is your mission control. Here you can see:\n- **Opportunities:** Total value in your pipeline.\n- **Conversion Rate:** How well you are closing.\n- **Tasks:** What you need to do today.`
      },
      {
        id: 'account-setup',
        title: 'Account Setup Checklist',
        summary: 'Complete these 5 steps to activate your account fully.',
        tags: ['setup', 'billing', 'profile'],
        timeToRead: '10 min',
        content: `# 5 Steps to Success\n\n1. **Connect your Google Calendar** - Sync your appointments.\n2. **Add a Payment Method** - Ensure your subscription is active.\n3. **Verify your Email Domain** - Crucial for deliverability.\n4. **Connect Social Accounts** - Facebook, Instagram, and LinkedIn.\n5. **Download the Mobile App** - Manage leads on the go.`
      }
    ]
  },
  {
    id: 'contacts-crm',
    title: 'Contacts & CRM',
    iconName: 'Users',
    description: 'Contact management, pipelines, opportunities, and smart lists.',
    guides: [
      {
        id: 'managing-contacts',
        title: 'Creating & Managing Contacts',
        summary: 'Learn how to add, edit, and organize your contact database.',
        tags: ['contacts', 'crm', 'lists'],
        timeToRead: '6 min',
        content: `# Managing Contacts\n\nContacts are the heart of your CRM. Learn how to import lists, add tags, and manage custom fields.`
      },
      {
        id: 'smart-lists',
        title: 'Using Smart Lists',
        summary: 'Filter and segment your audience for targeted marketing.',
        tags: ['smart lists', 'filters', 'segments'],
        timeToRead: '8 min',
        content: `# Smart Lists\n\nSmart lists allow you to save filters (e.g., "Leads from Facebook") for quick access and automation triggers.`
      }
    ]
  },
  {
    id: 'conversations',
    title: 'Conversations & Messaging',
    iconName: 'MessageCircle',
    description: 'Email composer, SMS, inbox, and messaging management.',
    guides: [
      {
        id: 'unified-inbox',
        title: 'Using the Unified Inbox',
        summary: 'Manage SMS, Email, Facebook, and IG DMs in one place.',
        tags: ['inbox', 'messaging', 'chat'],
        timeToRead: '5 min',
        content: `# Unified Inbox\n\nStop switching between tabs. Reply to all customer inquiries from a single stream.`
      }
    ]
  },
  {
    id: 'phone-system',
    title: 'Phone System',
    iconName: 'Phone',
    description: 'Calling, phone numbers, voicemail, SMS/MMS, A2P registration.',
    guides: [
      {
        id: 'a2p-registration',
        title: 'A2P 10DLC Registration',
        summary: 'Mandatory registration to ensure your text messages are delivered.',
        tags: ['compliance', 'sms', 'trust center'],
        timeToRead: '15 min',
        content: `# A2P 10DLC\n\nCarriers now require all businesses to register their brand and campaign use cases. Failure to do so will result in blocked messages.`
      }
    ]
  },
  {
    id: 'calendars-booking',
    title: 'Calendars & Booking',
    iconName: 'Calendar',
    description: 'Appointment scheduling, calendar setup, and booking widgets.',
    guides: [
      {
        id: 'calendar-setup',
        title: 'Creating Calendars',
        summary: 'Set up your availability and booking types.',
        tags: ['scheduling', 'appointments', 'round robin'],
        timeToRead: '10 min',
        content: `# Calendar Setup\n\nLearn the difference between Simple Calendars, Round Robin (Team) Calendars, and Class Booking.`
      }
    ]
  },
  {
    id: 'automation-workflows',
    title: 'Automation & Workflows',
    iconName: 'Zap',
    description: 'Workflow builder, triggers, actions, and campaigns.',
    guides: [
      {
        id: 'workflow-basics',
        title: 'Workflow Builder Fundamentals',
        summary: 'Master the trigger-action logic to automate your business.',
        tags: ['automation', 'workflows', 'triggers'],
        timeToRead: '12 min',
        content: `# Workflow Builder\n\nWorkflows are "If This, Then That" engines for your business. \n\n## Triggers\nWhat starts the automation? (e.g. Form Submitted)\n\n## Actions\nWhat happens next? (e.g. Send Email)`
      }
    ]
  },
  {
    id: 'ai-tools',
    title: 'AI Tools',
    iconName: 'Bot',
    description: 'Conversation AI, Workflow AI, prompting, and agents.',
    guides: [
      {
        id: 'conversation-ai',
        title: 'Setting up Conversation AI',
        summary: 'Train your bot to book appointments automatically.',
        tags: ['ai', 'bot', 'booking'],
        timeToRead: '10 min',
        content: `# Conversation AI\n\nConfigure the "Brain" of your bot. Upload your FAQs and set the goal to "Book Appointment".`
      }
    ]
  },
  {
    id: 'websites-funnels',
    title: 'Websites & Funnels',
    iconName: 'Layout',
    description: 'Funnel builder, websites, forms, surveys, and WordPress.',
    guides: [
      {
        id: 'funnel-builder',
        title: 'Using the Funnel Builder',
        summary: 'Create high-converting landing pages in minutes.',
        tags: ['funnels', 'landing pages', 'design'],
        timeToRead: '15 min',
        content: `# Funnel Builder\n\nDrag and drop elements to build your page. Learn how to use Sections, Rows, and Columns.`
      }
    ]
  },
  {
    id: 'email-marketing',
    title: 'Email Marketing',
    iconName: 'Mail',
    description: 'Email campaigns, templates, deliverability, and SMTP.',
    guides: [
      {
        id: 'email-builder',
        title: 'Designing Email Templates',
        summary: 'Create beautiful HTML emails using the drag-and-drop builder.',
        tags: ['email', 'marketing', 'newsletters'],
        timeToRead: '8 min',
        content: `# Email Builder\n\nCreate branded newsletters and automated follow-ups without writing code.`
      }
    ]
  },
  {
    id: 'social-media',
    title: 'Social Media & Marketing',
    iconName: 'Share2',
    description: 'Social planner, ad manager, and content scheduling.',
    guides: [
      {
        id: 'social-planner',
        title: 'Using the Social Planner',
        summary: 'Schedule posts to Facebook, Instagram, LinkedIn, and more.',
        tags: ['social media', 'content', 'scheduling'],
        timeToRead: '6 min',
        content: `# Social Planner\n\nConnect your accounts and schedule a month of content in one sitting.`
      }
    ]
  },
  {
    id: 'integrations',
    title: 'Integrations',
    iconName: 'Plug',
    description: 'Third-party connections, API, Zapier, and Marketplace apps.',
    guides: [
      {
        id: 'stripe-integration',
        title: 'Connecting Stripe',
        summary: 'Accept payments by linking your Stripe account.',
        tags: ['payments', 'stripe', 'setup'],
        timeToRead: '4 min',
        content: `# Connecting Stripe\n\nGo to Settings > Integrations and click "Connect" on the Stripe card.`
      }
    ]
  },
  {
    id: 'reputation-reviews',
    title: 'Reputation & Reviews',
    iconName: 'Star',
    description: 'Review management, reputation monitoring, and review requests.',
    guides: [
      {
        id: 'google-reviews',
        title: 'Automating Review Requests',
        summary: 'Send SMS/Email requests to customers after they purchase.',
        tags: ['reviews', 'reputation', 'google'],
        timeToRead: '5 min',
        content: `# Automating Reviews\n\nBuild a workflow that waits 1 hour after an appointment and asks "How did we do?".`
      }
    ]
  },
  {
    id: 'memberships-communities',
    title: 'Memberships & Communities',
    iconName: 'GraduationCap',
    description: 'Course creation, memberships, community groups, and certificates.',
    guides: [
      {
        id: 'create-course',
        title: 'Creating Your First Course',
        summary: 'Upload videos and organize modules for your students.',
        tags: ['courses', 'membership', 'education'],
        timeToRead: '12 min',
        content: `# Course Creation\n\nLearn how to structure your Product Structure (Categories, Posts, and Sub-categories).`
      }
    ]
  },
  {
    id: 'payments-invoicing',
    title: 'Payments & Invoicing',
    iconName: 'CreditCard',
    description: 'Invoices, products, subscriptions, and e-commerce.',
    guides: [
      {
        id: 'creating-invoices',
        title: 'Sending Invoices',
        summary: 'Create and send professional invoices via SMS or Email.',
        tags: ['invoices', 'payments', 'billing'],
        timeToRead: '5 min',
        content: `# Invoicing\n\nCreate one-time or recurring invoices directly from the Payments tab.`
      }
    ]
  },
  {
    id: 'client-portal',
    title: 'Client Portal',
    iconName: 'Smartphone',
    description: 'Client portal setup, mobile app, SSO, and branding.',
    guides: [
      {
        id: 'portal-setup',
        title: 'Configuring Client Portal',
        summary: 'Give your clients a branded login to access courses and communities.',
        tags: ['portal', 'branding', 'login'],
        timeToRead: '7 min',
        content: `# Client Portal\n\nCustomize the domain and branding for your client-facing login area.`
      }
    ]
  },
  {
    id: 'reporting-analytics',
    title: 'Reporting & Analytics',
    iconName: 'BarChart',
    description: 'Dashboards, attribution, ad reporting, and analytics.',
    guides: [
      {
        id: 'attribution-reporting',
        title: 'Understanding Attribution',
        summary: 'Track where your leads are coming from (Google, Facebook, Direct).',
        tags: ['reporting', 'ads', 'tracking'],
        timeToRead: '8 min',
        content: `# Attribution\n\nLearn the difference between First Click and Last Click attribution models.`
      }
    ]
  },
  {
    id: 'settings-admin',
    title: 'Settings & Administration',
    iconName: 'Settings',
    description: 'Account settings, user management, and permissions.',
    guides: [
      {
        id: 'adding-users',
        title: 'Adding Team Members',
        summary: 'Invite staff and configure their user permissions.',
        tags: ['users', 'team', 'permissions'],
        timeToRead: '4 min',
        content: `# Adding Users\n\nGo to Settings > My Staff to add employees. You can restrict their access to specific features.`
      }
    ]
  }
];
