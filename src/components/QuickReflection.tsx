import React, { useState } from 'react';
import {
  BookOpen,
  Compass,
  ArrowRight,
  Bookmark,
  Sparkles,
  HelpCircle,
  Lightbulb,
  CheckCircle2,
  Send,
  Star,
  Check,
} from 'lucide-react';
import { analyzeReflectionLocally, ReflectionAnalysis } from '../data/reflectionPrompts';
import { saveReflection, saveFavoritePrompt } from '../services/storage';
import { IntentionId } from '../types';

interface QuickReflectionProps {
  onDraftMessage: (context: string, intentionId?: IntentionId) => void;
  onNavigateToMySpace: () => void;
  showToast: (title: string, description?: string, type?: 'success' | 'info' | 'warning') => void;
}

export const QuickReflection: React.FC<QuickReflectionProps> = ({
  onDraftMessage,
  onNavigateToMySpace,
  showToast,
}) => {
  const [reflectionText, setReflectionText] = useState<string>('');
  const [analysis, setAnalysis] = useState<ReflectionAnalysis | null>(null);
  const [isSaved, setIsSaved] = useState<boolean>(false);
  const [isInsightFavorited, setIsInsightFavorited] = useState<boolean>(false);
  const [showNextSteps, setShowNextSteps] = useState<boolean>(false);
  const [showExpressGuide, setShowExpressGuide] = useState<boolean>(false);

  const handleAnalyze = () => {
    if (!reflectionText.trim()) {
      showToast('Please share a few words', 'Write what is on your heart before seeking guidance.', 'info');
      return;
    }
    const result = analyzeReflectionLocally(reflectionText);
    setAnalysis(result);
  };

  const handleHelpExpress = () => {
    handleAnalyze();
    setShowExpressGuide(true);
    setShowNextSteps(false);
  };

  const handleFindNextStep = () => {
    handleAnalyze();
    setShowNextSteps(true);
    setShowExpressGuide(false);
  };

  const handleDraftMessage = () => {
    if (!reflectionText.trim()) {
      showToast('No text entered', 'Write a quick thought first to carry it over to the Studio.', 'info');
      return;
    }
    const result = analyzeReflectionLocally(reflectionText);
    onDraftMessage(reflectionText, result.recommendedIntentionId);
    showToast(
      'Carrying your words to Reconnection Studio',
      'Your reflection was brought in as communication context.',
      'success'
    );
  };

  const handleSavePrivately = () => {
    if (!reflectionText.trim()) {
      showToast('Nothing to save', 'Write a few words before saving your reflection.', 'warning');
      return;
    }

    const res = analyzeReflectionLocally(reflectionText);
    saveReflection({
      text: reflectionText.trim(),
      theme: res.theme,
      suggestedNextStep: res.suggestedSteps[0],
    });

    setIsSaved(true);
    showToast(
      'Saved privately',
      'Stored exclusively on your device in My Space.',
      'success'
    );
  };

  const handleSaveInsightToFavoritePrompts = () => {
    if (!analysis) return;
    saveFavoritePrompt({
      title: `${analysis.theme} (Reflection Insight)`,
      text: analysis.groundingInsight,
      category: 'reflection',
      note: `Personal grounding insight saved from Quick Reflection on "${analysis.theme}".`,
    });
    setIsInsightFavorited(true);
    showToast(
      'Insight saved to Favorite Prompts',
      'Added to your personal collection in My Space.',
      'success'
    );
  };

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
      {/* Header */}
      <div className="text-center mb-6 sm:mb-8">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F3EEF9] border border-[#E3DAEC] text-xs text-[#5E385A] font-medium mb-3">
          <BookOpen className="w-3.5 h-3.5 text-[#D95D4A]" />
          <span>Private Space for Stillness</span>
        </div>
        <h1 className="font-serif-display text-2xl sm:text-3xl font-bold text-[#281426] tracking-tight">
          What's been on your heart today?
        </h1>
        <p className="text-xs sm:text-sm text-[#73556F] mt-2 max-w-md mx-auto leading-relaxed">
          A quiet space to untangle feelings about people you care for. No mandatory forms, no evaluation.
        </p>
      </div>

      {/* Main Journaling Card */}
      <div className="bg-[#FFFFFF] border border-[#E7DCEB] rounded-3xl p-5 sm:p-7 shadow-xs space-y-4">
        <div>
          <label htmlFor="heartInput" className="sr-only">
            What is on your heart today?
          </label>
          <textarea
            id="heartInput"
            value={reflectionText}
            onChange={(e) => {
              setReflectionText(e.target.value);
              setIsSaved(false);
              setIsInsightFavorited(false);
            }}
            rows={5}
            placeholder="Write freely. For example: 'Had an argument with Jamie about weekend plans and I know my tone got snappy and defensive.'"
            className="w-full text-sm sm:text-base p-4 rounded-2xl border border-[#DFD3E3] bg-[#FAF7F2] text-[#281426] placeholder-[#A48FA2] focus:outline-none focus:ring-2 focus:ring-[#D95D4A] leading-relaxed resize-y font-sans"
          />
        </div>

        {/* 4 Working Action Buttons */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
          <button
            type="button"
            onClick={handleHelpExpress}
            className={`p-2.5 rounded-xl border text-xs font-semibold text-center transition-all ${
              showExpressGuide
                ? 'bg-[#281426] text-[#FAF7F2] border-[#281426]'
                : 'bg-[#FAF7F2] border-[#E3D7E7] text-[#4F334C] hover:bg-[#F5EEF8]'
            }`}
          >
            <Sparkles className="w-4 h-4 mx-auto mb-1 text-[#D95D4A]" />
            <span>Help me express</span>
          </button>

          <button
            type="button"
            onClick={handleFindNextStep}
            className={`p-2.5 rounded-xl border text-xs font-semibold text-center transition-all ${
              showNextSteps
                ? 'bg-[#281426] text-[#FAF7F2] border-[#281426]'
                : 'bg-[#FAF7F2] border-[#E3D7E7] text-[#4F334C] hover:bg-[#F5EEF8]'
            }`}
          >
            <Lightbulb className="w-4 h-4 mx-auto mb-1 text-[#D95D4A]" />
            <span>Find small step</span>
          </button>

          <button
            type="button"
            onClick={handleDraftMessage}
            className="p-2.5 rounded-xl border border-[#E3D7E7] bg-[#FAF7F2] text-[#4F334C] hover:bg-[#F5EEF8] text-xs font-semibold text-center transition-all"
          >
            <Send className="w-4 h-4 mx-auto mb-1 text-[#8B4D7E]" />
            <span>Draft message</span>
          </button>

          <button
            type="button"
            onClick={handleSavePrivately}
            className={`p-2.5 rounded-xl border text-xs font-semibold text-center transition-all ${
              isSaved
                ? 'bg-[#EDF6F1] border-[#BCE1CD] text-[#2E7E52]'
                : 'bg-[#FAF7F2] border-[#E3D7E7] text-[#4F334C] hover:bg-[#F5EEF8]'
            }`}
          >
            {isSaved ? (
              <CheckCircle2 className="w-4 h-4 mx-auto mb-1 text-[#2E7E52]" />
            ) : (
              <Bookmark className="w-4 h-4 mx-auto mb-1 text-[#8B4D7E]" />
            )}
            <span>{isSaved ? 'Saved locally' : 'Save privately'}</span>
          </button>
        </div>

        {/* Guided Local Insight Panel */}
        {analysis && (showExpressGuide || showNextSteps) && (
          <div className="mt-4 p-4 rounded-2xl bg-[#FAF5FB] border border-[#E8DEEC] space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-[#EAE0EE]">
              <span className="text-xs font-semibold text-[#8B4D7E]">
                Reflection Focus: {analysis.theme}
              </span>
              <span className="text-[11px] text-[#9A8197] italic">
                Local insight
              </span>
            </div>

            {showExpressGuide && (
              <div className="space-y-2 text-xs sm:text-sm text-[#553651] leading-relaxed">
                <p className="font-medium text-[#281426]">
                  {analysis.themeDescription}
                </p>
                <p className="text-[#6C4F68]">
                  {analysis.groundingInsight}
                </p>
              </div>
            )}

            {showNextSteps && (
              <div className="space-y-2">
                <p className="text-xs font-semibold text-[#281426]">
                  Low-pressure micro-steps you could consider:
                </p>
                <ul className="space-y-1.5 text-xs text-[#5D3F59]">
                  {analysis.suggestedSteps.map((step, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-[#D95D4A] font-bold">·</span>
                      <span>{step}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="pt-2 flex flex-wrap items-center justify-between gap-2 border-t border-[#ECE3F0]">
              <button
                onClick={handleSaveInsightToFavoritePrompts}
                className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-lg border transition-colors ${
                  isInsightFavorited
                    ? 'bg-[#EDF6F1] border-[#C1E3CE] text-[#2E7E52]'
                    : 'border-[#DECDE2] bg-white text-[#6B4F67] hover:bg-[#F5EEF8]'
                }`}
              >
                <Star
                  className={`w-3.5 h-3.5 ${
                    isInsightFavorited ? 'fill-[#2E7E52] text-[#2E7E52]' : 'text-[#886984]'
                  }`}
                />
                <span>
                  {isInsightFavorited ? 'Insight in Favorites' : 'Save as Favorite Prompt'}
                </span>
              </button>

              <button
                onClick={handleDraftMessage}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#D95D4A] hover:text-[#B24636]"
              >
                <span>Take into Reconnection Studio</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {isSaved && (
          <div className="mt-2 text-right">
            <button
              onClick={onNavigateToMySpace}
              className="text-xs text-[#8B4D7E] hover:text-[#281426] font-semibold underline underline-offset-2"
            >
              View in My Space →
            </button>
          </div>
        )}
      </div>

      <p className="text-center text-[11px] text-[#9A8197] mt-6">
        HeartSync provides transparent local reflection logic. It does not provide clinical diagnoses or external network transmission.
      </p>
    </div>
  );
};
