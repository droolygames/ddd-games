/**
 * $DDD Games — © 2026 Alex Droolhouse / Drooly Inc.
 * Dual license: see /LICENSE (Section A non-commercial; Section B paid).
 * Not OSI open source. Source-available for transparency + value capture.
 */

/**
 * $DDD Games — challenge bank (Season 0)
 * Three skills: code · canvas (creativity) · heart (empathy)
 * difficulty: 1 easy · 2 mid · 3 hard  — used for run curves
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

/** @typedef {{ id: string, skill: 'code'|'canvas'|'heart', title: string, prompt: string, kind: string, weight?: number, difficulty?: 1|2|3, options?: {id:string,label:string,html?:string}[], correct: string|string[], explain: string, multi?: boolean }} Challenge */

/** @type {Challenge[]} */
export const CHALLENGES = [
  // ══════════════════════════════════════════════════════
  // CODE — Null Protocol (14)
  // ══════════════════════════════════════════════════════
  {
    id: "code-sec-tools",
    skill: "code",
    title: "Public boundary",
    prompt:
      "drooly.ai public chat must stay tool-free. Which server config is CORRECT for the holder chat path?",
    kind: "single",
    difficulty: 1,
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
    difficulty: 1,
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
    prompt: "Holder chat inference env is missing. What should the API do?",
    kind: "single",
    difficulty: 1,
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
    prompt: "Order the secure request path for a holder prompt (first → last).",
    kind: "order",
    difficulty: 2,
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
    difficulty: 1,
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
    title: "CSP posture",
    prompt: "For $DDD Games UI on drooly.ai, which pattern is CSP-safe?",
    kind: "single",
    difficulty: 2,
    weight: 1.15,
    options: [
      { id: "a", label: "Inline onclick handlers and eval() for dynamic answers" },
      { id: "b", label: "ES modules + addEventListener; no inline handlers; no eval" },
      { id: "c", label: "document.write with unsanitized challenge HTML" },
      { id: "d", label: "new Function(userPrompt) to grade free text" },
    ],
    correct: "b",
    explain: "Modules + listeners stay CSP-friendly. Eval and inline handlers are out.",
  },
  {
    id: "code-equality",
    skill: "code",
    title: "Strict equality",
    prompt:
      "What prints?\n\n```js\nconsole.log(0 == \"0\", 0 === \"0\", null == undefined, null === undefined);\n```",
    kind: "single",
    difficulty: 2,
    options: [
      { id: "a", label: "true true true true" },
      { id: "b", label: "true false true false" },
      { id: "c", label: "false false false false" },
      { id: "d", label: "true false false false" },
    ],
    correct: "b",
    explain: "== coerces (0==\"0\", null==undefined); === is type-strict.",
  },
  {
    id: "code-async-order",
    skill: "code",
    title: "Microtask order",
    prompt:
      "Order of logs?\n\n```js\nconsole.log(\"A\");\nPromise.resolve().then(() => console.log(\"B\"));\nconsole.log(\"C\");\n```",
    kind: "single",
    difficulty: 2,
    options: [
      { id: "a", label: "A B C" },
      { id: "b", label: "A C B" },
      { id: "c", label: "B A C" },
      { id: "d", label: "C A B" },
    ],
    correct: "b",
    explain: "Sync first (A, C), then microtask (B).",
  },
  {
    id: "code-secrets",
    skill: "code",
    title: "Secret surface",
    prompt: "Where must private keys / provider tokens NEVER live?",
    kind: "single",
    difficulty: 1,
    weight: 1.25,
    options: [
      { id: "a", label: "Server env only, rotated, never logged" },
      { id: "b", label: "Frontend bundle, public GitHub, or client localStorage for “convenience”" },
      { id: "c", label: "CI secrets store with least privilege" },
      { id: "d", label: "Hardware-backed vault for production signing" },
    ],
    correct: "b",
    explain: "Browser and public repos are hostile. Secrets stay server-side.",
  },
  {
    id: "code-idempotent",
    skill: "code",
    title: "Idempotent quota",
    prompt: "Client retries a chat request after a timeout. Correct quota design?",
    kind: "single",
    difficulty: 3,
    weight: 1.35,
    options: [
      { id: "a", label: "Debit quota on every HTTP hit, even retries of the same client token" },
      {
        id: "b",
        label:
          "Idempotency key: same client request id consumes quota once; duplicate is a replay",
      },
      { id: "c", label: "Never debit quota — freeloaders welcome" },
      { id: "d", label: "Debit twice on success to punish retries" },
    ],
    correct: "b",
    explain: "Timeouts happen. Idempotency keys protect holders from double-spend of quota.",
  },
  {
    id: "code-mint-check",
    skill: "code",
    title: "Canonical mint",
    prompt: "Holder gate checks a Solana balance. What must the server use?",
    kind: "single",
    difficulty: 2,
    weight: 1.2,
    options: [
      { id: "a", label: "Any mint string scraped from Telegram replies" },
      {
        id: "b",
        label:
          "Only the CA posted by @kingofqueens6ix / config — never invent mints in code or copy",
      },
      { id: "c", label: "A hard-coded fake mint so demos always pass" },
      { id: "d", label: "User-supplied mint from the request body, trusted fully" },
    ],
    correct: "b",
    explain: "No invented CAs. Canonical mint comes from human/config only.",
  },
  {
    id: "code-xss",
    skill: "code",
    title: "Escape the glass",
    prompt: "Rendering tribute names and challenge text into the DOM safely means:",
    kind: "single",
    difficulty: 2,
    options: [
      { id: "a", label: "innerHTML = userName with no escape" },
      { id: "b", label: "escapeHtml / textContent for untrusted strings; never eval user input" },
      { id: "c", label: "JSON.parse on query strings then document.write" },
      { id: "d", label: "markdown-it with raw HTML enabled by default" },
    ],
    correct: "b",
    explain: "XSS is a factory hazard. Escape untrusted strings; keep CSP.",
  },
  {
    id: "code-race",
    skill: "code",
    title: "Race window",
    prompt:
      "Balance check then quota debit can race. Best mitigation for concurrent holder requests?",
    kind: "single",
    difficulty: 3,
    weight: 1.4,
    options: [
      { id: "a", label: "Hope network latency serializes everyone" },
      {
        id: "b",
        label:
          "Atomic server-side transaction / compare-and-set on quota + recheck balance in one critical section",
      },
      { id: "c", label: "Move the gate entirely to the browser" },
      { id: "d", label: "Sleep 500ms between steps" },
    ],
    correct: "b",
    explain: "TOCTOU needs atomicity. Client-side gates are theater.",
  },
  {
    id: "code-deploy-order",
    skill: "code",
    title: "Deploy ritual",
    prompt: "Order a safe marketing-site ship for $DDD Games (first → last).",
    kind: "order",
    difficulty: 2,
    weight: 1.2,
    options: [
      { id: "review", label: "Review dual-license notice + no fake CA / honest claims" },
      { id: "static", label: "Build static assets; cache-bust CSS/JS" },
      { id: "smoke", label: "Smoke title → play → result on staging/local" },
      { id: "prod", label: "Deploy to Mythic Agent / drooly.ai path" },
    ],
    correct: ["review", "static", "smoke", "prod"],
    explain: "Honesty + build + smoke before prod. Never YOLO mint claims.",
  },

  // ══════════════════════════════════════════════════════
  // CANVAS — Golden Confection (14)
  // ══════════════════════════════════════════════════════
  {
    id: "canvas-palette",
    skill: "canvas",
    title: "Factory palette",
    prompt:
      "Pick the palette that best matches Drooly’s golden-ticket system (ticket hero, not candy chaos).",
    kind: "single",
    difficulty: 1,
    weight: 1.1,
    options: [
      { id: "a", label: "Pure white ground · rainbow foil · Comic Sans serial" },
      {
        id: "b",
        label: "Black velvet · chocolate gold foil · thin mint edge spark · serial #0N",
      },
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
    prompt: "For Golden Drool Ticket #07 still-life, what should dominate the frame?",
    kind: "single",
    difficulty: 1,
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
    prompt: "Best title for a ticket still-life with wax seal and envelope (#10)?",
    kind: "single",
    difficulty: 1,
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
    difficulty: 2,
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
    difficulty: 1,
    weight: 1.2,
    options: [
      {
        id: "a",
        label: "85mm product shot, real foil grain, one readable serial, balanced negative space",
      },
      {
        id: "b",
        label:
          "Plastic skin hands with six fingers, random glyphs on foil, watermark, twin face from another drop",
      },
      { id: "c", label: "Macro ticket with subtle film grain and crushed blacks" },
      { id: "d", label: "Velvet tray hero with mint rim light only on the edge" },
    ],
    correct: "b",
    explain: "If it looks like AI spam, it doesn’t ship — even for tributes.",
  },
  {
    id: "canvas-type",
    skill: "canvas",
    title: "Type pairing",
    prompt: "Which type stack matches Icefam / $DDD Games marketing polish?",
    kind: "single",
    difficulty: 1,
    options: [
      { id: "a", label: "Impact + Papyrus + Comic Sans stack" },
      {
        id: "b",
        label: "Instrument Serif for display + Space Grotesk for UI / body",
      },
      { id: "c", label: "Default Times New Roman everywhere, no hierarchy" },
      { id: "d", label: "Five display fonts on one hero for “energy”" },
    ],
    correct: "b",
    explain: "Serif for flavor, Grotesk for systems — two fonts, clear roles.",
  },
  {
    id: "canvas-negative",
    skill: "canvas",
    title: "Negative space",
    prompt: "Ticket hero feels cramped. Best fix?",
    kind: "single",
    difficulty: 2,
    options: [
      { id: "a", label: "Add three more stickers and a QR wall" },
      {
        id: "b",
        label:
          "Crop/compose so the ticket breathes; kill competing props; let velvet read as field",
      },
      { id: "c", label: "Max-compress JPEG until foil bands" },
      { id: "d", label: "Center-crop faces only — discard the ticket" },
    ],
    correct: "b",
    explain: "Luxury reads as space. Clutter is candy-shop chaos.",
  },
  {
    id: "canvas-og",
    skill: "canvas",
    title: "OG card",
    prompt: "Best 1200×630 OG for $DDD Games share?",
    kind: "single",
    difficulty: 2,
    weight: 1.1,
    options: [
      { id: "a", label: "Blurry screenshot of a Discord channel" },
      {
        id: "b",
        label:
          "Dark ground, legible title, gold accent, brand mark, no fake CA, readable at thumb size",
      },
      { id: "c", label: "Wall of 8pt legal text as the only content" },
      { id: "d", label: "Random pepe with “100x” stamped over faces" },
    ],
    correct: "b",
    explain: "OG is a billboard: contrast, brand, honesty at small sizes.",
  },
  {
    id: "canvas-motion",
    skill: "canvas",
    title: "Motion manners",
    prompt: "Progress bar animation ships. What must Design + a11y agree on?",
    kind: "single",
    difficulty: 2,
    options: [
      { id: "a", label: "Always animate; ignore prefers-reduced-motion" },
      {
        id: "b",
        label:
          "Honor prefers-reduced-motion: cut or shorten transitions; keep clarity without seizure risk",
      },
      { id: "c", label: "Flash the whole viewport on every answer" },
      { id: "d", label: "Autoplay audio with no mute" },
    ],
    correct: "b",
    explain: "Motion is optional seasoning. Reduced-motion is factory law.",
  },
  {
    id: "canvas-contrast",
    skill: "canvas",
    title: "Contrast gate",
    prompt: "Gold text on near-white cream fails WCAG. Factory move?",
    kind: "single",
    difficulty: 2,
    weight: 1.15,
    options: [
      { id: "a", label: "Ship anyway — “brand is the law”" },
      {
        id: "b",
        label:
          "Darken gold or switch ground; keep foil as accent on dark panels so body text stays readable",
      },
      { id: "c", label: "Shrink type to 10px so it “looks premium”" },
      { id: "d", label: "Add more yellow glow until it blooms" },
    ],
    correct: "b",
    explain: "Gold is garnish; readable text is the product.",
  },
  {
    id: "canvas-serial",
    skill: "canvas",
    title: "Serial discipline",
    prompt: "Golden Drool tickets #01–#10. Design rule for serials?",
    kind: "single",
    difficulty: 1,
    options: [
      { id: "a", label: "Random digits each render — “unique every time”" },
      {
        id: "b",
        label: "One fixed serial per piece, readable, consistent type system across the set",
      },
      { id: "c", label: "Hide serial under noise for “mystery”" },
      { id: "d", label: "Duplicate #07 on three different drops" },
    ],
    correct: "b",
    explain: "Collectible honesty: one serial, one piece, readable craft.",
  },
  {
    id: "canvas-composition",
    skill: "canvas",
    title: "Rule of thirds vs center",
    prompt: "Hero ticket product shot for store landing. Strongest default?",
    kind: "single",
    difficulty: 2,
    options: [
      { id: "a", label: "Crop so the ticket is a 5% corner speck" },
      {
        id: "b",
        label:
          "Near-center hero with intentional asymmetry (seal/prop offset) and generous margins",
      },
      { id: "c", label: "Dutch angle + motion blur on every still" },
      { id: "d", label: "Full bleed collage of unrelated memes" },
    ],
    correct: "b",
    explain: "Center-weighted product hero + controlled asymmetry reads premium.",
  },
  {
    id: "canvas-order-light",
    skill: "canvas",
    title: "Light the tray",
    prompt: "Order the lighting story for a velvet ticket still-life (first → last).",
    kind: "order",
    difficulty: 3,
    weight: 1.25,
    options: [
      { id: "key", label: "Key light to sculpt foil edges" },
      { id: "fill", label: "Soft fill so blacks crush without losing serial" },
      { id: "rim", label: "Thin mint rim only on the ticket edge" },
      { id: "grade", label: "Grade: lift gold, hold blacks, no rainbow LUT" },
    ],
    correct: ["key", "fill", "rim", "grade"],
    explain: "Sculpt → fill → mint accent → restrained grade.",
  },
  {
    id: "canvas-brand-bleed",
    skill: "canvas",
    title: "Brand boundary",
    prompt: "Icefam FM mint radio vs $DDD Games arena. On the Games UI you should:",
    kind: "single",
    difficulty: 3,
    weight: 1.2,
    options: [
      { id: "a", label: "Paste full Icefam radio claims and fake on-chain AI on the Games title" },
      {
        id: "b",
        label:
          "Keep Games identity (factory / tributes / Code·Canvas·Heart); link live show honestly; don’t mix product claims",
      },
      { id: "c", label: "Replace all gold with pure mint wash and drop ticket language" },
      { id: "d", label: "Invent a second token ticker mid-hero" },
    ],
    correct: "b",
    explain: "One product, honest links. No claim soup across clusters.",
  },

  // ══════════════════════════════════════════════════════
  // HEART — Glass Elevator (14)
  // ══════════════════════════════════════════════════════
  {
    id: "heart-scam",
    skill: "heart",
    title: "Scam DM",
    prompt:
      "A new holder DMs: “I sent SOL to a mint someone posted in a reply — was that you?” What’s the best first response?",
    kind: "single",
    difficulty: 1,
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
    difficulty: 2,
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
    difficulty: 1,
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
    difficulty: 1,
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
    prompt: "You used a junior tribute’s idea in a drooly.ai PR. Socially correct move?",
    kind: "single",
    difficulty: 1,
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
    id: "heart-no",
    skill: "heart",
    title: "Boundary yes",
    prompt:
      "A fan asks you to review their seed phrase “to recover funds.” Correct boundary?",
    kind: "single",
    difficulty: 1,
    weight: 1.25,
    options: [
      { id: "a", label: "Take the phrase and “help” offline" },
      {
        id: "b",
        label:
          "Hard no — never share seeds with anyone; point to official recovery docs and scam education",
      },
      { id: "c", label: "Ask them to post the phrase in public chat" },
      { id: "d", label: "Charge $DDD to “secure” their phrase" },
    ],
    correct: "b",
    explain: "Compassion includes refusing dangerous asks cleanly.",
  },
  {
    id: "heart-feedback",
    skill: "heart",
    title: "Hard feedback",
    prompt: "A tribute’s art is slop. You mentor. Best frame?",
    kind: "single",
    difficulty: 2,
    weight: 1.15,
    options: [
      { id: "a", label: "Public roast thread with memes of their worst frame" },
      {
        id: "b",
        label:
          "Private, specific, kind: name what fails (hands/glyphs), show a bar reference, offer one clear next step",
      },
      { id: "c", label: "Ghost them forever" },
      { id: "d", label: "Lie that it’s mint-ready to avoid feelings" },
    ],
    correct: "b",
    explain: "Truth + dignity + path. Factory standards without cruelty.",
  },
  {
    id: "heart-live",
    skill: "heart",
    title: "Live show energy",
    prompt:
      "During ICEFAM.FM EP.2 live, chat is spicy. Host-adjacent tribute should:",
    kind: "single",
    difficulty: 2,
    options: [
      { id: "a", label: "Brigade dissenters and invent CA “leaks” for hype" },
      {
        id: "b",
        label:
          "Amplify the broadcast link, keep claims honest, model chill curiosity, redirect scams to official channels",
      },
      { id: "c", label: "Spam rival tokens in every reply" },
      { id: "d", label: "Demand seeds for “VIP seats”" },
    ],
    correct: "b",
    explain: "Live culture = signal, honesty, no predation. Broadcast is the stage.",
  },
  {
    id: "heart-apology",
    skill: "heart",
    title: "Own the miss",
    prompt: "You shipped wrong copy that implied a live CA. Repair order?",
    kind: "order",
    difficulty: 2,
    weight: 1.3,
    options: [
      { id: "ack", label: "Acknowledge the error publicly without spin" },
      { id: "fix", label: "Fix the page / pin the correction" },
      { id: "scope", label: "State what is true now (pre-mint / official sources only)" },
      { id: "prevent", label: "Add checklist so it doesn’t recur" },
    ],
    correct: ["ack", "fix", "scope", "prevent"],
    explain: "Own → fix → restate truth → harden process.",
  },
  {
    id: "heart-inclusion",
    skill: "heart",
    title: "Who gets to play",
    prompt: "Arena only works for desktop mouse users. Heart says:",
    kind: "single",
    difficulty: 2,
    options: [
      { id: "a", label: "Mobile users should buy better phones" },
      {
        id: "b",
        label:
          "Keyboard + touch targets + readable type — the factory includes more tributes by default",
      },
      { id: "c", label: "Hide the game behind a 4K-only gate" },
      { id: "d", label: "Require webcam eye tracking to start" },
    ],
    correct: "b",
    explain: "Inclusion is product quality, not a charity add-on.",
  },
  {
    id: "heart-hype",
    skill: "heart",
    title: "Hype without harm",
    prompt: "Someone asks if $DDD “guarantees 100x.” Best reply?",
    kind: "single",
    difficulty: 1,
    weight: 1.2,
    options: [
      { id: "a", label: "Yes, guaranteed — mortgage your house" },
      {
        id: "b",
        label:
          "No guarantees. Skill arena + culture. Not financial advice. Pre-mint until official CA. Play for craft, not promises",
      },
      { id: "c", label: "Only if you send me SOL first" },
      { id: "d", label: "Refuse to answer and mock them" },
    ],
    correct: "b",
    explain: "Honesty protects people. Hype without floor is predation.",
  },
  {
    id: "heart-moderation",
    skill: "heart",
    title: "Moderation compass",
    prompt: "A joke crosses into targeted harassment of a junior tribute. You mod. First move?",
    kind: "single",
    difficulty: 3,
    weight: 1.25,
    options: [
      { id: "a", label: "Reply-all with worse jokes" },
      {
        id: "b",
        label:
          "Stop the harm (timeout/delete), support the target privately, document, apply rules evenly",
      },
      { id: "c", label: "Ban the target for “causing drama”" },
      { id: "d", label: "Do nothing so “free speech vibes”" },
    ],
    correct: "b",
    explain: "Safety first, fairness second, spectacle never.",
  },
  {
    id: "heart-async",
    skill: "heart",
    title: "Async grace",
    prompt: "Teammate in another TZ misses a “urgent” thread. Empathetic default?",
    kind: "single",
    difficulty: 2,
    options: [
      { id: "a", label: "Public shame for “not grinding”" },
      {
        id: "b",
        label:
          "Assume good intent, summarize decision + ask, keep async-friendly notes, escalate only if blocking",
      },
      { id: "c", label: "Fire them in a group voice call" },
      { id: "d", label: "Change all deadlines to their 3am without saying so" },
    ],
    correct: "b",
    explain: "Global teams need grace and clear writeups.",
  },
  {
    id: "heart-spectator",
    skill: "heart",
    title: "Spectator dignity",
    prompt: "Someone finishes MELT rank on the arena. Public results chat should:",
    kind: "single",
    difficulty: 2,
    options: [
      { id: "a", label: "Dogpile with “ngmi” spam" },
      {
        id: "b",
        label:
          "Encourage a re-run, point at weak skill from debrief, keep dignity — melt is data, not identity",
      },
      { id: "c", label: "Ban them from retrying" },
      { id: "d", label: "Demand payment to erase the local board" },
    ],
    correct: "b",
    explain: "The arena trains. Shame is not a curriculum.",
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

/** Default trials per skill in a single run (difficulty curve applied) */
export const RUN_PER_SKILL = 5;

export function challengesBySkill(skill) {
  return CHALLENGES.filter((c) => c.skill === skill);
}

/**
 * Build a difficulty-curved subset: per skill, prefer easy→mid→hard mix.
 * @param {Challenge[]} pool
 * @param {number} perSkill
 */
export function pickRunChallenges(pool = CHALLENGES, perSkill = RUN_PER_SKILL) {
  const skills = ["code", "canvas", "heart"];
  const out = [];
  for (const skill of skills) {
    const bucket = pool.filter((c) => c.skill === skill);
    const byDiff = { 1: [], 2: [], 3: [] };
    for (const c of bucket) {
      const d = c.difficulty === 3 ? 3 : c.difficulty === 2 ? 2 : 1;
      byDiff[d].push(c);
    }
    for (const d of [1, 2, 3]) shuffleInPlace(byDiff[d]);

    // Curve: roughly 40% easy, 40% mid, 20% hard (for perSkill=5 → 2,2,1)
    const n1 = Math.max(1, Math.round(perSkill * 0.4));
    const n3 = Math.max(1, Math.round(perSkill * 0.2));
    const n2 = Math.max(0, perSkill - n1 - n3);
    const targets = [
      ...take(byDiff[1], n1),
      ...take(byDiff[2], n2),
      ...take(byDiff[3], n3),
    ];
    // Fill shortfall from remaining in skill
    const used = new Set(targets.map((c) => c.id));
    const rest = shuffleInPlace(bucket.filter((c) => !used.has(c.id)));
    while (targets.length < perSkill && rest.length) targets.push(rest.shift());
    // Soft order within skill: easy → hard for the run curve feel
    targets.sort((a, b) => (a.difficulty || 1) - (b.difficulty || 1));
    out.push(...targets);
  }
  return out;
}

function take(arr, n) {
  return arr.slice(0, Math.min(n, arr.length));
}

function shuffleInPlace(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}
