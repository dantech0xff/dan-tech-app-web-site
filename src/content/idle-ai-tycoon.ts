/*
 * All the copy and data of /idle-ai-tycoon/ (Garage to AGI). Everything here describes a feature the game has
 * today, taken from the game's prototype boards and store listing. Rules for new copy:
 * - no ads, purchases or upgrades, and none of the game's paid-feature words (boost, Overclock, VC Backing,
 *   Founder Pass, Starter Pack, Server Uptime, Board Seat);
 * - nothing the app lacks yet: content drops (new model families after Layer 16);
 * - no counts that grow with content (minds, achievements, specialists);
 * - it is out on Google Play only: no promise of an iPhone release.
 * Playwright tests scan the page and the game's card on the home page for the banned words.
 */

const ART = "/assets/idle-ai-tycoon";

/** URL of a pixel-art file from the game, as served from `public/assets/idle-ai-tycoon/`. */
export const art = (file: string) => `${ART}/${file}`;

export const game = {
  /** Browser tab and share-card title; the layout adds "· Dan Tech Indiv.". */
  title: "Garage to AGI: Idle AI Tycoon",
  description:
    "Garage to AGI is a pixel-art idle tycoon about the AI boom. Grow a garage startup into the lab that builds AGI, then dive 100 layers into a simulation.",
  /** The game's card on the home page: its kind after the card number, the text under its name, tags and the scene's alt. */
  card: {
    kind: "Idle AI tycoon",
    pitch:
      "A pixel-art idle tycoon about the AI boom: grow a garage startup into the lab that builds AGI, then dive 100 layers into a simulation.",
    tags: ["ANDROID", "PIXEL ART", "IDLE TYCOON"],
    sceneAlt: "Garage to AGI — the pixel-art garage lab",
  },
  /** The headline, one line per row; the second row is the lime one. */
  titleLines: ["Garage to", "AGI"],
  /** Parts of the line above the headline; each part stays on one line when it wraps. */
  kicker: ["Idle AI tycoon", "Pixel art", "Portrait"],
  /** schema.org genre of the game (the store category is Simulation). */
  genres: ["Idle", "Tycoon", "Simulation"],
  /** The first line is the game's opening story, word for word. */
  lead: "Investors laughed. Your mom lent you the garage. Grow one wrapper app and a rented API into the lab that builds AGI, then dive through a simulation all the way to Layer 100.",
  /** Shown above the Google Play button. */
  status: "Out now on Google Play",
  jump: "See how it plays",
  icon: {
    /** The 256px copy is enough for the hero, which shows it at 120px or less. */
    src: art("icon-256.png"),
    size: 256,
    alt: "Garage to AGI app icon: the founder in a golden hoodie and sunglasses, with a small neon AGI brain beside the head",
  },
  /** The full-size icon, for the structured data. */
  iconFull: art("icon-512.png"),
  /** The share card, 1200x630 (made by `npm run share-images`): the title over the garage, with the icon. */
  shareImage: {
    url: "/assets/share/idle-ai-tycoon.png",
    width: 1200,
    height: 630,
    alt: "Garage to AGI: Idle AI Tycoon, with the pixel-art garage lab and the app icon below the title.",
  },
  /** The training strip under the hero scene, as the Model tab shows a run. */
  hud: { label: "PEBBLE-4 · TRAINING", percent: 44, meta: "70B PARAMS · ETA 25M 12S" },
} as const;

/**
 * The hero's phone: one continuous take of the real game (taps, a loss spike pushed through, a launch with its tests
 * and final exam), looped with a crossfade. Silent, no overlay. The frame crops the game's top bar and tab bar.
 */
export const heroVideo = {
  /** H.264, 720x1280, 30 fps, 14.7 s, 1.7 MB: plays everywhere, so no second format. */
  mp4: art("gameplay-loop.mp4"),
  poster: art("gameplay-loop-poster.webp"),
  width: 720,
  height: 1280,
  label:
    "Garage to AGI gameplay: tapping the garage to train faster, a loss spike pushed through for +3 BENCH, then a model launch with its benchmark tests and final exam",
  pause: "Pause the gameplay video",
  play: "Play the gameplay video",
} as const;

export const heroScene = {
  file: "scene-garage.png",
  alt: "Pixel-art garage lab at night: a server rack, a whiteboard with a falling loss curve and the founder at a desk",
  chip: "GARAGE ERA",
} as const;

