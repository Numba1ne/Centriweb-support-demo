/**
 * Central type exports
 */

// Re-export everything from guides
export * from './guides';
export * from './auth';

// Create a Guide alias for GuideDisplay for backward compatibility
export type { GuideDisplay as Guide } from './guides';
