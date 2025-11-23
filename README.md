
# CentriWeb Support OS 🚀

**The Enterprise-Grade, White-Label Support Portal for GoHighLevel Agencies.**

This application is designed to be embedded directly into GoHighLevel (GHL) as a Custom Menu Link. It dynamically rebrands itself based on the Agency accessing it, providing a seamless "Native App" experience.

---

## ⚡️ Quick Start (Local Development)

1.  **Install Dependencies**
    ```bash
    npm install
    ```

2.  **Start the Dev Server**
    ```bash
    npm run dev
    ```

3.  **Test White-Labeling**
    Open the URL with a mock location ID to see the branding change:
    - Default: `http://localhost:5173`
    - Red Brand: `http://localhost:5173/?location_id=red-account-123`

---

## 🏗️ Architecture Overview

The app runs as a **Single Page Application (SPA)** on Vercel.

1.  **Frontend:** React 19 + TypeScript + Tailwind.
2.  **Backend (Config):** Supabase (PostgreSQL). Stores agency settings (Colors, Logo, Help Topics).
3.  **Automation:** n8n. Listens for new GHL signups and populates Supabase.
4.  **Context:** GoHighLevel Custom Menu Link. Passes `location_id` via URL parameters.

---

## 🗄️ Step 1: Supabase Setup (The Database)

You need a database to store the configuration for each agency.

1.  Create a new project at [Supabase.com](https://supabase.com).
2.  Go to the **SQL Editor** and run this query to create the table:

```sql
-- Create the Agencies Table
create table public.agencies (
  location_id text primary key, -- The GHL Sub-Account ID (or Agency ID)
  name text not null,
  logo_url text,
  primary_color text default '#0ea5e9',
  
  -- JSON configuration for the "I'm trying to..." buttons
  help_topics jsonb default '[
    {"id": "leads", "label": "Getting Leads", "tags": ["marketing"], "description": "Ads & Funnels"},
    {"id": "crm", "label": "CRM Basics", "tags": ["contacts"], "description": "Manage Lists"}
  ]'::jsonb,

  -- Array of IDs for enabled guide categories (to hide features they don't have)
  enabled_guide_areas text[] default array[
    'getting-started', 'contacts-crm', 'conversations', 'phone-system', 
    'calendars-booking', 'automation-workflows', 'websites-funnels'
  ]
);

-- Enable Row Level Security (Public Read Access)
alter table public.agencies enable row level security;

create policy "Allow public read access"
on public.agencies for select
to anon
using (true);
```

3.  **Insert Dummy Data:**
    Go to the Table Editor and add a row with:
    *   `location_id`: `red-account-123` (or your real GHL location ID)
    *   `name`: `Your Agency Name`
    *   `primary_color`: `#ef4444`

---

## 🤖 Step 2: n8n Automation (The Onboarding Engine)

When a new Agency signs up with you, you don't want to manually edit the database. Use n8n to automate this.

**The Workflow:**
1.  **Trigger:** GHL Webhook (Event: `Form Submitted` or `Contact Created` on your signup funnel).
2.  **Action:** HTTP Request (Supabase API).

**n8n HTTP Request Settings:**
*   **Method:** POST
*   **URL:** `https://<YOUR_PROJECT_REF>.supabase.co/rest/v1/agencies`
*   **Headers:**
    *   `apikey`: `<YOUR_SUPABASE_ANON_KEY>`
    *   `Authorization`: `Bearer <YOUR_SUPABASE_ANON_KEY>`
    *   `Content-Type`: `application/json`
    *   `Prefer`: `resolution=merge-duplicates` (Upsert)
*   **Body (JSON):**
    ```json
    {
      "location_id": "{{ $json.contact.location_id }}",
      "name": "{{ $json.contact.company_name }}",
      "logo_url": "{{ $json.contact.custom_logo_url }}",
      "primary_color": "{{ $json.contact.custom_color_hex }}"
    }
    ```

---

## 🔌 Step 3: Connect Code to Supabase

Currently, `services/agency.ts` uses mock data. You need to connect it to your real Supabase instance.

1.  **Install Supabase Client:**
    ```bash
    npm install @supabase/supabase-js
    ```

2.  **Create Environment Variables:**
    Create a `.env` file in the root:
    ```env
    VITE_SUPABASE_URL=https://your-project.supabase.co
    VITE_SUPABASE_KEY=your-anon-key
    ```

3.  **Update `services/agency.ts`:**
    Replace the entire file content with this:

    ```typescript
    import { createClient } from '@supabase/supabase-js';
    import { AgencyConfig } from '../types';

    // Initialize Supabase
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    const supabaseKey = import.meta.env.VITE_SUPABASE_KEY;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const DEFAULT_CONFIG: AgencyConfig = {
      id: 'default',
      name: 'CentriWeb',
      colors: { primary: '#0ea5e9' },
      helpTopics: [], // ... fill default topics
      enabledGuideAreas: [] // ... fill default areas
    };

    export const fetchAgencyConfig = async (locationId?: string): Promise<AgencyConfig> => {
      if (!locationId) return DEFAULT_CONFIG;

      try {
        const { data, error } = await supabase
          .from('agencies')
          .select('*')
          .eq('location_id', locationId)
          .single();

        if (error || !data) {
          console.warn('Agency not found, using default.');
          return DEFAULT_CONFIG;
        }

        return {
          id: data.location_id,
          name: data.name,
          logoUrl: data.logo_url,
          colors: {
            primary: data.primary_color || '#0ea5e9'
          },
          helpTopics: data.help_topics || DEFAULT_CONFIG.helpTopics,
          enabledGuideAreas: data.enabled_guide_areas || DEFAULT_CONFIG.enabledGuideAreas
        };
      } catch (e) {
        console.error('Failed to fetch agency config', e);
        return DEFAULT_CONFIG;
      }
    };

    export const hexToRgb = (hex: string) => {
      const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
      return result ? 
        `${parseInt(result[1], 16)} ${parseInt(result[2], 16)} ${parseInt(result[3], 16)}` 
        : '14 165 233';
    };
    ```

---

## 🚀 Step 4: Deployment (Vercel)

1.  Push this code to a GitHub repository.
2.  Go to **Vercel** -> Add New Project -> Import from GitHub.
3.  In Vercel Settings, add your Environment Variables (`VITE_SUPABASE_URL`, etc.).
4.  Deploy! You will get a URL like `https://centriweb-support.vercel.app`.

---

## 🔗 Step 5: Embed in GoHighLevel

This is how you distribute it to agencies.

1.  **Go to Agency View** -> Settings -> Custom Menu Link.
2.  **Create New Link:**
    *   **Icon:** Question Mark or Life Ring.
    *   **Link Title:** Support Portal (or "Help Center").
    *   **URL:** `https://your-vercel-app.app/?location_id={{location.id}}`
    *   **Open in:** iFrame (Inside GHL).
    *   **Show to:** All Accounts (or select specific ones).

**Why `{{location.id}}`?**
GHL automatically replaces this tag with the actual Sub-Account ID (e.g., `red-account-123`). Your React app reads this ID from the URL, queries Supabase, and paints the interface Red automatically.

