# CentriWeb Support OS - Demo Model

> **Single-Tenant Demo** - A self-contained, production-ready demonstration of the CentriWeb Support OS platform.

---

## 🎯 Overview

This is a **DEMO MODEL** repository showcasing the CentriWeb Support OS - a comprehensive support platform built on GoHighLevel with:

- 📚 **Help Center / Guides** - 200+ step-by-step tutorials
- 🤖 **AI Assistant** - Intelligent chat with context-aware responses
- 🎫 **Support Tickets** - Integrated GoHighLevel form submission
- 📊 **Dashboard** - User activity tracking and quick actions
- 🎨 **Premium UI** - Dark/light mode with smooth transitions
- 🔊 **Voice Input** - Web Speech API integration

---

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

The app will be available at:
- **Dev**: http://localhost:3000
- **Preview**: http://localhost:4173

---

## 📁 Project Structure

```
centriweb-support-demo/
├── components/          # React components
│   ├── Chat/           # AI chat interface & voice input
│   ├── Guide/          # Guide viewer & related guides
│   ├── Layout/         # Sidebar navigation
│   ├── Search/         # Command menu (⌘K)
│   └── ui/             # Reusable UI components
├── pages/              # Page components
│   ├── DashboardPage.tsx
│   ├── GuidesPage.tsx
│   ├── ChatPage.tsx
│   └── SupportPage.tsx
├── data/               # Static demo data
│   ├── guides.ts       # 200+ guide articles
│   └── badges.ts       # Achievement badges
├── services/           # Business logic
│   ├── chatService.ts  # AI chat simulation
│   ├── contentService.ts
│   └── whisperService.ts
├── lib/                # Utilities
│   ├── tenant-loader.ts
│   ├── analytics.ts
│   └── utils.ts
├── contexts/           # React context providers
│   └── TenantContext.tsx
├── types/              # TypeScript definitions
│   └── tenant.ts       # Demo tenant config
└── api/                # API routes (not used in demo)
```

---

## 🎨 Demo Features

### ✅ Working Features

| Feature | Status | Notes |
|---------|--------|-------|
| **Dashboard** | ✅ Working | Shows stats, recent guides, quick actions |
| **Help Center** | ✅ Working | 200+ guides across 10+ categories |
| **AI Chat** | ✅ Working | Simulated AI responses with actions |
| **Voice Input** | ✅ Working | Web Speech API (Chrome/Edge) |
| **Support Form** | ✅ Working | Embedded GHL form |
| **Search (⌘K)** | ✅ Working | Fuzzy search across all guides |
| **Dark/Light Mode** | ✅ Working | Persistent theme toggle |
| **Responsive UI** | ✅ Working | Mobile, tablet, desktop |

### 🚧 Stubbed/Simulated (for Demo)

- **Backend APIs** - All API calls fail gracefully and fall back to static data
- **Supabase** - Not connected; uses local data instead
- **Analytics** - Events tracked but not persisted
- **User Auth** - Single anonymous session
- **Multi-tenancy** - Hard-coded to "centriweb" tenant

---

## 🔧 Configuration

### Demo Tenant Config

The demo uses a hard-coded tenant configuration in `types/tenant.ts`:

```typescript
{
  id: 'centriweb',
  slug: 'centriweb',
  domain: 'localhost',
  plan: 'pro',
  branding: {
    companyName: 'CentriWeb',
    primaryColor: '#1275FF',
    logo: '/logo.png'
  },
  features: {
    guides: true,
    aiChat: true,
    analytics: true,
    voiceInput: true,
    badges: false,        // Disabled for demo
    gamification: false   // Disabled for demo
  }
}
```

### Environment Variables

See `.env` file:

```bash
VITE_DEMO_MODE=true
VITE_TENANT_ID=centriweb
VITE_TENANT_SLUG=centriweb
```

---

## 📦 Deployment

### Vercel (Recommended)

This app is optimized for Vercel deployment:

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

