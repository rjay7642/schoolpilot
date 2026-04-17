import React, { useEffect, useState } from 'react';
import { useStore } from './store/useStore.js';
import LandingPage from './pages/LandingPage.jsx';
import DashboardLayout from './pages/DashboardLayout.jsx';
import ResultPreviewPage from './pages/ResultPreviewPage.jsx';
import IDPrintPage from './pages/IDPrintPage.jsx';
import PremiumLogo from './components/PremiumLogo.jsx';

function getPage() {
  return window.location.hash.replace('#', '').split('?')[0] || '';
}

export default function App() {
  const { currentUser, initDB } = useStore();
  const [page, setPage] = useState(getPage());
  const [ready, setReady] = useState(false);

  useEffect(() => {
    initDB().then(() => setReady(true));
    const handler = () => setPage(getPage());
    window.addEventListener('hashchange', handler);
    return () => window.removeEventListener('hashchange', handler);
  }, []);

  if (!ready) {
    return (
      <div className="app-loader">
        <div className="app-loader-card">
          <PremiumLogo size="lg" className="app-loader-logo" />
          <h2>Preparing SchoolPilot</h2>
          <p>Loading your local school workspace and saved records.</p>
        </div>
      </div>
    );
  }

  if (page === 'preview') return <ResultPreviewPage />;
  if (page === 'id-print') return <IDPrintPage />;

  return currentUser ? <DashboardLayout /> : <LandingPage />;
}
