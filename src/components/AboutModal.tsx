import React from 'react';
import { X, Heart, ShieldCheck, Sparkles, Compass, CheckCircle } from 'lucide-react';

interface AboutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStartReconnecting: () => void;
}

export const AboutModal: React.FC<AboutModalProps> = ({
  isOpen,
  onClose,
  onStartReconnecting,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-[#281426]/50 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-[#FAF7F2] border border-[#E7DCEB] rounded-3xl max-w-xl w-full shadow-2xl overflow-hidden my-8">
        {/* Banner with generated artwork */}
        <div className="relative h-44 sm:h-52 w-full bg-[#EADEEA] overflow-hidden">
          <img
            src="/src/assets/images/heartsync_connection_art_1792260340041.jpg"
            alt="HeartSync connection illustration"
            className="w-full h-full object-cover object-center"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#281426]/85 via-[#281426]/30 to-transparent flex items-end p-5">
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#FAF7F2]/20 backdrop-blur-md text-[#FAF7F2] text-[11px] font-medium mb-1">
                <span>SETU 2026 Challenge Entry</span>
              </div>
              <h2 className="font-serif-display text-xl sm:text-2xl font-bold text-[#FAF7F2]">
                Bridge the Gap. Build the Fix.
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="absolute top-3.5 right-3.5 w-8 h-8 rounded-full bg-white/80 backdrop-blur-md text-[#281426] flex items-center justify-center hover:bg-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5 text-xs sm:text-sm text-[#5D3F59] leading-relaxed">
          <div className="border-b border-[#EBE1EF] pb-4">
            <div className="flex items-center justify-between text-xs text-[#8F728C] mb-1">
              <span>Project: HeartSync</span>
              <span>Team: Brain Catalyst</span>
            </div>
            <p className="font-serif-display text-lg font-bold text-[#281426]">
              Real-time connection for people who matter.
            </p>
          </div>

          <div className="space-y-3">
            <h3 className="font-serif-display text-base font-bold text-[#281426]">
              The Problem We Address
            </h3>
            <p>
              People exchange rapid messages and emojis every day, yet still experience emotional disconnection. Busy routines, awkwardness about reaching out after silence, and forgotten intentions make meaningful relationships harder to sustain.
            </p>
            <p>
              Existing chat platforms optimize for notifications and infinite feeds. HeartSync was created for intentional, asynchronous follow-through: turning a quiet wish to reconnect into a thoughtful action.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-[#FFFFFF] border border-[#E8DEEC] space-y-2.5">
            <h4 className="font-serif-display text-sm font-bold text-[#281426] flex items-center gap-2">
              <Compass className="w-4 h-4 text-[#D95D4A]" />
              <span>The Signature 4-Stage Experience</span>
            </h4>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-2 rounded-xl bg-[#FAF7F2]">
                <p className="font-bold text-[#281426]">1. Notice</p>
                <p className="text-[#765872] text-[11px]">Pinpoint the relationship and communication goal.</p>
              </div>
              <div className="p-2 rounded-xl bg-[#FAF7F2]">
                <p className="font-bold text-[#281426]">2. Express</p>
                <p className="text-[#765872] text-[11px]">Explore curated tones and customize with authentic context.</p>
              </div>
              <div className="p-2 rounded-xl bg-[#FAF7F2]">
                <p className="font-bold text-[#281426]">3. Act</p>
                <p className="text-[#765872] text-[11px]">Copy, share, or preserve your draft locally.</p>
              </div>
              <div className="p-2 rounded-xl bg-[#FAF7F2]">
                <p className="font-bold text-[#281426]">4. Remember</p>
                <p className="text-[#765872] text-[11px]">Schedule a gentle follow-up so intentions stick.</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2.5 text-xs text-[#4F735F] bg-[#EDF6F1] p-3 rounded-xl border border-[#CDE5D8]">
            <ShieldCheck className="w-4 h-4 text-[#2E7E52] shrink-0" />
            <span>
              100% Client-Side. No telemetry, no external database, no fake AI claims.
            </span>
          </div>

          <div className="pt-2 flex items-center justify-between">
            <button
              onClick={onClose}
              className="text-xs text-[#7F617C] hover:text-[#281426]"
            >
              Close
            </button>
            <button
              onClick={() => {
                onClose();
                onStartReconnecting();
              }}
              className="px-4 py-2 text-xs font-semibold bg-[#281426] text-[#FAF7F2] rounded-xl hover:bg-[#3D1F3A] transition-colors"
            >
              Start Reconnecting
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
