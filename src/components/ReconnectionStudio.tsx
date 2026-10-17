import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  ArrowRight,
  Copy,
  Check,
  Share2,
  Calendar,
  Bookmark,
  RotateCcw,
  Edit3,
  RefreshCw,
  Clock,
  Send,
  AlertCircle,
  CheckCircle2,
  Info,
  CalendarCheck,
  Star,
  CheckCheck,
} from 'lucide-react';
import {
  Intention,
  IntentionId,
  ToneStyle,
  DraftOption,
  CompassStage,
  FollowUpReminder,
} from '../types';
import {
  INTENTIONS,
  getDraftOptions,
  getTotalVariantsCount,
  TONE_LABELS,
} from '../data/messageLibrary';
import { ConnectionCompass } from './ConnectionCompass';
import { saveDraft, saveReminder, saveFavoritePrompt } from '../services/storage';

interface ReconnectionStudioProps {
  initialContext?: string;
  initialIntentionId?: IntentionId;
  onNavigateToMySpace: () => void;
  showToast: (title: string, description?: string, type?: 'success' | 'info' | 'warning') => void;
}

export const ReconnectionStudio: React.FC<ReconnectionStudioProps> = ({
  initialContext = '',
  initialIntentionId,
  onNavigateToMySpace,
  showToast,
}) => {
  // Current intention
  const [selectedIntentionId, setSelectedIntentionId] = useState<IntentionId | null>(
    initialIntentionId || null
  );

  // User context input
  const [contextInput, setContextInput] = useState<string>(initialContext);
  const [isUsingIllustrativeScenario, setIsUsingIllustrativeScenario] = useState<boolean>(false);

  // Active stage for Compass: notice, express, act, remember
  const [compassStage, setCompassStage] = useState<CompassStage>('notice');
  const [completedStages, setCompletedStages] = useState<CompassStage[]>([]);

  // Drafts & tone selection
  const [activeTone, setActiveTone] = useState<ToneStyle>('natural');
  const [variantIndex, setVariantIndex] = useState<number>(0);
  const [editedDrafts, setEditedDrafts] = useState<Record<string, string>>({});
  const [isEditingDraft, setIsEditingDraft] = useState<boolean>(false);

  // Action status
  const [hasCopied, setHasCopied] = useState<boolean>(false);
  const [isDraftSaved, setIsDraftSaved] = useState<boolean>(false);
  const [isPromptFavorited, setIsPromptFavorited] = useState<boolean>(false);
  const [savedReminderRecord, setSavedReminderRecord] = useState<FollowUpReminder | null>(null);

  // Schedule reminder widget state
  const [showReminderForm, setShowReminderForm] = useState<boolean>(false);
  const [reminderTitle, setReminderTitle] = useState<string>('');
  const [reminderDate, setReminderDate] = useState<string>('');
  const [reminderTime, setReminderTime] = useState<string>('09:30');
  const [reminderNotes, setReminderNotes] = useState<string>('');

  const currentIntention = INTENTIONS.find((i) => i.id === selectedIntentionId);

  // Generate current draft options
  const draftMap = selectedIntentionId
    ? getDraftOptions(selectedIntentionId, contextInput, variantIndex)
    : null;

  const currentDraftKey = `${selectedIntentionId}_${activeTone}_${variantIndex}`;
  const currentDraftText =
    draftMap && editedDrafts[currentDraftKey] !== undefined
      ? editedDrafts[currentDraftKey]
      : draftMap
      ? draftMap[activeTone].text
      : '';

  // Synchronize when initial props change
  useEffect(() => {
    if (initialIntentionId) {
      setSelectedIntentionId(initialIntentionId);
      setCompassStage('express');
      setCompletedStages(['notice']);
    }
  }, [initialIntentionId]);

  useEffect(() => {
    if (initialContext) {
      setContextInput(initialContext);
    }
  }, [initialContext]);

  // Set default reminder date (tomorrow)
  useEffect(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    setReminderDate(tomorrow.toISOString().split('T')[0]);
  }, []);

  // Update default reminder title when intention changes
  useEffect(() => {
    if (currentIntention) {
      setReminderTitle(currentIntention.suggestedActionTitle);
    }
  }, [currentIntention]);

  // Handle stage change from compass
  const handleStageSelect = (stage: CompassStage) => {
    if (!selectedIntentionId && stage !== 'notice') {
      showToast('Select an intention first', 'Pick one of the four intentions below to begin.', 'info');
      return;
    }
    setCompassStage(stage);
  };

  // Select an intention
  const handleSelectIntention = (id: IntentionId) => {
    setSelectedIntentionId(id);
    setCompassStage('express');
    setCompletedStages((prev) => Array.from(new Set([...prev, 'notice'])));
    setIsDraftSaved(false);
    setIsPromptFavorited(false);
    setSavedReminderRecord(null);
    setVariantIndex(0);
  };

  // Illustrative scenario handler
  const handleApplyIllustrativeScenario = () => {
    if (!currentIntention) return;
    setContextInput(currentIntention.illustrativeScenario);
    setIsUsingIllustrativeScenario(true);
    showToast(
      'Illustrative scenario loaded',
      'This realistic scenario is temporary and isolated from your personal records.',
      'info'
    );
  };

  // Reset illustrative scenario
  const handleResetIllustrativeScenario = () => {
    setContextInput('');
    setIsUsingIllustrativeScenario(false);
    showToast('Scenario reset', 'Context cleared without altering any saved personal records.', 'info');
  };

  // Cycle to another draft option
  const handleCycleVariant = () => {
    if (!selectedIntentionId) return;
    const total = getTotalVariantsCount(selectedIntentionId, activeTone);
    const nextIndex = (variantIndex + 1) % total;
    setVariantIndex(nextIndex);
    setIsEditingDraft(false);
    setIsPromptFavorited(false);
  };

  // Set specific variant index directly
  const handleSelectVariantIndex = (idx: number) => {
    setVariantIndex(idx);
    setIsEditingDraft(false);
    setIsPromptFavorited(false);
  };

  // Reset draft to library template
  const handleResetDraft = () => {
    if (!currentDraftKey) return;
    const nextEdits = { ...editedDrafts };
    delete nextEdits[currentDraftKey];
    setEditedDrafts(nextEdits);
    setIsEditingDraft(false);
    showToast('Draft restored', 'Reset back to the curated draft text.', 'info');
  };

  // Save inline edit
  const handleSaveInlineEdit = (newText: string) => {
    setEditedDrafts((prev) => ({
      ...prev,
      [currentDraftKey]: newText,
    }));
    setIsEditingDraft(false);
    showToast('Edits updated', 'Your customized wording has been saved to this draft.', 'success');
  };

  // Copy message
  const handleCopyMessage = async () => {
    if (!currentDraftText) return;

    let copiedSuccessfully = false;
    if (navigator.clipboard && navigator.clipboard.writeText) {
      try {
        await navigator.clipboard.writeText(currentDraftText);
        copiedSuccessfully = true;
      } catch {
        copiedSuccessfully = false;
      }
    }

    if (!copiedSuccessfully) {
      // Fallback for iframe / strict browser clipboard policy
      const textarea = document.createElement('textarea');
      textarea.value = currentDraftText;
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.select();
      try {
        document.execCommand('copy');
        copiedSuccessfully = true;
      } catch {
        copiedSuccessfully = false;
      }
      document.body.removeChild(textarea);
    }

    if (copiedSuccessfully) {
      setHasCopied(true);
      setTimeout(() => setHasCopied(false), 2600);
      setCompletedStages((prev) => Array.from(new Set([...prev, 'act'])));
      showToast('Copied to clipboard', 'Ready to paste into your messaging application.', 'success');
    } else {
      showToast('Copy failed', 'Please select and copy the text manually from the card.', 'warning');
    }
  };

  // Native share trigger
  const handleShareMessage = async () => {
    if (!currentDraftText) return;

    if (navigator.share) {
      try {
        await navigator.share({
          title: 'HeartSync Note',
          text: currentDraftText,
        });
        setCompletedStages((prev) => Array.from(new Set([...prev, 'act'])));
        showToast('Shared', 'Shared using your system sharing interface.', 'success');
      } catch (err: unknown) {
        if ((err as Error)?.name !== 'AbortError') {
          showToast('Sharing cancelled or unavailable', 'You can copy the message instead.', 'info');
        }
      }
    } else {
      // Direct email fallback trigger
      const mailtoUrl = `mailto:?subject=${encodeURIComponent(
        'Thinking of you'
      )}&body=${encodeURIComponent(currentDraftText)}`;
      window.location.href = mailtoUrl;
    }
  };

  // Save intention & draft to My Space
  const handleSaveToMySpace = () => {
    if (!selectedIntentionId || !currentIntention) return;

    saveDraft({
      intentionId: selectedIntentionId,
      intentionTitle: currentIntention.label,
      tone: activeTone,
      content: currentDraftText,
      customContext: contextInput.trim() || undefined,
    });

    setIsDraftSaved(true);
    setCompletedStages((prev) => Array.from(new Set([...prev, 'act'])));
    showToast(
      'Saved to My Space',
      'Stored safely in your local browser workspace under Saved Drafts.',
      'success'
    );
  };

  // Save as Favorite Prompt
  const handleSaveAsFavoritePrompt = () => {
    if (!currentDraftText || !selectedIntentionId) return;

    let category: 'repair' | 'support' | 'conversation_starter' | 'appreciation' = 'conversation_starter';
    if (selectedIntentionId === 'repair_conversation') category = 'repair';
    else if (selectedIntentionId === 'support_difficult') category = 'support';
    else if (selectedIntentionId === 'express_appreciation') category = 'appreciation';

    const focus = draftMap?.[activeTone]?.focusArea || TONE_LABELS[activeTone].label;

    saveFavoritePrompt({
      title: `${focus} (${TONE_LABELS[activeTone].label})`,
      text: currentDraftText,
      category,
      note: `Saved from Reconnection Studio for "${currentIntention?.label}".`,
    });

    setIsPromptFavorited(true);
    showToast(
      'Saved to Favorite Prompts',
      'Added to your personal prompt collection in My Space.',
      'success'
    );
  };

  // Save Reminder
  const handleSaveReminder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reminderTitle.trim() || !reminderDate) {
      showToast('Title & date required', 'Please specify a title and date for your reminder.', 'warning');
      return;
    }

    const created = saveReminder({
      title: reminderTitle.trim(),
      dueDate: reminderDate,
      dueTime: reminderTime || '09:00',
      completed: false,
      intentionId: selectedIntentionId || undefined,
      notes: reminderNotes.trim() || undefined,
    });

    setSavedReminderRecord(created);
    setShowReminderForm(false);
    setCompassStage('remember');
    setCompletedStages((prev) => Array.from(new Set([...prev, 'remember'])));

    showToast(
      'Follow-up scheduled',
      `Saved locally for ${reminderDate}. View or manage anytime in My Space.`,
      'success'
    );
  };

  // Quick preset dates for reminder
  const setPresetDate = (daysAhead: number, timeStr: string = '09:30') => {
    const target = new Date();
    target.setDate(target.getDate() + daysAhead);
    setReminderDate(target.toISOString().split('T')[0]);
    setReminderTime(timeStr);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
      {/* Central Value Statement & Reconnection Studio Header */}
      <div className="text-center mb-8 sm:mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#F3EEF9] border border-[#E3DAEC] text-xs text-[#5E385A] font-medium mb-3.5">
          <Sparkles className="w-3.5 h-3.5 text-[#D95D4A]" />
          <span>The Reconnection Studio</span>
        </div>
        <h1 className="font-serif-display text-2xl sm:text-3xl md:text-4xl text-[#281426] font-bold tracking-tight text-balance max-w-2xl mx-auto leading-tight">
          Someone matters. Life gets busy. Let's make reconnecting easier.
        </h1>
        <p className="text-sm sm:text-base text-[#6B4E67] mt-2.5 max-w-xl mx-auto leading-relaxed">
          Transform a quiet intention into a warm, practical reach-out. No algorithms, no artificial barriers, no social performance.
        </p>
      </div>

      {/* Connection Compass (Notice → Express → Act → Remember) */}
      <ConnectionCompass
        currentStage={compassStage}
        completedStages={completedStages}
        onSelectStage={handleStageSelect}
        actionSummary={
          savedReminderRecord
            ? `Reminder saved for ${savedReminderRecord.dueDate}`
            : isDraftSaved
            ? 'Draft stored in My Space'
            : hasCopied
            ? 'Message copied to clipboard'
            : undefined
        }
      />

      {/* STAGE 1: NOTICE & CHOOSE INTENTION */}
      {compassStage === 'notice' && (
        <section className="space-y-6">
          <div className="border-b border-[#ECE2F0] pb-3">
            <h2 className="font-serif-display text-xl sm:text-2xl font-bold text-[#281426]">
              Stage 1: Notice your intention
            </h2>
            <p className="text-xs sm:text-sm text-[#72546D] mt-1">
              Select what feels most true to this specific relationship right now.
            </p>
          </div>

          {/* 4 Selectable Intentions */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {INTENTIONS.map((intention) => {
              const isSelected = selectedIntentionId === intention.id;
              return (
                <button
                  key={intention.id}
                  onClick={() => handleSelectIntention(intention.id)}
                  className={`text-left p-4 sm:p-5 rounded-2xl border transition-all relative flex flex-col justify-between ${
                    isSelected
                      ? 'bg-[#FFFFFF] border-[#D95D4A] shadow-md ring-2 ring-[#D95D4A]/20'
                      : 'bg-[#FFFFFF] border-[#E8DFEC] hover:border-[#D5C2DC] hover:shadow-xs'
                  }`}
                >
                  <div>
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <h3 className="font-serif-display text-base sm:text-lg font-bold text-[#281426] leading-snug">
                        {intention.label}
                      </h3>
                      {isSelected && (
                        <div className="w-5 h-5 rounded-full bg-[#D95D4A] text-white flex items-center justify-center shrink-0">
                          <Check className="w-3 h-3" />
                        </div>
                      )}
                    </div>
                    <p className="text-xs sm:text-sm text-[#6C5068] leading-relaxed">
                      {intention.tagline}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-[#F1EAF4] flex items-center justify-between text-xs font-semibold text-[#D95D4A]">
                    <span>Open workflow</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </button>
              );
            })}
          </div>
        </section>
      )}

      {/* STAGES 2 & 3: WORKFLOW */}
      {selectedIntentionId && currentIntention && compassStage !== 'notice' && (
        <div className="space-y-6">
          {/* Stage One: Understand banner */}
          <div className="bg-[#FAF5FB] border border-[#E9DFED] rounded-2xl p-4 sm:p-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#EBE1EF]">
              <div>
                <span className="text-[11px] font-mono font-semibold uppercase tracking-wider text-[#987895]">
                  Stage One · Understand
                </span>
                <h2 className="font-serif-display text-lg sm:text-xl font-bold text-[#281426] mt-0.5">
                  {currentIntention.label}
                </h2>
              </div>
              <button
                onClick={() => setCompassStage('notice')}
                className="text-xs font-semibold text-[#8B4D7E] hover:text-[#281426] transition-colors py-1 px-2.5 rounded-lg border border-[#DECDE2] bg-[#FFFFFF] self-start sm:self-auto shrink-0"
              >
                Change intention
              </button>
            </div>

            <div className="mt-3 text-xs sm:text-sm text-[#5B3E57] flex items-start gap-2">
              <Info className="w-4 h-4 text-[#D95D4A] shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-[#281426]">Communication Goal: </span>
                <span>{currentIntention.communicationGoal}</span>
              </div>
            </div>

            {/* Specific Guidance Breakdown (Tailored for Repair and Support) */}
            {currentIntention.guidancePoints && currentIntention.guidancePoints.length > 0 && (
              <div className="mt-3.5 p-3.5 rounded-xl bg-[#FFFFFF] border border-[#E9DFEC]">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-[#795B76] block mb-2">
                  Guidance Principles for this Moment:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-[#5E3F5B]">
                  {currentIntention.guidancePoints.map((point, pIdx) => {
                    const [title, desc] = point.split(': ');
                    return (
                      <div key={pIdx} className="flex items-start gap-1.5 leading-snug">
                        <CheckCheck className="w-3.5 h-3.5 text-[#3C7B5D] shrink-0 mt-0.5" />
                        <div>
                          <strong className="text-[#281426]">{title}:</strong>{' '}
                          <span>{desc}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Optional Context Field with Illustrative Scenario Switcher */}
            <div className="mt-4 pt-3 border-t border-[#EDE4F0]">
              <div className="flex items-center justify-between mb-1.5">
                <label
                  htmlFor="contextInput"
                  className="text-xs font-semibold text-[#482D44]"
                >
                  What would you like this person to know? (Optional)
                </label>
                <div className="flex items-center gap-2">
                  {!isUsingIllustrativeScenario ? (
                    <button
                      type="button"
                      onClick={handleApplyIllustrativeScenario}
                      className="text-[11px] text-[#A25265] hover:text-[#281426] font-medium underline underline-offset-2 transition-colors"
                    >
                      Use illustrative scenario
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={handleResetIllustrativeScenario}
                      className="text-[11px] text-[#A25265] hover:text-[#281426] font-semibold flex items-center gap-1 transition-colors"
                    >
                      <RotateCcw className="w-3 h-3" />
                      Reset scenario
                    </button>
                  )}
                </div>
              </div>

              <textarea
                id="contextInput"
                value={contextInput}
                onChange={(e) => {
                  setContextInput(e.target.value);
                  if (isUsingIllustrativeScenario) {
                    setIsUsingIllustrativeScenario(false);
                  }
                }}
                rows={2}
                placeholder="E.g., I realized I was defensive when we disagreed yesterday about dinner plans; want to apologize for my tone and hear their side."
                className="w-full text-xs sm:text-sm p-3 rounded-xl border border-[#DFD3E3] bg-[#FFFFFF] text-[#281426] placeholder-[#A48FA2] focus:outline-none focus:ring-2 focus:ring-[#D95D4A] transition-all resize-y"
              />

              {isUsingIllustrativeScenario && (
                <div className="mt-1.5 flex items-center justify-between text-[11px] text-[#865977] bg-[#F4EEF7] px-2.5 py-1 rounded-md border border-[#E5DAE9]">
                  <div className="flex items-center gap-1.5">
                    <span className="font-semibold text-[#281426]">Illustrative example:</span>
                    <span>{currentIntention.scenarioDescription}</span>
                  </div>
                  <span className="text-[#886B83] text-[10px] hidden sm:inline">Isolated from personal data</span>
                </div>
              )}
            </div>
          </div>

          {/* STAGE TWO: FIND THE WORDS */}
          <section className="bg-[#FFFFFF] border border-[#E7DEEC] rounded-2xl p-5 sm:p-6 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#EFE8F3]">
              <div>
                <span className="text-[11px] font-mono font-semibold uppercase tracking-wider text-[#987895]">
                  Stage Two · Find the words
                </span>
                <h3 className="font-serif-display text-xl font-bold text-[#281426] mt-0.5">
                  Suggested message drafts
                </h3>
              </div>

              {/* Tone Switcher Tabs */}
              <div className="flex items-center p-1 bg-[#F4EFF7] rounded-xl border border-[#E3DAE7] self-start sm:self-auto">
                {(['natural', 'warm', 'honest'] as ToneStyle[]).map((tone) => {
                  const isActive = activeTone === tone;
                  return (
                    <button
                      key={tone}
                      onClick={() => {
                        setActiveTone(tone);
                        setIsEditingDraft(false);
                        setCompassStage('express');
                        setIsPromptFavorited(false);
                      }}
                      className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all whitespace-nowrap ${
                        isActive
                          ? 'bg-[#FFFFFF] text-[#281426] shadow-xs'
                          : 'text-[#6F516B] hover:text-[#281426]'
                      }`}
                    >
                      {tone === 'natural'
                        ? 'Natural & Casual'
                        : tone === 'warm'
                        ? 'Warm & Thoughtful'
                        : 'Honest & Direct'}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Distinct Focus Selector for Repair & Support */}
            {selectedIntentionId === 'repair_conversation' && (
              <div className="mt-4 p-2.5 bg-[#FAF7F2] rounded-xl border border-[#EAE0EE] flex flex-wrap items-center gap-2 text-xs">
                <span className="font-semibold text-[#281426] whitespace-nowrap">
                  Repair Angle:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  <button
                    onClick={() => handleSelectVariantIndex(0)}
                    className={`px-2.5 py-1 rounded-lg transition-colors ${
                      variantIndex === 0
                        ? 'bg-[#281426] text-white font-medium'
                        : 'bg-[#FFFFFF] text-[#694E65] border border-[#DDD1E2] hover:bg-[#F4EFF7]'
                    }`}
                  >
                    1. Acknowledge Impact & Apologize
                  </button>
                  <button
                    onClick={() => handleSelectVariantIndex(1)}
                    className={`px-2.5 py-1 rounded-lg transition-colors ${
                      variantIndex === 1
                        ? 'bg-[#281426] text-white font-medium'
                        : 'bg-[#FFFFFF] text-[#694E65] border border-[#DDD1E2] hover:bg-[#F4EFF7]'
                    }`}
                  >
                    2. Seek Mutual Understanding & Listen
                  </button>
                  <button
                    onClick={() => handleSelectVariantIndex(2)}
                    className={`px-2.5 py-1 rounded-lg transition-colors ${
                      variantIndex === 2
                        ? 'bg-[#281426] text-white font-medium'
                        : 'bg-[#FFFFFF] text-[#694E65] border border-[#DDD1E2] hover:bg-[#F4EFF7]'
                    }`}
                  >
                    3. Articulate Feelings Without Blaming
                  </button>
                </div>
              </div>
            )}

            {selectedIntentionId === 'support_difficult' && (
              <div className="mt-4 p-2.5 bg-[#FAF7F2] rounded-xl border border-[#EAE0EE] flex flex-wrap items-center gap-2 text-xs">
                <span className="font-semibold text-[#281426] whitespace-nowrap">
                  Support Lens:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  <button
                    onClick={() => handleSelectVariantIndex(0)}
                    className={`px-2.5 py-1 rounded-lg transition-colors ${
                      variantIndex === 0
                        ? 'bg-[#281426] text-white font-medium'
                        : 'bg-[#FFFFFF] text-[#694E65] border border-[#DDD1E2] hover:bg-[#F4EFF7]'
                    }`}
                  >
                    1. Zero-Reply Pressure
                  </button>
                  <button
                    onClick={() => handleSelectVariantIndex(1)}
                    className={`px-2.5 py-1 rounded-lg transition-colors ${
                      variantIndex === 1
                        ? 'bg-[#281426] text-white font-medium'
                        : 'bg-[#FFFFFF] text-[#694E65] border border-[#DDD1E2] hover:bg-[#F4EFF7]'
                    }`}
                  >
                    2. Emotional Sanctuary & Listening
                  </button>
                  <button
                    onClick={() => handleSelectVariantIndex(2)}
                    className={`px-2.5 py-1 rounded-lg transition-colors ${
                      variantIndex === 2
                        ? 'bg-[#281426] text-white font-medium'
                        : 'bg-[#FFFFFF] text-[#694E65] border border-[#DDD1E2] hover:bg-[#F4EFF7]'
                    }`}
                  >
                    3. Concrete Practical Help
                  </button>
                </div>
              </div>
            )}

            {/* Active Draft Display & Editor */}
            <div className="mt-5">
              <div className="flex items-center justify-between text-xs text-[#7A5E75] mb-2">
                <span className="font-medium">
                  {TONE_LABELS[activeTone].label} ·{' '}
                  <span className="italic">{TONE_LABELS[activeTone].tagline}</span>
                </span>
                {draftMap?.[activeTone]?.focusArea && (
                  <span className="text-[11px] font-semibold text-[#8B4D7E] bg-[#F4EEF7] px-2 py-0.5 rounded-md border border-[#E5DAE9]">
                    Focus: {draftMap[activeTone].focusArea}
                  </span>
                )}
              </div>

              {/* Message Box */}
              {!isEditingDraft ? (
                <div className="p-4 sm:p-5 rounded-2xl bg-[#FAF7F2] border border-[#E6DDE9] text-[#281426] text-sm sm:text-base leading-relaxed font-sans relative group">
                  <p className="whitespace-pre-wrap">{currentDraftText}</p>

                  {/* Why it works caption */}
                  {draftMap && (
                    <div className="mt-3.5 pt-3 border-t border-[#ECE3F0] flex items-center gap-1.5 text-xs text-[#6F516B]">
                      <span className="font-semibold text-[#281426]">Why it works:</span>
                      <span>{draftMap[activeTone].whyItWorks}</span>
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-2">
                  <textarea
                    defaultValue={currentDraftText}
                    id="inlineDraftEditor"
                    rows={4}
                    className="w-full text-sm sm:text-base p-4 rounded-2xl border-2 border-[#D95D4A] bg-[#FFFFFF] text-[#281426] focus:outline-none leading-relaxed font-sans"
                  />
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-[#846980]">
                      Edit to sound authentically like your voice.
                    </span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setIsEditingDraft(false)}
                        className="px-3 py-1.5 rounded-lg border border-[#DDD1E2] text-[#6F516B] hover:bg-[#F6EFF8] transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => {
                          const val = (
                            document.getElementById(
                              'inlineDraftEditor'
                            ) as HTMLTextAreaElement
                          )?.value;
                          if (val) handleSaveInlineEdit(val);
                        }}
                        className="px-3.5 py-1.5 rounded-lg bg-[#281426] text-[#FAF7F2] font-semibold hover:bg-[#3E213B] transition-colors"
                      >
                        Save changes
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Working Controls Bar */}
              <div className="mt-4 flex flex-wrap items-center justify-between gap-2.5 pt-2">
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleCycleVariant}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-[#DED1E3] bg-[#FFFFFF] text-xs font-semibold text-[#573952] hover:bg-[#F7EFF9] transition-colors shadow-2xs"
                  >
                    <RefreshCw className="w-3.5 h-3.5 text-[#D95D4A]" />
                    <span>Generate another option</span>
                  </button>

                  {!isEditingDraft && (
                    <button
                      onClick={() => setIsEditingDraft(true)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-[#DED1E3] bg-[#FFFFFF] text-xs font-semibold text-[#573952] hover:bg-[#F7EFF9] transition-colors shadow-2xs"
                    >
                      <Edit3 className="w-3.5 h-3.5 text-[#886984]" />
                      <span>Edit message</span>
                    </button>
                  )}

                  {editedDrafts[currentDraftKey] !== undefined && (
                    <button
                      onClick={handleResetDraft}
                      className="text-xs text-[#895E81] hover:text-[#281426] underline underline-offset-2 px-1 transition-colors"
                    >
                      Reset draft
                    </button>
                  )}

                  {/* Bookmark to Favorite Prompts button */}
                  <button
                    onClick={handleSaveAsFavoritePrompt}
                    className={`flex items-center gap-1 text-xs px-2.5 py-1.5 rounded-xl border transition-colors ${
                      isPromptFavorited
                        ? 'bg-[#EDF6F1] border-[#C2E3D0] text-[#2E7E52]'
                        : 'border-[#DED1E3] bg-[#FFFFFF] text-[#6B4F67] hover:bg-[#F7EFF9]'
                    }`}
                    title="Bookmark this prompt into My Space"
                  >
                    <Star
                      className={`w-3.5 h-3.5 ${
                        isPromptFavorited ? 'fill-[#2E7E52] text-[#2E7E52]' : 'text-[#886984]'
                      }`}
                    />
                    <span>{isPromptFavorited ? 'Favorited' : 'Favorite Prompt'}</span>
                  </button>
                </div>

                <div className="text-[11px] text-[#9A8498] italic">
                  Suggested message draft (curated locally)
                </div>
              </div>
            </div>
          </section>

          {/* STAGE THREE: MAKE IT HAPPEN */}
          <section className="bg-[#FAF7F2] border border-[#E7DCEB] rounded-2xl p-5 sm:p-6 shadow-xs">
            <div className="pb-3 border-b border-[#ECE0EF] mb-4">
              <span className="text-[11px] font-mono font-semibold uppercase tracking-wider text-[#987895]">
                Stage Three · Make it happen
              </span>
              <h3 className="font-serif-display text-xl font-bold text-[#281426] mt-0.5">
                Take thoughtful action
              </h3>
              <p className="text-xs sm:text-sm text-[#73546E] mt-1">
                Choose how you would like to follow through with these words.
              </p>
            </div>

            {/* Action Buttons Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2.5">
              {/* Action 1: Copy */}
              <button
                onClick={handleCopyMessage}
                className={`flex flex-col items-center justify-center p-3.5 rounded-xl border transition-all text-center ${
                  hasCopied
                    ? 'bg-[#EBF7F0] border-[#9DD4B4] text-[#1D5E3A]'
                    : 'bg-[#FFFFFF] border-[#E2D6E6] hover:border-[#D95D4A] text-[#281426] hover:shadow-xs'
                }`}
              >
                {hasCopied ? (
                  <Check className="w-5 h-5 text-[#2E7E52] mb-1.5" />
                ) : (
                  <Copy className="w-5 h-5 text-[#D95D4A] mb-1.5" />
                )}
                <span className="text-xs font-bold">
                  {hasCopied ? 'Copied!' : 'Copy to clipboard'}
                </span>
                <span className="text-[11px] text-[#7C6278] mt-0.5">
                  Paste into any app
                </span>
              </button>

              {/* Action 2: Share */}
              <button
                onClick={handleShareMessage}
                className="flex flex-col items-center justify-center p-3.5 rounded-xl border bg-[#FFFFFF] border-[#E2D6E6] hover:border-[#D95D4A] text-[#281426] hover:shadow-xs transition-all text-center"
              >
                <Share2 className="w-5 h-5 text-[#8B4D7E] mb-1.5" />
                <span className="text-xs font-bold">Share message</span>
                <span className="text-[11px] text-[#7C6278] mt-0.5">
                  Native share or email
                </span>
              </button>

              {/* Action 3: Save to My Space */}
              <button
                onClick={handleSaveToMySpace}
                className={`flex flex-col items-center justify-center p-3.5 rounded-xl border transition-all text-center ${
                  isDraftSaved
                    ? 'bg-[#F2EDF7] border-[#C5B3D2] text-[#442340]'
                    : 'bg-[#FFFFFF] border-[#E2D6E6] hover:border-[#D95D4A] text-[#281426] hover:shadow-xs'
                }`}
              >
                {isDraftSaved ? (
                  <CheckCircle2 className="w-5 h-5 text-[#3C7B5D] mb-1.5" />
                ) : (
                  <Bookmark className="w-5 h-5 text-[#8B4D7E] mb-1.5" />
                )}
                <span className="text-xs font-bold">
                  {isDraftSaved ? 'Saved in My Space' : 'Save as private draft'}
                </span>
                <span className="text-[11px] text-[#7C6278] mt-0.5">
                  Keep for later
                </span>
              </button>

              {/* Action 4: Schedule Reminder */}
              <button
                onClick={() => {
                  setShowReminderForm(!showReminderForm);
                  setCompassStage('remember');
                }}
                className={`flex flex-col items-center justify-center p-3.5 rounded-xl border transition-all text-center ${
                  showReminderForm || savedReminderRecord
                    ? 'bg-[#281426] border-[#281426] text-[#FAF7F2]'
                    : 'bg-[#FFFFFF] border-[#E2D6E6] hover:border-[#D95D4A] text-[#281426] hover:shadow-xs'
                }`}
              >
                <Calendar className={`w-5 h-5 mb-1.5 ${showReminderForm || savedReminderRecord ? 'text-[#E58778]' : 'text-[#D95D4A]'}`} />
                <span className="text-xs font-bold">
                  {savedReminderRecord ? 'Reminder Scheduled' : 'Schedule follow-up'}
                </span>
                <span className={`text-[11px] mt-0.5 ${showReminderForm || savedReminderRecord ? 'text-[#D5C2D4]' : 'text-[#7C6278]'}`}>
                  Set a gentle prompt
                </span>
              </button>
            </div>

            {/* Saved Reminder Confirmation Banner */}
            {savedReminderRecord && !showReminderForm && (
              <div className="mt-4 p-4 rounded-xl bg-[#EDF7F2] border border-[#BCE1CD] flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <CalendarCheck className="w-5 h-5 text-[#2E7E52] shrink-0" />
                  <div>
                    <p className="text-xs font-bold text-[#1D5E3A]">
                      Follow-up reminder confirmed
                    </p>
                    <p className="text-[11px] text-[#346F4C]">
                      "{savedReminderRecord.title}" scheduled for{' '}
                      <span className="font-semibold">{savedReminderRecord.dueDate}</span> at{' '}
                      {savedReminderRecord.dueTime}.
                    </p>
                  </div>
                </div>
                <button
                  onClick={onNavigateToMySpace}
                  className="px-3 py-1.5 text-xs font-semibold bg-[#2E7E52] text-white rounded-lg hover:bg-[#256843] transition-colors shrink-0"
                >
                  View in My Space
                </button>
              </div>
            )}

            {/* Inline Reminder Scheduling Form */}
            {showReminderForm && (
              <form
                onSubmit={handleSaveReminder}
                className="mt-4 p-4 sm:p-5 rounded-2xl bg-[#FFFFFF] border border-[#DECDE2] shadow-xs space-y-4"
              >
                <div className="flex items-center justify-between border-b border-[#EFE8F3] pb-2.5">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-[#D95D4A]" />
                    <h4 className="font-serif-display text-base font-bold text-[#281426]">
                      Schedule a gentle follow-up
                    </h4>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowReminderForm(false)}
                    className="text-xs text-[#8A6A86] hover:text-[#281426]"
                  >
                    Close
                  </button>
                </div>

                {/* Pre-populated action title */}
                <div>
                  <label
                    htmlFor="remTitle"
                    className="block text-xs font-semibold text-[#4A3046] mb-1"
                  >
                    Action Title
                  </label>
                  <input
                    id="remTitle"
                    type="text"
                    value={reminderTitle}
                    onChange={(e) => setReminderTitle(e.target.value)}
                    required
                    className="w-full text-xs sm:text-sm p-2.5 rounded-xl border border-[#D8C7DD] bg-[#FAF7F2] text-[#281426] focus:outline-none focus:ring-2 focus:ring-[#D95D4A]"
                  />
                </div>

                {/* Quick Date Presets */}
                <div>
                  <span className="block text-xs font-medium text-[#7A6076] mb-1.5">
                    Quick timing presets:
                  </span>
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => setPresetDate(1, '09:00')}
                      className="px-2.5 py-1 text-xs rounded-lg border border-[#DACBE0] bg-[#F7EFF9] text-[#4F334B] hover:bg-[#EFE4F3] transition-colors"
                    >
                      Tomorrow (9:00 AM)
                    </button>
                    <button
                      type="button"
                      onClick={() => setPresetDate(2, '11:00')}
                      className="px-2.5 py-1 text-xs rounded-lg border border-[#DACBE0] bg-[#F7EFF9] text-[#4F334B] hover:bg-[#EFE4F3] transition-colors"
                    >
                      In 2 days
                    </button>
                    <button
                      type="button"
                      onClick={() => setPresetDate(4, '11:30')}
                      className="px-2.5 py-1 text-xs rounded-lg border border-[#DACBE0] bg-[#F7EFF9] text-[#4F334B] hover:bg-[#EFE4F3] transition-colors"
                    >
                      This weekend
                    </button>
                    <button
                      type="button"
                      onClick={() => setPresetDate(7, '10:00')}
                      className="px-2.5 py-1 text-xs rounded-lg border border-[#DACBE0] bg-[#F7EFF9] text-[#4F334B] hover:bg-[#EFE4F3] transition-colors"
                    >
                      Next week
                    </button>
                  </div>
                </div>

                {/* Date & Time Inputs */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label
                      htmlFor="remDate"
                      className="block text-xs font-semibold text-[#4A3046] mb-1"
                    >
                      Date
                    </label>
                    <input
                      id="remDate"
                      type="date"
                      value={reminderDate}
                      onChange={(e) => setReminderDate(e.target.value)}
                      required
                      className="w-full text-xs sm:text-sm p-2 rounded-xl border border-[#D8C7DD] bg-[#FAF7F2] text-[#281426] focus:outline-none focus:ring-2 focus:ring-[#D95D4A]"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="remTime"
                      className="block text-xs font-semibold text-[#4A3046] mb-1"
                    >
                      Time
                    </label>
                    <input
                      id="remTime"
                      type="time"
                      value={reminderTime}
                      onChange={(e) => setReminderTime(e.target.value)}
                      required
                      className="w-full text-xs sm:text-sm p-2 rounded-xl border border-[#D8C7DD] bg-[#FAF7F2] text-[#281426] focus:outline-none focus:ring-2 focus:ring-[#D95D4A]"
                    />
                  </div>
                </div>

                {/* Notes (Optional) */}
                <div>
                  <label
                    htmlFor="remNotes"
                    className="block text-xs font-semibold text-[#4A3046] mb-1"
                  >
                    Personal Note (Optional)
                  </label>
                  <input
                    id="remNotes"
                    type="text"
                    value={reminderNotes}
                    onChange={(e) => setReminderNotes(e.target.value)}
                    placeholder="E.g., Check if she replied, or send quick follow-up wave."
                    className="w-full text-xs sm:text-sm p-2 rounded-xl border border-[#D8C7DD] bg-[#FAF7F2] text-[#281426] focus:outline-none focus:ring-2 focus:ring-[#D95D4A]"
                  />
                </div>

                <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-[#EFE8F3]">
                  <button
                    type="button"
                    onClick={() => setShowReminderForm(false)}
                    className="px-3.5 py-1.5 text-xs text-[#735770] hover:text-[#281426] transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-xs font-semibold bg-[#281426] text-[#FAF7F2] rounded-xl hover:bg-[#3E213B] transition-colors shadow-xs"
                  >
                    Confirm & Save Reminder
                  </button>
                </div>
              </form>
            )}
          </section>
        </div>
      )}
    </div>
  );
};
