
import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate, Link, useLocation } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Onboarding from './components/Onboarding';
import Dashboard from './pages/Dashboard';
import BlogCommenter from './pages/BlogCommenter';
import HindiTutor from './pages/HindiTutor';
import ImageTools from './pages/ImageTools';
import SEOAnalyzer from './pages/SEOAnalyzer';
import LogoAnimation from './pages/LogoAnimation';
import Transcription from './pages/Transcription';
import UserTesting from './pages/UserTesting';
import Pricing from './pages/Pricing';
import { UserCredits, ToolType, TOOL_COSTS } from './types';

const App: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [credits, setCredits] = useState<UserCredits>({ available: 10, total: 10 });
  const [showOnboarding, setShowOnboarding] = useState(false);

  useEffect(() => {
    const savedCredits = localStorage.getItem('hub_credits');
    if (savedCredits) {
      setCredits(JSON.parse(savedCredits));
    }
    
    const onboardingComplete = localStorage.getItem('hub_onboarding_complete');
    if (!onboardingComplete) {
      setShowOnboarding(true);
    }
  }, []);

  const completeOnboarding = () => {
    localStorage.setItem('hub_onboarding_complete', 'true');
    setShowOnboarding(false);
  };

  const deductCredit = (type: ToolType) => {
    const cost = TOOL_COSTS[type];
    if (credits.available >= cost) {
      const newCredits = { ...credits, available: credits.available - cost };
      setCredits(newCredits);
      localStorage.setItem('hub_credits', JSON.stringify(newCredits));
      return true;
    }
    return false;
  };

  return (
    <HashRouter>
      <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
        {showOnboarding && <Onboarding onComplete={completeOnboarding} />}
        <Sidebar isOpen={isSidebarOpen} toggle={() => setIsSidebarOpen(!isSidebarOpen)} />
        
        <main className={`flex-1 flex flex-col transition-all duration-300 ${isSidebarOpen ? 'ml-64' : 'ml-20'}`}>
          <Header credits={credits} />
          
          <div className="p-6 overflow-auto">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/blog-commenter" element={<BlogCommenter onUse={() => deductCredit(ToolType.BLOG_COMMENTER)} credits={credits.available} />} />
              <Route path="/hindi-tutor" element={<HindiTutor onUse={() => deductCredit(ToolType.HINDI_TUTOR)} credits={credits.available} />} />
              <Route path="/image-tools" element={<ImageTools onUse={() => deductCredit(ToolType.IMAGE_TOOLS)} credits={credits.available} />} />
              <Route path="/seo-analyzer" element={<SEOAnalyzer onUse={() => deductCredit(ToolType.SEO_ANALYZER)} credits={credits.available} />} />
              <Route path="/logo-animation" element={<LogoAnimation onUse={() => deductCredit(ToolType.LOGO_ANIMATION)} credits={credits.available} />} />
              <Route path="/transcription" element={<Transcription onUse={() => deductCredit(ToolType.TRANSCRIPTION)} credits={credits.available} />} />
              <Route path="/user-testing" element={<UserTesting onUse={() => deductCredit(ToolType.USER_TESTING)} credits={credits.available} />} />
              <Route path="/pricing" element={<Pricing setCredits={setCredits} />} />
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </div>
        </main>
      </div>
    </HashRouter>
  );
};

export default App;
