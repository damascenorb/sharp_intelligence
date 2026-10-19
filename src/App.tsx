import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { Footer } from './components/Footer';
import { BrandOverviewModal } from './components/BrandOverviewModal';
import { AuthModal } from './components/AuthModal';
import { FloatingWhatsApp } from './components/FloatingWhatsApp';

// Client Portal Views
import { SolutionSelector } from './components/ClientPortal/SolutionSelector';
import { SmartBriefingForm } from './components/ClientPortal/SmartBriefingForm';
import { PainAnalyzerAI } from './components/ClientPortal/PainAnalyzerAI';
import { VisualInspirationAI } from './components/ClientPortal/VisualInspirationAI';
import { CalendarAgenda } from './components/CalendarAgenda';
import { MeetingScheduler } from './components/ClientPortal/MeetingScheduler';
import { ClientApprovalGallery } from './components/ClientPortal/ClientApprovalGallery';
import { EntrepreneurHub } from './components/ClientPortal/EntrepreneurHub';

// Lead Views
import { LeadDashboard } from './components/LeadPortal/LeadDashboard';

// New Executive Platform Views
import { BusinessHealthCheck } from './components/ClientPortal/BusinessHealthCheck';
import { ExecutiveCalculators } from './components/ClientPortal/ExecutiveCalculators';
import { SharpPlatformOverview } from './components/ClientPortal/SharpPlatformOverview';
import { IntelligenceHub } from './components/ClientPortal/IntelligenceHub';
import { ExecutiveCases } from './components/ClientPortal/ExecutiveCases';
import { MarketObservatory } from './components/ClientPortal/MarketObservatory';
import { SharpAIAssistant } from './components/ClientPortal/SharpAIAssistant';
import { DownloadLibrary } from './components/ClientPortal/DownloadLibrary';

// Admin Portal Views
import { LeadPipelineKanban } from './components/AdminPortal/LeadPipelineKanban';
import { ProjectManagementKanban } from './components/AdminPortal/ProjectManagementKanban';
import { ArtLeaderQueue } from './components/AdminPortal/ArtLeaderQueue';
import { StaffAndAccessManagement } from './components/AdminPortal/StaffAndAccessManagement';
import { TeamAndClientChat } from './components/AdminPortal/TeamAndClientChat';
import { SharpInternalTools } from './components/AdminPortal/SharpInternalTools';
import { MethodologyKanban } from './components/AdminPortal/MethodologyKanban';
import { ClientsDirectory } from './components/AdminPortal/ClientsDirectory';
import { MyOperationsDashboard } from './components/AdminPortal/MyOperationsDashboard';
import { DeliveryModelsLibrary } from './components/AdminPortal/DeliveryModelsLibrary';
import { AccountsAndRelationships } from './components/AdminPortal/AccountsAndRelationships';
import { FinancialManagementDashboard } from './components/AdminPortal/FinancialManagementDashboard';