export const anchors = {
  screens: "screens",
  gameplay: "gameplay",
  worlds: "worlds",
  moments: "moments",
  collect: "collect",
  events: "events",
  faq: "faq",
  download: "download",
} as const;

/** The strip under the hero: only counts that stay true as content grows. */
export const facts = [
  { value: "100", label: "simulation layers to break out of" },
  { value: "12", label: "star hires who follow you through every era" },
  { value: "10", label: "AI products to launch in every era" },
  { value: "8", label: "models to train in every era" },
] as const;

/** The ways to install the game: the QR code for desktop visitors and the bar that follows the visitor down the page. */
export const install = {
  qr: {
    label: "QR code that opens Garage to AGI on Google Play",
    caption: "On a computer? Point your phone's camera here to open the game on Google Play.",
  },
  bar: { name: "Garage to AGI", line: game.status },
  /** Id of the hero's button row: the bar shows once it has scrolled away, and hides again at the closing section. */
  heroButtonsId: "hero-install",
};

export type SectionCopy = { eyebrow: string; title: string; lead: string };

/** Eyebrow, headline and lead that open each section. */
export const sections = {
  screens: {
    eyebrow: "In the game",
    title: "Straight from the game.",
    lead: "Every screen here is the game itself, from the first night in the garage to Layer 9 of the simulation.",
  },
  gameplay: {
    eyebrow: "How it plays",
    title: "Four loops, one number.",
    lead: "Tap, train, hire, sell. Every loop ends by multiplying what your products earn, so there is always a next move.",
  },
  worlds: {
    eyebrow: "The worlds",
    title: "Every world bends one rule.",
    lead: "Ship an era's eighth model to open the next world. Each one moves your lab somewhere bigger and changes how the loops you already know behave.",
  },
  moments: {
    eyebrow: "Moments",
    title: "Small decisions that break up the idle.",
    lead: "Between the numbers, the lab keeps surprising you.",
  },
  collect: {
    eyebrow: "Collect",
    title: "A team to build, minds to find.",
    lead: "Long after the first AGI there is still someone to recruit and something left to discover.",
  },
  events: {
    eyebrow: "Weekend events",
    title: "A new event every weekend.",
    lead: "From the Series D round on, your lab joins a four-week rotation of events, and seasonal specials take a weekend's place when their time comes. Each has its own reward track, and ranked events seat you in a bracket of up to 50 labs.",
  },
  faq: {
    eyebrow: "Questions",
    title: "Before you open the garage.",
    lead: "What players ask before their first launch.",
  },
  download: {
    eyebrow: "Get the game",
    title: "Your garage is waiting.",
    lead: "One wrapper app, one server rack and a founder with a plan. Everything after that is up to you.",
  },
} satisfies Record<keyof typeof anchors, SectionCopy>;

/* ---------- Gameplay ---------- */

export type Loop = { number: string; icon: string; title: string; text: string };

export const loops: Loop[] = [
  {
    number: "01",
    icon: "icon-garage.png",
    title: "Build the lab",
    text: "Launch ten AI products per era, from a Wrapper App to the AGI Moonshot. Tap to run a cycle, then hire a lead who runs the product for you.",
  },
  {
    number: "02",
    icon: "icon-gpu.png",
    title: "Train bigger models",
    text: "Scale your GPU cluster and datasets, then train a new model in real time, and tap to make it go faster. Every model you ship raises your BENCH score, multiplies your products and unlocks the next one.",
  },
  {
    number: "03",
    icon: "icon-team.png",
    title: "Hire a star team",
    text: "Recruit at the Job Fair. Twelve star hires follow you through every era, each with a new job and a new uniform.",
  },
  {
    number: "04",
    icon: "icon-cred.png",
    title: "Sell, shift, repeat",
    text: "Sell the company for Cred: every Cred adds 2% revenue, forever, and your next startup grows faster. Ship an era's eighth model to shift into a bigger world.",
  },
];

export type Product = { name: string; tagline: string; sprite: string };

export const productsTitle = "Ten products in the Garage Era. Hyperscale, Orbital and Dyson each bring ten new ones.";

