import React from 'react';
import { Heart, BookOpen, User, Sparkles, PlusCircle } from 'lucide-react';

interface HeaderProps {
  currentView: 'studio' | 'myspace' | 'reflection';
  onNavigate: (view: 'studio' | 'myspace' | 'reflection') => void;
  onOpenAbout: () => void;
  onStartNew: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentView,
  onNavigate,
  onOpenAbout,
  onStartNew,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-[#FAF7F2]/90 backdrop-blur-md border-b border-[#EADEEA]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4 md:gap-8">
        {/* Zone 1: Brand wordmark (single element, clean display type) */}
        <button
          onClick={() => onNavigate('studio')}
          className="flex items-center gap-2.5 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D95D4A] rounded-lg py-1 px-1.5 transition-opacity hover:opacity-90 whitespace-nowrap shrink-0"
        >
          <div className="w-8 h-8 rounded-lg bg-[#281426] flex items-center justify-center text-[#FAF7F2] shadow-xs">
            <Heart className="w-4 h-4 fill-[#D95D4A] text-[#D95D4A]" />
          </div>
          <div>
            <span className="font-serif-display text-xl font-semibold tracking-tight text-[#281426]">
              HeartSync
            </span>
          </div>
        </button>

        {/* Zone 2: Single-line navigation links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-[#684B64]">
          <button
            onClick={() => onNavigate('studio')}
            className={`whitespace-nowrap transition-colors py-1 relative ${
              currentView === 'studio'
                ? 'text-[#281426] font-semibold'
                : 'hover:text-[#281426]'
            }`}
          >
            Reconnection Studio
            {currentView === 'studio' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#D95D4A] rounded-full" />
            )}
          </button>

          <button
            onClick={() => onNavigate('myspace')}
            className={`whitespace-nowrap transition-colors py-1 relative ${
              currentView === 'myspace'
                ? 'text-[#281426] font-semibold'
                : 'hover:text-[#281426]'
            }`}
          >
            My Space
            {currentView === 'myspace' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#D95D4A] rounded-full" />
            )}
          </button>

          <button
            onClick={() => onNavigate('reflection')}
            className={`whitespace-nowrap transition-colors py-1 relative ${
              currentView === 'reflection'
                ? 'text-[#281426] font-semibold'
                : 'hover:text-[#281426]'
            }`}
          >
            Quick Reflection
            {currentView === 'reflection' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#D95D4A] rounded-full" />
            )}
          </button>

          <button
            onClick={onOpenAbout}
            className="whitespace-nowrap hover:text-[#281426] transition-colors py-1 text-[#83697F]"
          >
            SETU 2026 Story
          </button>
        </nav>

        {/* Zone 3: 1 primary action */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <button
            onClick={onStartNew}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-[#FAF7F2] bg-[#281426] hover:bg-[#3D1F3A] rounded-xl transition-all shadow-xs active:scale-[0.98] whitespace-nowrap"
          >
            <PlusCircle className="w-3.5 h-3.5 text-[#E58778]" />
            <span>New Reconnection</span>
          </button>
        </div>
      </div>
    </header>
  );
};
