import { Intention, IntentionId, ToneStyle, DraftOption } from '../types';

export const INTENTIONS: Intention[] = [
  {
    id: 'repair_conversation',
    label: 'I want to repair a conversation that went wrong.',
    tagline: 'Acknowledge impact, apologize sincerely, and build mutual understanding',
    communicationGoal:
      'The goal is to take genuine responsibility for impact, de-escalate defensiveness, articulate feelings without placing blame, and prioritize the relationship over winning the argument.',
    guidancePoints: [
      'Acknowledge Impact: Validate how the conversation landed on them, honoring their feelings over your original intentions.',
      'Apologize Sincerely: Take direct ownership for your tone or reactivity with zero "if" or "but" excuses.',
      'Seek Mutual Understanding: Ask to listen to their experience and let them speak without interrupting or defending.',
      'Articulate Without Blame: Use "I" statements to explain what you were feeling inside without portraying them as the villain.',
    ],
    illustrativeScenario:
      'Had an abrupt disagreement yesterday evening about plans, and my response was sharper and more dismissive than it should have been. I want to clear the air, take accountability, and listen to where they were coming from.',
    scenarioDescription:
      'Mending a recent friction before distance hardens into awkwardness.',
    suggestedActionTitle: 'Send gentle repair and listening note',
  },
  {
    id: 'support_difficult',
    label: 'I want to support someone having a difficult day.',
    tagline: 'Offer steady, empathetic presence without unsolicited advice or reply pressure',
    communicationGoal:
      'The goal is to offer compassionate presence and gentle care, completely releasing the recipient from conversational pressure while letting them know they are not alone.',
    guidancePoints: [
      'Release Reply Pressure: Explicitly state that no reply is required, protecting their low social battery.',
      'Validate Their Experience: Resist the urge to offer quick solutions; offer witness and gentle comfort instead.',
      'Offer Concrete Low-Demand Support: Suggest tangible small acts of service (e.g., dropping off dinner, running an errand, or quiet check-in).',
    ],
    illustrativeScenario:
      'A close friend had an emotionally exhausting week with medical news and demanding deadlines. I want to send warmth, validate how hard it is, and make sure they know they do not have to put on a brave face with me.',
    scenarioDescription:
      'Showing quiet, non-demanding solidarity during an overwhelming time.',
    suggestedActionTitle: 'Send empathetic support message',
  },
  {
    id: 'reconnect_busy',
    label: 'I want to reconnect after being busy.',
    tagline: 'Warmly reopen the conversation without guilt or excuses',
    communicationGoal:
      'The goal is to reopen the conversation warmly without making the other person feel guilty or neglected.',
    guidancePoints: [
      'Avoid Over-Apologizing: A simple, warm acknowledgment works better than a laundry list of excuses.',
      'Focus on Their World: Ask about their life rather than dwelling on your calendar.',
      'Suggest a Low-Key Touchpoint: Propose a quick, realistic catch-up.',
    ],
    illustrativeScenario:
      "Haven't spoken to Maya since our project sprint wrapped up three weeks ago. Want to check in simply to see how she is doing, without any work agenda.",
    scenarioDescription:
      'Reconnecting with a colleague or friend after an intense work period went quiet.',
    suggestedActionTitle: 'Send reconnection note to Maya',
  },
  {
    id: 'express_appreciation',
    label: 'I want to express appreciation.',
    tagline: 'Name a specific quality or act of care that meant something to you',
    communicationGoal:
      'The goal is to name a specific quality or action you value, letting warmth take center stage without asking for anything in return.',
    guidancePoints: [
      'Be Specific: Name the exact act, gesture, or character trait that touched you.',
      'Keep it Pure: Avoid coupling praise with a request or favor.',
      'Acknowledge the Human: Remind them that their presence genuinely matters.',
    ],
    illustrativeScenario:
      'A close friend brought over homemade soup when I was swamped last week, and I never got to thank them properly beyond a rushed thumbs-up.',
    scenarioDescription:
      'Belated but heartfelt gratitude for an everyday act of kindness.',
    suggestedActionTitle: "Send appreciation note for last week's kindness",
  },
];

interface VariantItem {
  template: string;
  withContextTemplate: (context: string) => string;
  whyItWorks: string;
  focusArea: string;
}