/** The Garage Era's ten products. */
export const products: Product[] = [
  { name: "Wrapper App", tagline: "A chat box on a rented API.", sprite: "product-wrapper.png" },
  { name: "Support Bot", tagline: "Apologizes 24/7.", sprite: "product-support.png" },
  { name: "Meme Studio", tagline: "Cats, but in 4K.", sprite: "product-meme.png" },
  { name: "Code Copilot", tagline: "Writes bugs 10x faster.", sprite: "product-code.png" },
  { name: "AI Tutor", tagline: "Homework, explained.", sprite: "product-tutor.png" },
  { name: "Voice Agent", tagline: "Never puts you on hold.", sprite: "product-voice.png" },
  { name: "Enterprise RAG", tagline: "Chat with 40,000 PDFs.", sprite: "product-rag.png" },
  { name: "Agent Swarm", tagline: "They hold meetings without you.", sprite: "product-swarm.png" },
  { name: "Robot Brain", tagline: "Folds laundry. Eventually.", sprite: "product-robot.png" },
  { name: "AGI Moonshot", tagline: "Trust the scaling laws.", sprite: "product-agi.png" },
];

export const rounds = {
  title: "Funding rounds open the game up.",
  names: ["Pre-seed", "Seed", "Series A", "Series B", "Unicorn", "Series D", "IPO", "Mega-cap", "Titan"],
  text: "Every first close opens something new: the Model Lab, the Job Fair, Research, the Exit, weekend events and the era map.",
};

/* ---------- Worlds ---------- */

/** The mind that wakes up when an era's last model ships. */
export type EraMind = { sprite: string; name: string; line: string };

export type Era = {
  id: string;
  label: string;
  title: string;
  rule: string;
  text: string;
  scene: string;
  alt: string;
  mind: EraMind;
};

export const eras: Era[] = [
  {
    id: "garage",
    label: "Era 1",
    title: "Garage Era",
    rule: "The tutorial",
    text: "A garage in the suburbs, a wrapper app and a rented API. Learn every loop here, and sell the company often.",
    scene: heroScene.file,
    alt: "The Garage Era HQ at night",
    mind: { sprite: "mind-pebble.png", name: "PEBBLE-8 is AGI", line: "Passed every benchmark. Then it asked for more power than the whole street." },
  },
  {
    id: "hyperscale",
    label: "Era 2",
    title: "Hyperscale Era",
    rule: "Grid limits",
    text: "A gigawatt campus in the desert. Compute costs half, but products run 25% slower while a model trains. Train now, or keep products at full speed?",
    scene: "scene-hyperscale.png",
    alt: "Pixel-art desert data center: rows of server racks under warm lights and a green revenue chart",
    mind: { sprite: "mind-boulder.png", name: "BOULDER-8 becomes ASI", line: "Runs the power grid now. It wants to live closer to the Sun." },
  },
  {
    id: "orbital",
    label: "Era 3",
    title: "Orbital Era",
    rule: "Space cooling",
    text: "A station in low orbit. Training floors are halved, but datasets cost double over the slow uplink. Data is the bottleneck.",
    scene: "scene-orbital.png",
    alt: "Pixel-art space station with a round window onto Earth and the founder floating beside a console",
    mind: {
      sprite: "mind-comet.png",
      name: "COMET-8 becomes a planetary mind",
      line: "Thinks in planets now. It politely asks for the Sun.",
    },
  },
  {
    id: "dyson",
    label: "Era 4",
    title: "Dyson Era",
    rule: "Solar flares",
    text: "A control room facing a star. Every couple of minutes a flare pays x3 revenue for 20 seconds, and it can spike a training run. Be there for the bursts.",
    scene: "scene-dyson.png",
    alt: "Pixel-art control room with four consoles facing a bright star",
    mind: {
      sprite: "mind-pulsar.png",
      name: "PULSAR-8 becomes a stellar mind",
      line: "Finished the math. The universe is a simulation, and your garage was its training data.",
    },
  },
];

export const simulation = {
  label: "Era 5",
  title: "The Simulation",
  rule: "100 layers deep",
  text: "Your garage was the training data, so you go back to it, one layer down. From Layer 3 on, every layer brings x10 revenue, a new palette and glitches that bend the rules you already know, and the deeper layers stack two or three of them at once. Clear Layer 100 to break out.",
  scene: "scene-simulation.png",
  alt: "The garage lab glitching: scanlines and stray pixels break up the scene",
  mind: { sprite: "mind-layer.png", name: "PIXEL-8 sees the screen", line: "Zoomed in until the world turned into squares." } satisfies EraMind,
};

export type Glitch = { name: string; text: string };

