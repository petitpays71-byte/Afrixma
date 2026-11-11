/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';
import { OfflineIndicator } from './components/common/OfflineIndicator';
import { AuthModal } from './components/auth/AuthModal';
import { PaymentModal } from './components/payment/PaymentModal';
import { NotificationDrawer } from './components/notifications/NotificationDrawer';
import { CartDrawer } from './components/cart/CartDrawer';
import { TestRunnerModal } from './components/qa/TestRunnerModal';

import { HomeView } from './views/HomeView';
import { AcademyView } from './views/AcademyView';
import { MarketplaceView } from './views/MarketplaceView';
import { BooksView } from './views/BooksView';
import { AppsView } from './views/AppsView';
import { CryptoView } from './views/CryptoView';
import { VPNView } from './views/VPNView';
import { CommunityView } from './views/CommunityView';
import { NewsView } from './views/NewsView';
import { DashboardView } from './views/DashboardView';
import { AdminView } from './views/AdminView';

const AppContent: React.FC = () => {
  const { activeView } = useApp();

  const renderView = () => {
    switch (activeView) {
      case 'home':
        return <HomeView />;
      case 'academy':
        return <AcademyView />;
      case 'marketplace':
        return <MarketplaceView />;
      case 'books':
        return <BooksView />;
      case 'apps':
        return <AppsView />;
      case 'crypto':
        return <CryptoView />;
      case 'vpn':
        return <VPNView />;
      case 'community':
        return <CommunityView />;
      case 'news':
        return <NewsView />;
      case 'dashboard':
        return <DashboardView />;
      case 'admin':
        return <AdminView />;
      default:
        return <HomeView />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#080E21] text-slate-100 selection:bg-blue-600 selection:text-white">
      <Navbar />
      <OfflineIndicator />

      {/* Main View Container */}
      <main className="flex-1 animate-in fade-in duration-300">
        {renderView()}
      </main>

      <Footer />

      {/* Global Interactive Modals & Drawers */}
      <AuthModal />
      <PaymentModal />
      <NotificationDrawer />
      <CartDrawer />
      <TestRunnerModal />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
