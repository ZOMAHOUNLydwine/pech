import React, { useState } from 'react';
import Layout from './components/layout/Layout';
import DashboardPage from './pages/DashboardPage';
import ContentPage from './pages/ContentPage';
import LevelsPage from './pages/LevelsPage';

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

function App() {
  const [activeSection, setActiveSection] = useState('dashboard');

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

export default App;
