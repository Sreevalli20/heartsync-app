import React, { useState, useEffect } from 'react';
import {
  Calendar,
  Bookmark,
  BookOpen,
  CheckCircle2,
  Circle,
  Trash2,
  Edit2,
  Download,
  AlertTriangle,
  ArrowRight,
  Clock,
  Sparkles,
  Copy,
  Check,
  Shield,
  Layers,
  Star,
  Plus,
  Send,
  MessageSquare,
  HelpCircle,
} from 'lucide-react';
import {
  FollowUpReminder,
  SavedDraft,
  PrivateReflection,
  FavoritePrompt,
  PromptCategory,
  IntentionId,
} from '../types';
import {
  getReminders,
  getSavedDrafts,
  getReflections,
  getFavoritePrompts,
  toggleReminderComplete,
  deleteReminder,
  updateReminder,
  deleteDraft,
  updateDraft,
  deleteReflection,
  saveFavoritePrompt,
  deleteFavoritePrompt,
  updateFavoritePrompt,
  exportAllData,
  clearAllLocalData,
} from '../services/storage';
import { STARTER_PROMPTS } from '../data/curatedPrompts';

interface MySpaceProps {
  onStartReconnection: () => void;
  onOpenReflection: () => void;
  onUsePromptInStudio?: (text: string, intentionId?: IntentionId) => void;
  showToast: (title: string, description?: string, type?: 'success' | 'info' | 'warning') => void;
}

type TabFilter = 'all' | 'reminders' | 'drafts' | 'reflections' | 'prompts';