interface VariantBank {
  [intentionId: string]: {
    [tone in ToneStyle]: VariantItem[];
  };
}

export const DRAFT_VARIANTS: VariantBank = {
  repair_conversation: {
    natural: [
      {
        focusArea: 'Acknowledging Impact & Sincere Apology',
        template:
          "Hey, I've been feeling uncomfortable about how our conversation went. Regardless of what was on my mind, my sharpness wasn't fair to you and I know it probably stung. I'm really sorry for how I handled it.",
        withContextTemplate: (ctx) =>
          `Hey, I've been thinking about our conversation (${ctx.trim()}). Looking back, my tone wasn't fair to you at all. I'm genuinely sorry for how that landed—you didn't deserve that sharpness from me.`,
        whyItWorks:
          'Directly acknowledges impact over intention and offers an unambiguous apology without excuses.',
      },
      {
        focusArea: 'Seeking Mutual Understanding & Listening',
        template:
          "Hey, our friendship is way too important to me to let an argument hang between us. I'd really love the chance to hear how that felt from your side, without me interrupting or being defensive. Can we talk whenever you're ready?",
        withContextTemplate: (ctx) =>
          `Hey, regarding ${ctx.trim()}: our relationship matters so much more to me than being right. I'd really appreciate the chance to just listen to your perspective so I can understand where you were coming from. Whenever you have space, let's talk.`,
        whyItWorks:
          'Positions listening as the active objective and creates emotional safety for them to share their experience.',
      },
      {
        focusArea: 'Articulating Feelings Without Placing Blame',
        template:
          "Hey, I wanted to reach out because I felt myself get reactive and overwhelmed during our chat. I didn't communicate my feelings clearly, and that's on me. I really value us, and I'd love to share where I was coming from calmly whenever you feel open to it.",
        withContextTemplate: (ctx) =>
          `Hey, about ${ctx.trim()}: I noticed I got overwhelmed and reactive, which caused me to communicate poorly. I don't want to blame anyone—I just want us to understand each other. Whenever you have a quiet moment, I'd love to talk it through gently.`,
        whyItWorks:
          'Uses non-blaming "I" statements to share inner vulnerability while holding clear personal responsibility.',
      },
    ],
    warm: [
      {
        focusArea: 'Acknowledging Impact & Sincere Apology',
        template:
          "Our bond means the world to me, and it hurts me to know that my words brought tension or hurt into our space. I am truly sorry for my defensiveness. You deserve my patience and care, and I regret not giving you that.",
        withContextTemplate: (ctx) =>
          `You mean too much to me to leave things bruised. Reflecting on ${ctx.trim()}, I realize my words carried a sting that was unfair to you. I am deeply sorry for how I showed up, and I want to repair this with you.`,
        whyItWorks:
          'Deep emotional resonance that validates their worth and directly owns the negative emotional impact.',
      },
      {
        focusArea: 'Seeking Mutual Understanding & Listening',
        template:
          "I care deeply about how you experience our relationship. I want to step back from my own viewpoint and truly hear how things landed with you. I'm ready to listen whenever you feel ready to share.",
        withContextTemplate: (ctx) =>
          `I care far more about our connection than defending what happened around ${ctx.trim()}. When you're ready, I'd love to take you out for a coffee or sit together and just listen to your thoughts. No debate, just care.`,
        whyItWorks:
          'Relinquishes the urge to litigate the past in favor of deeply understanding their feelings.',
      },
      {
        focusArea: 'Articulating Feelings Without Placing Blame',
        template:
          "When we were talking, I felt a wave of anxiety and didn't know how to express it gently, so it came out sideways. That was my struggle, not your fault. I love having you in my life, and I want to be honest about where my heart was without making you feel accused.",
        withContextTemplate: (ctx) =>
          `Reflecting on ${ctx.trim()}, I realize I was carrying internal stress that I let leak into our conversation. I want to own that cleanly—it wasn't about you doing anything wrong. I cherish you and want to share my heart vulnerably when you have space.`,
        whyItWorks:
          'Exemplifies non-defensive vulnerability; names the underlying feeling (anxiety/stress) without projecting culpability.',
      },
    ],
    honest: [
      {
        focusArea: 'Acknowledging Impact & Sincere Apology',
        template:
          "I was wrong in how I reacted, full stop. My frustration got the better of me, and regardless of what sparked it, the way I spoke was unacceptable. I apologize, and I'm committed to doing better.",
        withContextTemplate: (ctx) =>
          `I want to be completely candid: the way I reacted regarding ${ctx.trim()} was wrong. You didn't deserve that sharpness. I'm sorry, and I want to own that directly with you.`,
        whyItWorks:
          'Grounded, unflinching accountability with zero sugarcoating or deflection.',
      },
      {
        focusArea: 'Seeking Mutual Understanding & Listening',
        template:
          "I don't want us sweeping this under the rug or pretending it didn't sting. I'd like to take responsibility for my part and hear what you need from me so we can rebuild trust cleanly. When is a good time to talk?",
        withContextTemplate: (ctx) =>
          `Looking at ${ctx.trim()}, I want us to deal with this honestly. I want to know how that interaction felt to you and what you need from me going forward. Let me know when you have 10 minutes to talk.`,
        whyItWorks:
          'Constructive and mature; invites clear expectations and mutual truth-telling.',
      },
      {
        focusArea: 'Articulating Feelings Without Placing Blame',
        template:
          "To be honest, I felt unheard and hurt during that conversation, but letting that turn into irritation was my mistake. I'm not blaming you for my reaction. I want to share my honest feelings calmly, because you matter to me.",
        withContextTemplate: (ctx) =>
          `To be transparent about ${ctx.trim()}: I was feeling vulnerable and defensive, which led to me snapping. That was my failing, not yours. I value our honesty and want to talk without any finger-pointing whenever you are ready.`,
        whyItWorks:
          'Boldly acknowledges feeling hurt while drawing a clear line between feelings and personal responsibility for behavior.',
      },
    ],
  },

  support_difficult: {
    natural: [
      {
        focusArea: 'Low-Pressure Presence (No Reply Needed)',
        template:
          "Hey, thinking of you today. Zero need to reply at all—I just wanted you to know I'm sending you gentle thoughts and rooting for you from over here.",
        withContextTemplate: (ctx) =>
          `Hey, keeping you close in mind with everything you're navigating (${ctx.trim()}). No need to spend energy replying! Just sending you warmth and a quiet hug today.`,
        whyItWorks:
          'Explicitly frees the recipient from social obligation when emotional batteries are depleted.',
      },
      {
        focusArea: 'Empathetic Validation',
        template:
          "Just a gentle wave. I know things have been genuinely heavy lately. Take all the quiet and space you need. You don't have to put on a brave face, and I'm in your corner whenever you want company.",
        withContextTemplate: (ctx) =>
          `Gentle check-in: knowing you're dealing with ${ctx.trim()}, I just want to say it makes complete sense that you're exhausted. You don't have to carry it alone, and I'm here for whatever feels helpful.`,
        whyItWorks:
          'Validates the difficulty of the situation without toxic positivity or superficial cheerleading.',
      },
      {
        focusArea: 'Practical Low-Friction Help',
        template:
          "Hey! I'm running some errands later today. Can I drop off dinner or some groceries on your porch? No visiting or socializing needed at all—just want to take one small thing off your plate.",
        withContextTemplate: (ctx) =>
          `Thinking about what you're dealing with (${ctx.trim()}). Can I bring you some takeout or handle an errand for you today? Truly zero social energy required—happy to just drop and go.`,
        whyItWorks:
          'Concrete, tangible assistance that relieves real daily burden without demanding hosting or interaction.',
      },
    ],
    warm: [
      {
        focusArea: 'Emotional Sanctuary & Steady Presence',
        template:
          "I've been holding you close in my heart today. I know words cannot fix a hard day, but I want you to feel deeply remembered and cared for. There is zero expectation to answer this—just let yourself rest.",
        withContextTemplate: (ctx) =>
          `Holding you in my thoughts. Knowing how much you are carrying with ${ctx.trim()}, I wish I could lighten the load. Please be extraordinarily gentle with yourself right now. You are deeply cherished.`,
        whyItWorks:
          'Offers deep unconditional warmth that honors their exhaustion.',
      },
      {
        focusArea: 'Safe Space to Vent or Be Quiet',
        template:
          "I'm here for whatever today needs to be: whether you need to vent for an hour, cry, laugh at something stupid, or just sit on the phone in total silence. You are safe with me.",
        withContextTemplate: (ctx) =>
          `Thinking of you through ${ctx.trim()}. Whether you want a listening ear to scream into or someone to sit quietly with a cup of tea, I am here. No judgment, no advice, just presence.`,
        whyItWorks:
          'Establishes psychological safety and lets the recipient set the terms of connection.',
      },
      {
        focusArea: 'Affirming Resilience & Gentle Care',
        template:
          "Sending you the biggest, gentlest breath of calm today. You have been carrying so much with grace, but you don't always have to be the strong one. It's okay to let things rest.",
        withContextTemplate: (ctx) =>
          `Watching you navigate ${ctx.trim()}, I see how hard you've been working to stay grounded. Please know you have permission to drop the ball on everything else and just rest. I am standing by you.`,
        whyItWorks:
          'Gives permission to stop performing resilience and embrace rest.',
      },
    ],
    honest: [
      {
        focusArea: 'Grounded Realism & Steadfast Support',
        template:
          "I know things are genuinely difficult right now, and I won't give you empty platitudes. But I am standing by you, and I'm ready to listen or help the minute you give the word.",
        withContextTemplate: (ctx) =>
          `I know ${ctx.trim()} is brutally tough right now. I won't give you clichés, but I am in your corner for the long haul. Tell me if you need practical help or just space.`,
        whyItWorks:
          'Refuses cliché positivity and offers steadfast, mature companionship.',
      },
      {
        focusArea: 'Radical Zero-Demands Offer',
        template:
          "Life can be exhausting sometimes. I just want to be one person who demands absolutely nothing from you today. Take whatever time you need. I'm here when the dust settles.",
        withContextTemplate: (ctx) =>
          `Knowing what's going on with ${ctx.trim()}, I'm making sure I ask nothing of you. No replies, no updates. Just breathe and get through today.`,
        whyItWorks:
          'Provides total relief from interpersonal pressure.',
      },
      {
        focusArea: 'Specific Practical Offer',
        template:
          "I can see how much you have on your shoulders. Tell me one concrete thing I can do for you today—laundry, food, picking up supplies, or walking the dog. Consider it done.",
        withContextTemplate: (ctx) =>
          `Navigating ${ctx.trim()} is overwhelming. What is one chore or errand I can take completely off your hands today? Let me help carry a piece of this.`,
        whyItWorks:
          'Focuses on practical relief which is often the most soothing form of love.',
      },
    ],
  },

  reconnect_busy: {
    natural: [
      {
        focusArea: 'Breezy Catch-up',
        template:
          "Hey, life's been a little hectic lately. I've been meaning to catch up with you. How have you been?",
        withContextTemplate: (ctx) =>
          `Hey! Life's been moving fast lately (${ctx.trim()}), but you crossed my mind today. How have things been on your end?`,
        whyItWorks:
          'Breezy and low-friction. Reopens the door without lingering on why time passed.',
      },
      {
        focusArea: 'Light Check-in',
        template:
          "Hey! Just thought of you today and realized it's been a bit. Hope you've been having some calm moments. How are things?",
        withContextTemplate: (ctx) =>
          `Hey! Thought of you today—${ctx.trim()}. Hope you're doing well. No need to rush back, just wanted to say hi!`,
        whyItWorks:
          'Light and unburdened; removes social pressure while signaling genuine memory.',
      },
      {
        focusArea: 'Casual Invitation',
        template:
          "Hey, popping in because I've missed our usual banter. Hope life is treating you well lately—let's grab a coffee or quick phone call whenever you're free.",
        withContextTemplate: (ctx) =>
          `Hey, just checking in on you. Thinking about ${ctx.trim()} and wanted to say hello. Would love to catch up when you have a free moment.`,
        whyItWorks: 'Concrete invitation without a rigid deadline.',
      },
    ],
    warm: [
      {
        focusArea: 'Heartfelt Inquest',
        template:
          "I realized it's been a while since we had a proper conversation. I'd really love to hear how things have been going for you.",
        withContextTemplate: (ctx) =>
          `I was thinking about you today and how it's been a while since we had a real conversation (${ctx.trim()}). I'd really love to hear how you're doing.`,
        whyItWorks:
          'Focuses on genuine interest in their well-being rather than an apology spiral.',
      },
      {
        focusArea: 'Affirming Bond',
        template:
          "You've been on my mind lately. Life pulled me in ten directions, but you're someone who really matters to me. How is your heart these days?",
        withContextTemplate: (ctx) =>
          `You've been on my mind. Especially reflecting on ${ctx.trim()}, I realized I value our connection so much. How are you holding up these days?`,
        whyItWorks:
          'Affirms their value in your life and invites a deeper, meaningful check-in.',
      },
      {
        focusArea: 'Accountability with Care',
        template:
          "Thinking of you today with genuine fondness. I'm sorry I've been quiet—I cherish our friendship and would love to hear what's been filling your days.",
        withContextTemplate: (ctx) =>
          `Thinking of you today. With everything going on around ${ctx.trim()}, I've been quiet, but I really cherish our connection and would love to hear what's on your mind.`,
        whyItWorks: 'Gentle accountability paired with sincere affection.',
      },
    ],
    honest: [
      {
        focusArea: 'Direct Intent',
        template:
          "I've missed talking properly. I know we've both been busy, but I'd like to make a little time for us to catch up.",
        withContextTemplate: (ctx) =>
          `I've missed talking to you. Things got crowded on my end with ${ctx.trim()}, but I don't want us to lose touch. Could we make a little time to catch up?`,
        whyItWorks:
          'Direct, mature, and transparent. Clear about wanting intentional connection.',
      },
      {
        focusArea: 'Interrupting the Drift',
        template:
          "I don't like how easy it is to let weeks slip by without talking to people who matter to me. I'd really like to change that. When is a good time for a call?",
        withContextTemplate: (ctx) =>
          `I don't like letting time slip by—especially since ${ctx.trim()}. You matter to me, and I'd like to make intentional time to talk. What does your week look like?`,
        whyItWorks: 'Boldly names the drift and takes initiative to remedy it.',
      },
      {
        focusArea: 'Vulnerable Candor',
        template:
          "To be completely candid, I got overwhelmed with daily life and went into a shell. But I miss you and I'd love to reconnect if you're open to it.",
        withContextTemplate: (ctx) =>
          `To be candid, I got caught up in everything (${ctx.trim()}) and stepped back, but I truly miss you. Would love to reconnect whenever suits you.`,
        whyItWorks:
          'Vulnerable self-awareness that disarms defensiveness immediately.',
      },
    ],
  },

  express_appreciation: {
    natural: [
      {
        focusArea: 'Spontaneous Warmth',
        template:
          "Hey, was just thinking about you and wanted to say how much I appreciate having you in my life. Thanks for being you.",
        withContextTemplate: (ctx) =>
          `Hey! I was thinking about ${ctx.trim()} and just wanted to say how much I appreciate you. Thank you for being in my corner.`,
        whyItWorks:
          'Casual, unforced gratitude that brightens someone\'s day effortlessly.',
      },
      {
        focusArea: 'Witnessing Their Effort',
        template:
          "Just a quick note to say thank you for being such a steady, wonderful person. It doesn't go unnoticed!",
        withContextTemplate: (ctx) =>
          `Quick note to say: ${ctx.trim()}. It meant a lot to me, and I wanted to make sure you knew it doesn't go unnoticed!`,
        whyItWorks:
          'Affirms that their effort or character is truly witnessed and valued.',
      },
      {
        focusArea: 'Playful Praise',
        template:
          "Random appreciation text incoming: you're genuinely one of the most thoughtful people I know. Hope your day is as great as you are.",
        withContextTemplate: (ctx) =>
          `Random appreciation note: reflecting on ${ctx.trim()} reminded me how thoughtful you are. Really grateful for you!`,
        whyItWorks:
          'Playful framing makes accepting praise feel natural and cheerful.',
      },
    ],
    warm: [
      {
        focusArea: 'Deep Gratitude',
        template:
          "I was reflecting on people who bring genuine light into my life, and you were right there. Thank you for your warmth and care—it means more than I usually say.",
        withContextTemplate: (ctx) =>
          `I wanted to take a quiet moment to thank you properly. Specifically regarding ${ctx.trim()}, your kindness and presence meant the world to me.`,
        whyItWorks:
          'Deep, heartfelt, and gives the recipient a profound sense of validation.',
      },
      {
        focusArea: 'Character Honor',
        template:
          "You have this quiet way of making people feel seen and valued. I just wanted you to know that your presence in my world makes a real difference.",
        withContextTemplate: (ctx) =>
          `You have such a generous way of showing up. When ${ctx.trim()}, it reminded me how rare and special your friendship is. Thank you.`,
        whyItWorks: 'Specific character praise that resonates deeply.',
      },
      {
        focusArea: 'Speaking the Unsaid',
        template:
          "I often think about how grateful I am for our connection, but I don't say it out loud enough. Thank you for being someone I can always count on.",
        withContextTemplate: (ctx) =>
          `I don't say this out loud often enough, but thank you. Remembering ${ctx.trim()} filled me with gratitude for having you in my life.`,
        whyItWorks:
          'Acknowledges the gap between feeling gratitude and speaking it.',
      },
    ],
    honest: [
      {
        focusArea: 'Plainspoken Thanks',
        template:
          "I wanted to say this directly: what you did meant a great deal to me. You showed up when it counted, and I won't forget it.",
        withContextTemplate: (ctx) =>
          `I want to say this plainly: ${ctx.trim()}. What you did meant a huge amount to me. You showed up, and I truly value that.`,
        whyItWorks:
          'Clear, grounded, and sincere without decorative fluff.',
      },
      {
        focusArea: 'Grounded Loyalty',
        template:
          "I don't always express it well, but your presence in my life is something I don't take for granted. Thank you for your integrity and patience.",
        withContextTemplate: (ctx) =>
          `I don't always say things as clearly as I'd like, but regarding ${ctx.trim()}: I don't take your kindness for granted. Thank you for being real.`,
        whyItWorks:
          'Honest vulnerability about communication hurdles coupled with authentic appreciation.',
      },
      {
        focusArea: 'Respect & Admiration',
        template:
          "I wanted to make sure you heard this straight from me: you are an exceptional human, and knowing you makes me want to be better. Thank you.",
        withContextTemplate: (ctx) =>
          `Wanted to tell you directly: ${ctx.trim()}. It highlighted your character so clearly, and I have tremendous respect for who you are.`,
        whyItWorks: 'High emotional resonance with dignified directness.',
      },
    ],
  },
};

