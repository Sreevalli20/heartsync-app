/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  Heart,
  BookOpen,
  User,
  PlusCircle,
  HelpCircle,
  Sparkles,
  Info,
  Calendar,
  Layers,
} from 'lucide-react';
import { Header } from './components/Header';
import { ReconnectionStudio } from './components/ReconnectionStudio';
import { MySpace } from './components/MySpace';
import { QuickReflection } from './components/QuickReflection';
import { AboutModal } from './components/AboutModal';
import { Toast } from './components/Toast';
import { ToastMessage, IntentionId } from './types';

export default function App() {
  const [currentView, setCurrentView] = useState<'studio' | 'myspace' | 'reflection'>('studio');
  const [isAboutOpen, setIsAboutOpen] = useState<boolean>(false);
  const [activeToast, setActiveToast] = useState<ToastMessage | null>(null);

  // Cross-view handover context
  const [studioContext, setStudioContext] = useState<string>('');
  const [studioIntentionId, setStudioIntentionId] = useState<IntentionId | undefined>(undefined);
  const [studioKey, setStudioKey] = useState<number>(0);

  const showToast = (
    title: string,
    description?: string,
    type?: 'success' | 'info' | 'warning'
  ) => {
    setActiveToast({
      id: String(Date.now()),
      title,
      description,
      type: type || 'success',
    });
  };

  const handleStartNewReconnection = () => {
    setStudioContext('');
    setStudioIntentionId(undefined);
    setStudioKey((prev) => prev + 1);
    setCurrentView('studio');
  };

  const handleReflectionToDraft = (context: string, intentionId?: IntentionId) => {
    setStudioContext(context);
    setStudioIntentionId(intentionId);
    setStudioKey((prev) => prev + 1);
    setCurrentView('studio');
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#281426] flex flex-col font-sans selection:bg-[#F0D5D0] pb-20 md:pb-6">
      {/* Top Bar Contract (Wordmark, Nav links, 1 Primary Action) */}
      <Header
        currentView={currentView}
        onNavigate={(view) => setCurrentView(view)}
        onOpenAbout={() => setIsAboutOpen(true)}
        onStartNew={handleStartNewReconnection}
      />

      {/* Main View Container */}
      <main className="flex-1 w-full">
        {currentView === 'studio' && (
          <ReconnectionStudio
            key={studioKey}
            initialContext={studioContext}
            initialIntentionId={studioIntentionId}
            onNavigateToMySpace={() => setCurrentView('myspace')}
            showToast={showToast}
          />
        )}

        {currentView === 'myspace' && (
          <MySpace
            onStartReconnection={handleStartNewReconnection}
            onOpenReflection={() => setCurrentView('reflection')}
            onUsePromptInStudio={handleReflectionToDraft}
            showToast={showToast}
          />
        )}

        {currentView === 'reflection' && (
          <QuickReflection
            onDraftMessage={handleReflectionToDraft}
            onNavigateToMySpace={() => setCurrentView('myspace')}
            showToast={showToast}
          />
        )}
      </main>

      {/* Quiet, Humanistic Footer */}
      <footer className="mt-auto border-t border-[#EDE1EF] bg-[#FAF7F2] py-8 text-xs text-[#7F647E]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-serif-display font-bold text-[#281426]">HeartSync</span>
            <span aria-hidden="true">·</span>
            <span>SETU 2026: Bridge the Gap. Build the Fix</span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 text-[#8C748B]">
            <span>Team Brain Catalyst</span>
            <span aria-hidden="true">·</span>
            <button
              onClick={() => setIsAboutOpen(true)}
              className="hover:text-[#281426] transition-colors underline underline-offset-2"
            >
              Why HeartSync?
            </button>
            <span aria-hidden="true">·</span>
            <span>Browser-Local Privacy</span>
          </div>
        </div>
      </footer>

      {/* Mobile Fixed Bottom Navigation Bar (Pattern 1 from Mobile Touch Apps) */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#FAF7F2]/95 backdrop-blur-md border-t border-[#E8DEEC] px-4 py-2 flex items-center justify-around shadow-lg">
        <button
          onClick={() => setCurrentView('studio')}
          className={`flex flex-col items-center justify-center py-1 px-3 min-w-[56px] min-h-[44px] transition-colors rounded-xl ${
            currentView === 'studio'
              ? 'text-[#D95D4A] font-semibold'
              : 'text-[#7B6179] hover:text-[#281426]'
          }`}
        >
          <Heart
            className={`w-5 h-5 ${
              currentView === 'studio' ? 'fill-[#D95D4A] text-[#D95D4A]' : 'text-[#7B6179]'
            }`}
          />
          <span className="text-[10px] mt-1 tracking-tight">Studio</span>
        </button>

        <button
          onClick={() => setCurrentView('myspace')}
          className={`flex flex-col items-center justify-center py-1 px-3 min-w-[56px] min-h-[44px] transition-colors rounded-xl ${
            currentView === 'myspace'
              ? 'text-[#D95D4A] font-semibold'
              : 'text-[#7B6179] hover:text-[#281426]'
          }`}
        >
          <Layers className="w-5 h-5" />
          <span className="text-[10px] mt-1 tracking-tight">My Space</span>
        </button>

        <button
          onClick={() => setCurrentView('reflection')}
          className={`flex flex-col items-center justify-center py-1 px-3 min-w-[56px] min-h-[44px] transition-colors rounded-xl ${
            currentView === 'reflection'
              ? 'text-[#D95D4A] font-semibold'
              : 'text-[#7B6179] hover:text-[#281426]'
          }`}
        >
          <BookOpen className="w-5 h-5" />
          <span className="text-[10px] mt-1 tracking-tight">Reflection</span>
        </button>

        <button
          onClick={() => setIsAboutOpen(true)}
          className="flex flex-col items-center justify-center py-1 px-3 min-w-[56px] min-h-[44px] text-[#7B6179] hover:text-[#281426] transition-colors rounded-xl"
        >
          <Info className="w-5 h-5" />
          <span className="text-[10px] mt-1 tracking-tight">SETU 2026</span>
        </button>
      </div>

      {/* About Modal */}
      <AboutModal
        isOpen={isAboutOpen}
        onClose={() => setIsAboutOpen(false)}
        onStartReconnecting={() => {
          handleStartNewReconnection();
        }}
      />

      {/* Floating Toast */}
      <Toast toast={activeToast} onDismiss={() => setActiveToast(null)} />
    </div>
  );
}
