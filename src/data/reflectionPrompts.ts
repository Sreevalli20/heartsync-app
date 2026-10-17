export interface ReflectionAnalysis {
  theme: string;
  themeDescription: string;
  groundingInsight: string;
  suggestedSteps: string[];
  recommendedIntentionId?: 'reconnect_busy' | 'express_appreciation' | 'support_difficult' | 'repair_conversation';
}

export function analyzeReflectionLocally(text: string): ReflectionAnalysis {
  const lower = text.toLowerCase();

  // Pattern detection for Repairing a Conversation
  if (
    lower.includes('sorry') ||
    lower.includes('fight') ||
    lower.includes('argument') ||
    lower.includes('upset') ||
    lower.includes('harsh') ||
    lower.includes('snapped') ||
    lower.includes('regret') ||
    lower.includes('disagree') ||
    lower.includes('defensive') ||
    lower.includes('tension') ||
    lower.includes('friction') ||
    lower.includes('blame') ||
    lower.includes('repair')
  ) {
    return {
      theme: 'Repairing & Clearing the Air',
      themeDescription: 'It sounds like recent words or tension left a painful sting between you.',
      groundingInsight:
        'Repairing a conversation is not about groveling or litigating who was right; it is about choosing mutual dignity and prioritizing the relationship over winning. When you acknowledge impact and articulate your feelings without placing blame, defensiveness naturally softens.',
      suggestedSteps: [
        'Acknowledge impact over intent: Validate that how it landed mattered more than what you meant.',
        'Articulate your feelings cleanly with "I" statements rather than finger-pointing accusations.',
        'Ask for a quiet, low-pressure moment to simply listen to their perspective without debate.',
      ],
      recommendedIntentionId: 'repair_conversation',
    };
  }

  // Pattern detection for Supporting Someone in Need
  if (
    lower.includes('tired') ||
    lower.includes('exhausted') ||
    lower.includes('heavy') ||
    lower.includes('sad') ||
    lower.includes('struggling') ||
    lower.includes('overwhelm') ||
    lower.includes('hard day') ||
    lower.includes('difficult day') ||
    lower.includes('stress') ||
    lower.includes('sick') ||
    lower.includes('support') ||
    lower.includes('burnout') ||
    lower.includes('grief') ||
    lower.includes('crying') ||
    lower.includes('loss') ||
    lower.includes('tough time')
  ) {
    return {
      theme: 'Empathetic Support & Holding Gentle Space',
      themeDescription: 'You are noticing that someone you care for (or yourself) is navigating a heavy season.',
      groundingInsight:
        'When someone we love is hurting, our default instinct is often to offer quick advice or solutions. But deep support is not about fixing—it is about steady, companionable presence. Simply knowing someone remembers you and demands nothing is profound emotional shelter.',
      suggestedSteps: [
        'Explicitly remove reply pressure: Give them full permission to leave your message on read.',
        'Validate their exhaustion without toxic cheerleading; let it be hard without rushing them to smile.',
        'Offer one concrete, low-demand act of care (e.g. dropping off a meal or running a quiet errand).',
      ],
      recommendedIntentionId: 'support_difficult',
    };
  }

  // Pattern detection for Gratitude & Appreciation
  if (
    lower.includes('thank') ||
    lower.includes('grateful') ||
    lower.includes('appreciate') ||
    lower.includes('love') ||
    lower.includes('kind') ||
    lower.includes('helped') ||
    lower.includes('sweet') ||
    lower.includes('gift')
  ) {
    return {
      theme: 'Gratitude & Appreciation',
      themeDescription: 'You are noticing quiet acts of kindness that warmed your day.',
      groundingInsight:
        'Gratitude felt inwardly is comforting, but gratitude expressed out loud transforms human relationships. Even a tiny 2-sentence note creates an enduring ripple in someone\'s week.',
      suggestedSteps: [
        'Send a specific note naming what they did and the character trait you admire in them.',
        'Keep the appreciation clean without attaching an ask or transaction.',
        'Save this note in your Favorite Prompts to inspire future words of affirmation.',
      ],
      recommendedIntentionId: 'express_appreciation',
    };
  }

  // Default: Reconnecting after busyness
  return {
    theme: 'Longing to Reconnect',
    themeDescription: 'Life has been moving fast, and you want to bridge the distance with someone who matters.',
    groundingInsight:
      'We often wait for the "perfect uninterrupted moment" to reach out, which delays us for weeks. A small, imperfect, warm note today bridges distance far better than an ideal conversation postponed forever.',
    suggestedSteps: [
      'Send a short, warm check-in with zero guilt for the silence.',
      'Suggest a realistic micro-touchpoint (like a 10-minute walk-and-talk).',
      'Set a gentle calendar reminder so you follow through without mental clutter.',
    ],
    recommendedIntentionId: 'reconnect_busy',
  };
}