export const TONE_LABELS: Record<ToneStyle, { label: string; tagline: string }> = {
  natural: {
    label: 'Natural & Casual',
    tagline: 'Effortless, breezy, and low-friction',
  },
  warm: {
    label: 'Warm & Thoughtful',
    tagline: 'Deep care and sincere emotional resonance',
  },
  honest: {
    label: 'Honest & Direct',
    tagline: 'Grounded, clear, and unpretentious',
  },
};

export function getDraftOptions(
  intentionId: IntentionId,
  contextText: string,
  variantIndex: number = 0
): Record<ToneStyle, DraftOption> {
  const bank = DRAFT_VARIANTS[intentionId] || DRAFT_VARIANTS.reconnect_busy;
  const tones: ToneStyle[] = ['natural', 'warm', 'honest'];

  const results = {} as Record<ToneStyle, DraftOption>;

  tones.forEach((tone) => {
    const variants = bank[tone];
    const item = variants[variantIndex % variants.length];
    const hasContext = contextText && contextText.trim().length > 0;
    const text = hasContext ? item.withContextTemplate(contextText) : item.template;

    results[tone] = {
      id: `${intentionId}_${tone}_${variantIndex}`,
      tone,
      toneLabel: TONE_LABELS[tone].label,
      toneTagline: TONE_LABELS[tone].tagline,
      text,
      whyItWorks: item.whyItWorks,
      focusArea: item.focusArea,
    };
  });

  return results;
}

export function getTotalVariantsCount(intentionId: IntentionId, tone: ToneStyle): number {
  return DRAFT_VARIANTS[intentionId]?.[tone]?.length || 3;
}
