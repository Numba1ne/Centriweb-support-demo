/**
 * API Endpoint: Get Content Guides with Inheritance
 * 
 * Route: /api/content/guides?tenantId=xxx&category=getting-started
 * Method: GET
 * 
 * Returns guides with content inheritance:
 * 1. Base content (tenant_id = NULL)
 * 2. Tenant overrides (is_override = true)
 * 3. Tenant custom content (is_override = false)
 */

import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL || '';
const supabaseKey = process.env.VITE_SUPABASE_SERVICE_KEY || process.env.SUPABASE_SERVICE_KEY || '';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { tenantId, category } = req.query;

  if (!supabaseUrl || !supabaseKey) {
    console.error('[API] Missing Supabase credentials');
    return res.status(500).json({ error: 'Server configuration error' });
  }

  try {
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Step 1: Fetch base content (tenant_id IS NULL)
    const { data: baseContent, error: baseError } = await supabase
      .from('content_items')
      .select('*')
      .is('tenant_id', null)
      .eq('published', true)
      .eq('type', 'guide');

    if (baseError) {
      console.error('[API] Error fetching base content:', baseError);
      return res.status(500).json({ error: 'Failed to fetch base content' });
    }

    // Step 2: If tenantId provided, fetch tenant-specific content
    let tenantOverrides: any[] = [];
    let tenantCustom: any[] = [];

    if (tenantId && typeof tenantId === 'string') {
      // Fetch tenant overrides (is_override = true)
      const { data: overrides, error: overridesError } = await supabase
        .from('content_items')
        .select('*')
        .eq('tenant_id', tenantId)
        .eq('is_override', true)
        .eq('published', true)
        .eq('type', 'guide');

      if (!overridesError && overrides) {
        tenantOverrides = overrides;
      }

      // Fetch tenant custom content (is_override = false or NULL)
      const { data: custom, error: customError } = await supabase
        .from('content_items')
        .select('*')
        .eq('tenant_id', tenantId)
        .eq('published', true)
        .eq('type', 'guide')
        .or('is_override.eq.false,is_override.is.null');

      if (!customError && custom) {
        tenantCustom = custom;
      }
    }

    // Step 3: Merge content with inheritance logic
    // Start with base content
    const contentMap = new Map<string, any>();
    
    // Add all base content
    (baseContent || []).forEach((item: any) => {
      const key = `${item.category}:${item.slug}`;
      contentMap.set(key, {
        id: item.id,
        title: item.title,
        summary: item.summary,
        content: item.content,
        category: item.category,
        tags: item.tags || [],
        timeToRead: item.time_to_read,
        videoUrl: item.video_url,
        slug: item.slug,
        type: item.type,
        metadata: item.metadata || {},
      });
    });

    // Apply tenant overrides (replace base content)
    tenantOverrides.forEach((item: any) => {
      const key = `${item.category}:${item.slug}`;
      contentMap.set(key, {
        id: item.id,
        title: item.title,
        summary: item.summary,
        content: item.content,
        category: item.category,
        tags: item.tags || [],
        timeToRead: item.time_to_read,
        videoUrl: item.video_url,
        slug: item.slug,
        type: item.type,
        metadata: item.metadata || {},
        isOverride: true,
        overridesId: item.overrides_id,
      });
    });

    // Add tenant custom content (new content not in base)
    tenantCustom.forEach((item: any) => {
      const key = `${item.category}:${item.slug}`;
      if (!contentMap.has(key)) {
        contentMap.set(key, {
          id: item.id,
          title: item.title,
          summary: item.summary,
          content: item.content,
          category: item.category,
          tags: item.tags || [],
          timeToRead: item.time_to_read,
          videoUrl: item.video_url,
          slug: item.slug,
          type: item.type,
          metadata: item.metadata || {},
          isCustom: true,
        });
      }
    });

    // Convert map to array
    let guides = Array.from(contentMap.values());

    // Filter by category if provided
    if (category && typeof category === 'string') {
      guides = guides.filter((guide) => guide.category === category);
    }

    // Sort by category, then by title
    guides.sort((a, b) => {
      if (a.category !== b.category) {
        return a.category.localeCompare(b.category);
      }
      return a.title.localeCompare(b.title);
    });

    return res.status(200).json(guides);
  } catch (error: any) {
    console.error('[API] Error fetching guides:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

