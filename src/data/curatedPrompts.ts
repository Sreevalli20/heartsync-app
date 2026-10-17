import { FavoritePrompt, PromptCategory } from '../types';

export const STARTER_PROMPTS: Array<Omit<FavoritePrompt, 'id' | 'createdAt'>> = [
  {
    title: 'Low-Pressure Weekly Check-in',
    text: "No need to reply right away! Just wanted to send some love and ask: what was one small moment that brought you calm this week?",
    category: 'conversation_starter',
    note: 'Great for busy friends when you want to avoid asking the generic "how are you?".',
  },
  {
    title: 'Curious Deep Question',
    text: "If you had two hours of completely uninterrupted quiet today, how would your soul want to spend it?",
    category: 'conversation_starter',
    note: 'Opens up a reflective space about current energy and personal space.',
  },
  {
    title: 'Apology & Impact Acknowledgment',
    text: "I realized my tone earlier wasn't fair to you. Regardless of what was going on in my head, I know it stung, and I'm really sorry for that impact.",
    category: 'repair',
    note: 'Separates intent from impact; validates that their pain was real.',
  },
  {
    title: 'Expressing Hurt Without Blame',
    text: "When our conversation got heated earlier, I started feeling overwhelmed and shut down. I care about us too much to keep that bottled up, and I want to talk it through gently whenever you feel ready.",
    category: 'repair',
    note: 'Uses "I" statements to convey vulnerability without accusing the other person.',
  },
  {
    title: 'Seeking Mutual Understanding',
    text: "I value our bond far more than being right. Could we grab a tea or quiet phone call so I can listen to how that conversation felt for you?",
    category: 'repair',
    note: 'Positions listening as the priority before attempting to resolve.',
  },
  {
    title: 'Zero-Pressure Emotional Anchor',
    text: "I know you're carrying a lot right now. Please don't worry about replying to this. Just wanted to remind you that you are deeply loved and you don't have to carry it all in silence.",
    category: 'support',
    note: 'Relieves conversational burden while offering steadfast presence.',
  },
  {
    title: 'Practical Low-Friction Help',
    text: "I'm heading out for some errands shortly—can I drop off your favorite soup or groceries on your porch today? Absolutely zero social energy required.",
    category: 'support',
    note: 'Tangible, specific, and requires no hosting or conversation.',
  },
  {
    title: 'Quiet Daily Reflection',
    text: "Who has been occupying my thoughts lately, and what unsaid gratitude or reassurance could I offer them today?",
    category: 'reflection',
    note: 'Daily prompt to identify relationships that might need a gentle touchpoint.',
  },
  {
    title: 'Belated Appreciation Note',
    text: "I was just thinking about how you showed up for me recently. You have this quiet way of making people feel safe, and I wanted to make sure you heard how much I treasure that.",
    category: 'appreciation',
    note: 'Names specific character attributes that leave a lasting emotional glow.',
  },
];
