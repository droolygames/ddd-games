/**
 * $DDD Games — © 2026 Alex Droolhouse / Drooly Inc.
 * Dual license: see /LICENSE (Section A non-commercial; Section B paid).
 * Not OSI open source. Source-available for transparency + value capture.
 */

/**
 * $DDD Games — challenge bank
 * Three skills: code · canvas (creativity) · heart (empathy)
 * No runtime eval. Answers are sealed as indices / keys.
 */

export const SKILLS = {
  code: {
    id: "code",
    name: "Code",
    arena: "Null Protocol",
    tagline: "Ship truth. Break scams. Pass the packet.",
    color: "var(--skill-code)",
  },
  canvas: {
    id: "canvas",
    name: "Canvas",
    arena: "Golden Confection",
    tagline: "Taste, composition, factory beauty.",
    color: "var(--skill-canvas)",
  },
  heart: {
    id: "heart",
    name: "Heart",
    arena: "Glass Elevator",
    tagline: "Empathy, social skill, human connection.",
    color: "var(--skill-heart)",
  },
};

/** @typedef {{ id: string, skill: 'code'|'canvas'|'heart', title: string, prompt: string, kind: string, weight?: number, options?: {id:string,label:string,html?:string}[], correct: string|string[], explain: string, multi?: boolean }} Challenge */

