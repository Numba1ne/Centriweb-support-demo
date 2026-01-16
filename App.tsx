
import React, { useEffect } from 'react';
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
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { hexToRgb } from './lib/utils';
import { Loader2, AlertCircle } from 'lucide-react';
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
  const { theme } = useStore();
  const { agency, isLoading, error } = useAuth();

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(theme);
  }, [theme]);

  // Inject Dynamic Brand Colors from agency branding_config
  useEffect(() => {
    if (agency?.branding_config) {
      const primaryColor = agency.branding_config.primaryColor || '#0ea5e9';
      const rgb = hexToRgb(primaryColor);
      document.documentElement.style.setProperty('--primary-500', rgb);
      
      const companyName = agency.branding_config.companyName || agency.name || 'Support OS';
      document.title = `${companyName} Support OS`;
    }
  }, [agency]);

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

const AppContent = () => {
  const { isLoading, error } = useAuth();

  if (isLoading) {
    return (
      <div className="h-screen w-screen bg-slate-50 dark:bg-dark-bg flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-centri-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-screen w-screen bg-slate-50 dark:bg-dark-bg flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Authentication Failed</h2>
          <p className="text-slate-600 dark:text-slate-400">{error}</p>
        </div>
      </div>
    );
  }

  return <Layout />;
};

const App = () => {
  return (
    <HashRouter>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </HashRouter>
  );
};

export default App;
