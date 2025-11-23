
import React, { useEffect, useState } from 'react';
import { HashRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { Header } from './components/Layout/Header';
import { CommandMenu } from './components/Search/CommandMenu';
import { DashboardPage } from './pages/DashboardPage';
import { GuidesPage } from './pages/GuidesPage';
import { ChatPage } from './pages/ChatPage';
import { SupportPage } from './pages/SupportPage';
import { PageTransition } from './components/Layout/PageTransition';
import { ChatWidget } from './components/Chat/ChatWidget';
import { useStore } from './store/useStore';
import { fetchAgencyConfig, hexToRgb } from './services/agency';
import { Loader2 } from 'lucide-react';
import { ErrorBoundary } from './components/ui/ErrorBoundary';

const AnimatedRoutes = () => {
  const location = useLocation();
  
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname.split('/')[1]}>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/guides/*" element={<GuidesPage />} />
        <Route path="/chat" element={
          <PageTransition>
            <ChatPage />
          </PageTransition>
        } />
        <Route path="/support" element={
          <PageTransition>
            <SupportPage />
          </PageTransition>
        } />
      </Routes>
    </AnimatePresence>
  );
};

const Layout = () => {
  const { theme, agencyConfig } = useStore();

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(theme);
  }, [theme]);

  // Inject Dynamic Brand Colors
  useEffect(() => {
    if (agencyConfig) {
      const rgb = hexToRgb(agencyConfig.colors.primary);
      document.documentElement.style.setProperty('--primary-500', rgb);
      document.title = `${agencyConfig.name} Support OS`;
    }
  }, [agencyConfig]);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-dark-bg text-slate-900 dark:text-slate-200 flex flex-col font-sans selection:bg-centri-500 selection:text-white overflow-x-hidden transition-colors duration-500">
      {/* Film Noise Overlay */}
      <div className="bg-noise mix-blend-overlay opacity-50 dark:opacity-100" />
      
      {/* Ambient Background */}
      <div className="aurora-bg opacity-50 dark:opacity-100" />
      
      <Header />
      
      <main className="flex-1 flex flex-col w-full max-w-[1600px] mx-auto relative z-10">
        <div className="flex-1 p-4 sm:p-6 lg:p-8">
          <ErrorBoundary>
            <AnimatedRoutes />
          </ErrorBoundary>
        </div>
      </main>

      <ChatWidget />
      <CommandMenu />
    </div>
  );
};

const App = () => {
  const { setAgencyConfig } = useStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. Check for GHL Context (location_id) in URL params
    // GHL Custom Menu Links usually append ?location_id=xxx&session_key=yyy
    const params = new URLSearchParams(window.location.search);
    const locationId = params.get('location_id') || undefined;

    // 2. Fetch Config for this specific location/agency
    fetchAgencyConfig(locationId).then(config => {
      setAgencyConfig(config);
      setLoading(false);
    });
  }, [setAgencyConfig]);

  if (loading) {
    return (
      <div className="h-screen w-screen bg-slate-50 dark:bg-dark-bg flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-centri-500" />
      </div>
    );
  }

  return (
    <HashRouter>
      <Layout />
    </HashRouter>
  );
};

export default App;
