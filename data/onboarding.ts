
import { OnboardingTask } from '../types';

export const ONBOARDING_TASKS: OnboardingTask[] = [
  {
    id: 'setup-profile',
    title: 'Secure Your Account',
    description: 'Setup 2FA and update your business profile information.',
    category: 'setup',
    actionLabel: 'Go to Settings',
    guideId: 'account-setup'
  },
  {
    id: 'connect-calendar',
    title: 'Connect Your Calendar',
    description: 'Sync Google or Outlook to start accepting bookings.',
    category: 'operations',
    actionLabel: 'Sync Now',
    guideId: 'getting-started' // Fallback
  },
  {
    id: 'verify-domain',
    title: 'Verify Email Domain',
    description: 'Essential for email deliverability and avoiding spam folders.',
    category: 'setup',
    actionLabel: 'Verify Domain',
    guideId: 'account-setup'
  },
  {
    id: 'first-contact',
    title: 'Upload Contacts',
    description: 'Import your existing CSV list to the CRM.',
    category: 'marketing',
    actionLabel: 'Import CSV',
    guideId: 'platform-overview'
  },
  {
    id: 'get-reviews',
    title: 'Send Review Request',
    description: 'Generate your first Google Review using the reputation manager.',
    category: 'marketing',
    actionLabel: 'Get Reviews',
    guideId: 'platform-overview'
  }
];
