import { FollowUpReminder, SavedDraft, PrivateReflection, FavoritePrompt } from '../types';

const REMINDERS_KEY = 'heartsync_reminders_v1';
const DRAFTS_KEY = 'heartsync_saved_drafts_v1';
const REFLECTIONS_KEY = 'heartsync_reflections_v1';
const PROMPTS_KEY = 'heartsync_favorite_prompts_v1';

function isStorageAvailable(): boolean {
  try {
    const test = '__storage_test__';
    localStorage.setItem(test, test);
    localStorage.removeItem(test);
    return true;
  } catch {
    return false;
  }
}

function notifyDataChanged() {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('heartsync:storage_updated'));
  }
}

// Reminders
export function getReminders(): FollowUpReminder[] {
  if (!isStorageAvailable()) return [];
  try {
    const raw = localStorage.getItem(REMINDERS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (err) {
    console.error('Failed to read reminders from storage', err);
    return [];
  }
}

export function saveReminder(reminder: Omit<FollowUpReminder, 'id' | 'createdAt'>): FollowUpReminder {
  const existing = getReminders();
  const created: FollowUpReminder = {
    ...reminder,
    id: 'rem_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7),
    createdAt: new Date().toISOString(),
  };
  const updated = [created, ...existing];
  try {
    localStorage.setItem(REMINDERS_KEY, JSON.stringify(updated));
    notifyDataChanged();
  } catch (err) {
    console.error('Failed to save reminder', err);
  }
  return created;
}

export function updateReminder(id: string, updates: Partial<FollowUpReminder>): FollowUpReminder | null {
  const existing = getReminders();
  const index = existing.findIndex((r) => r.id === id);
  if (index === -1) return null;

  const updatedItem = { ...existing[index], ...updates };
  existing[index] = updatedItem;
  try {
    localStorage.setItem(REMINDERS_KEY, JSON.stringify(existing));
    notifyDataChanged();
  } catch (err) {
    console.error('Failed to update reminder', err);
  }
  return updatedItem;
}

export function deleteReminder(id: string): boolean {
  const existing = getReminders();
  const filtered = existing.filter((r) => r.id !== id);
  try {
    localStorage.setItem(REMINDERS_KEY, JSON.stringify(filtered));
    notifyDataChanged();
    return true;
  } catch (err) {
    console.error('Failed to delete reminder', err);
    return false;
  }
}

export function toggleReminderComplete(id: string): FollowUpReminder | null {
  const existing = getReminders();
  const target = existing.find((r) => r.id === id);
  if (!target) return null;

  const completed = !target.completed;
  return updateReminder(id, {
    completed,
    completedAt: completed ? new Date().toISOString() : undefined,
  });
}

// Saved Drafts
export function getSavedDrafts(): SavedDraft[] {
  if (!isStorageAvailable()) return [];
  try {
    const raw = localStorage.getItem(DRAFTS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (err) {
    console.error('Failed to read drafts from storage', err);
    return [];
  }
}

export function saveDraft(draft: Omit<SavedDraft, 'id' | 'createdAt' | 'updatedAt'>): SavedDraft {
  const existing = getSavedDrafts();
  const created: SavedDraft = {
    ...draft,
    id: 'draft_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  const updated = [created, ...existing];
  try {
    localStorage.setItem(DRAFTS_KEY, JSON.stringify(updated));
    notifyDataChanged();
  } catch (err) {
    console.error('Failed to save draft', err);
  }
  return created;
}

export function updateDraft(id: string, content: string): SavedDraft | null {
  const existing = getSavedDrafts();
  const index = existing.findIndex((d) => d.id === id);
  if (index === -1) return null;

  const updatedItem = {
    ...existing[index],
    content,
    updatedAt: new Date().toISOString(),
  };
  existing[index] = updatedItem;
  try {
    localStorage.setItem(DRAFTS_KEY, JSON.stringify(existing));
    notifyDataChanged();
  } catch (err) {
    console.error('Failed to update draft', err);
  }
  return updatedItem;
}

export function deleteDraft(id: string): boolean {
  const existing = getSavedDrafts();
  const filtered = existing.filter((d) => d.id !== id);
  try {
    localStorage.setItem(DRAFTS_KEY, JSON.stringify(filtered));
    notifyDataChanged();
    return true;
  } catch (err) {
    console.error('Failed to delete draft', err);
    return false;
  }
}

// Reflections
export function getReflections(): PrivateReflection[] {
  if (!isStorageAvailable()) return [];
  try {
    const raw = localStorage.getItem(REFLECTIONS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (err) {
    console.error('Failed to read reflections from storage', err);
    return [];
  }
}

export function saveReflection(ref: Omit<PrivateReflection, 'id' | 'createdAt'>): PrivateReflection {
  const existing = getReflections();
  const created: PrivateReflection = {
    ...ref,
    id: 'refl_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7),
    createdAt: new Date().toISOString(),
  };
  const updated = [created, ...existing];
  try {
    localStorage.setItem(REFLECTIONS_KEY, JSON.stringify(updated));
    notifyDataChanged();
  } catch (err) {
    console.error('Failed to save reflection', err);
  }
  return created;
}

export function deleteReflection(id: string): boolean {
  const existing = getReflections();
  const filtered = existing.filter((r) => r.id !== id);
  try {
    localStorage.setItem(REFLECTIONS_KEY, JSON.stringify(filtered));
    notifyDataChanged();
    return true;
  } catch (err) {
    console.error('Failed to delete reflection', err);
    return false;
  }
}

// Favorite Prompts
export function getFavoritePrompts(): FavoritePrompt[] {
  if (!isStorageAvailable()) return [];
  try {
    const raw = localStorage.getItem(PROMPTS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (err) {
    console.error('Failed to read favorite prompts from storage', err);
    return [];
  }
}

export function saveFavoritePrompt(prompt: Omit<FavoritePrompt, 'id' | 'createdAt'>): FavoritePrompt {
  const existing = getFavoritePrompts();
  const created: FavoritePrompt = {
    ...prompt,
    id: 'prompt_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7),
    createdAt: new Date().toISOString(),
  };
  const updated = [created, ...existing];
  try {
    localStorage.setItem(PROMPTS_KEY, JSON.stringify(updated));
    notifyDataChanged();
  } catch (err) {
    console.error('Failed to save favorite prompt', err);
  }
  return created;
}

export function updateFavoritePrompt(id: string, updates: Partial<FavoritePrompt>): FavoritePrompt | null {
  const existing = getFavoritePrompts();
  const index = existing.findIndex((p) => p.id === id);
  if (index === -1) return null;

  const updatedItem = { ...existing[index], ...updates };
  existing[index] = updatedItem;
  try {
    localStorage.setItem(PROMPTS_KEY, JSON.stringify(existing));
    notifyDataChanged();
  } catch (err) {
    console.error('Failed to update favorite prompt', err);
  }
  return updatedItem;
}

export function deleteFavoritePrompt(id: string): boolean {
  const existing = getFavoritePrompts();
  const filtered = existing.filter((p) => p.id !== id);
  try {
    localStorage.setItem(PROMPTS_KEY, JSON.stringify(filtered));
    notifyDataChanged();
    return true;
  } catch (err) {
    console.error('Failed to delete favorite prompt', err);
    return false;
  }
}

// Data Export & Clear
export function exportAllData(): string {
  const data = {
    exportDate: new Date().toISOString(),
    source: 'HeartSync',
    reminders: getReminders(),
    savedDrafts: getSavedDrafts(),
    reflections: getReflections(),
    favoritePrompts: getFavoritePrompts(),
  };
  return JSON.stringify(data, null, 2);
}

export function clearAllLocalData(): void {
  try {
    localStorage.removeItem(REMINDERS_KEY);
    localStorage.removeItem(DRAFTS_KEY);
    localStorage.removeItem(REFLECTIONS_KEY);
    localStorage.removeItem(PROMPTS_KEY);
    notifyDataChanged();
  } catch (err) {
    console.error('Failed to clear data', err);
  }
}
