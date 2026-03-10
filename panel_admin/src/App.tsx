import React, { useState } from 'react';
import Layout from './components/layout/Layout';
import DashboardPage from './pages/DashboardPage';
import ContentPage from './pages/ContentPage';
import LevelsPage from './pages/LevelsPage';
import { AuthProvider, useAuth } from './context/AuthContext';
import LoginPage from './pages/LoginPage';

// Placeholder components for other sections
const UsersPage = () => (
  <div className="p-8 bg-white rounded-3xl border border-earth-100 shadow-card">
    <h2 className="text-2xl font-bold text-earth-900 uppercase tracking-tight">Gestion des Utilisateurs</h2>
    <p className="text-earth-500 mt-2">Cette section est en cours de développement.</p>
  </div>
);

const StatsPage = () => (
  <div className="p-8 bg-white rounded-3xl border border-earth-100 shadow-card">
    <h2 className="text-2xl font-bold text-earth-900 uppercase tracking-tight">Analyses & Statistiques</h2>
    <p className="text-earth-500 mt-2">Les graphiques avancés seront disponibles ici.</p>
  </div>
);

const MessagesPage = () => (
  <div className="p-8 bg-white rounded-3xl border border-earth-100 shadow-card">
    <h2 className="text-2xl font-bold text-earth-900 uppercase tracking-tight">Centre de Messages</h2>
    <p className="text-earth-500 mt-2">Consultez et répondez aux messages des utilisateurs.</p>
  </div>
);

const SettingsPage = () => (
  <div className="p-8 bg-white rounded-3xl border border-earth-100 shadow-card">
    <h2 className="text-2xl font-bold text-earth-900 uppercase tracking-tight">Paramètres du Système</h2>
    <p className="text-earth-500 mt-2">Configurez les options de votre plateforme.</p>
  </div>
);

function AppContent() {
  const { isAuthenticated, isLoading } = useAuth();
  const [activeSection, setActiveSection] = useState('dashboard');

  if (isLoading) {
    return (
      <div className="min-h-screen bg-earth-50 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-benin-green border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <LoginPage />;
  }

  const renderContent = () => {
    switch (activeSection) {
      case 'dashboard':
        return <DashboardPage />;
      case 'courses':
        return <ContentPage />;
      case 'levels':
        return <LevelsPage />;
      case 'users':
        return <UsersPage />;
      case 'stats':
        return <StatsPage />;
      case 'messages':
        return <MessagesPage />;
      case 'settings':
        return <SettingsPage />;
      default:
        return <DashboardPage />;
    }
  };

  return (
    <Layout activeSection={activeSection} setActiveSection={setActiveSection}>
      {renderContent()}
    </Layout>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
