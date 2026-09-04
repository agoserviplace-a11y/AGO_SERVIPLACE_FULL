import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { Hero } from './components/home/Hero';
import { CategoriesSection } from './components/home/CategoriesSection';
import { FeaturedSpecialists } from './components/home/FeaturedSpecialists';
import { PopularServices } from './components/home/PopularServices';
import { HowItWorks } from './components/home/HowItWorks';
import { SpecialistCTA } from './components/home/SpecialistCTA';

// Explorers & Dashboards
import { ServicesExplorer } from './components/services/ServicesExplorer';
import { RequestsExplorer } from './components/requests/RequestsExplorer';
import { UserDashboard } from './components/dashboard/UserDashboard';

// Modals & Drawers
import { AuthModal } from './components/auth/AuthModal';
import { OnboardingModal } from './components/auth/OnboardingModal';
import { ServiceDetailModal } from './components/services/ServiceDetailModal';
import { SpecialistDetailModal } from './components/specialists/SpecialistDetailModal';
import { NewRequestModal } from './components/requests/NewRequestModal';
import { NewServiceModal } from './components/services/NewServiceModal';
import { SendProposalModal } from './components/proposals/SendProposalModal';
import { ChatDrawer } from './components/chat/ChatDrawer';

// Data & types
import { Service, SpecialistProfile, ServiceRequest, Category, AccountType } from './types';
import { dbService } from './lib/dbService';
import { seedInitialMarketplaceIfNeeded, INITIAL_SPECIALISTS } from './lib/seedMarketplace';
import { INITIAL_CATEGORIES } from './lib/constants';