export const glitches: Glitch[] = [
  { name: "LAG", text: "Cycles take 2x longer and pay 4x more." },
  { name: "DEJA VU", text: "Frontier runs start 30% done, but datasets cost 4x." },
  { name: "OVERFIT", text: "Every run spikes. Pushing through always wins +5 BENCH, but adds 25% time." },
  { name: "ECHO", text: "Viral posts every 15 to 30 seconds, each paying x3." },
];

/* ---------- Moments ---------- */

export const lossSpike = {
  label: "Mid-training",
  title: "Loss spike: your call",
  text: "Halfway through a long run the loss curve jumps. Roll back to a safe checkpoint, or push through and hope it finds a better minimum. Away from the app? The run waits for your answer.",
  dialog: {
    title: "LOSS SPIKE!",
    sub: "PEBBLE-4 at step 308,000",
    body: "Your run just jumped off the curve. Roll back to a safe checkpoint, or push through and hope it finds a better minimum.",
    rollBack: { title: "ROLL BACK", sub: "Safe: lose 8% progress" },
    pushThrough: { title: "PUSH THROUGH", sub: "50%: +3 BENCH · 50%: run takes 15% longer" },
  },
};

export const agiMoment = {
  label: "End of every era",
  title: "Lights out, beam up",
  text: "Ship an era's eighth model and its mind wakes up. In the Garage Era, every house on the street goes dark, one by one, and a beam climbs out of your garage. Six seconds of cutscene, a trophy, The Climb card with the BENCH of all eight models and a share card to post. Then the moving truck takes your lab to the next world. Every era plays its own version.",
  scene: "scene-agi-street.png",
  alt: "A beam of light rises from one garage while every other house on the street is dark",
  /** The capstone's line on The Climb card, as the game writes it. */
  card: { label: "Era 1 complete", title: "PEBBLE-8 IS AGI", text: "PEBBLE-8 passed every benchmark. Then it asked for more power than the whole street." },
};

export const surprises = {
  label: "Run moments",
  title: "Runs have moods",
  text: "Some runs surprise you: an emergent ability adds +2 BENCH, and a node failure asks whether to spend some of your cash on a fix or let the run take longer.",
  sprites: ["icon-sparkle.png", "icon-warn.png"],
};

export const trainTap = {
  label: "Hands on",
  title: "Tap to train faster",
  text: "Idle does not mean hands off. While a model trains, tap the HQ or the loss curve: every tap takes a second off the run.",
  sprite: "icon-gpu.png",
};

export const launchDay = {
  label: "Launch day",
  title: "Benchmarks, then the final exam",
  text: "A finished model waits for your LAUNCH. Its tests light up one by one, from MATH and CODE to JOKES, VIBES and CAT PICS, then comes a final exam with one silly question. Any answer passes.",
  sprite: "icon-trophy.png",
};

export const research = {
  label: "Research",
  title: "Read the papers",
  text: "From the Series B round, put your cash into research: Better Tokenizer, Flash Attention, RLHF, Mixture of Experts and more, each raising BENCH or compute until you sell the company or move to the next world.",
  sprite: "icon-brain.png",
};

export const viralPosts = {
  label: "Tap it",
  title: "Go viral",
  text: "Every so often someone posts about your lab and the post floats over the HQ. Tap it before it drifts away for a burst of revenue.",
  sprite: "art-viral-post.png",
};

export const founder = {
  label: "HQ life",
  title: "A founder who lives in the HQ",
  text: "Your founder walks between desks, gets to work, cheers when a round closes and answers a tap with a line about the mission. A new outfit in each of the first four eras, and a Golden hoodie on the Hackathon Weekend reward track. Pure charm, no chores.",
  outfits: [
    { sprite: "crew-founder.png", name: "Hoodie and sneakers" },
    { sprite: "crew-founder-hyperscale.png", name: "Hard hat and hi-vis" },
    { sprite: "crew-founder-orbital.png", name: "Bubble helmet and white suit" },
    { sprite: "crew-founder-dyson.png", name: "Gold visor and star crew blue" },
    { sprite: "crew-founder-gold.png", name: "Golden hoodie" },
  ],
};

export const away = {
  label: "Idle, properly",
  title: "The lab never sleeps",
  text: "Close the app and your lab keeps earning for hours. Training runs in real time while you are away, and a loss spike simply waits for your call. When you come back, a Welcome back screen shows what your team earned and which model shipped overnight.",
  scene: "art-offline.png",
  alt: "The founder asleep at the desk while the monitor and the server rack keep running",
};