export const MySpace: React.FC<MySpaceProps> = ({
  onStartReconnection,
  onOpenReflection,
  onUsePromptInStudio,
  showToast,
}) => {
  const [reminders, setReminders] = useState<FollowUpReminder[]>([]);
  const [drafts, setDrafts] = useState<SavedDraft[]>([]);
  const [reflections, setReflections] = useState<PrivateReflection[]>([]);
  const [favoritePrompts, setFavoritePrompts] = useState<FavoritePrompt[]>([]);
  const [activeTab, setActiveTab] = useState<TabFilter>('all');

  // Editing state for Reminder
  const [editingReminderId, setEditingReminderId] = useState<string | null>(null);
  const [editReminderTitle, setEditReminderTitle] = useState<string>('');
  const [editReminderDate, setEditReminderDate] = useState<string>('');

  // Editing state for Draft
  const [editingDraftId, setEditingDraftId] = useState<string | null>(null);
  const [editDraftText, setEditDraftText] = useState<string>('');

  // Editing state for Prompt
  const [editingPromptId, setEditingPromptId] = useState<string | null>(null);
  const [editPromptTitle, setEditPromptTitle] = useState<string>('');
  const [editPromptText, setEditPromptText] = useState<string>('');

  // Add custom prompt form
  const [showAddPromptForm, setShowAddPromptForm] = useState<boolean>(false);
  const [showBrowseStarters, setShowBrowseStarters] = useState<boolean>(false);
  const [newPromptTitle, setNewPromptTitle] = useState<string>('');
  const [newPromptText, setNewPromptText] = useState<string>('');
  const [newPromptCategory, setNewPromptCategory] = useState<PromptCategory>('conversation_starter');
  const [newPromptNote, setNewPromptNote] = useState<string>('');

  // Delete all confirmation modal
  const [showClearModal, setShowClearModal] = useState<boolean>(false);

  // Copied items trackers
  const [copiedItemId, setCopiedItemId] = useState<string | null>(null);

  const loadData = () => {
    setReminders(getReminders());
    setDrafts(getSavedDrafts());
    setReflections(getReflections());
    setFavoritePrompts(getFavoritePrompts());
  };

  useEffect(() => {
    loadData();
    const handleStorageUpdate = () => {
      loadData();
    };
    window.addEventListener('heartsync:storage_updated', handleStorageUpdate);
    return () => {
      window.removeEventListener('heartsync:storage_updated', handleStorageUpdate);
    };
  }, []);

  // Reminder actions
  const handleToggleReminder = (id: string) => {
    const res = toggleReminderComplete(id);
    if (res) {
      loadData();
      showToast(
        res.completed ? 'Reminder completed' : 'Reminder reopened',
        `"${res.title}" marked as ${res.completed ? 'done' : 'active'}.`,
        'success'
      );
    }
  };

  const handleDeleteReminder = (id: string, title: string) => {
    if (window.confirm(`Delete the reminder "${title}"?`)) {
      deleteReminder(id);
      loadData();
      showToast('Reminder deleted', `"${title}" was removed.`, 'info');
    }
  };

  const handleSaveReminderEdit = (id: string) => {
    if (!editReminderTitle.trim() || !editReminderDate) return;
    updateReminder(id, {
      title: editReminderTitle.trim(),
      dueDate: editReminderDate,
    });
    setEditingReminderId(null);
    loadData();
    showToast('Reminder updated', 'Changes saved successfully.', 'success');
  };

  // Draft actions
  const handleDeleteDraft = (id: string) => {
    if (window.confirm('Delete this saved draft?')) {
      deleteDraft(id);
      loadData();
      showToast('Draft removed', 'Saved draft deleted.', 'info');
    }
  };

  const handleSaveDraftEdit = (id: string) => {
    if (!editDraftText.trim()) return;
    updateDraft(id, editDraftText.trim());
    setEditingDraftId(null);
    loadData();
    showToast('Draft updated', 'Custom wording updated.', 'success');
  };

  const handleCopyText = async (id: string, text: string) => {
    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(text);
      } else {
        const textarea = document.createElement('textarea');
        textarea.value = text;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
      }
      setCopiedItemId(id);
      setTimeout(() => setCopiedItemId(null), 2500);
      showToast('Copied to clipboard', 'Message ready to send.', 'success');
    } catch {
      showToast('Copy failed', 'Please select text manually.', 'warning');
    }
  };

  // Reflection actions
  const handleDeleteReflection = (id: string) => {
    if (window.confirm('Delete this reflection entry?')) {
      deleteReflection(id);
      loadData();
      showToast('Reflection removed', 'Entry deleted from private space.', 'info');
    }
  };

  // Favorite Prompt actions
  const handleCreatePrompt = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPromptTitle.trim() || !newPromptText.trim()) {
      showToast('Title & text required', 'Please provide a title and prompt text.', 'warning');
      return;
    }
    saveFavoritePrompt({
      title: newPromptTitle.trim(),
      text: newPromptText.trim(),
      category: newPromptCategory,
      note: newPromptNote.trim() || undefined,
    });
    setNewPromptTitle('');
    setNewPromptText('');
    setNewPromptNote('');
    setShowAddPromptForm(false);
    loadData();
    showToast('Favorite prompt saved', 'Added to your permanent collection.', 'success');
  };

  const handleBookmarkStarter = (starter: Omit<FavoritePrompt, 'id' | 'createdAt'>) => {
    saveFavoritePrompt(starter);
    loadData();
    showToast('Starter prompt added', `"${starter.title}" saved to your favorites.`, 'success');
  };

  const handleDeletePrompt = (id: string, title: string) => {
    if (window.confirm(`Remove "${title}" from favorite prompts?`)) {
      deleteFavoritePrompt(id);
      loadData();
      showToast('Prompt removed', 'Removed from your favorites.', 'info');
    }
  };

  const handleSavePromptEdit = (id: string) => {
    if (!editPromptTitle.trim() || !editPromptText.trim()) return;
    updateFavoritePrompt(id, {
      title: editPromptTitle.trim(),
      text: editPromptText.trim(),
    });
    setEditingPromptId(null);
    loadData();
    showToast('Prompt updated', 'Changes saved successfully.', 'success');
  };

  const handleLaunchPromptInStudio = (prompt: FavoritePrompt) => {
    if (onUsePromptInStudio) {
      let intId: IntentionId | undefined = undefined;
      if (prompt.category === 'repair') intId = 'repair_conversation';
      else if (prompt.category === 'support') intId = 'support_difficult';
      else if (prompt.category === 'appreciation') intId = 'express_appreciation';
      else intId = 'reconnect_busy';

      onUsePromptInStudio(prompt.text, intId);
      showToast('Prompt loaded into Studio', 'Opening Reconnection Studio with this text.', 'success');
    } else {
      onStartReconnection();
    }
  };

  // Export data
  const handleExportData = () => {
    const jsonStr = exportAllData();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `heartsync-records-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('Records exported', 'Downloaded your private JSON backup.', 'success');
  };

  // Clear data
  const handleConfirmClearAll = () => {
    clearAllLocalData();
    loadData();
    setShowClearModal(false);
    showToast('All local records cleared', 'Your device storage has been wiped clean.', 'info');
  };

  const totalRecordsCount =
    reminders.length + drafts.length + reflections.length + favoritePrompts.length;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#EBDDEE]">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#987895] mb-1">
            <Layers className="w-3.5 h-3.5 text-[#D95D4A]" />
            <span>Personal Workspace</span>
          </div>
          <h1 className="font-serif-display text-2xl sm:text-3xl font-bold text-[#281426]">
            My Space
          </h1>
          <p className="text-xs sm:text-sm text-[#73556E] mt-1">
            Only records you create are stored here. Private to this browser.
          </p>
        </div>

        {/* Data Tools */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          {totalRecordsCount > 0 && (
            <>
              <button
                onClick={handleExportData}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-[#DCD0E1] bg-[#FFFFFF] text-xs font-semibold text-[#5A3C55] hover:bg-[#F6EFF8] transition-colors shadow-2xs"
                title="Download local JSON copy"
              >
                <Download className="w-3.5 h-3.5 text-[#886984]" />
                <span>Export Data</span>
              </button>

              <button
                onClick={() => setShowClearModal(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-[#E9CAD1] bg-[#FDF6F7] text-xs font-semibold text-[#A2384C] hover:bg-[#FBECEF] transition-colors shadow-2xs"
                title="Permanently remove all records"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Clear Data</span>
              </button>
            </>
          )}
        </div>
      </div>

      {/* Filter Tabs */}
      {totalRecordsCount > 0 && (
        <div className="flex items-center gap-2 py-4 overflow-x-auto">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
              activeTab === 'all'
                ? 'bg-[#281426] text-[#FAF7F2]'
                : 'bg-[#F2EDF7] text-[#694D64] hover:text-[#281426]'
            }`}
          >
            All Records ({totalRecordsCount})
          </button>
          <button
            onClick={() => setActiveTab('reminders')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
              activeTab === 'reminders'
                ? 'bg-[#281426] text-[#FAF7F2]'
                : 'bg-[#F2EDF7] text-[#694D64] hover:text-[#281426]'
            }`}
          >
            Reminders ({reminders.length})
          </button>
          <button
            onClick={() => setActiveTab('drafts')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
              activeTab === 'drafts'
                ? 'bg-[#281426] text-[#FAF7F2]'
                : 'bg-[#F2EDF7] text-[#694D64] hover:text-[#281426]'
            }`}
          >
            Saved Drafts ({drafts.length})
          </button>
          <button
            onClick={() => setActiveTab('prompts')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
              activeTab === 'prompts'
                ? 'bg-[#281426] text-[#FAF7F2]'
                : 'bg-[#F2EDF7] text-[#694D64] hover:text-[#281426]'
            }`}
          >
            Favorite Prompts ({favoritePrompts.length})
          </button>
          <button
            onClick={() => setActiveTab('reflections')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
              activeTab === 'reflections'
                ? 'bg-[#281426] text-[#FAF7F2]'
                : 'bg-[#F2EDF7] text-[#694D64] hover:text-[#281426]'
            }`}
          >
            Reflections ({reflections.length})
          </button>
        </div>
      )}

      {/* EMPTY STATE */}
      {totalRecordsCount === 0 && (
        <div className="my-10 p-8 sm:p-12 text-center rounded-3xl bg-[#FFFFFF] border border-[#E8DFEC] shadow-xs max-w-lg mx-auto">
          <div className="w-12 h-12 rounded-2xl bg-[#F4EEF7] text-[#D95D4A] flex items-center justify-center mx-auto mb-4">
            <Sparkles className="w-6 h-6" />
          </div>
          <h2 className="font-serif-display text-xl sm:text-2xl font-bold text-[#281426]">
            Your personal space is quiet
          </h2>
          <p className="text-xs sm:text-sm text-[#73546E] mt-2 mb-6 leading-relaxed">
            HeartSync does not invent sample data or fake conversations. When you save message drafts, reminders, favorite prompts, or private reflections, they will appear here.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={onStartReconnection}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#281426] hover:bg-[#3D1F3A] text-[#FAF7F2] text-xs sm:text-sm font-semibold transition-all shadow-xs active:scale-[0.98]"
            >
              <span>Open Reconnection Studio</span>
              <ArrowRight className="w-4 h-4 text-[#E58778]" />
            </button>
            <button
              onClick={() => {
                setShowBrowseStarters(true);
                setActiveTab('prompts');
              }}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-[#D5C2D9] bg-[#FFFFFF] text-xs sm:text-sm font-semibold text-[#5A3C55] hover:bg-[#F6EFF8] transition-colors"
            >
              <Star className="w-4 h-4 text-[#D95D4A]" />
              <span>Explore Curated Prompts</span>
            </button>
          </div>
        </div>
      )}

      {/* CONTENT LISTS */}
      {totalRecordsCount > 0 && (
        <div className="space-y-8 mt-4">
          {/* Reminders Section */}
          {(activeTab === 'all' || activeTab === 'reminders') && reminders.length > 0 && (
            <section className="space-y-3">
              <div className="flex items-center justify-between">
                <h2 className="font-serif-display text-lg font-bold text-[#281426] flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-[#D95D4A]" />
                  <span>Follow-Up Reminders</span>
                </h2>
                <span className="text-xs text-[#8B6E86]">
                  {reminders.filter((r) => !r.completed).length} active
                </span>
              </div>

              <div className="grid grid-cols-1 gap-2.5">
                {reminders.map((reminder) => {
                  const isEditing = editingReminderId === reminder.id;

                  return (
                    <div
                      key={reminder.id}
                      className={`p-4 rounded-2xl border transition-all ${
                        reminder.completed
                          ? 'bg-[#F9F6FA] border-[#E9DFEB] opacity-75'
                          : 'bg-[#FFFFFF] border-[#E5DBE8] shadow-xs'
                      }`}
                    >
                      {!isEditing ? (
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-start gap-3">
                            <button
                              onClick={() => handleToggleReminder(reminder.id)}
                              className="mt-0.5 text-[#8D7089] hover:text-[#281426] transition-colors"
                              title={
                                reminder.completed
                                  ? 'Mark incomplete'
                                  : 'Mark complete'
                              }
                            >
                              {reminder.completed ? (
                                <CheckCircle2 className="w-5 h-5 text-[#3C7B5D]" />
                              ) : (
                                <Circle className="w-5 h-5 text-[#AE97AC]" />
                              )}
                            </button>

                            <div>
                              <p
                                className={`text-sm sm:text-base font-semibold leading-snug ${
                                  reminder.completed
                                    ? 'line-through text-[#8E748B]'
                                    : 'text-[#281426]'
                                }`}
                              >
                                {reminder.title}
                              </p>

                              <div className="flex flex-wrap items-center gap-2 mt-1.5 text-xs text-[#7A5F76]">
                                <span className="flex items-center gap-1 font-mono">
                                  <Clock className="w-3.5 h-3.5 text-[#D95D4A]" />
                                  <span>{reminder.dueDate}</span>
                                  {reminder.dueTime && (
                                    <span>at {reminder.dueTime}</span>
                                  )}
                                </span>
                                {reminder.notes && (
                                  <>
                                    <span aria-hidden="true">·</span>
                                    <span className="italic">{reminder.notes}</span>
                                  </>
                                )}
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => {
                                setEditingReminderId(reminder.id);
                                setEditReminderTitle(reminder.title);
                                setEditReminderDate(reminder.dueDate);
                              }}
                              className="p-1.5 text-[#8E748B] hover:text-[#281426] transition-colors rounded-lg"
                              title="Edit reminder"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() =>
                                handleDeleteReminder(reminder.id, reminder.title)
                              }
                              className="p-1.5 text-[#B26E7B] hover:text-[#9A2C40] transition-colors rounded-lg"
                              title="Delete reminder"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-3">
                          <input
                            type="text"
                            value={editReminderTitle}
                            onChange={(e) => setEditReminderTitle(e.target.value)}
                            className="w-full text-sm p-2 rounded-xl border border-[#D5C2D9] bg-[#FAF7F2] text-[#281426] focus:outline-none focus:ring-2 focus:ring-[#D95D4A]"
                          />
                          <input
                            type="date"
                            value={editReminderDate}
                            onChange={(e) => setEditReminderDate(e.target.value)}
                            className="text-xs p-2 rounded-xl border border-[#D5C2D9] bg-[#FAF7F2] text-[#281426]"
                          />
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => setEditingReminderId(null)}
                              className="text-xs px-2.5 py-1 text-[#785C74]"
                            >
                              Cancel
                            </button>
                            <button
                              onClick={() => handleSaveReminderEdit(reminder.id)}
                              className="text-xs font-semibold px-3 py-1 rounded-lg bg-[#281426] text-white"
                            >
                              Save
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </section>
          )}

          {/* FAVORITE PROMPTS SECTION (NEW CATEGORY) */}
          {(activeTab === 'all' || activeTab === 'prompts') && (
            <section className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h2 className="font-serif-display text-lg font-bold text-[#281426] flex items-center gap-2">
                    <Star className="w-4 h-4 text-[#D95D4A] fill-[#D95D4A]" />
                    <span>Favorite Prompts</span>
                  </h2>
                  <p className="text-xs text-[#7B5F77] mt-0.5">
                    Your preferred conversation starters, repair frameworks, and reflection questions.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setShowBrowseStarters(!showBrowseStarters)}
                    className="text-xs font-semibold px-3 py-1.5 rounded-xl border border-[#D5C2D9] bg-[#FFFFFF] text-[#5A3C55] hover:bg-[#F6EFF8] transition-colors"
                  >
                    {showBrowseStarters ? 'Hide Starter Library' : 'Browse Starters'}
                  </button>
                  <button
                    onClick={() => setShowAddPromptForm(!showAddPromptForm)}
                    className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-[#281426] text-[#FAF7F2] hover:bg-[#3D1F3A] transition-colors flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Custom Prompt</span>
                  </button>
                </div>
              </div>

              {/* Add Custom Prompt Form */}
              {showAddPromptForm && (
                <form
                  onSubmit={handleCreatePrompt}
                  className="p-4 sm:p-5 rounded-2xl bg-[#FFFFFF] border-2 border-[#D95D4A]/30 shadow-xs space-y-3.5"
                >
                  <div className="flex items-center justify-between border-b border-[#EFE8F3] pb-2">
                    <h3 className="font-serif-display text-base font-bold text-[#281426]">
                      Create a Favorite Prompt
                    </h3>
                    <button
                      type="button"
                      onClick={() => setShowAddPromptForm(false)}
                      className="text-xs text-[#8A6A86] hover:text-[#281426]"
                    >
                      Cancel
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-[#4A3046] mb-1">
                        Title / Name
                      </label>
                      <input
                        type="text"
                        value={newPromptTitle}
                        onChange={(e) => setNewPromptTitle(e.target.value)}
                        placeholder="E.g., De-escalation & Listening starter"
                        required
                        className="w-full text-xs sm:text-sm p-2.5 rounded-xl border border-[#D8C7DD] bg-[#FAF7F2] text-[#281426] focus:outline-none focus:ring-2 focus:ring-[#D95D4A]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-[#4A3046] mb-1">
                        Category
                      </label>
                      <select
                        value={newPromptCategory}
                        onChange={(e) => setNewPromptCategory(e.target.value as PromptCategory)}
                        className="w-full text-xs sm:text-sm p-2.5 rounded-xl border border-[#D8C7DD] bg-[#FAF7F2] text-[#281426] focus:outline-none focus:ring-2 focus:ring-[#D95D4A]"
                      >
                        <option value="conversation_starter">Conversation Starter</option>
                        <option value="repair">Conversation Repair</option>
                        <option value="support">Empathetic Support</option>
                        <option value="reflection">Personal Reflection</option>
                        <option value="appreciation">Appreciation & Gratitude</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#4A3046] mb-1">
                      Prompt or Starter Text
                    </label>
                    <textarea
                      value={newPromptText}
                      onChange={(e) => setNewPromptText(e.target.value)}
                      placeholder="E.g., I value our relationship way too much to let an argument hang between us. I'd love to listen without any defensiveness whenever you're ready."
                      rows={3}
                      required
                      className="w-full text-xs sm:text-sm p-3 rounded-xl border border-[#D8C7DD] bg-[#FAF7F2] text-[#281426] focus:outline-none focus:ring-2 focus:ring-[#D95D4A]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#4A3046] mb-1">
                      Personal Context / Tip (Optional)
                    </label>
                    <input
                      type="text"
                      value={newPromptNote}
                      onChange={(e) => setNewPromptNote(e.target.value)}
                      placeholder="E.g., Use when conversations get heated before going to sleep."
                      className="w-full text-xs sm:text-sm p-2 rounded-xl border border-[#D8C7DD] bg-[#FAF7F2] text-[#281426] focus:outline-none focus:ring-2 focus:ring-[#D95D4A]"
                    />
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#EFE8F3]">
                    <button
                      type="button"
                      onClick={() => setShowAddPromptForm(false)}
                      className="text-xs px-3 py-1.5 text-[#785C74]"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 text-xs font-semibold bg-[#281426] text-[#FAF7F2] rounded-xl hover:bg-[#3D1F3A]"
                    >
                      Save Favorite Prompt
                    </button>
                  </div>
                </form>
              )}

              {/* Browse Starter Library Modal / Strip */}
              {showBrowseStarters && (
                <div className="p-4 sm:p-5 rounded-2xl bg-[#FAF5FB] border border-[#E4D7E8] space-y-3">
                  <div className="flex items-center justify-between pb-2 border-b border-[#E8DCEC]">
                    <h3 className="font-serif-display text-sm font-bold text-[#281426] flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-[#D95D4A]" />
                      <span>Curated Starter Library (Tap + to save to Favorites)</span>
                    </h3>
                    <button
                      onClick={() => setShowBrowseStarters(false)}
                      className="text-xs text-[#8A6A86]"
                    >
                      Close
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {STARTER_PROMPTS.map((starter, sIdx) => {
                      const alreadyFavorited = favoritePrompts.some(
                        (p) => p.text === starter.text
                      );

                      return (
                        <div
                          key={sIdx}
                          className="p-3 rounded-xl bg-[#FFFFFF] border border-[#E9DFEC] flex flex-col justify-between"
                        >
                          <div>
                            <div className="flex items-center justify-between gap-1 mb-1">
                              <span className="font-semibold text-xs text-[#281426]">
                                {starter.title}
                              </span>
                              <span className="text-[10px] font-mono text-[#8C7088] uppercase">
                                {starter.category}
                              </span>
                            </div>
                            <p className="text-xs text-[#5D3F59] leading-relaxed italic mb-1.5">
                              "{starter.text}"
                            </p>
                            {starter.note && (
                              <p className="text-[11px] text-[#866A82]">
                                {starter.note}
                              </p>
                            )}
                          </div>

                          <div className="mt-2.5 pt-2 border-t border-[#F2EAF4] flex items-center justify-end">
                            <button
                              onClick={() => handleBookmarkStarter(starter)}
                              disabled={alreadyFavorited}
                              className={`text-xs px-2.5 py-1 rounded-lg flex items-center gap-1 font-semibold transition-colors ${
                                alreadyFavorited
                                  ? 'bg-[#EDF6F1] text-[#2E7E52]'
                                  : 'bg-[#281426] text-white hover:bg-[#3D1F3A]'
                              }`}
                            >
                              {alreadyFavorited ? (
                                <>
                                  <Check className="w-3 h-3" />
                                  <span>In Favorites</span>
                                </>
                              ) : (
                                <>
                                  <Plus className="w-3 h-3" />
                                  <span>Add to Favorites</span>
                                </>
                              )}
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Favorite Prompts List */}
              {favoritePrompts.length === 0 && !showBrowseStarters && (
                <div className="p-5 rounded-2xl bg-[#FFFFFF] border border-[#E5DBE8] text-center">
                  <p className="text-xs sm:text-sm text-[#73546E]">
                    No favorite prompts saved yet. Add a custom prompt or browse the curated library above!
                  </p>
                </div>
              )}

              <div className="grid grid-cols-1 gap-3">
                {favoritePrompts.map((prompt) => {
                  const isEditing = editingPromptId === prompt.id;
                  const hasCopied = copiedItemId === prompt.id;

                  return (
                    <div
                      key={prompt.id}
                      className="p-4 sm:p-5 rounded-2xl bg-[#FFFFFF] border border-[#E5DBE8] shadow-xs"
                    >
                      <div className="flex items-center justify-between text-xs text-[#8E738B] pb-2 border-b border-[#F2EBF5] mb-2.5">
                        <div className="flex items-center gap-1.5 font-semibold text-[#5A3C55]">
                          <Star className="w-3.5 h-3.5 text-[#D95D4A] fill-[#D95D4A]" />
                          <span>{prompt.title}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="capitalize">{prompt.category.replace('_', ' ')}</span>
                          <span aria-hidden="true">·</span>
                          <span className="font-mono text-[11px]">
                            {new Date(prompt.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>

                      {!isEditing ? (
                        <div>
                          <p className="text-sm sm:text-base text-[#281426] leading-relaxed whitespace-pre-wrap font-sans">
                            "{prompt.text}"
                          </p>
                          {prompt.note && (
                            <p className="text-xs text-[#7B6178] mt-2 italic">
                              Context note: {prompt.note}
                            </p>
                          )}
                        </div>
                      ) : (
                        <div className="space-y-2">
                          <input
                            type="text"
                            value={editPromptTitle}
                            onChange={(e) => setEditPromptTitle(e.target.value)}
                            className="w-full text-xs font-semibold p-2 rounded-xl border border-[#D5C2D9] bg-[#FAF7F2] text-[#281426]"
                          />
                          <textarea
                            value={editPromptText}
                            onChange={(e) => setEditPromptText(e.target.value)}
                            rows={3}
                            className="w-full text-sm p-3 rounded-xl border-2 border-[#D95D4A] bg-[#FAF7F2] text-[#281426] focus:outline-none"
                          />
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => setEditingPromptId(null)}
                              className="text-xs px-2.5 py-1 text-[#785C74]"
                            >
                              Cancel
                            </button>
                            <button
                              onClick={() => handleSavePromptEdit(prompt.id)}
                              className="text-xs font-semibold px-3 py-1 rounded-lg bg-[#281426] text-white"
                            >
                              Save Changes
                            </button>
                          </div>
                        </div>
                      )}

                      {!isEditing && (
                        <div className="mt-4 pt-3 border-t border-[#F2EBF5] flex flex-wrap items-center justify-between gap-2">
                          <div className="flex items-center gap-3">
                            <button
                              onClick={() => handleCopyText(prompt.id, prompt.text)}
                              className="flex items-center gap-1.5 text-xs font-semibold text-[#D95D4A] hover:text-[#B24636] transition-colors"
                            >
                              {hasCopied ? (
                                <>
                                  <Check className="w-3.5 h-3.5 text-[#3C7B5D]" />
                                  <span className="text-[#3C7B5D]">Copied</span>
                                </>
                              ) : (
                                <>
                                  <Copy className="w-3.5 h-3.5" />
                                  <span>Copy prompt</span>
                                </>
                              )}
                            </button>

                            <button
                              onClick={() => handleLaunchPromptInStudio(prompt)}
                              className="flex items-center gap-1 text-xs font-semibold text-[#8B4D7E] hover:text-[#281426] transition-colors"
                            >
                              <Send className="w-3.5 h-3.5" />
                              <span>Use in Studio</span>
                            </button>
                          </div>

                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => {
                                setEditingPromptId(prompt.id);
                                setEditPromptTitle(prompt.title);
                                setEditPromptText(prompt.text);
                              }}
                              className="text-xs text-[#8A6F87] hover:text-[#281426] transition-colors"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDeletePrompt(prompt.id, prompt.title)}
                              className="text-xs text-[#B26E7B] hover:text-[#9A2C40] transition-colors"
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </section>
          )}

          {/* Saved Drafts Section */}
          {(activeTab === 'all' || activeTab === 'drafts') && drafts.length > 0 && (
            <section className="space-y-3">
              <h2 className="font-serif-display text-lg font-bold text-[#281426] flex items-center gap-2">
                <Bookmark className="w-4 h-4 text-[#D95D4A]" />
                <span>Saved Message Drafts</span>
              </h2>

              <div className="grid grid-cols-1 gap-3">
                {drafts.map((draft) => {
                  const isEditing = editingDraftId === draft.id;
                  const hasCopied = copiedItemId === draft.id;

                  return (
                    <div
                      key={draft.id}
                      className="p-4 sm:p-5 rounded-2xl bg-[#FFFFFF] border border-[#E5DBE8] shadow-xs relative"
                    >
                      <div className="flex items-center justify-between text-xs text-[#8E738B] pb-2 border-b border-[#F2EBF5] mb-2.5">
                        <span className="font-semibold text-[#5A3C55]">
                          {draft.intentionTitle}
                        </span>
                        <div className="flex items-center gap-2">
                          <span className="capitalize">{draft.tone} style</span>
                          <span aria-hidden="true">·</span>
                          <span className="font-mono text-[11px]">
                            {new Date(draft.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>

                      {!isEditing ? (
                        <p className="text-sm sm:text-base text-[#281426] leading-relaxed whitespace-pre-wrap font-sans">
                          {draft.content}
                        </p>
                      ) : (
                        <div className="space-y-2">
                          <textarea
                            value={editDraftText}
                            onChange={(e) => setEditDraftText(e.target.value)}
                            rows={3}
                            className="w-full text-sm p-3 rounded-xl border-2 border-[#D95D4A] bg-[#FAF7F2] text-[#281426] focus:outline-none"
                          />
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => setEditingDraftId(null)}
                              className="text-xs px-2.5 py-1 text-[#785C74]"
                            >
                              Cancel
                            </button>
                            <button
                              onClick={() => handleSaveDraftEdit(draft.id)}
                              className="text-xs font-semibold px-3 py-1 rounded-lg bg-[#281426] text-white"
                            >
                              Save Changes
                            </button>
                          </div>
                        </div>
                      )}

                      {!isEditing && (
                        <div className="mt-4 pt-3 border-t border-[#F2EBF5] flex items-center justify-between">
                          <button
                            onClick={() => handleCopyText(draft.id, draft.content)}
                            className="flex items-center gap-1.5 text-xs font-semibold text-[#D95D4A] hover:text-[#B24636] transition-colors"
                          >
                            {hasCopied ? (
                              <>
                                <Check className="w-3.5 h-3.5 text-[#3C7B5D]" />
                                <span className="text-[#3C7B5D]">Copied</span>
                              </>
                            ) : (
                              <>
                                <Copy className="w-3.5 h-3.5" />
                                <span>Copy message</span>
                              </>
                            )}
                          </button>

                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => {
                                setEditingDraftId(draft.id);
                                setEditDraftText(draft.content);
                              }}
                              className="text-xs text-[#8A6F87] hover:text-[#281426] transition-colors"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDeleteDraft(draft.id)}
                              className="text-xs text-[#B26E7B] hover:text-[#9A2C40] transition-colors"
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </section>
          )}

          {/* Reflections Section */}
          {(activeTab === 'all' || activeTab === 'reflections') &&
            reflections.length > 0 && (
              <section className="space-y-3">
                <div className="flex items-center justify-between">
                  <h2 className="font-serif-display text-lg font-bold text-[#281426] flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-[#D95D4A]" />
                    <span>Private Reflections</span>
                  </h2>
                  <button
                    onClick={onOpenReflection}
                    className="text-xs font-semibold text-[#8B4D7E] hover:text-[#281426]"
                  >
                    + New reflection
                  </button>
                </div>

                <div className="grid grid-cols-1 gap-3">
                  {reflections.map((ref) => (
                    <div
                      key={ref.id}
                      className="p-4 sm:p-5 rounded-2xl bg-[#FFFFFF] border border-[#E5DBE8] shadow-xs"
                    >
                      <div className="flex items-center justify-between text-xs text-[#8E738B] pb-2 border-b border-[#F2EBF5] mb-2.5">
                        <span className="font-semibold text-[#5A3C55]">
                          {ref.theme || 'Quiet Reflection'}
                        </span>
                        <span className="font-mono text-[11px]">
                          {new Date(ref.createdAt).toLocaleDateString()}
                        </span>
                      </div>

                      <p className="text-sm sm:text-base text-[#281426] leading-relaxed whitespace-pre-wrap font-sans">
                        "{ref.text}"
                      </p>

                      {ref.suggestedNextStep && (
                        <div className="mt-3 p-2.5 rounded-xl bg-[#FAF5FB] border border-[#EAE0EE] text-xs text-[#5D3F59]">
                          <span className="font-semibold text-[#281426]">
                            Grounded step:{' '}
                          </span>
                          <span>{ref.suggestedNextStep}</span>
                        </div>
                      )}

                      <div className="mt-3 pt-2.5 border-t border-[#F2EBF5] flex items-center justify-end">
                        <button
                          onClick={() => handleDeleteReflection(ref.id)}
                          className="text-xs text-[#B26E7B] hover:text-[#9A2C40] transition-colors"
                        >
                          Delete entry
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}
        </div>
      )}

      {/* Local Storage Privacy Guarantee Banner */}
      <div className="mt-12 p-4 rounded-2xl bg-[#F6F1F8] border border-[#E5D9E8] flex items-start gap-3 text-xs text-[#6B4F67]">
        <Shield className="w-4 h-4 text-[#D95D4A] shrink-0 mt-0.5" />
        <div>
          <p className="font-semibold text-[#281426]">
            Browser-Only Storage Guarantee
          </p>
          <p className="mt-0.5 leading-relaxed">
            All records displayed in My Space reside exclusively in your current browser's local storage. HeartSync operates without a remote database, ensuring your thoughts and messages remain solely yours.
          </p>
        </div>
      </div>

      {/* Clear Data Confirmation Modal */}
      {showClearModal && (
        <div className="fixed inset-0 z-50 bg-[#281426]/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#FFFFFF] border border-[#E5D7E8] rounded-3xl p-6 max-w-md w-full shadow-xl space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#FDEEED] text-[#D95D4A] flex items-center justify-center shrink-0">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-serif-display text-lg font-bold text-[#281426]">
                  Clear all local records?
                </h3>
                <p className="text-xs text-[#7B5F77]">
                  This action is permanent and cannot be undone.
                </p>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-[#5C3F58] leading-relaxed">
              This will erase all your reminders, saved message drafts, favorite prompts, and private reflections from this browser.
            </p>

            <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-[#EFE8F3]">
              <button
                onClick={() => setShowClearModal(false)}
                className="px-4 py-2 text-xs font-semibold rounded-xl border border-[#D9C8DD] text-[#694E65] hover:bg-[#F7EFF9]"
              >
                Keep Records
              </button>
              <button
                onClick={handleConfirmClearAll}
                className="px-4 py-2 text-xs font-semibold rounded-xl bg-[#D95D4A] text-white hover:bg-[#C24B38]"
              >
                Yes, Clear All Data
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
