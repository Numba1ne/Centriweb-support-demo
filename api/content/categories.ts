/**
 * API Endpoint: Get Content Categories with Guides
 * 
 * Route: /api/content/categories?tenantId=xxx
 * Method: GET
 * 
 * Returns categories grouped with their guides (using content inheritance)
 */

import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL || '';
const supabaseKey = process.env.VITE_SUPABASE_SERVICE_KEY || process.env.SUPABASE_SERVICE_KEY || '';

// Category metadata
const CATEGORY_METADATA: Record<string, { title: string; description: string; icon?: string }> = {
  'getting-started': {
    title: 'Getting Started',
    description: 'Essential guides to get up and running quickly',
    icon: 'Rocket',
  },
  'contacts-crm': {
    title: 'Contacts & CRM',
    description: 'Contact management, pipelines, and lead tracking',
    icon: 'Users',
  },
  'automation-workflows': {
    title: 'Automation & Workflows',
    description: 'Create powerful automated sequences',
    icon: 'Zap',
  },
  'calendars-booking': {
    title: 'Calendars & Booking',
    description: 'Schedule appointments and manage availability',
    icon: 'Calendar',
  },
  'troubleshooting': {
    title: 'Troubleshooting',
    description: 'Common issues and solutions',
    icon: 'HelpCircle',
  },
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { tenantId } = req.query;

  if (!supabaseUrl || !supabaseKey) {
    console.error('[API] Missing Supabase credentials');
    return res.status(500).json({ error: 'Server configuration error' });
  }

  try {
    // Fetch guides using the guides endpoint logic
    const guidesResponse = await fetch(
      `${req.headers['x-forwarded-proto'] || 'http'}://${req.headers.host}/api/content/guides${tenantId ? `?tenantId=${tenantId}` : ''}`
    );

    if (!guidesResponse.ok) {
      // Fallback: query directly
      const supabase = createClient(supabaseUrl, supabaseKey);
      const { data: guides } = await supabase
        .from('content_items')
        .select('*')
        .is('tenant_id', null)
        .eq('published', true)
        .eq('type', 'guide');

      // Group by category
      const categoriesMap = new Map<string, any[]>();
      (guides || []).forEach((guide: any) => {
        if (!categoriesMap.has(guide.category)) {
          categoriesMap.set(guide.category, []);
        }
        categoriesMap.get(guide.category)!.push({
          id: guide.id,
          title: guide.title,
          summary: guide.summary,
          slug: guide.slug,
          tags: guide.tags || [],
          timeToRead: guide.time_to_read,
        });
      });

      const categories = Array.from(categoriesMap.entries()).map(([id, guides]) => ({
        id,
        ...(CATEGORY_METADATA[id] || { title: id, description: '' }),
        guides,
      }));

      return res.status(200).json(categories);
    }

    const guides = await guidesResponse.json();

    // Group guides by category
    const categoriesMap = new Map<string, any[]>();
    guides.forEach((guide: any) => {
      if (!categoriesMap.has(guide.category)) {
        categoriesMap.set(guide.category, []);
      }
      categoriesMap.get(guide.category)!.push({
        id: guide.id,
        title: guide.title,
        summary: guide.summary,
        slug: guide.slug,
        tags: guide.tags || [],
        timeToRead: guide.timeToRead,
      });
    });

    // Build categories array with metadata
    const categories = Array.from(categoriesMap.entries()).map(([id, guides]) => ({
      id,
      ...(CATEGORY_METADATA[id] || { title: id, description: '' }),
      guides,
    }));

    // Sort categories
    categories.sort((a, b) => a.title.localeCompare(b.title));

    return res.status(200).json(categories);
  } catch (error: any) {
    console.error('[API] Error fetching categories:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