**Configuration:**
- Framework: Vite
- Build Command: `npm run build`
- Output Directory: `dist`
- Install Command: `npm install`

### Other Platforms

The app is a static SPA and can be deployed to:
- Netlify
- Cloudflare Pages
- AWS S3 + CloudFront
- GitHub Pages

Just build and deploy the `dist/` folder.

---

## 🎓 Content Management

### Adding Guides

Edit `data/guides.ts`:

```typescript
{
  id: 'my-new-guide',
  title: 'My New Guide',
  summary: 'Quick overview',
  tags: ['tag1', 'tag2'],
  timeToRead: '5 min',
  content: `
    # Guide Title

    Your markdown content here...
  `,
  relatedGuideIds: ['other-guide-id']
}
```

### GHL Form Integration

Update the support form in `pages/SupportPage.tsx`:

```typescript
<iframe
  src="https://link.centriweb.com/widget/form/YOUR_FORM_ID"
  // ... other props
/>
```

---

## 🧪 Testing

### Manual Testing Checklist

- [ ] Dashboard loads with stats
- [ ] Guides page shows categories
- [ ] Individual guide pages render markdown
- [ ] AI chat responds to messages
- [ ] Voice input works (Chrome/Edge)
- [ ] Support form loads correctly
- [ ] Search (⌘K) finds guides
- [ ] Dark/light mode toggle works
- [ ] Mobile responsive layout
- [ ] Demo indicator shows in bottom right

### Run Tests

```bash
# Build test
npm run build

# Preview build
npm run preview
```

---

## 🔐 Security Notes

This is a **DEMO** application. For production:

1. **Never commit** real API keys or secrets
2. **Enable authentication** for protected routes
3. **Add rate limiting** to prevent abuse
4. **Sanitize user input** before rendering
5. **Enable CSP headers** for XSS protection
6. **Use HTTPS** in production

---

## 🐛 Troubleshooting

### Build Warnings

**"Some chunks are larger than 500 kB"**
- This is expected for the demo
- For production, implement code splitting:
  ```typescript
  const ChatPage = lazy(() => import('./pages/ChatPage'));
  ```

### Voice Input Not Working

- Requires **HTTPS** or **localhost**
- Only works in **Chrome** and **Edge**
- Check browser microphone permissions

### GHL Form Not Loading

- Check iframe `src` URL is correct
- Verify CORS settings in GHL
- Check browser console for errors

---

## 📚 Tech Stack

- **Framework**: React 19 + TypeScript
- **Build**: Vite 6
- **Routing**: React Router 7
- **Styling**: Tailwind CSS (via CDN)
- **Animations**: Framer Motion
- **State**: Zustand
- **Search**: Fuse.js
- **Icons**: Lucide React

---

## 🎯 Demo vs Production

| Feature | Demo | Production |
|---------|------|------------|
| Tenant Config | Hard-coded | Database |
| Content | Static files | Supabase CMS |
| AI Chat | Simulated | OpenAI API |
| Analytics | Console only | Supabase DB |
| Auth | Anonymous | Multi-user |
| Multi-tenant | Single tenant | Dynamic routing |

---

## 📞 Support

For questions or issues:

- **Email**: support@centriweb.com
- **Website**: [centriweb.com](https://centriweb.com)
- **Demo**: [support.centriweb.com](https://support.centriweb.com) *(coming soon)*

---

## 📄 License

Proprietary - © 2025 CentriWeb. All rights reserved.

---

## ✨ Future Enhancements

Potential features for full production version:

- [ ] Real AI integration (OpenAI/Anthropic)
- [ ] Multi-tenant database (Supabase)
- [ ] User authentication & profiles
- [ ] Advanced analytics & health scoring
- [ ] Gamification & badges system
- [ ] Interactive walkthroughs
- [ ] Video guides
- [ ] Multi-language support
- [ ] Co-browsing for support
- [ ] Integration with GHL API

---

**Made with ❤️ by CentriWeb**