function AppContent() {
  const { userRole, currentUser, activeNavTab, setActiveNavTab } = useApp();
  const activeTab = activeNavTab;
  const setActiveTab = setActiveNavTab;
  const [isBrandModalOpen, setIsBrandModalOpen] = useState<boolean>(false);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-cyan-500 selection:text-white flex flex-col justify-between antialiased">
      
      {/* Top Header */}
      <Header
        onOpenBrandModal={() => setIsBrandModalOpen(true)}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      {/* Main Content Layout */}
      <div className="flex-1 flex flex-col md:flex-row">
        
        {/* Render Left Vertical Sidebar ONLY when logged in (Sharp staff or Client/Lead) */}
        {currentUser && (
          <Sidebar
            activeTab={activeTab}
            setActiveTab={setActiveTab}
          />
        )}

        {/* Main View Area */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-[1280px] mx-auto w-full">
          
          {/* 1. MY OPERATIONS DASHBOARD (ETAPA 12) */}
          {activeTab === 'my_operations' && (
            <MyOperationsDashboard
              onNavigateTab={(tab) => setActiveTab(tab)}
            />
          )}

          {/* LEAD DASHBOARD */}
          {activeTab === 'lead_dashboard' && (
            <LeadDashboard
              onNavigateTab={(tab) => setActiveTab(tab)}
            />
          )}

          {/* ENTREPRENEUR HUB (CLIENT) */}
          {activeTab === 'entrepreneur_hub' && (
            <EntrepreneurHub />
          )}

          {/* SHARP INTERNAL TOOLS */}
          {activeTab === 'sharp_tools' && (
            <SharpInternalTools />
          )}

          {/* 2. SHARP ACCOUNTS AND RELATIONSHIPS (CLIENTES) */}
          {(activeTab === 'clients' || activeTab === 'accounts') && (
            <AccountsAndRelationships />
          )}

          {/* SOLUTIONS & BRIEFING */}
          {activeTab === 'solutions' && (
            <SolutionSelector
              onContinueToBriefing={() => setActiveTab('briefing')}
              onGoToPainAnalyzer={() => setActiveTab('pain_analyzer')}
            />
          )}

          {activeTab === 'briefing' && (
            <SmartBriefingForm
              onBackToSolutions={() => setActiveTab('solutions')}
              onGoToCalendar={() => setActiveTab('calendar')}
            />
          )}

          {/* BUSINESS HEALTH CHECK */}
          {activeTab === 'health_check' && (
            <BusinessHealthCheck
              onGoToCalendarWithData={() => setActiveTab('calendar')}
            />
          )}

          {/* CALCULATORS */}
          {activeTab === 'calculators' && (
            <ExecutiveCalculators
              onGoToDiagnostic={() => setActiveTab('health_check')}
            />
          )}

          {/* PLATAFORMA SHARP OVERVIEW */}
          {activeTab === 'platform' && (
            <SharpPlatformOverview
              onGoToDiagnostic={() => setActiveTab('calendar')}
            />
          )}

          {/* INTELLIGENCE HUB */}
          {activeTab === 'intelligence_hub' && (
            <IntelligenceHub
              onGoToDiagnostic={() => setActiveTab('calendar')}
            />
          )}

          {/* CASES */}
          {activeTab === 'cases' && (
            <ExecutiveCases
              onGoToDiagnostic={() => setActiveTab('calendar')}
            />
          )}

          {/* MARKET OBSERVATORY */}
          {activeTab === 'observatory' && (
            <MarketObservatory
              onGoToDiagnostic={() => setActiveTab('calendar')}
            />
          )}

          {/* AI ASSISTANT */}
          {activeTab === 'ai_assistant' && (
            <SharpAIAssistant
              onGoToDiagnostic={() => setActiveTab('calendar')}
            />
          )}

          {/* DOWNLOADS */}
          {activeTab === 'downloads' && (
            <DownloadLibrary
              onGoToDiagnostic={() => setActiveTab('calendar')}
            />
          )}

          {/* PAIN ANALYZER */}
          {activeTab === 'pain_analyzer' && (
            <PainAnalyzerAI
              onGoToCalendar={() => setActiveTab('calendar')}
            />
          )}

          {/* VISUAL INSPIRATION */}
          {activeTab === 'visual_inspiration' && (
            <VisualInspirationAI />
          )}

          {/* MEETING SCHEDULER / CALENDAR */}
          {activeTab === 'calendar' && (
            currentUser ? <CalendarAgenda /> : <MeetingScheduler />
          )}

          {/* CLIENT APPROVAL GALLERY & PROJECTS (CLIENT) */}
          {activeTab === 'approval_portal' && (
            <ClientApprovalGallery />
          )}

          {/* SHARP CRM PIPELINE */}
          {activeTab === 'crm' && (
            <LeadPipelineKanban />
          )}

          {/* SHARP FINANCIAL DASHBOARD & PRICING */}
          {(activeTab === 'financial' || activeTab === 'pricing') && (
            <FinancialManagementDashboard
              onNavigateTab={(tab) => setActiveTab(tab)}
            />
          )}

          {/* SHARP PROJECTS & POST-SALE (NOW INCLUDES ART QUEUE & METHODOLOGY) */}
          {(activeTab === 'projects' || activeTab === 'art_queue') && (
            <ProjectManagementKanban />
          )}

          {/* TEAM & CLIENT CHAT SYSTEM */}
          {activeTab === 'chat' && (
            <TeamAndClientChat />
          )}

          {/* ACCESS & STAFF MANAGEMENT */}
          {activeTab === 'access_management' && (
            <StaffAndAccessManagement />
          )}

        </main>
      </div>

      {/* Complete Executive Footer */}
      <Footer
        setActiveTab={setActiveTab}
        onOpenBrandModal={() => setIsBrandModalOpen(true)}
      />

      {/* Brand Information Modal */}
      <BrandOverviewModal
        isOpen={isBrandModalOpen}
        onClose={() => setIsBrandModalOpen(false)}
      />

      {/* Login / Auth Modal */}
      <AuthModal />

      {/* Floating WhatsApp Contact Widget (Bottom Left) */}
      <FloatingWhatsApp />

    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