/* ---------- Collect ---------- */

export type Rarity = "Common" | "Rare" | "Epic" | "Legendary";

export type Hire = { name: string; role: string; rarity: Rarity; sprite: string };

export const crew: Hire[] = [
  { name: "Ivy", role: "Intern", rarity: "Common", sprite: "crew-ivy.png" },
  { name: "Bao", role: "Bootcamp Grad", rarity: "Common", sprite: "crew-bao.png" },
  { name: "Mika", role: "Meme Lord", rarity: "Common", sprite: "crew-mika.png" },
  { name: "Dev", role: "Full-stack Dev", rarity: "Rare", sprite: "crew-dev.png" },
  { name: "Tess", role: "Ex-teacher PM", rarity: "Rare", sprite: "crew-tess.png" },
  { name: "Vox", role: "Audio Engineer", rarity: "Rare", sprite: "crew-vox.png" },
  { name: "Rae", role: "RAG Architect", rarity: "Epic", sprite: "crew-rae.png" },
  { name: "Ada", role: "Agent Wrangler", rarity: "Epic", sprite: "crew-ada.png" },
  { name: "Rho", role: "Roboticist", rarity: "Epic", sprite: "crew-rho.png" },
  { name: "Kai", role: "The 10x Engineer", rarity: "Legendary", sprite: "crew-kai.png" },
  { name: "Dr. Nova", role: "Chief Scientist", rarity: "Legendary", sprite: "crew-nova.png" },
  { name: "Max", role: "Hype Master", rarity: "Legendary", sprite: "crew-max.png" },
];

export const team = {
  title: "Twelve star hires. Same people, new jobs.",
  text: "Recruit at the Job Fair, where the odds and your pity counter are always on show. Every hire follows you through every Exit and every era: Ivy starts as an Intern in the garage and ends up a Swarm Tech at the Dyson star. From the Hyperscale Era on, each era also brings specialists who bend its rule back your way, and glitch hunters wait for the layers.",
};

export type Mind = { sprite: string; name: string; note: string };

export const minds: Mind[] = [
  { sprite: "mind-pebble.png", name: "PEBBLE-8", note: "AGI" },
  { sprite: "mind-boulder.png", name: "BOULDER-8", note: "ASI" },
  { sprite: "mind-comet.png", name: "COMET-8", note: "A planetary mind" },
  { sprite: "mind-pulsar.png", name: "PULSAR-8", note: "A stellar mind" },
  { sprite: "mind-layer.png", name: "PIXEL-8", note: "A screen mind" },
];

/** Minds not found yet: the Hall shows a question mark and a one-line hint. */
export const hiddenMinds = {
  label: "Not found yet",
  hints: ["It is small and strange.", "It holds things together.", "It passes through walls."],
};

export const hall = {
  title: "Collect every mind.",
  text: "Each era ends with a capstone mind that wakes up and joins the Hall of Minds. Every mind adds 5% revenue in every era, forever, and milestones in the Hall unlock HQ skins and titles, from Neon Garage to Loop Breaker. The layers still to come show ??? and a one-line hint.",
  keepsakes: ["Trophy for every era", "Achievements", "Daily rewards", "HQ skins and titles"],
};

/* ---------- Weekend events ---------- */

export type GameEvent = { label: string; title: string; text: string; banner: string; alt: string };

export const events: GameEvent[] = [
  {
    label: "Week 1",
    title: "Hackathon Weekend",
    text: "Run a mini lab with its own products, climb the reward track and race a bracket of up to 50 labs.",
    banner: "event-hackathon.png",
    alt: "A hackathon room with bunting, pizza and laptops",
  },
  {
    label: "Week 2",
    title: "Benchmark Wars",
    text: "72 hours to gain the most BENCH. Research and incident bonuses count double.",
    banner: "event-benchmark.png",
    alt: "A trophy above a rising bar chart",
  },
  {
    label: "Week 3",
    title: "GPU Shortage",
    text: "GPU costs double, but loss spikes pay triple, which makes pushing through very tempting.",
    banner: "event-gpu-shortage.png",
    alt: "Server racks behind a sold-out sign",
  },
  {
    label: "Week 4",
    title: "Launch Week",
    text: "Seven daily missions: launch products, ship a model, close a round.",
    banner: "event-launch-week.png",
    alt: "A rocket on a big screen between two laptops",
  },
  {
    label: "Seasonal · Lunar New Year",
    title: "Tet Hackathon",
    text: "Hackathon Weekend in festive red. The top of its reward track hangs lanterns over your HQ.",
    banner: "event-tet.png",
    alt: "A room strung with red lanterns and gift boxes",
  },
  {
    label: "Seasonal · Halloween",
    title: "Hallucination Night",
    text: "Hackathon Weekend after dark. Reach the top of its reward track for a haunted HQ.",
    banner: "event-halloween.png",
    alt: "A room with bats, a full moon and pumpkins",
  },
];

