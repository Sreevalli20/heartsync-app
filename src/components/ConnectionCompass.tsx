import React from 'react';
import { Eye, MessageSquareQuote, Send, Clock, CheckCircle2 } from 'lucide-react';
import { CompassStage } from '../types';

interface ConnectionCompassProps {
  currentStage: CompassStage;
  completedStages: CompassStage[];
  onSelectStage: (stage: CompassStage) => void;
  actionSummary?: string;
}

const STAGES: Array<{
  id: CompassStage;
  number: string;
  name: string;
  shortDesc: string;
  guidance: string;
  icon: React.ComponentType<{ className?: string }>;
}> = [
  {
    id: 'notice',
    number: '01',
    name: 'Notice',
    shortDesc: 'Acknowledge the moment',
    guidance: 'Recognize who matters right now and pinpoint what your communication goal actually is.',
    icon: Eye,
  },
  {
    id: 'express',
    number: '02',
    name: 'Express',
    shortDesc: 'Find the words',
    guidance: 'Compare three genuine tones (casual, warm, direct) and edit the text until it feels true to you.',
    icon: MessageSquareQuote,
  },
  {
    id: 'act',
    number: '03',
    name: 'Act',
    shortDesc: 'Take a practical step',
    guidance: 'Copy your crafted note, share it directly, or store it securely in your private workspace.',
    icon: Send,
  },
  {
    id: 'remember',
    number: '04',
    name: 'Remember',
    shortDesc: 'Follow through gently',
    guidance: 'Lock in a follow-up reminder so your intentional effort does not get swallowed by daily busyness.',
    icon: Clock,
  },
];

export const ConnectionCompass: React.FC<ConnectionCompassProps> = ({
  currentStage,
  completedStages,
  onSelectStage,
  actionSummary,
}) => {
  const activeStageInfo = STAGES.find((s) => s.id === currentStage) || STAGES[0];

  return (
    <div className="bg-[#FAF7F2] border border-[#E8DEEC] rounded-2xl p-4 sm:p-5 shadow-xs mb-6 sm:mb-8 transition-all">
      {/* Visual Compass Stepper */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-3">
        {STAGES.map((stage) => {
          const isActive = stage.id === currentStage;
          const isCompleted = completedStages.includes(stage.id);
          const Icon = stage.icon;

          return (
            <button
              key={stage.id}
              onClick={() => onSelectStage(stage.id)}
              className={`text-left p-3 rounded-xl transition-all relative flex flex-col justify-between border ${
                isActive
                  ? 'bg-[#FFFFFF] border-[#D95D4A] shadow-xs ring-1 ring-[#D95D4A]/20'
                  : isCompleted
                  ? 'bg-[#F4EFF8] border-[#DFD5E6] hover:bg-[#EFE8F4] text-[#472D43]'
                  : 'bg-transparent border-transparent hover:bg-[#F6F1FA] text-[#81687E]'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span
                  className={`text-[11px] font-mono tracking-wider font-semibold ${
                    isActive ? 'text-[#D95D4A]' : 'text-[#81687E]'
                  }`}
                >
                  {stage.number}
                </span>
                {isCompleted ? (
                  <CheckCircle2 className="w-4 h-4 text-[#3C7B5D]" />
                ) : (
                  <Icon
                    className={`w-4 h-4 ${
                      isActive ? 'text-[#D95D4A]' : 'text-[#9C869A]'
                    }`}
                  />
                )}
              </div>

              <div>
                <p
                  className={`text-xs sm:text-sm font-semibold tracking-tight ${
                    isActive ? 'text-[#281426]' : 'text-[#472D43]'
                  }`}
                >
                  {stage.name}
                </p>
                <p className="text-[11px] text-[#7F647D] line-clamp-1 mt-0.5">
                  {stage.shortDesc}
                </p>
              </div>

              {isActive && (
                <div className="absolute -bottom-1 left-4 right-4 h-0.5 bg-[#D95D4A] rounded-full" />
              )}
            </button>
          );
        })}
      </div>

      {/* Contextual Guidance Panel */}
      <div className="mt-3.5 pt-3 border-t border-[#ECE3F0] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5">
        <div className="flex items-start gap-2 text-xs text-[#5C3F58]">
          <span className="font-semibold text-[#281426] whitespace-nowrap">
            {activeStageInfo.name} Guidance:
          </span>
          <span className="leading-relaxed">{activeStageInfo.guidance}</span>
        </div>

        {actionSummary && (
          <div className="shrink-0 text-xs text-[#3C7B5D] bg-[#EDF6F1] px-2.5 py-1 rounded-md border border-[#D1E8DB] font-medium">
            Action: {actionSummary}
          </div>
        )}
      </div>
    </div>
  );
};