function MarketplaceApp() {
  const { currentUser, activeMode } = useAuth();

  // Navigation views: 'home' | 'services' | 'requests' | 'dashboard'
  const [currentView, setCurrentView] = useState<'home' | 'services' | 'requests' | 'dashboard'>('home');

  // Core data states
  const [categories, setCategories] = useState<Category[]>(INITIAL_CATEGORIES);
  const [services, setServices] = useState<Service[]>([]);
  const [requests, setRequests] = useState<ServiceRequest[]>([]);
  const [specialists, setSpecialists] = useState<SpecialistProfile[]>(INITIAL_SPECIALISTS);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Modals visibility state
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalTab, setAuthModalTab] = useState<'login' | 'register'>('login');
  const [authModalAccountType, setAuthModalAccountType] = useState<AccountType>('both');

  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const [newRequestModalOpen, setNewRequestModalOpen] = useState(false);
  const [newServiceModalOpen, setNewServiceModalOpen] = useState(false);

  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [selectedSpecialist, setSelectedSpecialist] = useState<SpecialistProfile | null>(null);
  const [proposalRequest, setProposalRequest] = useState<ServiceRequest | null>(null);

  // Chat Drawer State
  const [chatOpen, setChatOpen] = useState(false);
  const [chatTargetUserId, setChatTargetUserId] = useState<string | null>(null);
  const [chatTargetUserName, setChatTargetUserName] = useState<string | null>(null);

  // Initial load
  const loadMarketplaceData = async () => {
    try {
      await seedInitialMarketplaceIfNeeded();
      const [cats, srvs, reqs] = await Promise.all([
        dbService.getCategories(),
        dbService.getServices(),
        dbService.getRequests()
      ]);
      if (cats && cats.length > 0) setCategories(cats);
      if (srvs && srvs.length > 0) setServices(srvs);
      if (reqs && reqs.length > 0) setRequests(reqs);
    } catch (err) {
      console.error('Error initializing marketplace data:', err);
    }
  };

  useEffect(() => {
    loadMarketplaceData();
  }, []);

  // Handlers
  const handleOpenAuth = (
    initialTab: 'login' | 'register' = 'login',
    accountType: AccountType = 'both'
  ) => {
    setAuthModalTab(initialTab);
    setAuthModalAccountType(accountType);
    setAuthModalOpen(true);
  };

  const handleOpenChat = (targetUserId?: string, targetUserName?: string) => {
    if (!currentUser) {
      handleOpenAuth('login');
      return;
    }
    setChatTargetUserId(targetUserId || null);
    setChatTargetUserName(targetUserName || null);
    setChatOpen(true);
  };

  const handleOpenNewRequest = () => {
    if (!currentUser) {
      handleOpenAuth('register', 'requester');
      return;
    }
    setNewRequestModalOpen(true);
  };

  const handleOpenNewService = () => {
    if (!currentUser) {
      handleOpenAuth('register', 'specialist');
      return;
    }
    setNewServiceModalOpen(true);
  };

  const handleOpenSendProposal = (req: ServiceRequest) => {
    if (!currentUser) {
      handleOpenAuth('register', 'specialist');
      return;
    }
    setProposalRequest(req);
  };

  const handleSelectCategoryAndNavigate = (catId: string) => {
    setSelectedCategory(catId);
    setCurrentView('services');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#0A0A0B] text-slate-200 font-sans selection:bg-blue-600 selection:text-white antialiased">

      {/* Top Navigation */}
      <Navbar
        onOpenAuth={handleOpenAuth}
        onOpenNewRequest={handleOpenNewRequest}
        onOpenNewService={handleOpenNewService}
        onOpenChat={() => handleOpenChat()}
        onNavigate={(v) => {
          setCurrentView(v);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        currentView={currentView}
        onOpenProfile={() => setProfileModalOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {currentView === 'home' && (
          <>
            <Hero
              onSearch={(term) => {
                setCurrentView('services');
              }}
              onOpenAuth={handleOpenAuth}
              onNavigate={(v) => {
                setCurrentView(v);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            />

            <CategoriesSection
              categories={categories}
              onSelectCategory={handleSelectCategoryAndNavigate}
            />

            <PopularServices
              services={services}
              onSelectService={(s) => setSelectedService(s)}
              onViewAll={() => {
                setCurrentView('services');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            />

            <FeaturedSpecialists
              specialists={specialists}
              onSelectSpecialist={(spec) => setSelectedSpecialist(spec)}
              onViewAll={() => {
                setCurrentView('services');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            />

            <HowItWorks
              onOpenNewRequest={handleOpenNewRequest}
              onNavigate={(v) => {
                setCurrentView(v);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            />

            <SpecialistCTA
              onOpenRegister={() => handleOpenAuth('register', 'specialist')}
            />
          </>
        )}

        {currentView === 'services' && (
          <ServicesExplorer
            services={services}
            categories={categories}
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
            onSelectService={(s) => setSelectedService(s)}
            onOpenNewService={handleOpenNewService}
          />
        )}

        {currentView === 'requests' && (
          <RequestsExplorer
            requests={requests}
            onOpenNewRequest={handleOpenNewRequest}
            onOpenSendProposal={handleOpenSendProposal}
            onOpenChat={(uid, uname) => handleOpenChat(uid, uname)}
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
          />
        )}

        {currentView === 'dashboard' && (
          <UserDashboard
            onOpenNewRequest={handleOpenNewRequest}
            onOpenNewService={handleOpenNewService}
            onOpenChat={(uid, uname) => handleOpenChat(uid, uname)}
            onNavigate={(v) => {
              setCurrentView(v);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}
      </main>

      {/* Global Modals */}

      {/* Auth Modal */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        initialTab={authModalTab}
        defaultAccountType={authModalAccountType}
        onSuccess={() => {
          loadMarketplaceData();
        }}
      />

      {/* User Onboarding / Profile Modal */}
      <OnboardingModal
        isOpen={profileModalOpen}
        onClose={() => setProfileModalOpen(false)}
      />

      {/* Service Detail Modal */}
      <ServiceDetailModal
        service={selectedService}
        isOpen={Boolean(selectedService)}
        onClose={() => setSelectedService(null)}
        onOpenChat={(specId, specName) => handleOpenChat(specId, specName)}
        onServiceHired={() => {
          loadMarketplaceData();
          setCurrentView('dashboard');
        }}
      />

      {/* Specialist Detail Modal */}
      <SpecialistDetailModal
        specialist={selectedSpecialist}
        isOpen={Boolean(selectedSpecialist)}
        onClose={() => setSelectedSpecialist(null)}
        onOpenChatWithSpecialist={(specId, specName) => handleOpenChat(specId, specName)}
        onOpenNewRequestForSpecialist={(spec) => {
          handleOpenNewRequest();
        }}
      />

      {/* New Request Modal */}
      <NewRequestModal
        isOpen={newRequestModalOpen}
        onClose={() => setNewRequestModalOpen(false)}
        onCreated={() => {
          loadMarketplaceData();
          setCurrentView('requests');
        }}
      />

      {/* New Service Modal */}
      <NewServiceModal
        isOpen={newServiceModalOpen}
        onClose={() => setNewServiceModalOpen(false)}
        onCreated={() => {
          loadMarketplaceData();
          setCurrentView('services');
        }}
      />

      {/* Send Proposal Modal */}
      <SendProposalModal
        request={proposalRequest}
        isOpen={Boolean(proposalRequest)}
        onClose={() => setProposalRequest(null)}
        onProposalSent={() => {
          loadMarketplaceData();
        }}
      />

      {/* Protected Real-time Chat Drawer */}
      <ChatDrawer
        isOpen={chatOpen}
        onClose={() => setChatOpen(false)}
        targetUserId={chatTargetUserId}
        targetUserName={chatTargetUserName}
      />

      {/* Footer */}
      <Footer
        onNavigate={(v) => {
          setCurrentView(v);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenAuth={handleOpenAuth}
      />

    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <MarketplaceApp />
    </AuthProvider>
  );
}
