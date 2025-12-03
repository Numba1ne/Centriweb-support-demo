# How to Find Your Supabase API Keys

## Step-by-Step Guide

1. **Go to Supabase Dashboard**
   - Visit: https://app.supabase.com
   - Select your project: `msveowiujkbzsnavkfyz`

2. **Navigate to API Settings**
   - Click **Settings** (gear icon) in the left sidebar
   - Click **API** in the settings menu

3. **Find These Three Values:**

   ### a) Project URL
   - Look for **"Project URL"** or **"API URL"**
   - Should be: `https://msveowiujkbzsnavkfyz.supabase.co`
   - Copy this value

   ### b) anon public key
   - Look for **"anon public"** or **"Project API keys"** section
   - There should be a long token that starts with `eyJ...`
   - This is safe to use in frontend code
   - Click the **eye icon** or **"Reveal"** button if it's hidden
   - Copy the entire token

   ### c) service_role key
   - Look for **"service_role"** key (usually below anon key)
   - Also starts with `eyJ...`
   - ⚠️ **WARNING**: This key bypasses Row Level Security - keep it secret!
   - Only use in backend/serverless functions
   - Click **"Reveal"** if hidden
   - Copy the entire token

## What They Look Like

The keys should look like this (much longer in reality):

```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1zdmVvd2l1amtiem5hdmtmeXoiLCJyb2xlIjoiYW5vbiIsImlhdCI6MTY5ODc2NTIwMCwiZXhwIjo...
```

## Alternative: If You See Different Format

If your keys look like:
- `sb_publishable_...` 
- `sb_secret_...`

These might be from a newer Supabase version. Try them - they might work! But the standard JWT format (`eyJ...`) is what most Supabase clients expect.

## Once You Have Them

Share them with me and I'll:
1. Set up the `.env.local` file
2. Test the connection
3. Check your database schema
4. Adapt the code to work with your existing tables

## Security Note

- ✅ **anon key**: Safe to share (used in frontend)
- ⚠️ **service_role key**: Keep secret! Only share if you trust me, or I can guide you to set it up yourself

