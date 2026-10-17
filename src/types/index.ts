export type IntentionId =
  | 'reconnect_busy'
  | 'express_appreciation'
  | 'support_difficult'
  | 'repair_conversation';

export interface Intention {
  id: IntentionId;
  label: string;
  tagline: string;
  communicationGoal: string;
  guidancePoints?: string[];
  illustrativeScenario: string;
  scenarioDescription: string;
  suggestedActionTitle: string;
}

export type ToneStyle = 'natural' | 'warm' | 'honest';

export interface DraftOption {
  id: string;
  tone: ToneStyle;
  toneLabel: string;
  toneTagline: string;
  text: string;
  whyItWorks: string;
  focusArea?: string;
}

export type CompassStage = 'notice' | 'express' | 'act' | 'remember';

export interface FollowUpReminder {
  id: string;
  title: string;
  targetPerson?: string;
  dueDate: string; // YYYY-MM-DD
  dueTime: string; // HH:mm
  completed: boolean;
  completedAt?: string;
  intentionId?: IntentionId;
  notes?: string;
  createdAt: string;
}

export interface SavedDraft {
  id: string;
  intentionId: IntentionId;
  intentionTitle: string;
  tone: ToneStyle;
  content: string;
  customContext?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PrivateReflection {
  id: string;
  text: string;
  theme?: string;
  suggestedNextStep?: string;
  createdAt: string;
}

export type PromptCategory =
  | 'conversation_starter'
  | 'reflection'
  | 'repair'
  | 'support'
  | 'appreciation';

export interface FavoritePrompt {
  id: string;
  title: string;
  text: string;
  category: PromptCategory;
  note?: string;
  createdAt: string;
}

export interface ToastMessage {
  id: string;
  title: string;
  description?: string;
  type?: 'success' | 'info' | 'warning';
}