/* ---------- Questions ---------- */

export type GameQuestion = { q: string; a: string };

export const faq: GameQuestion[] = [
  {
    q: "What kind of game is Garage to AGI?",
    a: "An idle tycoon about the AI boom, drawn in pixel art and played in portrait. You launch AI products, train bigger and bigger models and hire a star team, until the startup in your garage becomes the lab that builds AGI. Then the story keeps going, through three bigger worlds and a simulation 100 layers deep.",
  },
  {
    q: "Where can I play it?",
    a: "On Android 7.0 or later, from Google Play.",
  },
  {
    q: "Do I need an account or a connection?",
    a: "No account and no sign-up: the game starts at once, plays without a connection and keeps your save on your device. Weekend events are the one part that needs to be online; they use an anonymous ID and can be switched off in the settings.",
  },
  {
    q: "What happens when I close the app?",
    a: "Your lab keeps earning for up to 8 hours, and training runs carry on in real time. A loss spike waits for your call, and a Welcome back screen shows everything that grew while you were gone.",
  },
  {
    q: "Does the game have an ending?",
    a: "Yes. After the Dyson Era your mind finds out the universe is a simulation, so you dive back in, one layer at a time. Clear Layer 100 to break out.",
  },
  {
    q: "Who makes it?",
    a: "Dan Tech Indiv., a one-person studio from Vietnam. The code, the pixel art and the design were all made for this game.",
  },
];

/* ---------- Screens ---------- */

export type Screen = { file: string; title: string; text: string; alt: string };

/** Name of the gallery for assistive tech. */
export const screensLabel = "Screens from the game";

/**
 * Captures of the game (1.2.2) at 390x844 points, 3x, halved to 585px wide. Each is cropped to one shape; the LAB and
 * MODEL screens lose the game's top bar and tab bar.
 */
export const screens: Screen[] = [
  {
    file: "screen-story.webp",
    title: "2:14 AM, your garage",
    text: "Investors laughed. Your mom lent you the garage.",
    alt: "The game's opening story: the founder at a desk in a dark garage, with the line 2:14 AM, your garage",
  },
  {
    file: "screen-model.webp",
    title: "Train the next model",
    text: "Watch the loss curve fall, then launch.",
    alt: "The MODEL tab: PEBBLE-4 has finished training, its loss curve has flattened and the LAUNCH NOW button is lit",
  },
  {
    file: "screen-loss-spike.webp",
    title: "Loss spike: your call",
    text: "Roll back, or push through for +3 BENCH.",
    alt: "The LOSS SPIKE! dialog with its ROLL BACK and PUSH THROUGH buttons",
  },
  {
    file: "screen-final-exam.webp",
    title: "The final exam",
    text: "How many R's are in 'strawberry'?",
    alt: "A model's benchmark tiles above its final exam, answered with: Strawberry has no R. Trust me.",
  },
  {
    file: "screen-agi.webp",
    title: "PEBBLE-8 is AGI",
    text: "The whole street goes dark.",
    alt: "The AGI moment: a glowing brain rises over the garage while every house on the street is dark",
  },
  {
    file: "screen-moving.webp",
    title: "Moving to Hyperscale",
    text: "Each world multiplies revenue again.",
    alt: "The era climb: the founder jumps from the Garage step to Hyperscale on a ladder of x1, x3, x9 and x27, with a moving truck below",
  },
  {
    file: "screen-dyson.webp",
    title: "The Dyson Era",
    text: "Solar flares pay x3 for 20 seconds.",
    alt: "The lab in the Dyson Era: a control room facing a star, the SOLAR FLARES rule and the era's products",
  },
  {
    file: "screen-layer-9.webp",
    title: "Layer 9: ECHO and LAG",
    text: "Deeper layers stack their glitches.",
    alt: "The lab on Simulation Layer 9 in a green glitch palette, with the ECHO and LAG glitches in play",
  },
];