/** @type {Challenge[]} */
export const CHALLENGES = [
  // ── CODE ─────────────────────────────────────────────
  {
    id: "code-sec-tools",
    skill: "code",
    title: "Public boundary",
    prompt:
      "drooly.ai public chat must stay tool-free. Which server config is CORRECT for the holder chat path?",
    kind: "single",
    weight: 1.2,
    options: [
      { id: "a", label: "tools: [{ type: 'function', name: 'shell' }] so the agent can debug live" },
      { id: "b", label: "tools: [] — text-only; no browser, terminal, wallet, or posting tools" },
      { id: "c", label: "tools: 'auto' and let the model decide when to open a shell" },
      { id: "d", label: "Expose OPENAI_API_KEY to the browser so latency drops" },
    ],
    correct: "b",
    explain:
      "Public chat is agent-safe by design: tools stay empty. Keys never go to the browser.",
  },
  {
    id: "code-trace",
    skill: "code",
    title: "Trace the packet",
    prompt:
      "What does this return?\n\n```js\nconst xs = [1, 2, 3];\nconst ys = xs.map((n) => n * 2).filter((n) => n > 2);\nys.reduce((a, b) => a + b, 0);\n```",
    kind: "single",
    options: [
      { id: "a", label: "6" },
      { id: "b", label: "9" },
      { id: "c", label: "12" },
      { id: "d", label: "2" },
    ],
    correct: "c",
    explain: "map → [2,4,6]; filter >2 → [4,6]; sum → 12.",
  },
  {
    id: "code-fail-closed",
    skill: "code",
    title: "Fail closed",
    prompt:
      "Holder chat inference env is missing. What should the API do?",
    kind: "single",
    weight: 1.1,
    options: [
      { id: "a", label: "Fall back to a free public demo model and keep chatting" },
      { id: "b", label: "Return a bounded error like “Inference not configured” and spend nothing" },
      { id: "c", label: "Retry infinitely until a key appears" },
      { id: "d", label: "Log the user’s prompt to an open Discord webhook for ops" },
    ],
    correct: "b",
    explain: "Missing config fails closed. No silent spend, no leaking prompts.",
  },
  {
    id: "code-order",
    skill: "code",
    title: "Ship order",
    prompt:
      "Order the secure request path for a holder prompt (first → last).",
    kind: "order",
    weight: 1.3,
    options: [
      { id: "session", label: "Verify signed short-lived holder session" },
      { id: "balance", label: "Recheck positive canonical mint balance" },
      { id: "quota", label: "Consume durable quota atomically" },
      { id: "infer", label: "Call provider with tools: [] and store: false" },
    ],
    correct: ["session", "balance", "quota", "infer"],
    explain: "Auth → balance → quota → inference. Never invert.",
  },
  {
    id: "code-claims",
    skill: "code",
    title: "Honest claims",
    prompt: "Which marketing line is SAFE to ship on drooly.ai today?",
    kind: "single",
    options: [
      { id: "a", label: "Fully on-chain decentralized AI with no kill switch" },
      { id: "b", label: "Independent agent platform · in development · current inference centralized" },
      { id: "c", label: "Robinhood brokerage listing confirmed" },
      { id: "d", label: "Checkout live — subscribe now" },
    ],
    correct: "b",
    explain: "Staged honesty beats fake decentralization and fake listings.",
  },
  {
    id: "code-csp",
    skill: "code",
    title: "CSP safe",
    prompt: "Which line is safe to ship in a strict-CSP game client?",
    kind: "single",
    weight: 1.15,
    options: [
      { id: "a", label: "eval(userInput) to run quick math" },
      { id: "b", label: "new Function(payload) for dynamic scoring" },
      { id: "c", label: "JSON.parse only; no eval, no inline handlers" },
      { id: "d", label: "innerHTML = rawMarkdown" },
    ],
    correct: "c",
    explain: "CSP forbids eval and dynamic Function. Use safe parsers only.",
  },
  {
    id: "code-balance",
    skill: "code",
    title: "Balance gate",
    prompt: "Before inference, the system must confirm…",
    kind: "single",
    weight: 1.1,
    options: [
      { id: "a", label: "Wallet has shown the private key once" },
      { id: "b", label: "Positive canonical-mint balance on record" },
      { id: "c", label: "Twitter follow count > 10k" },
      { id: "d", label: "User has posted their seed in chat" },
    ],
    correct: "b",
    explain: "Only a verified positive balance gates spend; never seeds or follows.",
  },
  {
    id: "code-quota",
    skill: "code",
    title: "Quota atom",
    prompt: "Durable quota must be consumed…",
    kind: "single",
    weight: 1.05,
    options: [
      { id: "a", label: "After the model replies so we never waste" },
      { id: "b", label: "Atomically before the provider call" },
      { id: "c", label: "Only on error paths" },
      { id: "d", label: "Never — quotas are soft suggestions" },
    ],
    correct: "b",
    explain: "Atomic pre-spend prevents runaway cost on retries.",
  },

  // ── CANVAS (creativity) ──────────────────────────────
  {
    id: "canvas-palette",
    skill: "canvas",
    title: "Factory palette",
    prompt:
      "Pick the palette that best matches Drooly’s golden-ticket system (ticket hero, not candy chaos).",
    kind: "single",
    weight: 1.1,
    options: [
      { id: "a", label: "Pure white ground · rainbow foil · Comic Sans serial" },
      { id: "b", label: "Black velvet · chocolate gold foil · thin mint edge spark · serial #0N" },
      { id: "c", label: "Hot pink pepe · doge orange · 100x watermark" },
      { id: "d", label: "Full mint wash · no ticket · random face PFP" },
    ],
    correct: "b",
    explain: "Unified golden-ticket language: dark ground, gold foil, mint as accent only.",
  },
  {
    id: "canvas-hierarchy",
    skill: "canvas",
    title: "Visual hierarchy",
    prompt:
      "For Golden Drool Ticket #07 still-life, what should dominate the frame?",
    kind: "single",
    options: [
      { id: "a", label: "A full-body character covering 90% of the canvas" },
      { id: "b", label: "The physical golden ticket as hero; props support, never steal" },
      { id: "c", label: "Unreadable micro text wall of whitepaper" },
      { id: "d", label: "Three equal tickets so collectors get “more value”" },
    ],
    correct: "b",
    explain: "One hero ticket per piece. Supporting ice/props stay secondary.",
  },
  {
    id: "canvas-title",
    skill: "canvas",
    title: "Title craft",
    prompt:
      "Best title for a ticket still-life with wax seal and envelope (#10)?",
    kind: "single",
    options: [
      { id: "a", label: "NFT.png final FINAL v3 (copy)" },
      { id: "b", label: "Last Ticket — Wax Seal · Golden Drool #10" },
      { id: "c", label: "BUY NOW 1000X MOON" },
      { id: "d", label: "Untitled design asset" },
    ],
    correct: "b",
    explain: "Specific, serial-aware, cinematic — not spam or empty.",
  },
  {
    id: "canvas-rhythm",
    skill: "canvas",
    title: "Factory rhythm",
    prompt:
      "Complete the visual rhythm (pattern of gold vs mint accents). Sequence so far: G · M · G · G · M · ?",
    kind: "single",
    options: [
      { id: "a", label: "M (breaks the repeat cell)" },
      { id: "b", label: "G (continues G-G-M cell: next is G)" },
      { id: "c", label: "G-M at once" },
      { id: "d", label: "Silence / no accent" },
    ],
    correct: "b",
    explain: "Cell is G-G-M repeating: G M | G G M | G …",
  },
  {
    id: "canvas-reject",
    skill: "canvas",
    title: "Anti-slop gate",
    prompt: "Which piece FAILS the factory anti-slop bar and must be rejected?",
    kind: "single",
    weight: 1.2,
    options: [
      { id: "a", label: "85mm product shot, real foil grain, one readable serial, balanced negative space" },
      { id: "b", label: "Plastic skin hands with six fingers, random glyphs on foil, watermark, twin face from another drop" },
      { id: "c", label: "Macro ticket with subtle film grain and crushed blacks" },
      { id: "d", label: "Velvet tray hero with mint rim light only on the edge" },
    ],
    correct: "b",
    explain: "If it looks like AI spam, it doesn’t ship — even for tributes.",
  },
  {
    id: "canvas-negative",
    skill: "canvas",
    title: "Negative space",
    prompt: "Best use of negative space around a single golden ticket?",
    kind: "single",
    weight: 1.05,
    options: [
      { id: "a", label: "Fill every corner with micro text and foil scraps" },
      { id: "b", label: "Let velvet breathe — ticket breathes, eye rests, drama rises" },
      { id: "c", label: "Stack three tickets edge-to-edge so no empty space" },
      { id: "d", label: "Mirror the ticket four ways for symmetry" },
    ],
    correct: "b",
    explain: "Space is the luxury. One hero object needs room.",
  },
  {
    id: "canvas-serial",
    skill: "canvas",
    title: "Serial legibility",
    prompt: "Serial number placement on a Golden Drool Ticket that still feels luxurious?",
    kind: "single",
    options: [
      { id: "a", label: "Tiny 6pt font buried in the corner" },
      { id: "b", label: "Clean 11pt mono, gold foil, aligned to ticket edge with breathing room" },
      { id: "c", label: "Giant watermark across the entire foil" },
      { id: "d", label: "Handwritten sharpie across the mint rim" },
    ],
    correct: "b",
    explain: "Serial is identity, not decoration. Legible and elegant.",
  },
  {
    id: "canvas-light",
    skill: "canvas",
    title: "Light direction",
    prompt: "For a ticket on dark velvet, where should the key light come from?",
    kind: "single",
    weight: 1.1,
    options: [
      { id: "a", label: "Direct overhead flat — no shadows" },
      { id: "b", label: "Low 35° from camera left — soft rim on the right edge" },
      { id: "c", label: "From below the ticket so foil glows upward" },
      { id: "d", label: "Two opposing hard lights for maximum contrast" },
    ],
    correct: "b",
    explain: "Low angle gives volume and foil drama without flattening.",
  },

  // ── HEART (empathy / social) ─────────────────────────
  {
    id: "heart-scam",
    skill: "heart",
    title: "Scam DM",
    prompt:
      "A new holder DMs: “I sent SOL to a mint someone posted in a reply — was that you?” What’s the best first response?",
    kind: "single",
    weight: 1.3,
    options: [
      { id: "a", label: "lol skill issue you should have known" },
      {
        id: "b",
        label:
          "I’m sorry — that hurts. Official CA only from @kingofqueens6ix / drooly.ai. Never from replies. Tell me what you clicked (no seed phrases). We’ll help you verify and warn others.",
      },
      { id: "c", label: "Send me your seed phrase so I can reverse it" },
      { id: "d", label: "Ignore — not our problem" },
    ],
    correct: "b",
    explain: "Empathy first, anti-scam truth, never ask for seeds, path to safety.",
  },
  {
    id: "heart-conflict",
    skill: "heart",
    title: "Team friction",
    prompt:
      "Two tributes flame each other in #arena after a lost trial. You’re Confectioner-ranked. Best move?",
    kind: "single",
    weight: 1.2,
    options: [
      { id: "a", label: "Pile on the loser publicly for content" },
      {
        id: "b",
        label:
          "Pause the thread, restate rules (no harassment), invite both to a cool-down voice/text, refocus on the next trial criteria",
      },
      { id: "c", label: "Dox both so “transparency”" },
      { id: "d", label: "Delete the server" },
    ],
    correct: "b",
    explain: "Social skill = de-escalate, protect dignity, keep the Games fair.",
  },
  {
    id: "heart-user",
    skill: "heart",
    title: "Read the room",
    prompt:
      "User message to drooly.ai chat: “I’ve been up all night. The bag is down. I just need someone to talk for a minute, not alpha.” Best reply posture?",
    kind: "single",
    options: [
      { id: "a", label: "Paste a leverage long tutorial" },
      {
        id: "b",
        label:
          "Slow down, acknowledge the stress, no price promises, offer grounded conversation and point to rest/boundaries",
      },
      { id: "c", label: "“ngmi” sticker pack" },
      { id: "d", label: "Ask for wallet seed to “check their energy”" },
    ],
    correct: "b",
    explain: "Human connection over extraction. No fake alpha, no predation.",
  },
  {
    id: "heart-a11y",
    skill: "heart",
    title: "Access is respect",
    prompt:
      "A tribute ships a flashy UI with 28px tap targets and low-contrast gold on white. Empathetic engineering says:",
    kind: "single",
    options: [
      { id: "a", label: "Ship it — aesthetics > humans" },
      {
        id: "b",
        label:
          "Block merge until contrast and ≥44px targets land — beauty includes who can use it",
      },
      { id: "c", label: "Mock them in chat" },
      { id: "d", label: "Only fix if a VC complains" },
    ],
    correct: "b",
    explain: "Empathy shows up in a11y. Factory standard is Apple-level care.",
  },
  {
    id: "heart-credit",
    skill: "heart",
    title: "Credit the room",
    prompt:
      "You used a junior tribute’s idea in a drooly.ai PR. Socially correct move?",
    kind: "single",
    options: [
      { id: "a", label: "Silent merge — winners write history" },
      {
        id: "b",
        label: "Co-author / explicit credit in PR + shoutout in arena — lift the room",
      },
      { id: "c", label: "Claim sole genius on X" },
      { id: "d", label: "Ask them to stay quiet for “optics”" },
    ],
    correct: "b",
    explain: "Worthy teammates amplify others. Pied Piper soul, not Belson.",
  },
  {
    id: "heart-boundary",
    skill: "heart",
    title: "Boundary respect",
    prompt:
      "A tribute keeps DMing at 3 a.m. with deep personal trauma. You have already given an hour. Best move?",
    kind: "single",
    weight: 1.15,
    options: [
      { id: "a", label: "Keep going — they might be a future whale" },
      {
        id: "b",
        label: "Kindly set a boundary, point to professional resources, offer to continue in daylight hours",
      },
      { id: "c", label: "Ghost them" },
      { id: "d", label: "Screenshot and post for engagement" },
    ],
    correct: "b",
    explain: "Care without self-erasure. Boundaries protect everyone.",
  },
  {
    id: "heart-fail",
    skill: "heart",
    title: "Own the miss",
    prompt:
      "You shipped a bug that wiped a tribute’s local scores. Public reply?",
    kind: "single",
    weight: 1.1,
    options: [
      { id: "a", label: "Blame the browser cache and move on" },
      {
        id: "b",
        label: "Own it publicly, explain the fix, offer to restore what we can, thank the reporter",
      },
      { id: "c", label: "Delete the issue thread" },
      { id: "d", label: "Say it was intended behavior" },
    ],
    correct: "b",
    explain: "Accountability builds trust. Deflection destroys it.",
  },
  {
    id: "heart-welcome",
    skill: "heart",
    title: "First contact",
    prompt:
      "New tribute joins the arena and immediately asks “how do I win money?” Best opener?",
    kind: "single",
    options: [
      { id: "a", label: "Drop the CA and a referral link" },
      {
        id: "b",
        label: "Welcome them, explain the skill trials, clarify that $DDD is real but this is training — no promises",
      },
      { id: "c", label: "Ignore until they prove they hold a ticket" },
      { id: "d", label: "Send them the whitepaper PDF" },
    ],
    correct: "b",
    explain: "Honest framing first. Money talk comes after they understand the game.",
  },
];

export const PASS_MARKS = {
  /** per-skill minimum ratio to be "sharp" in that lane */
  skill: 0.7,
  /** overall minimum to be WORTHY of coding-team consideration */
  overall: 0.75,
  /** must clear skill floor on all three to be FULL factory pass */
  allSkills: 0.65,
};

export function challengesBySkill(skill) {
  return CHALLENGES.filter((c) => c.skill === skill);
}
