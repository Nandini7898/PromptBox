/**
 * PromptBox - An AI Prompt Generator & Copy-Paste Hub
 * Modern, Interactive Single Page Application Logic
 */

// ─── Supabase Configuration ───────────────────────────────────────────────────
const SUPABASE_URL = 'https://vnodyziuzezyxtayeeoo.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_xWp5T0_6xHm14awdla2-ow_im4HcBkY';
// Admin email — change this to the email you signed up with to get admin access
const ADMIN_EMAIL = 'nandinimishra313@gmail.com';

let supabaseClient = null;
try {
  if (window.supabase && window.supabase.createClient) {
    supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  }
} catch (e) {
  console.warn('[PromptBox] Supabase init failed:', e);
}

// Initial Seed Prompts Dataset
const INITIAL_PROMPTS = [
  {
    id: "pv-01",
    title: "3D Pixar Stylized Character with Cinematic Backlighting",
    category: "Animation & Visuals",
    tool: "AutoDraft",
    tags: ["3d", "character", "pixar", "blender", "cinematic"],
    copyCount: 1420,
    isFavorite: false,
    createdAt: "2026-03-01",
    tips: "Best used with aspect ratio --ar 16:9 and stylus stylize parameter --s 250 in AutoDraft or Midjourney v6.",
    prompt: "A charming [Character, e.g. young inquisitive botanist robot] in a lush glowing bioluminescent forest, Pixar and DreamWorks 3D animation style, cinematic volumetric backlighting, ultra-detailed textures, subsurface scattering on skin/surfaces, ray-traced reflections, octane render, unreal engine 5 style, vivid colors, emotional expression, 8k resolution, high render quality --ar 16:9 --v 6.0"
  },
  {
    id: "pv-02",
    title: "Hindi Psychological Thriller Mystery Plot Generator",
    category: "Stories & Scripts",
    tool: "ChatGPT",
    tags: ["hindi", "story", "thriller", "bollywood", "mystery"],
    copyCount: 980,
    isFavorite: true,
    createdAt: "2026-03-05",
    tips: "Produces an atmospheric 3-act outline with authentic regional idioms, cultural touchpoints, and shocking twists.",
    prompt: "Act as an award-winning Indian OTT screenplay writer. Develop a gripping psychological mystery thriller story set in the fog-drenched ghats of [City, e.g. Varanasi / Shimla]. \n\nProtagonist: [Character Archetype, e.g. A suspended forensic officer struggling with insomnia].\nThe Incident: [Mystery Event, e.g. A series of cryptic antique brass bells left at crime scenes without any footprints].\n\nProvide:\n1. Logline & Central Theme (in evocative Hinglish & Hindi tone).\n2. 3-Act Structure with escalating stakes.\n3. The Dark Secret / Midpoint Revelation.\n4. Climax confrontation with high psychological dilemma.\n5. Suggested title in Hindi with English translation."
  },
  {
    id: "pv-03",
    title: "Viral High CTR YouTube Thumbnail Master",
    category: "YouTube & Video",
    tool: "Midjourney",
    tags: ["youtube", "thumbnail", "ctr", "mrbeast", "expressive"],
    copyCount: 2310,
    isFavorite: false,
    createdAt: "2026-03-10",
    tips: "Leaves clear negative space on the left or right for bold thumbnail text overlays.",
    prompt: "YouTube video thumbnail shot of [Subject/Person, e.g. tech creator holding a transparent glowing smartphone], extreme shocked and astonished facial expression, dynamic split lighting with cyan rim light and warm orange key light, hyper-saturated contrast, clean shallow depth of field with blurred high-tech lab background, ultra-sharp 8k, cinematic camera lens 35mm f/1.4, optimized for high click-through-rate, empty space on left for typography --ar 16:9 --stylize 250"
  },
  {
    id: "pv-04",
    title: "Production Next.js 14 App Router + Tailwind Architecture",
    category: "Web Dev & Coding",
    tool: "Claude",
    tags: ["nextjs", "react", "typescript", "tailwind", "clean-code"],
    copyCount: 1850,
    isFavorite: true,
    createdAt: "2026-03-12",
    tips: "Specify your exact database or state library for Claude to provide tailored production schemas.",
    prompt: "You are a Principal Frontend Architect. Scaffold a production-ready, accessible Web Application using Next.js 14 (App Router), TypeScript, Tailwind CSS, and Shadcn UI for a [Application Type, e.g. AI Prompt Analytics Dashboard].\n\nRequirements:\n1. File structure following scalable Feature-Sliced or Domain-driven design.\n2. Server Components for data fetching with React Suspense and Error Boundaries.\n3. A reusable, accessible [Component Name, e.g. Interactive Filter Modal] with glassmorphism Tailwind styling.\n4. Type definitions with strict TypeScript interfaces and Zod validation schemas.\n5. Production performance optimizations (memoization, lazy loading, image optimization).\nProvide clean, copy-pasteable code with minimal fluff."
  },
  {
    id: "pv-05",
    title: "Cinematic Drone Hyperlapse City Transition",
    category: "Animation & Visuals",
    tool: "Runway",
    tags: ["video", "sora", "runway", "drone", "hyperlapse"],
    copyCount: 890,
    isFavorite: false,
    createdAt: "2026-03-15",
    tips: "Excellent for text-to-video generators like Runway Gen-3 Alpha, Sora, or Kling AI.",
    prompt: "Seamless drone FPV hyperlapse soaring through a futuristic cyberpunk [Location, e.g. Tokyo Shibuya intersection] at sunset transitioning into nighttime, neon holographic advertisements flickering, heavy rainfall with reflections on wet asphalt, dynamic high-speed camera motion turning 90 degrees around a skyscraper, cinematic motion blur, 60fps, 4k photorealistic, anamorphic lens flare"
  },
  {
    id: "pv-06",
    title: "High-Engagement X (Twitter) Viral Thread Formula",
    category: "Social Media",
    tool: "ChatGPT",
    tags: ["twitter", "viral", "copywriting", "hooks", "growth"],
    copyCount: 3120,
    isFavorite: false,
    createdAt: "2026-03-18",
    tips: "Generates high retweet velocity by combining curiosity gap hooks with digestible bullet frameworks.",
    prompt: "Act as a viral social media strategist who has generated 10M+ impressions. Write a high-converting 7-tweet educational thread about [Topic, e.g. 5 AI tools that automate 80% of frontend development].\n\nStructure:\n- Tweet 1: Hook that triggers intense curiosity or contrarian truth. No clichés.\n- Tweet 2: The Core Problem people waste hours on.\n- Tweets 3-5: The 3 actionable solutions with clear step-by-step takeaways and bullet points.\n- Tweet 6: Pro-tip / Golden Rule summarizing the mindset.\n- Tweet 7: CTA inviting bookmarks, reposts, and comments with an open question.\n\nTone: Snappy, authoritative, zero corporate jargon, high whitespace for readability."
  },
  {
    id: "pv-07",
    title: "10-Minute YouTube Video Script with High-Retention Hooks",
    category: "YouTube & Video",
    tool: "ChatGPT",
    tags: ["youtube", "scriptwriting", "storytelling", "retention"],
    copyCount: 1640,
    isFavorite: true,
    createdAt: "2026-03-20",
    tips: "Includes visual direction, sound effects (SFX), and B-roll cues mapped directly to talking points.",
    prompt: "Act as an expert YouTube scriptwriter who optimizes for 70%+ audience retention. Write a full 10-minute video script on the topic: '[Topic, e.g. How AI Coding Agents Will Change Programming Forever]'.\n\nFormat with 3 columns / tags:\n[TIMESTAMP] | [VISUAL / B-ROLL / SFX CUE] | [SPOKEN HOST SCRIPT]\n\nKey Rules:\n1. First 30 Seconds: 3-layer hook (The Promise, The Stakes, The Tease) without saying 'Welcome back to my channel'.\n2. Introduce an open story loop at minute 2 that is only resolved at minute 8.\n3. Every 45 seconds specify a pattern interrupt (zoom, sound effect, graphic overlay).\n4. Natural conversational tone with witty punchlines."
  },
  {
    id: "pv-08",
    title: "Full-Stack Node.js & Prisma REST API Generator",
    category: "Web Dev & Coding",
    tool: "ChatGPT",
    tags: ["backend", "nodejs", "express", "prisma", "api"],
    copyCount: 1240,
    isFavorite: false,
    createdAt: "2026-03-22",
    tips: "Includes JWT authentication, input sanitization, error middleware, and Prisma schemas.",
    prompt: "Write a complete, enterprise-grade REST API backend using Node.js, Express, TypeScript, and Prisma ORM for a [Service Name, e.g. Bookmark & Prompt Sharing Platform].\n\nInclude:\n1. Prisma schema model for User, Prompt, Category, and Like with relations.\n2. JWT Authentication middleware with refresh tokens and bcrypt password hashing.\n3. Controllers with input validation (Zod) and try/catch error handling.\n4. Centralized error handling middleware with custom ApiError class.\n5. Clean, structured folder hierarchy."
  },
  {
    id: "pv-09",
    title: "Hindi Mythological Sci-Fi Web Series Narrative Arc",
    category: "Stories & Scripts",
    tool: "Claude",
    tags: ["hindi", "mythology", "scifi", "worldbuilding", "series"],
    copyCount: 750,
    isFavorite: false,
    createdAt: "2026-03-25",
    tips: "Blends ancient Indian epics with futuristic speculative concepts (Astra-punk / Vedic Futurism).",
    prompt: "Act as a visionary creative showrunner. Create an episodic 6-part pilot season bible for an Indian Sci-Fi / Mythological thriller series titled '[Title, e.g. Brahmashirsha 2099]'.\n\nSetting: New Indraprastha in the year 2099, where quantum computing has unlocked the vibrational frequencies of ancient Astras.\nProtagonist: [Character, e.g. A cynical hacker from old Delhi who discovers their lineage].\nAntagonist: A mega-corporation attempting to synthesize divine armor (Kavach-Kundal).\n\nOutput:\n- Concept pitch & visual world aesthetic.\n- Character breakdowns with inner flaws and Hindi catchphrases.\n- Episode 1 to 6 breakdown with intense cliffhangers.\n- Dialogue sample in bilingual Hindi/English dialogue."
  },
  {
    id: "pv-10",
    title: "Isometric Cyberpunk 3D Game Room Asset",
    category: "Animation & Visuals",
    tool: "Midjourney",
    tags: ["isometric", "game-art", "cyberpunk", "3d", "room"],
    copyCount: 1580,
    isFavorite: false,
    createdAt: "2026-03-27",
    tips: "Great for game devs designing dioramas, tile assets, or futuristic concept rooms.",
    prompt: "Isometric 3D cutaway view of a futuristic [Room Type, e.g. Cyberpunk Hacker Hideout & Gaming Den], featuring multi-monitor holographic setups, tangled fiber-optic glowing cables, miniature neon vending machine, cozy futon bed, floating drone charging dock, rain streaks on large panoramic window overlooking neon megacity, octane render style, soft volumetric lighting, vibrant purple and teal palette, ultra detail, 8k resolution --ar 1:1 --v 6.0"
  },
  {
    id: "pv-11",
    title: "High-Converting 7-Slide Instagram Carousel Blueprint",
    category: "Social Media",
    tool: "ChatGPT",
    tags: ["instagram", "carousel", "growth", "design-copy", "marketing"],
    copyCount: 2040,
    isFavorite: false,
    createdAt: "2026-04-01",
    tips: "Slide-by-slide layout providing visual design direction on the left and typography copy on the right.",
    prompt: "Create a viral 7-slide educational Instagram carousel outline for [Topic, e.g. 5 Habits That Separate Junior Developers From Senior Engineers].\n\nFor each slide (1 to 7), provide:\n- Slide Goal: (Hook, Retain, Educate, Action)\n- Visual Design Direction: (Background color, imagery, icons, layout)\n- Headline: (Bold, large font text)\n- Body Copy: (Under 30 words, bite-sized & impactful)\n- Slide 7 CTA: Save for later & comment prompt."
  },
  {
    id: "pv-12",
    title: "Interactive Glassmorphic UI Component in Tailwind",
    category: "Web Dev & Coding",
    tool: "Claude",
    tags: ["tailwind", "css", "glassmorphism", "ui", "frontend"],
    copyCount: 1970,
    isFavorite: true,
    createdAt: "2026-04-03",
    tips: "Includes modern backdrop-filter blur, glowing borders, and accessible dark theme contrast.",
    prompt: "Write the HTML and Tailwind CSS code for a modern, high-contrast dark theme [Component, e.g. SaaS Pricing Card or AI Model Switcher].\n\nStyling details:\n- Deep dark slate backdrop with subtle multi-layer glassmorphism (`backdrop-blur-xl bg-slate-900/60 border border-white/10`).\n- Radiant gradient border glow on hover.\n- Micro-interactions on button click (scale, ring pulse).\n- Accessible typography with high contrast ratios.\n- Fully responsive and zero external CSS required."
  },
  // --- 1. YouTube Thumbnails & Video (pv-13 to pv-17) ---
  {
    id: "pv-13",
    title: "Extreme Challenge High-Stakes YouTube Thumbnail",
    category: "YouTube & Video",
    tool: "Midjourney",
    tags: ["youtube", "thumbnail", "challenge", "mrbeast", "high-ctr"],
    copyCount: 2840,
    isFavorite: false,
    createdAt: "2026-04-05",
    tips: "Leaves uncluttered space on the left side for bold, high-contrast text like 'I SURVIVED 50 HOURS'.",
    prompt: "High-energy YouTube thumbnail, wide angle, [Creator/Person, e.g. Young adventurer with wide eyes screaming in excitement] trapped inside [Scenario, e.g. a 100-layer giant unbreakable ice cube], vibrant saturated hyper-contrast lighting, glowing neon hazard yellow and icy cyan rims, sharp focus, expressive emotion, rule of thirds, clean empty backdrop on left for text overlay, 8k resolution, cinematic render --ar 16:9 --v 6.0"
  },
  {
    id: "pv-14",
    title: "Atmospheric Dark Mystery & True Crime YouTube Thumbnail",
    category: "YouTube & Video",
    tool: "Midjourney",
    tags: ["youtube", "thumbnail", "true-crime", "documentary", "noir"],
    copyCount: 1720,
    isFavorite: false,
    createdAt: "2026-04-06",
    tips: "Dimly lit with strong rim lighting that pops when viewed on small mobile YouTube feeds.",
    prompt: "Atmospheric true crime YouTube documentary thumbnail of [Subject/Evidence, e.g. an abandoned 1970s detective desk with crime scene photos and a smoking revolver], dimly lit noir spotlight beam cutting through volumetric haze and dust motes, sinister crimson red backlight, hyper-detailed, cinematic depth of field, suspenseful eerie mood, 35mm film photography --ar 16:9 --v 6.0"
  },
  {
    id: "pv-15",
    title: "Finance & Wealth Holographic YouTube Thumbnail",
    category: "YouTube & Video",
    tool: "AutoDraft",
    tags: ["youtube", "thumbnail", "finance", "crypto", "business"],
    copyCount: 1930,
    isFavorite: false,
    createdAt: "2026-04-07",
    tips: "Combines billionaire aesthetic with vivid green and cyan glowing holographic charts.",
    prompt: "YouTube thumbnail for finance video, [Subject, e.g. Confident entrepreneur pointing at a massive floating holographic 3D stock chart trending upwards with glowing green arrows], dramatic studio portrait lighting, dark blue and electric green rim lights, clean minimalist billionaire aesthetic, hyper-detailed, 8k, bokeh background --ar 16:9"
  },
  {
    id: "pv-16",
    title: "Before vs After Dramatic Split-Screen YouTube Thumbnail",
    category: "YouTube & Video",
    tool: "Midjourney",
    tags: ["youtube", "thumbnail", "split-screen", "transformation", "ctr"],
    copyCount: 2490,
    isFavorite: true,
    createdAt: "2026-04-08",
    tips: "Produces an instant visual narrative showing extreme contrast between struggle and success.",
    prompt: "YouTube thumbnail split screen composition: Left side showing [Depressing / Broken State, e.g. stressed student surrounded by messy papers in dull gray lighting]; Right side showing [Victorious / Transformed State, e.g. triumphant creator smiling in bright vibrant golden hour aesthetic with glowing trophy], sharp diagonal neon dividing line down the middle, high contrast, facial micro-expressions, 8k --ar 16:9 --v 6.0"
  },
  {
    id: "pv-17",
    title: "Futuristic Faceless AI & Tech Explainer YouTube Thumbnail",
    category: "YouTube & Video",
    tool: "Midjourney",
    tags: ["youtube", "thumbnail", "faceless", "ai", "hardware"],
    copyCount: 1410,
    isFavorite: false,
    createdAt: "2026-04-09",
    tips: "Ideal for faceless automation channels explaining quantum tech, chips, and AI breakthroughs.",
    prompt: "Futuristic faceless YouTube thumbnail featuring [Object, e.g. a translucent glass microchip with glowing purple quantum neural pathways], hovering in mid-air over a sleek dark obsidian pedestal, cinematic ray-traced reflections, laser grid background in deep indigo and magenta, crisp focus, extreme clarity, 8k --ar 16:9"
  },

  // --- 2. Midjourney Character Art (pv-18 to pv-22) ---
  {
    id: "pv-18",
    title: "Cyberpunk Street Samurai Ronin Character Concept",
    category: "Animation & Visuals",
    tool: "Midjourney",
    tags: ["midjourney", "character-art", "cyberpunk", "samurai", "concept-art"],
    copyCount: 3410,
    isFavorite: true,
    createdAt: "2026-04-10",
    tips: "Use higher stylize values (--s 250 to 400) for rich garment textures and intricate mechanical joints.",
    prompt: "Full-body character concept art of a [Cyberpunk Ronin / Street Assassin, e.g. female cyborg with chrome prosthetic arm and traditional weathered kimono], wielding a glowing plasma katana, standing on a rainy Neo-Tokyo rooftop with holographic neon billboards reflected in puddles, atmospheric fog, photorealistic octane render, intricate mechanical joints, character design sheet quality, 8k resolution --ar 9:16 --v 6.0 --stylize 300"
  },
  {
    id: "pv-19",
    title: "Ethereal Celestial Elf Sorceress Character Portrait",
    category: "Animation & Visuals",
    tool: "Midjourney",
    tags: ["midjourney", "character-art", "fantasy", "elf", "magic"],
    copyCount: 2650,
    isFavorite: false,
    createdAt: "2026-04-11",
    tips: "Delivers luminous skin subsurface scattering and detailed starlight particle effects.",
    prompt: "Close-up character portrait of an [Elven Sorceress, e.g. with iridescent silver braided hair and glowing runic tattoos], casting [Magic Element, e.g. celestial starlight orb] floating above palm, translucent gossamer robes with golden filigree embroidery, soft volumetric rim lighting, delicate facial features, cinematic bokeh, digital painting by Greg Rutkowski and Artgerm, masterpiece, 8k --ar 2:3 --v 6.0"
  },
  {
    id: "pv-20",
    title: "Vintage 1990s Cel-Shaded Anime Mecha Pilot",
    category: "Animation & Visuals",
    tool: "Midjourney",
    tags: ["anime", "niji", "retro", "mecha", "90s"],
    copyCount: 1980,
    isFavorite: false,
    createdAt: "2026-04-12",
    tips: "Utilizes the Midjourney Niji 6 model for authentic hand-drawn anime nostalgia.",
    prompt: "Vintage 1990s cel-shaded anime character portrait of [Character, e.g. a fierce young mecha pilot with spiky cobalt hair wearing a scuffed flight pilot suit], sitting in cockpit surrounded by glowing analog dials and CRT displays, hand-drawn aesthetic, Studio Ghibli and Evangelion influence, retro film grain, warm nostalgic color palette --ar 16:9 --niji 6"
  },
  {
    id: "pv-21",
    title: "Moody Dark Gothic Victorian Vampire Aristocrat",
    category: "Animation & Visuals",
    tool: "Midjourney",
    tags: ["gothic", "vampire", "portrait", "victorian", "chiaroscuro"],
    copyCount: 2210,
    isFavorite: false,
    createdAt: "2026-04-13",
    tips: "Captures heavy chiaroscuro shadow drama and velvet material realism.",
    prompt: "A brooding gothic Victorian [Character, e.g. aristocratic vampire lord in velvet crimson coat with silver lace collar], seated on a weathered carved obsidian throne inside a crumbling cathedral, moonlight filtering through stained glass windows, photorealistic textures, dark romanticism, chiaroscuro lighting, intricate jewelry and ring details, Hasselblad portrait 85mm --ar 4:5 --v 6.0"
  },
  {
    id: "pv-22",
    title: "Handmade Polymer Claymation Creature Mascot",
    category: "Animation & Visuals",
    tool: "AutoDraft",
    tags: ["claymation", "3d", "character", "cute", "stop-motion"],
    copyCount: 1620,
    isFavorite: false,
    createdAt: "2026-04-14",
    tips: "Produces an artisan handcrafted tactile feel with micro thumbprint textures.",
    prompt: "Adorable stop-motion claymation miniature figurine of a [Creature, e.g. chubby baby dragon holding a glowing acorn], handcrafted polymer clay texture with subtle artisan fingerprint marks, warm cozy studio lighting, tilt-shift lens macro photography, depth of field, vibrant pastel color palette, Aardman animations style, 8k --ar 1:1"
  },

  // --- 3. Hindi Story Writing & Screenplays (pv-23 to pv-27) ---
  {
    id: "pv-23",
    title: "Emotional Rural Indian Family Drama Screenplay (Hindi)",
    category: "Stories & Scripts",
    tool: "ChatGPT",
    tags: ["hindi", "screenplay", "bollywood", "drama", "family"],
    copyCount: 1840,
    isFavorite: false,
    createdAt: "2026-04-15",
    tips: "Authentic colloquial Hindi with rich subtext and poignant emotional tension.",
    prompt: "Act as a veteran Bollywood screenwriter in the style of Anurag Kashyap and Shoojit Sircar. Write an emotional, character-driven Hindi screenplay scene set in [Setting, e.g. a modest ancestral haveli in rural Bihar / Lucknow].\n\nCharacters:\n- [Character 1, e.g. Ramakant: An aging, stubborn schoolmaster refusing to sell his land].\n- [Character 2, e.g. Ankit: His ambitious son returning from Bengaluru with a corporate venture].\n\nDeliver:\n1. Scene Heading & Atmospheric Action Lines in Hindi script / Hinglish.\n2. Authentic Hindi dialogue with regional Bhojpuri/Awadhi idioms and emotional pauses.\n3. The unspoken generational conflict and poignant climax moment."
  },
  {
    id: "pv-24",
    title: "Supernatural Indian Folklore Horror Story Generator (Hindi)",
    category: "Stories & Scripts",
    tool: "ChatGPT",
    tags: ["hindi", "horror", "folklore", "supernatural", "mystery"],
    copyCount: 2150,
    isFavorite: true,
    createdAt: "2026-04-16",
    tips: "Draws upon authentic Indian mountain legends, haunted stepwells, and ancient rituals.",
    prompt: "Write a chilling Indian supernatural folklore horror story in evocative Hindi titled '[Story Title, e.g. Chudail ka Kuan / Peepal ke Niche]'.\n\nSetting: A remote Himalayan village cut off by landslides in winter.\nPlot: [Protagonist, e.g. An agnostic government doctor] hears ancient lullabies echoing from a sealed mountain well at 3:00 AM.\n\nStructure:\n1. 'Kathanak' (Premise) building dread through folklore rituals (Totka).\n2. First Encounter described using rich Hindi vocabulary (Bhayawah dharohar, anjaani aahat).\n3. Climax where ancient myth collides with horrifying reality.\n4. Epilogue with a chilling village proverb."
  },
  {
    id: "pv-25",
    title: "Cyberpunk Mumbai 2085 Underworld Detective Thriller (Hindi)",
    category: "Stories & Scripts",
    tool: "Claude",
    tags: ["hindi", "cyberpunk", "scifi", "mumbai", "detective"],
    copyCount: 1390,
    isFavorite: false,
    createdAt: "2026-04-17",
    tips: "Masterful blend of Mumbai street slang ('Bambaiya') and futuristic high-tech jargon.",
    prompt: "Act as a bilingual Indian sci-fi author. Draft the opening chapter of a neo-noir cyberpunk detective novella titled 'Kala Dariya: Mumbai 2085'.\n\nWorld: Monsoon rains flooding the lower neon underbelly of Dharavi-Megapolis, where synthetic memory drugs ('Yaadein') are black-marketed.\nProtagonist: [Detective Name, e.g. Kabir Rathore], an ex-encounter specialist with neural interface glitches.\n\nRequirements:\n- Written in immersive, street-smart Mumbaiya Hindi blended with futuristic terminology.\n- Vivid sensory descriptions of cybernetic street food stalls and flying rickshaws.\n- A gripping opening discovery: A dead synth-human clutching an antique gold coin with Ashoka pillar."
  },
  {
    id: "pv-26",
    title: "Historical Rajputana Battlefield Valor Screenplay (Hindi)",
    category: "Stories & Scripts",
    tool: "ChatGPT",
    tags: ["hindi", "historical", "epic", "valor", "dialogue"],
    copyCount: 1780,
    isFavorite: false,
    createdAt: "2026-04-18",
    tips: "Employs high-register Sanskritized Hindi ('Veer Ras') for legendary monologues.",
    prompt: "Write an intense, poetic historical Hindi dialogue monologue for a Rajput warrior prince before the battle of [Battle / Fort, e.g. Chittorgarh].\n\nTone: Fierce valor ('Veer Ras'), honor, sacrifice ('Balidan'), and poetic Hindi diction with chaste Sanskritized vocabulary.\nInclude:\n- Fiery speech addressing tired soldiers around the campfire.\n- References to motherland ('Matribhumi') and immortal legacy.\n- Direct confrontation with enemy envoy carrying surrender terms.\n- Stirring battle cry that echoes through the ramparts."
  },
  {
    id: "pv-27",
    title: "Charming University Campus Monsoon Romance (Hinglish)",
    category: "Stories & Scripts",
    tool: "ChatGPT",
    tags: ["hindi", "hinglish", "romance", "college", "relatable"],
    copyCount: 1540,
    isFavorite: false,
    createdAt: "2026-04-19",
    tips: "Warm, witty dialogue capturing the nostalgia of North Campus chai stalls and rain.",
    prompt: "Write a charming, heartwarming 5-scene short romance story in conversational modern Hinglish set in [College / City, e.g. Delhi University North Campus / Marine Drive Mumbai].\n\nCharacters: [Protagonists, e.g. An introverted coding student and an outgoing street-play theater director].\nInciting Incident: [Accidental Meeting, e.g. Exchanging identical umbrella during heavy Delhi monsoon at a tea stall].\n\nRequirements:\n- Natural, witty banter full of contemporary youth humor.\n- Subtle emotional beats and nostalgic Bollywood song references.\n- Satisfying cliffhanger confession scene at Metro station."
  },

  // --- 4. Instagram Reels & Short-Form Video (pv-28 to pv-32) ---
  {
    id: "pv-28",
    title: "Viral 3-Second Visual Hook & Retention Script for Reels",
    category: "Social Media",
    tool: "ChatGPT",
    tags: ["instagram", "reels", "tiktok", "viral-hook", "short-form"],
    copyCount: 3890,
    isFavorite: true,
    createdAt: "2026-04-20",
    tips: "Designed to stop thumb-scrolling within the critical 0-3 second window to maximize completion rate.",
    prompt: "Act as a short-form video viral strategist who has helped creators get 50M+ views on Instagram Reels and TikTok. Generate 5 scroll-stopping 30-second Reel concepts for the niche: [Niche, e.g. Productivity & Deep Work for Remote Workers].\n\nFor each concept provide:\n1. 3-Second Visual Hook: What the creator does on screen to halt thumbs.\n2. Audio / Spoken Hook: The exact controversial or curiosity-provoking first line.\n3. Retention Bridge: How to maintain watch time past second 10.\n4. B-Roll & Text Overlay Directives: On-screen captions and sound effect markers.\n5. Call to Action (CTA): High-save comment prompt (e.g. 'Comment CODE and I'll DM you the template')."
  },
  {
    id: "pv-29",
    title: "Relatable POV Comedy Reel Script with Text-on-Screen",
    category: "Social Media",
    tool: "ChatGPT",
    tags: ["instagram", "reels", "pov", "comedy", "shareable"],
    copyCount: 2740,
    isFavorite: false,
    createdAt: "2026-04-21",
    tips: "Optimized for high DM shares, which Instagram's algorithm weights highest for organic reach.",
    prompt: "Write 3 hilarious, highly shareable POV (Point of View) comedy Reel scripts for [Audience / Theme, e.g. Software engineers dealing with non-technical product managers].\n\nStructure per Reel:\n- POV Headline: (The relatable caption placed on screen throughout the clip).\n- Acting Direction: Facial micro-expressions, awkward eye contact, prop usage.\n- Sound & Music Track Recommendation: Trending audio type or viral sound bite.\n- Timing: Total 12 to 15 seconds for maximum replay loop percentage.\n- Caption & 5 High-Reach Hashtags."
  },
  {
    id: "pv-30",
    title: "High-Save Educational Micro-Tutorial Reel Blueprint",
    category: "Social Media",
    tool: "ChatGPT",
    tags: ["reels", "tutorial", "educational", "growth", "bookmarks"],
    copyCount: 2310,
    isFavorite: false,
    createdAt: "2026-04-22",
    tips: "Encourages viewers to save/bookmark the Reel by packaging a dense lesson into 45 seconds.",
    prompt: "Create a fast-paced 45-second educational micro-tutorial Reel script breaking down [Complex Topic, e.g. How to use Git rebase without ruining your repository in 3 simple steps].\n\nFormat:\n[0:00 - 0:03] Hook: 'Stop using Git merge like a rookie. Here is what senior devs actually do...'\n[0:03 - 0:35] The 3 Visual Steps: Clear split screen showing terminal commands with animated zoom.\n[0:35 - 0:45] Actionable Outro & Save Cue: 'Save this Reel before your next merge conflict.'"
  },
  {
    id: "pv-31",
    title: "Aesthetic Cinematic 'Day in the Life' B-Roll Reel",
    category: "Social Media",
    tool: "ChatGPT",
    tags: ["instagram", "reels", "aesthetic", "vlog", "storytelling"],
    copyCount: 1970,
    isFavorite: false,
    createdAt: "2026-04-23",
    tips: "Produces an atmospheric mood with precise camera framing cues and introspective voiceovers.",
    prompt: "Generate an aesthetic, cinematic 30-second 'Day in the life of a [Profession, e.g. Solo indie app founder working from a cozy coffee shop in Tokyo]' Reel breakdown.\n\nInclude:\n- 8 Shot B-Roll Checklist with focal lengths (Macro pouring coffee, keyboard mechanical clack, code compile progress bar, city window rain).\n- Voiceover Monologue Script: Introspective, inspiring, and transparent about founder struggles.\n- Ambient Lo-Fi music vibe suggestions and color grading LUT recommendation."
  },
  {
    id: "pv-32",
    title: "Contrarian 'Stop Doing X, Do Y Instead' Viral Reel",
    category: "Social Media",
    tool: "ChatGPT",
    tags: ["reels", "contrarian", "growth", "algorithm", "marketing"],
    copyCount: 3120,
    isFavorite: false,
    createdAt: "2026-04-24",
    tips: "Debunks common myths, prompting debates and comment activity that spike algorithm reach.",
    prompt: "Generate a contrarian Instagram Reel script based on the viral framework 'Stop Doing [Mistake], Do This Instead' for [Topic, e.g. Learning to Code in 2026].\n\nProvide:\n1. Shocking Hook that debunks a widely accepted industry myth.\n2. Proof / Why the old way is failing people now.\n3. The Modern Alternative blueprint in 3 bullet takeaways.\n4. Direct CTA asking viewers to debate in the comments to boost algorithm velocity."
  },

  // --- 5. Web Development & Architecture (pv-33 to pv-37) ---
  {
    id: "pv-33",
    title: "Enterprise Micro-Frontend Architecture with Module Federation",
    category: "Web Dev & Coding",
    tool: "Claude",
    tags: ["micro-frontends", "architecture", "react", "webpack", "enterprise"],
    copyCount: 2180,
    isFavorite: true,
    createdAt: "2026-04-25",
    tips: "Complete solution covering error boundaries, shared dependencies, and independent deployment.",
    prompt: "You are an Enterprise Principal Architect. Design a scalable Micro-Frontend Architecture using Webpack Module Federation with React, TypeScript, and Tailwind for an [Enterprise App, e.g. Multi-Tenant E-commerce Platform].\n\nDeliverables:\n1. Host Shell and Remote micro-apps configuration (`webpack.config.js`).\n2. Cross-application shared state and event bus pattern (Zustand or custom EventTarget).\n3. Shared design system component consumption with zero CSS collisions.\n4. Error boundary isolation so one failing micro-frontend never crashes the entire shell.\n5. CI/CD independent deployment pipeline strategy."
  },
  {
    id: "pv-34",
    title: "High-Performance Full-Text Search Schema (Postgres / SQLite)",
    category: "Web Dev & Coding",
    tool: "ChatGPT",
    tags: ["database", "sql", "postgres", "fts", "search"],
    copyCount: 1670,
    isFavorite: false,
    createdAt: "2026-04-26",
    tips: "Provides GIN indexing, ranked weights, headline generation, and typo tolerance.",
    prompt: "Write production SQL migrations, indexing strategies, and TypeScript repository methods for high-speed Full-Text Search (FTS5 in SQLite or tsvector in PostgreSQL) for a [Domain, e.g. Knowledge Base with 500,000 articles].\n\nInclude:\n1. Complete DDL schema with generated search vectors and GIN / FTS indexes.\n2. Ranking algorithm query using `ts_rank_cd` with term frequency and typo tolerance.\n3. TypeScript query builder with pagination, highlights, and SQL-injection-proof parameterized queries.\n4. Benchmark considerations and cache invalidation pattern."
  },
  {
    id: "pv-35",
    title: "Accessible WCAG 2.2 AAA Autocomplete Combobox in React",
    category: "Web Dev & Coding",
    tool: "Claude",
    tags: ["react", "accessibility", "a11y", "wcag", "tailwind"],
    copyCount: 1890,
    isFavorite: false,
    createdAt: "2026-04-27",
    tips: "Follows strict WAI-ARIA combobox 1.2 patterns with zero third-party dependencies.",
    prompt: "Build an accessible, keyboard-navigable [Component Name, e.g. Multi-Select Autocomplete Combobox with Tag Chips] in React and Tailwind CSS complying with WCAG 2.2 AAA standards.\n\nRequirements:\n1. Full ARIA attributes (`aria-expanded`, `aria-activedescendant`, `role=\"combobox\"`, `role=\"listbox\"`).\n2. Keyboard interactions: Arrow keys navigation, Home/End, Escape to close, Backspace to delete chips.\n3. Screen reader live announcement region (`aria-live=\"polite\"`).\n4. Zero external libraries beyond React standard hooks.\n5. High-contrast dark theme styling."
  },
  {
    id: "pv-36",
    title: "Fault-Tolerant Background Job Worker with BullMQ & Redis",
    category: "Web Dev & Coding",
    tool: "ChatGPT",
    tags: ["nodejs", "bullmq", "redis", "queues", "backend"],
    copyCount: 1560,
    isFavorite: false,
    createdAt: "2026-04-28",
    tips: "Includes exponential backoffs, dead letter queues, and graceful worker shutdown.",
    prompt: "Architect and code a fault-tolerant asynchronous background job processing system in Node.js and TypeScript using BullMQ and Redis for [Task, e.g. Generating AI video summaries and sending webhook notifications].\n\nProvide:\n1. Queue configuration with exponential backoff retries and Dead Letter Queue (DLQ).\n2. Worker implementation with concurrency limits and graceful shutdown on SIGTERM.\n3. Real-time progress reporting via Redis Pub/Sub or WebSockets.\n4. Unit tests using Vitest mocking Redis connection."
  },
  {
    id: "pv-37",
    title: "Full-Stack End-to-End Type Safety with tRPC & TanStack Query",
    category: "Web Dev & Coding",
    tool: "Claude",
    tags: ["trpc", "tanstack-query", "nextjs", "typescript", "fullstack"],
    copyCount: 2420,
    isFavorite: true,
    createdAt: "2026-04-29",
    tips: "Demonstrates optimistic UI updates with automatic cache invalidation and rollback on failure.",
    prompt: "Scaffold a modern, fully type-safe end-to-end full-stack integration using tRPC v11, TanStack Query, Next.js App Router, and Prisma for [Feature, e.g. Real-time Collaborative Prompt Bookmarking and Rating].\n\nProvide:\n1. Root tRPC router with public and authenticated procedures using middleware.\n2. Zod validation schemas for input mutations.\n3. Client-side optimistic update implementation in React component.\n4. Invalidation and cache management on mutation success.\n5. Error handling pipeline mapping database constraints to friendly UI toasts."
  },

  // --- 6. SEO Article Writing & Content Strategy (pv-38 to pv-42) ---
  {
    id: "pv-38",
    title: "Search-Intent Master SEO Article Outline & Featured Snippet",
    category: "Web Dev & Coding",
    tool: "ChatGPT",
    tags: ["seo", "content-marketing", "featured-snippet", "blogging", "google"],
    copyCount: 2950,
    isFavorite: true,
    createdAt: "2026-04-30",
    tips: "Crafts a 45-word definition block specifically engineered to capture Google's Position Zero.",
    prompt: "Act as a senior SEO Content Strategist. Create a high-ranking, search-intent optimized comprehensive article outline targeting the primary keyword: '[Primary Keyword, e.g. Best AI Coding Assistants for VS Code in 2026]'.\n\nInclude:\n1. Search Intent Analysis: (Informational, Commercial, or Navigational) and target audience pain points.\n2. Click-Worthy SEO Title (Under 60 chars) & Compelling Meta Description (Under 155 chars) with target keyword.\n3. Semantic H2 and H3 Heading Hierarchy integrating LSI keywords and People-Also-Ask questions.\n4. Featured Snippet target section: Concise 45-word definition box designed to win Google Position Zero.\n5. Internal linking blueprint and suggested high-authority external sources."
  },
  {
    id: "pv-39",
    title: "Programmatic SEO Template for In-Depth Product Comparisons",
    category: "Web Dev & Coding",
    tool: "Claude",
    tags: ["programmatic-seo", "vs-comparison", "schema-markup", "affiliate", "seo"],
    copyCount: 2130,
    isFavorite: false,
    createdAt: "2026-05-01",
    tips: "Generates high-intent comparison matrix with JSON-LD Schema markup for Google Rich Results.",
    prompt: "Design an in-depth programmatic SEO comparison template for comparing '[Product A] vs [Product B]' in the [Industry, e.g. Headless CMS / Vector Databases] niche.\n\nStructure:\n1. Quick Verdict Executive Summary table comparing Pricing, Speed, DX, and Limitations.\n2. Deep Dive Section 1: When to choose Product A (with real developer scenarios).\n3. Deep Dive Section 2: When to choose Product B.\n4. Feature-by-feature granular benchmark comparison.\n5. FAQ section structured in JSON-LD Schema markup for rich snippets in Google search results."
  },
  {
    id: "pv-40",
    title: "High-Converting Product-Led SEO Content Piece",
    category: "Social Media",
    tool: "ChatGPT",
    tags: ["product-led-seo", "b2b", "content-strategy", "copywriting", "growth"],
    copyCount: 1820,
    isFavorite: false,
    createdAt: "2026-05-02",
    tips: "Teaches valuable free solutions first before naturally positioning your SaaS as the effortless answer.",
    prompt: "Write a 1,500-word product-led SEO article addressing the problem: '[Problem Statement, e.g. How to manage state across micro-frontends without prop drilling]'.\n\nGuidelines:\n- Hook: Open with the frustration every senior engineer experiences with standard approaches.\n- Educational Value: Provide 2 free, vendor-neutral architectural solutions first.\n- Seamless Integration: Introduce [Your Product / Tool Name] as the effortless automated solution in Step 3.\n- Tone: Authoritative, technical, respectful of reader's intelligence with code examples.\n- Clear CTA guiding readers to try an interactive sandbox or GitHub repo."
  },
  {
    id: "pv-41",
    title: "Authoritative Pillar Page Strategy with 6 Supporting Clusters",
    category: "Stories & Scripts",
    tool: "Claude",
    tags: ["pillar-page", "topic-clusters", "content-marketing", "seo-strategy"],
    copyCount: 1690,
    isFavorite: false,
    createdAt: "2026-05-03",
    tips: "Creates a topical authority moat for search engines through bidirectional internal linking.",
    prompt: "You are an enterprise Content Marketing Director. Map out a comprehensive 3,000-word Pillar Page strategy and 6 Supporting Cluster Articles for the cornerstone topic: '[Cornerstone Topic, e.g. The Complete Guide to Agentic AI Architecture]'.\n\nFor the Pillar Page provide:\n1. Definitive core concepts and historical progression.\n2. Visual diagram description illustrating agent loops, memory, and tool calling.\n\nFor the 6 Cluster Articles:\n- Title, target secondary keyword, search volume intent, and reciprocal internal linking hooks pointing back to the pillar."
  },
  {
    id: "pv-42",
    title: "Technical SEO Content Audit & Modernization Refresh Plan",
    category: "Web Dev & Coding",
    tool: "ChatGPT",
    tags: ["seo-audit", "content-refresh", "decay", "optimization", "search"],
    copyCount: 1470,
    isFavorite: false,
    createdAt: "2026-05-04",
    tips: "Revives declining traffic by purging obsolete tech patterns and adding current schema specs.",
    prompt: "Act as an SEO Technical Auditor. Analyze the following outdated article text on '[Topic, e.g. React 16 Lifecycle Methods]' and produce a complete modernization audit.\n\nOriginal Text / Outline: [Paste Old Article Content Here]\n\nDeliver:\n1. Outdated Information List: Deprecated APIs, dead links, obsolete patterns to remove.\n2. Modern Upgrades: What modern best practices (React 19 Server Actions, compiler, hooks) must replace them.\n3. Content Expansion: 3 new subheadings based on current 2026 search trends and developer queries.\n4. Optimized meta tags and schema markup recommendation."
  },
  // --- 7. YouTube Thumbnails (pv-43 to pv-49) ---
  {
    id: "pv-43",
    title: "High-Contrast Tech Gadget Unboxing YouTube Thumbnail",
    category: "YouTube & Video",
    tool: "Midjourney",
    tags: ["youtube", "thumbnail", "tech", "gadgets", "unboxing"],
    copyCount: 2150,
    isFavorite: false,
    createdAt: "2026-05-05",
    tips: "Features transparent holographic product with dramatic studio rim lights and clean typography space on left.",
    prompt: "YouTube unboxing thumbnail shot of [Tech Gadget, e.g. transparent futuristic holographic smart glasses] hovering above premium matte black packaging box, dramatic neon cyan and magenta rim lighting, hands wearing minimalist matte rings reaching out, hyper-detailed, clean bokeh background of modern creator studio, 8k resolution, rule of thirds, empty space on left for bold typography --ar 16:9 --v 6.0"
  },
  {
    id: "pv-44",
    title: "Gaming Showdown 1v1 Battle YouTube Thumbnail",
    category: "YouTube & Video",
    tool: "Midjourney",
    tags: ["youtube", "thumbnail", "gaming", "esports", "vs-battle"],
    copyCount: 1980,
    isFavorite: false,
    createdAt: "2026-05-06",
    tips: "Diagonal energy lightning split separating two opposing high-contrast avatars.",
    prompt: "Intense gaming esports YouTube thumbnail, split screen with dynamic lightning bolt division, left side [Character/Player 1, e.g. aggressive neon demon gaming avatar], right side [Character/Player 2, e.g. cybernetic golden angel avatar], extreme glowing energy aura, hyper-saturated contrast, dramatic angled camera lens, high click-through rate design --ar 16:9 --v 6.0"
  },
  {
    id: "pv-45",
    title: "Sensational Myth-Busting Science Experiment Thumbnail",
    category: "YouTube & Video",
    tool: "AutoDraft",
    tags: ["youtube", "thumbnail", "science", "experiment", "shocking"],
    copyCount: 1670,
    isFavorite: false,
    createdAt: "2026-05-07",
    tips: "Showcases frozen liquid droplets in mid-air with exaggerated facial expressions.",
    prompt: "YouTube science experiment thumbnail, [Presenter, e.g. energetic scientist wearing safety goggles with mouth open in shock] holding a beaker overflowing with [Reaction Element, e.g. glowing emerald radioactive foam], slow-motion droplets frozen in mid-air, studio spotlighting, vibrant saturated primary colors, high contrast, clean composition --ar 16:9"
  },
  {
    id: "pv-46",
    title: "Cinematic Travel Vlog Sunrise Peak YouTube Thumbnail",
    category: "YouTube & Video",
    tool: "Midjourney",
    tags: ["youtube", "thumbnail", "travel", "vlog", "cinematic"],
    copyCount: 2310,
    isFavorite: true,
    createdAt: "2026-05-08",
    tips: "Golden hour sunburst with silhouette framing and expansive mountain scale.",
    prompt: "Epic travel vlog YouTube thumbnail of [Traveler, e.g. solo backpacker standing on the edge of a cliff overlooking majestic alpine peaks at sunrise], golden volumetric sun rays illuminating mist in the valley, silhouette with warm orange rim light, expansive scale, ultra-sharp 8k, National Geographic aesthetic, negative space for title --ar 16:9"
  },
  {
    id: "pv-47",
    title: "Food Review & Secret Recipe YouTube Thumbnail",
    category: "YouTube & Video",
    tool: "Midjourney",
    tags: ["youtube", "thumbnail", "food", "street-food", "delicious"],
    copyCount: 2790,
    isFavorite: false,
    createdAt: "2026-05-09",
    tips: "Extreme close-up macro focus on steaming texture and dripping sauce with high saturation.",
    prompt: "Mouth-watering YouTube food review thumbnail, extreme close-up of [Dish, e.g. towering crispy smash burger with cascading molten cheddar cheese and caramelized onions], steaming vapor, glistening sauce drip, warm cozy restaurant bokeh, creator smiling in background holding fork, hyper-vibrant saturation, commercial food photography --ar 16:9"
  },
  {
    id: "pv-48",
    title: "Financial Freedom & Net Worth Growth YouTube Thumbnail",
    category: "YouTube & Video",
    tool: "Midjourney",
    tags: ["youtube", "thumbnail", "finance", "money", "investing"],
    copyCount: 1840,
    isFavorite: false,
    createdAt: "2026-05-10",
    tips: "Clean, trustworthy dark blue palette accented with glowing green upwards chart vectors.",
    prompt: "Eye-catching finance YouTube thumbnail, [Subject, e.g. young professional looking astonished at a glowing smartphone screen reflecting green numbers], floating 3D golden coins and upward trending neon green stock line charts, clean deep navy studio background, soft rim light, minimalist high-CTR composition --ar 16:9"
  },
  {
    id: "pv-49",
    title: "Fitness Transformation Before & After Split Thumbnail",
    category: "YouTube & Video",
    tool: "AutoDraft",
    tags: ["youtube", "thumbnail", "fitness", "transformation", "motivation"],
    copyCount: 2120,
    isFavorite: false,
    createdAt: "2026-05-11",
    tips: "Creates instant curiosity through drastic lighting, posture, and emotional contrast.",
    prompt: "High-impact fitness YouTube thumbnail split composition: [Before State, e.g. slouched tired person in dim lighting with stopwatch] on left; [After State, e.g. energized muscular athlete in outdoor stadium golden hour] on right, sharp laser boundary line, motivational bold visual cues, ultra-crisp detail --ar 16:9"
  },

  // --- 8. 2D Village Animation & Rural Art (pv-50 to pv-56) ---
  {
    id: "pv-50",
    title: "Traditional Indian Village Morning 2D Animation Scene",
    category: "Animation & Visuals",
    tool: "AutoDraft",
    tags: ["2d-animation", "village", "ghibli", "indian-village", "rural"],
    copyCount: 2630,
    isFavorite: true,
    createdAt: "2026-05-12",
    tips: "Soft watercolor palette with warm golden morning mist and Ghibli-inspired hand-painted textures.",
    prompt: "Charming 2D animated scenic concept art of a [Setting, e.g. peaceful rural Indian village in Uttar Pradesh] at sunrise, mud houses with terracotta tile roofs, women drawing fresh water from a stone well, cows resting under a giant banyan tree with hanging roots, soft pastel watercolor aesthetic, Studio Ghibli inspired, gentle morning golden haze, 4k resolution --ar 16:9"
  },
  {
    id: "pv-51",
    title: "Monsoon Rain in Rural Village Tea Stall 2D Scene",
    category: "Animation & Visuals",
    tool: "Midjourney",
    tags: ["2d-animation", "monsoon", "rain", "cozy", "village"],
    copyCount: 3120,
    isFavorite: true,
    createdAt: "2026-05-13",
    tips: "Evocative rain reflection caustics and warm lantern glow inside thatched tea stalls.",
    prompt: "Cozy 2D cel-animated frame of heavy monsoon rain falling over a [Village Scene, e.g. village tea stall with thatched tin roof], water droplets splashing in mud puddles, children running with banana leaf umbrellas, warm lantern light glowing inside tea stall, lush green paddy fields in background, nostalgic Makoto Shinkai aesthetic, soothing rain atmosphere --ar 16:9 --niji 6"
  },
  {
    id: "pv-52",
    title: "Indian Village Potter & Artisan Wheel 2D Story Frame",
    category: "Animation & Visuals",
    tool: "AutoDraft",
    tags: ["2d-animation", "artisan", "pottery", "folk-art", "culture"],
    copyCount: 1590,
    isFavorite: false,
    createdAt: "2026-05-14",
    tips: "Warm terracotta clay tones with authentic rural Indian folk motifs and sunset warmth.",
    prompt: "Warm 2D hand-drawn animation frame of a [Character, e.g. humble elder Indian potter shaping a clay diya lamp on a spinning wooden wheel], warm earthen clay textures, courtyard filled with painted pottery drying in the sun, marigold flower garlands, folk art motifs, warm sunset lighting, Disney classic 2D animation style --ar 16:9"
  },
  {
    id: "pv-53",
    title: "Rural Harvest Festival & Village Fair 2D Visual",
    category: "Animation & Visuals",
    tool: "Midjourney",
    tags: ["2d-animation", "festival", "harvest", "mela", "folk"],
    copyCount: 1870,
    isFavorite: false,
    createdAt: "2026-05-15",
    tips: "Bursting with festive colors: marigold yellows, celebratory kites, and handmade wooden carnival rides.",
    prompt: "Vibrant 2D animated landscape of a rural [Festival, e.g. Baisakhi / Pongal harvest fair] in a village clearing, colorful decorated bullock carts, children riding a handmade wooden Ferris wheel, flying kites in orange sky, folk musicians playing dholak, warm joyful watercolor tones, folk illustration style --ar 16:9 --niji 6"
  },
  {
    id: "pv-54",
    title: "Open-Air Village School Under Mango Tree 2D Animation",
    category: "Animation & Visuals",
    tool: "AutoDraft",
    tags: ["2d-animation", "school", "children", "village", "nostalgia"],
    copyCount: 1740,
    isFavorite: false,
    createdAt: "2026-05-16",
    tips: "Captures dappled sunlight through green tree leaves with wholesome storybook charm.",
    prompt: "Heartwarming 2D animated storybook scene of an [Open-air Village School, e.g. enthusiastic teacher pointing at a blackboard tied to an ancient mango tree], barefoot smiling children sitting on jute mats with slate boards, dappled sunlight filtering through leaves, gentle breeze fluttering notebook pages, wholesome nostalgic animation style --ar 16:9"
  },
  {
    id: "pv-55",
    title: "Riverside Twilight & Floating Diya Lamps 2D Scene",
    category: "Animation & Visuals",
    tool: "Midjourney",
    tags: ["2d-animation", "river", "twilight", "peaceful", "evening"],
    copyCount: 2280,
    isFavorite: false,
    createdAt: "2026-05-17",
    tips: "Peaceful purple twilight palette with gently glowing oil lamps drifting on reflective river ripples.",
    prompt: "Serene 2D animated twilight scene of a riverside village, wooden fishing boats tied to bamboo poles, oil lamps floating on the gentle river current, smoke curling from chulha hearths, silhouettes of neem trees against purple and indigo twilight sky, peaceful Ghibli-style hand-painted background --ar 16:9 --niji 6"
  },
  {
    id: "pv-56",
    title: "Folk Tale Storybook Village Girl & Stray Pup 2D Scene",
    category: "Animation & Visuals",
    tool: "AutoDraft",
    tags: ["2d-animation", "storybook", "rural", "companion", "pastoral"],
    copyCount: 1940,
    isFavorite: false,
    createdAt: "2026-05-18",
    tips: "Vibrant blooming mustard fields stretching to the horizon with warm pastoral hues.",
    prompt: "Storybook 2D animation illustration of a [Character, e.g. curious 8-year-old village girl in a yellow frock] walking along a dusty field path with her loyal stray puppy, mustard flower fields blooming yellow on both sides, flock of parrots flying overhead, storybook art style, clean outline, rich warm colors --ar 16:9"
  },

  // --- 9. Midjourney Character & Visual Art (pv-57 to pv-63) ---
  {
    id: "pv-57",
    title: "Bioluminescent Deep Sea Cyber-Creature Concept",
    category: "Animation & Visuals",
    tool: "Midjourney",
    tags: ["midjourney", "creature", "bioluminescent", "ocean", "sci-fi"],
    copyCount: 2890,
    isFavorite: true,
    createdAt: "2026-05-19",
    tips: "National Geographic deep-ocean documentary style with iridescent fiber-optic caustics.",
    prompt: "Macro character portrait of a [Creature, e.g. translucent abyssal manta ray adorned with bioluminescent neon cyan patterns and fiber-optic tendrils], gliding through deep midnight blue oceanic trench, floating luminescent jellyfish particles, ray-traced underwater caustics, octane render, National Geographic deep ocean documentary style, 8k --ar 16:9 --v 6.0"
  },
  {
    id: "pv-58",
    title: "Solarpunk Botanical Architect Character Design",
    category: "Animation & Visuals",
    tool: "Midjourney",
    tags: ["midjourney", "solarpunk", "character-design", "architect", "green-future"],
    copyCount: 2450,
    isFavorite: false,
    createdAt: "2026-05-20",
    tips: "Hopeful utopian aesthetic blending sustainable materials with glowing flora.",
    prompt: "Full-body character concept art of a [Solarpunk Architect, e.g. young female botanist engineer wearing biodegradable linen tunic and brass drafting goggles], inspecting a living skyscraper made of genetically modified glowing sequoia trees, sunlight refracting through greenhouse glass domes, lush hanging gardens, utopian hopeful aesthetic, 8k resolution --ar 9:16 --v 6.0"
  },
  {
    id: "pv-59",
    title: "Dark Fantasy Eldritch Void Knight Character Concept",
    category: "Animation & Visuals",
    tool: "Midjourney",
    tags: ["midjourney", "dark-fantasy", "knight", "void", "eldritch"],
    copyCount: 3010,
    isFavorite: true,
    createdAt: "2026-05-21",
    tips: "Heavy chiaroscuro shadow drama and cosmic starlight energy swirling inside obsidian armor.",
    prompt: "Intimidating character art of an [Eldritch Knight, e.g. towering warrior in obsidian plate armor with purple cosmic nebulae swirling inside helmet visor], wielding a jagged greatsword dripping with starlight energy, standing amidst the ruins of a floating moon castle, dark souls aesthetic, volumetric fog, dramatic chiaroscuro lighting, 8k --ar 2:3 --v 6.0"
  },
  {
    id: "pv-60",
    title: "Brutalist Haute Couture Fashion Editorial Portrait",
    category: "Animation & Visuals",
    tool: "Midjourney",
    tags: ["midjourney", "fashion", "editorial", "vogue", "minimalism"],
    copyCount: 1820,
    isFavorite: false,
    createdAt: "2026-05-22",
    tips: "Hasselblad 35mm medium format framing with architectural minimalism.",
    prompt: "High-fashion studio editorial portrait of a [Model/Subject, e.g. statuesque model draped in oversized structured architectural wool coat in oat milk beige], geometric monochrome brutalist studio backdrop, sharp sunlight and shadow play, 35mm Hasselblad fashion photography, Vogue cover aesthetic, elegant minimalism --ar 3:4 --v 6.0"
  },
  {
    id: "pv-61",
    title: "Isometric 3D Artisan Coffee Roastery & Bookshop",
    category: "Animation & Visuals",
    tool: "Midjourney",
    tags: ["midjourney", "isometric", "coffee", "bookshop", "cozy-3d"],
    copyCount: 2340,
    isFavorite: false,
    createdAt: "2026-05-23",
    tips: "Tilt-shift miniature diorama effect featuring warm Edison bulbs and detailed props.",
    prompt: "Isometric 3D cutaway view of a [Shop Type, e.g. two-story artisan coffee roastery and antique bookshop], featuring brass espresso machines, floor-to-ceiling bookshelves with miniature rolling ladder, glowing amber Edison bulbs, patrons reading on velvet armchairs, rain trickling down windows, tilt-shift miniature effect, octane render 8k --ar 1:1 --v 6.0"
  },
  {
    id: "pv-62",
    title: "Steampunk Sky Airship Captain Character Portrait",
    category: "Animation & Visuals",
    tool: "Midjourney",
    tags: ["midjourney", "steampunk", "airship", "captain", "portrait"],
    copyCount: 1760,
    isFavorite: false,
    createdAt: "2026-05-24",
    tips: "Golden hour reflection across brass dials and goggles with flying cloudscapes.",
    prompt: "Detailed character portrait of a [Steampunk Airship Captain, e.g. weathered veteran navigator with a brass monocle lens and leather flight jacket], standing on the open wooden deck of an airship soaring above sea of clouds, sunset golden hour reflecting on brass gears, windblown hair, cinematic framing, 8k --ar 4:5 --v 6.0"
  },
  {
    id: "pv-63",
    title: "Surrealist Metaphysical Prism Glass Sculpture",
    category: "Animation & Visuals",
    tool: "Midjourney",
    tags: ["midjourney", "surrealism", "sculpture", "glass", "moma"],
    copyCount: 1610,
    isFavorite: false,
    createdAt: "2026-05-25",
    tips: "Dichroic prism glass refraction suspended above desert mirror reflections at dusk.",
    prompt: "Avant-garde surrealist art installation of a [Subject, e.g. delicate human anatomical heart sculpted from rainbow prism dichroic glass], suspended weightlessly in mid-air above calm desert mirror water at dusk, refraction of pastel sunset sky through internal crystals, MoMA exhibition aesthetic, ray-traced hyper-realism --ar 16:9 --v 6.0"
  },

  // --- 10. Hindi Moral Stories & Fables (pv-64 to pv-70) ---
  {
    id: "pv-64",
    title: "Classic Panchatantra Animal Moral Fable (Hindi)",
    category: "Stories & Scripts",
    tool: "ChatGPT",
    tags: ["hindi", "panchatantra", "moral-story", "animals", "wisdom"],
    copyCount: 2470,
    isFavorite: true,
    createdAt: "2026-05-26",
    tips: "Includes poetic animal dialogue in Sanskritized Hindi with a rhyming 2-line moral doha.",
    prompt: "Act as a master Hindi storyteller. Write an engaging Panchatantra-style moral fable in pure, poetic Hindi titled '[Story Title, e.g. Chatur Lomdi aur Ahankari Sher / Shanti ka Moti]'.\n\nCharacters:\n- [Animal 1, e.g. Ek buddhiman budha khargosh (Wise elder hare)].\n- [Animal 2, e.g. Ek ghamandi aur krodhi sher (Arrogant tiger)].\n\nSetting: Sundarvan ka ghana jungle.\n\nStructure:\n1. 'Katha Aarambh' (Story introduction setting up the forest crisis).\n2. The Moral Dilemma: How wit and patience overcome brute force.\n3. Dialogue in evocative Hindi rich in metaphors.\n4. 'Shiksha' (Moral lesson) summarized in a memorable 2-line Hindi doha/couplet."
  },
  {
    id: "pv-65",
    title: "Akbar-Birbal Courtly Wit & Wisdom Tale (Hindi)",
    category: "Stories & Scripts",
    tool: "ChatGPT",
    tags: ["hindi", "akbar-birbal", "courtroom", "wit", "humor"],
    copyCount: 2190,
    isFavorite: false,
    createdAt: "2026-05-27",
    tips: "Authentic Mughal court greetings, respectful protocol, and brilliant deductive reasoning.",
    prompt: "Write a witty historical court tale in authentic formal Hindi in the style of Birbal's wisdom stories.\n\nScenario: Emperor Akbar poses an unsolvable riddle to his courtiers: '[Riddle/Test, e.g. Shahar mein kitne kaue hain / Sabse bada dhan kya hai?]'.\n\nInclude:\n- Courtly etiquette and Urdu/Hindi greetings ('Jahanpanah', 'Adab').\n- Rival courtier's flawed and greedy answer.\n- Birbal's clever, humorous deduction that leaves the courtroom smiling.\n- King Akbar's hearty laughter and royal reward."
  },
  {
    id: "pv-66",
    title: "Modern Village Panchayat Moral Drama on Greed (Hindi)",
    category: "Stories & Scripts",
    tool: "ChatGPT",
    tags: ["hindi", "village", "panchayat", "family", "morals"],
    copyCount: 1830,
    isFavorite: false,
    createdAt: "2026-05-28",
    tips: "Grounding in rural values, generational land disputes, and emotional reconciliations.",
    prompt: "Write an emotional and inspiring Hindi moral story set in an Indian village titled '[Story Title, e.g. Mitti ka Mol / Do Bhaiyon ka Khet]'.\n\nCore Conflict: [Conflict, e.g. Two brothers disputing an ancestral mango orchard during severe drought].\n\nDeliver:\n1. Realistic portrayal of village life, panchayat dialogue, and rural values.\n2. The turning point where selflessness triumphs over greed.\n3. Heart-touching climax where family bonds are restored.\n4. Thought-provoking moral for modern youth."
  },
  {
    id: "pv-67",
    title: "The Generous Village Potter & The King Fable (Hindi)",
    category: "Stories & Scripts",
    tool: "Claude",
    tags: ["hindi", "fable", "humility", "wisdom", "philosophical"],
    copyCount: 1520,
    isFavorite: false,
    createdAt: "2026-05-29",
    tips: "Gentle spiritual philosophy inspired by Munshi Premchand and Sant Kabir.",
    prompt: "Write an evocative Hindi fable about [Topic, e.g. a humble village potter whose unadorned earthen water pots bring healing to a proud monarch afflicted with thirst].\n\nTone: Gentle, spiritual, reflective (Sant Kabir / Premchand influence).\nKey Themes: Simplicity ('Sadagi'), honest labor ('Shram'), and humility ('Vinamrata').\nFormat with engaging narrative prose followed by a philosophical takeaway in Hindi and English."
  },
  {
    id: "pv-68",
    title: "Inspirational Rural Girl's Education Moral Story (Hindi)",
    category: "Stories & Scripts",
    tool: "ChatGPT",
    tags: ["hindi", "education", "inspirational", "empowerment", "story"],
    copyCount: 2040,
    isFavorite: true,
    createdAt: "2026-05-30",
    tips: "Celebrates resilience and community unity around girl-child education in rural India.",
    prompt: "Write an uplifting Hindi story about [Protagonist, e.g. Gauri: a determined 12-year-old girl in a remote Rajasthan village who dreams of becoming a doctor].\n\nObstacles: Village elders opposing girl child education and financial hardship.\nTurning Point: Gauri using herbal knowledge to save an elder during a medical emergency.\nClimax: The entire village pooling resources to send her to city high school.\nMessage: Education empowers not just an individual, but an entire generation."
  },
  {
    id: "pv-69",
    title: "The Honest Farmer & The Buried Gold Urn (Hindi)",
    category: "Stories & Scripts",
    tool: "ChatGPT",
    tags: ["hindi", "fable", "honesty", "farmer", "ethics"],
    copyCount: 1680,
    isFavorite: false,
    createdAt: "2026-05-31",
    tips: "Explores the rare virtue of returning wealth found on rented land.",
    prompt: "Draft a traditional Hindi folk fable titled 'Imandar Kisan aur Sone ka Bartan'.\n\nPlot: An impoverished farmer finds a buried urn of gold coins while plowing rented farmland belonging to a wealthy zamindar.\nConflict: The farmer refuses to keep what isn't his, but the zamindar refuses to accept it without honest claim.\nResolution: The wise village elder solves the dispute in an unexpected benevolent way.\nMoral in Hindi highlighting integrity ('Satyanishtha')."
  },
  {
    id: "pv-70",
    title: "Illustrated Children Bedtime Fable: The Little Firefly (Hindi)",
    category: "Stories & Scripts",
    tool: "ChatGPT",
    tags: ["hindi", "bedtime", "children", "firefly", "kindness"],
    copyCount: 1910,
    isFavorite: false,
    createdAt: "2026-06-01",
    tips: "Playful onomatopoeia sound words (Chham-chham, Tim-tim) with bilingual English translation.",
    prompt: "Create a sweet, imaginative Hindi bedtime story with English translation for children aged 6-10 about [Character, e.g. a tiny glowworm who believed his light was too small to matter].\n\nArc: On a stormy night when the village lighthouse fails, the glowworm gathers thousands of fireflies to guide a lost boat safely to shore.\nInclude sound words (Chham-chham, Tim-tim), joyful dialogue, and a warm moral about self-worth."
  },

  // --- 11. Web Dev & Modern Full-Stack (pv-71 to pv-76) ---
  {
    id: "pv-71",
    title: "React 19 Server Actions & Optimistic Form Mutations",
    category: "Web Dev & Coding",
    tool: "Claude",
    tags: ["react19", "server-actions", "optimistic-ui", "typescript", "frontend"],
    copyCount: 2750,
    isFavorite: true,
    createdAt: "2026-06-02",
    tips: "Includes immediate UI rollback on server mutation failure with zero client lag.",
    prompt: "You are a Senior React Architect. Write a production implementation of a high-performance form using React 19 Server Actions, `useActionState`, and `useOptimistic` for [Feature, e.g. Real-Time Collaborative Task Board].\n\nInclude:\n1. Server Action with Zod schema validation and simulated network latency.\n2. Optimistic UI update showing immediate rollback if the server fails.\n3. Accessible Tailwind form layout with pending spinner and error state banners.\n4. Clean TypeScript interfaces and error boundary handling."
  },
  {
    id: "pv-72",
    title: "Async FastAPI & Streaming AI Agent Microservice",
    category: "Web Dev & Coding",
    tool: "ChatGPT",
    tags: ["fastapi", "python", "streaming", "ai-agent", "backend"],
    copyCount: 2320,
    isFavorite: false,
    createdAt: "2026-06-03",
    tips: "Server-Sent Events (SSE) streaming endpoint with strict Pydantic v2 validation.",
    prompt: "Build an enterprise-grade async microservice in Python using FastAPI, Pydantic v2, and LangChain / OpenAI API for a [Service Type, e.g. Automated PDF Document Q&A and Extraction Engine].\n\nRequirements:\n1. Async streaming endpoint (`StreamingResponse`) with server-sent events (SSE).\n2. Strict Pydantic request/response validation models.\n3. API Key authentication dependency and rate-limiting middleware.\n4. Comprehensive Pytest test cases mocking LLM calls."
  },
  {
    id: "pv-73",
    title: "Multi-Stage Dockerfile & CI/CD Pipeline for Next.js",
    category: "Web Dev & Coding",
    tool: "ChatGPT",
    tags: ["docker", "nextjs", "devops", "ci-cd", "github-actions"],
    copyCount: 1980,
    isFavorite: false,
    createdAt: "2026-06-04",
    tips: "Produces an Alpine Linux standalone production image under 120MB with non-root security.",
    prompt: "Write an ultra-optimized, secure multi-stage Dockerfile and GitHub Actions CI/CD workflow for a [Application, e.g. Next.js 14 standalone containerized app].\n\nInclude:\n1. Multi-stage build (deps, builder, runner) with Alpine Linux resulting in <120MB image.\n2. Non-root user permissions (`nextjs:nodejs`) for container hardening.\n3. Docker layer caching in GitHub Actions.\n4. Health check endpoint configuration and docker-compose file."
  },
  {
    id: "pv-74",
    title: "Tailwind CSS Micro-Interactions Analytics Card Component",
    category: "Web Dev & Coding",
    tool: "Claude",
    tags: ["tailwind", "css", "micro-interactions", "ui-component", "dashboard"],
    copyCount: 2410,
    isFavorite: true,
    createdAt: "2026-06-05",
    tips: "Includes SVG sparkline visualization, glowing gradient borders, and sliding active pills.",
    prompt: "Create the HTML, Tailwind CSS, and lightweight JS for an interactive analytics dashboard card for [Metric, e.g. Real-time API Latency & Error Rate Monitor].\n\nFeatures:\n- Sleek high-contrast dark theme with SVG sparkline graph and glowing tooltips.\n- Smooth micro-interactions on hover (spring scale, glowing gradient border).\n- Live toggle switch for timeframes (1h, 24h, 7d, 30d) with active pill sliding transition.\n- 100% accessible with ARIA live region."
  },
  {
    id: "pv-75",
    title: "PostgreSQL Multi-Tenant Row-Level Security (RLS) Policy",
    category: "Web Dev & Coding",
    tool: "ChatGPT",
    tags: ["postgresql", "rls", "security", "database", "multi-tenant"],
    copyCount: 1890,
    isFavorite: false,
    createdAt: "2026-06-06",
    tips: "Enforces cryptographic tenant isolation directly in database engine with RBAC grants.",
    prompt: "Write production PostgreSQL SQL DDL and policies for a Multi-Tenant SaaS application with Row-Level Security (RLS) for [Domain, e.g. Healthcare Clinical Notes & Patient Records].\n\nInclude:\n1. Schema with Tenants, Users, Roles, and Records tables.\n2. PostgreSQL RLS policies enforcing tenant isolation and role-based permissions (Admin, Doctor, Auditor).\n3. Session context function (`current_setting('app.current_tenant_id')`).\n4. Test queries demonstrating access grant and rejection."
  },
  {
    id: "pv-76",
    title: "Autonomous Agent Tool-Calling Loop in TypeScript",
    category: "Web Dev & Coding",
    tool: "Claude",
    tags: ["agentic-ai", "typescript", "tool-calling", "openai", "architecture"],
    copyCount: 2980,
    isFavorite: true,
    createdAt: "2026-06-07",
    tips: "Features recursive loop safeguards, token-safe history sliding windows, and self-healing error recovery.",
    prompt: "Code a robust, resilient Agentic AI loop in TypeScript using the OpenAI SDK function/tool calling for [Agent Goal, e.g. Autonomous Web Research & Summary Bot].\n\nImplement:\n1. Tool declarations with JSON Schema (e.g. searchDatabase, fetchUrlContent, calculateMetrics).\n2. Agent execution loop with recursion depth limit and token-safe message history trimming.\n3. Structured error handling for tool failures with model recovery prompts.\n4. Final answer synthesis with source citations."
  },

  // --- 12. Social Media Captions & Growth (pv-77 to pv-82) ---
  {
    id: "pv-77",
    title: "High-Engagement LinkedIn Thought Leadership Narrative",
    category: "Social Media",
    tool: "ChatGPT",
    tags: ["linkedin", "copywriting", "growth", "founder", "thought-leadership"],
    copyCount: 3120,
    isFavorite: true,
    createdAt: "2026-06-08",
    tips: "Crafts a 2-line curiosity hook that compels users to tap '...see more' on mobile feeds.",
    prompt: "Act as a top 1% LinkedIn creator who writes thought leadership posts that generate 100,000+ views. Write a compelling, vulnerable professional story about [Topic, e.g. Failing a major software product launch and the 3 lessons learned].\n\nFormat:\n- 2-Line Hook: High-contrast emotional hook with 'See more' cliffhanger.\n- The Story: Short 1-2 sentence paragraphs with whitespace.\n- The Pivot: The realization that changed everything.\n- 3 Tactical Takeaways: Bullet points with zero fluff.\n- Closing Question: Open-ended question encouraging industry leaders to share their experience."
  },
  {
    id: "pv-78",
    title: "Instagram 10-Slide Educational Carousel Caption & Teasers",
    category: "Social Media",
    tool: "ChatGPT",
    tags: ["instagram", "carousel", "caption", "seo", "engagement"],
    copyCount: 2640,
    isFavorite: false,
    createdAt: "2026-06-09",
    tips: "Teases specific slides (e.g., slide 5 and 7) to guarantee high swipe-through rates.",
    prompt: "Write a high-converting Instagram caption for a 10-slide educational carousel about [Topic, e.g. 7 Hidden Developer Tools That Feel Illegal to Know].\n\nInclude:\n1. First sentence hook that stops users mid-feed.\n2. Brief bullet teaser of slides 3 and 7 to drive swipe completion.\n3. Clear call-to-action: 'Swipe through and bookmark slide 5 for your next project.'\n4. Keyword-rich caption body for Instagram SEO search ranking.\n5. 5 targeted hashtags with balanced search volumes."
  },
  {
    id: "pv-79",
    title: "TikTok & Shorts 60-Second Storytelling Voiceover Script",
    category: "Social Media",
    tool: "ChatGPT",
    tags: ["tiktok", "shorts", "voiceover", "viral", "retention"],
    copyCount: 2280,
    isFavorite: false,
    createdAt: "2026-06-10",
    tips: "Ends with a seamless loop phrase that connects directly back to the first second.",
    prompt: "Write a 60-second viral storytelling voiceover script for TikTok / YouTube Shorts about [Story / Phenomenon, e.g. How a 19-year-old student accidentally built a $2M open-source tool from their dorm].\n\nScript Structure:\n[0-3s] Curiosity Hook: 'Nobody believed this kid when he uploaded a 40-line script to GitHub...'\n[3-25s] The Struggle & Escalation: Pacing with dramatic beats.\n[25-45s] The Breakthrough: Sudden viral surge and server crash.\n[45-60s] Inspiring Conclusion & Loop-back ending that connects seamlessly with the first second for infinite replay loops."
  },
  {
    id: "pv-80",
    title: "Viral Twitter / X Long-Form Breakdown Post (~400 Words)",
    category: "Social Media",
    tool: "ChatGPT",
    tags: ["twitter", "x-premium", "long-form", "growth", "breakdown"],
    copyCount: 2890,
    isFavorite: true,
    createdAt: "2026-06-11",
    tips: "High whitespace, data-driven frameworks, and contrarian perspectives built for retweets.",
    prompt: "Write a high-authority long-form post (X Premium format, ~400 words) breaking down [Topic, e.g. How the world's most profitable solo developers build $50k/mo businesses with AI agents].\n\nStyle Guide:\n- Contrarian headline.\n- Framework breakdown: Stack, Distribution, and Monetization.\n- Data-backed bullet points and specific tool recommendations.\n- Clean formatting with bold subheadings and generous spacing.\n- Engaging closing question."
  },
  {
    id: "pv-81",
    title: "High-Converting Product Launch Social Announcement",
    category: "Social Media",
    tool: "ChatGPT",
    tags: ["launch", "product-hunt", "marketing", "copywriting", "announcement"],
    copyCount: 1970,
    isFavorite: false,
    createdAt: "2026-06-12",
    tips: "Translates technical features into tangible user superpowers with early-adopter incentives.",
    prompt: "Draft a celebratory, high-converting product launch announcement for [Product Name, e.g. PromptBox Pro] across X (Twitter) and LinkedIn.\n\nStructure:\n1. The Problem we were sick of dealing with.\n2. What we built (in 1 punchy sentence).\n3. 4 Standout features with mini-bullet benefits.\n4. Special launch offer / Free tier announcement.\n5. Link in comments CTA with invitation for feedback."
  },
  {
    id: "pv-82",
    title: "Relatable Developer Meme Captions & Micro-Stories",
    category: "Social Media",
    tool: "ChatGPT",
    tags: ["humor", "memes", "developers", "relatable", "social-copy"],
    copyCount: 3450,
    isFavorite: true,
    createdAt: "2026-06-13",
    tips: "Humorous micro-narratives tailored to spark vibrant comment debates and shares.",
    prompt: "Write 5 witty, highly relatable meme captions and 1-sentence punchlines for [Situation, e.g. Fixing a production bug on Friday at 4:59 PM].\n\nInclude:\n- Caption 1: Self-deprecating humor.\n- Caption 2: Pop culture reference.\n- Caption 3: Internal monologue format.\n- Caption 4: Expectation vs Reality.\n- Caption 5: Short dramatic movie narrator voice.\nKeep them punchy, hilarious, and primed for comment sections."
  }
];

// App State
class PromptBoxApp {
  constructor() {
    this.prompts = [];
    this.favorites = new Set();
    this.currentCategory = "All";
    this.currentTool = "All";
    this.searchQuery = "";
    this.sortBy = "popular"; // "popular", "newest", "az"
    this.viewMode = "grid"; // "grid", "list"
    this.showOnlyFavorites = false;
    this.activeModalPrompt = null;
    this.variableValues = {};

    this.init();
  }

  init() {
    this.loadState();
    this.bindEvents();
    this.renderCategoryPills();
    this.renderPrompts();
    this.updateStats();
    this.initLucideIcons();
  }

  // Load state from localStorage or fallback with intelligent seed merge
  loadState() {
    try {
      const storedPrompts = localStorage.getItem("promptbox_prompts") || localStorage.getItem("promptverse_prompts");
      if (storedPrompts) {
        const parsed = JSON.parse(storedPrompts);
        // Smart merge: ensure all seeds from INITIAL_PROMPTS exist, while preserving user-submitted prompts
        const existingIds = new Set(parsed.map(p => p.id));
        const missingSeeds = INITIAL_PROMPTS.filter(p => !existingIds.has(p.id));
        this.prompts = [...parsed, ...missingSeeds];
        if (missingSeeds.length > 0) {
          this.savePrompts();
        }
      } else {
        this.prompts = [...INITIAL_PROMPTS];
        this.savePrompts();
      }

      const storedFavs = localStorage.getItem("promptbox_favorites") || localStorage.getItem("promptverse_favorites");
      if (storedFavs) {
        this.favorites = new Set(JSON.parse(storedFavs));
      } else {
        // Seed favorites from initial dataset
        this.prompts.forEach(p => {
          if (p.isFavorite) this.favorites.add(p.id);
        });
      }
    } catch (e) {
      console.error("Failed to load local storage:", e);
      this.prompts = [...INITIAL_PROMPTS];
    }
  }

  savePrompts() {
    try {
      localStorage.setItem("promptbox_prompts", JSON.stringify(this.prompts));
    } catch (e) {
      console.warn("Storage full or unavailable:", e);
    }
  }

  saveFavorites() {
    try {
      localStorage.setItem("promptbox_favorites", JSON.stringify(Array.from(this.favorites)));
    } catch (e) {
      console.warn("Could not save favorites:", e);
    }
  }

  updateStats() {
    const totalPromptsEl = document.getElementById("stat-total-prompts");
    const totalFavsEl = document.getElementById("stat-total-favs");
    const favFilterBtnBadge = document.getElementById("fav-filter-count");

    if (totalPromptsEl) totalPromptsEl.textContent = this.prompts.length;
    if (totalFavsEl) totalFavsEl.textContent = this.favorites.size;
    if (favFilterBtnBadge) favFilterBtnBadge.textContent = this.favorites.size;
  }

  initLucideIcons() {
    if (window.lucide && typeof window.lucide.createIcons === "function") {
      window.lucide.createIcons();
    }
  }

  // Event bindings
  bindEvents() {
    // Search input
    const searchInput = document.getElementById("search-input");
    const clearSearchBtn = document.getElementById("clear-search-btn");

    if (searchInput) {
      searchInput.addEventListener("input", (e) => {
        this.searchQuery = e.target.value.trim().toLowerCase();
        if (clearSearchBtn) {
          clearSearchBtn.classList.toggle("hidden", this.searchQuery.length === 0);
        }
        this.renderPrompts();
      });

      // Keyboard shortcut "/" or "Ctrl+K" / "Cmd+K"
      window.addEventListener("keydown", (e) => {
        if ((e.key === "/" || (e.ctrlKey && e.key === "k") || (e.metaKey && e.key === "k")) && document.activeElement !== searchInput) {
          e.preventDefault();
          searchInput.focus();
          searchInput.select();
        } else if (e.key === "Escape") {
          this.closeAllModals();
        }
      });
    }

    if (clearSearchBtn) {
      clearSearchBtn.addEventListener("click", () => {
        searchInput.value = "";
        this.searchQuery = "";
        clearSearchBtn.classList.add("hidden");
        this.renderPrompts();
        searchInput.focus();
      });
    }

    // Tool filter dropdown
    const toolSelect = document.getElementById("tool-select");
    if (toolSelect) {
      toolSelect.addEventListener("change", (e) => {
        this.currentTool = e.target.value;
        this.renderPrompts();
      });
    }

    // Sort select
    const sortSelect = document.getElementById("sort-select");
    if (sortSelect) {
      sortSelect.addEventListener("change", (e) => {
        this.sortBy = e.target.value;
        this.renderPrompts();
      });
    }

    // Favorites only toggle
    const favFilterBtn = document.getElementById("fav-filter-btn");
    if (favFilterBtn) {
      favFilterBtn.addEventListener("click", () => {
        this.showOnlyFavorites = !this.showOnlyFavorites;
        favFilterBtn.classList.toggle("bg-pink-500/20", this.showOnlyFavorites);
        favFilterBtn.classList.toggle("text-pink-400", this.showOnlyFavorites);
        favFilterBtn.classList.toggle("border-pink-500/40", this.showOnlyFavorites);
        this.renderPrompts();
      });
    }

    // Submit Prompt Modal Openers
    const openSubmitModalBtn = document.getElementById("btn-open-submit-modal");
    const heroSubmitBtn = document.getElementById("hero-submit-btn");
    if (openSubmitModalBtn) openSubmitModalBtn.addEventListener("click", () => this.openSubmitModal());
    if (heroSubmitBtn) heroSubmitBtn.addEventListener("click", () => this.openSubmitModal());

    // Prompt Generator Studio Opener
    const openGeneratorBtn = document.getElementById("btn-open-generator");
    if (openGeneratorBtn) openGeneratorBtn.addEventListener("click", () => this.openGeneratorModal());

    // Submit Prompt Form
    const submitForm = document.getElementById("submit-prompt-form");
    if (submitForm) {
      submitForm.addEventListener("submit", (e) => this.handleNewPromptSubmit(e));
    }

    // Modal Close buttons
    document.querySelectorAll("[data-close-modal]").forEach(btn => {
      btn.addEventListener("click", () => this.closeAllModals());
    });

    // Close on backdrop click
    document.querySelectorAll(".modal-backdrop").forEach(backdrop => {
      backdrop.addEventListener("click", (e) => {
        if (e.target === backdrop) this.closeAllModals();
      });
    });

    // Generator Form Listeners
    const generatorForm = document.getElementById("generator-form");
    if (generatorForm) {
      generatorForm.addEventListener("submit", (e) => this.handleGeneratePrompt(e));
    }
  }

  renderCategoryPills() {
    const categories = [
      "All",
      "Animation & Visuals",
      "YouTube & Video",
      "Web Dev & Coding",
      "Social Media",
      "Stories & Scripts"
    ];

    const container = document.getElementById("category-pills-container");
    if (!container) return;

    container.innerHTML = "";

    categories.forEach(cat => {
      const btn = document.createElement("button");
      btn.className = `category-pill px-4 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all whitespace-nowrap flex items-center gap-2 border ${
        this.currentCategory === cat
          ? "bg-violet-600/30 text-violet-200 border-violet-500/60 shadow-lg shadow-violet-500/20 font-semibold"
          : "bg-slate-900/60 text-slate-400 border-slate-800 hover:border-slate-700 hover:text-slate-200"
      }`;

      // Count for category
      const count = cat === "All"
        ? this.prompts.length
        : this.prompts.filter(p => p.category === cat).length;

      btn.innerHTML = `
        <span>${cat}</span>
        <span class="text-[10px] px-1.5 py-0.5 rounded-full ${this.currentCategory === cat ? 'bg-violet-500/40 text-violet-100' : 'bg-slate-800 text-slate-400'}">${count}</span>
      `;

      btn.addEventListener("click", () => {
        this.currentCategory = cat;
        this.renderCategoryPills();
        this.renderPrompts();
      });

      container.appendChild(btn);
    });
  }

  getFilteredPrompts() {
    return this.prompts.filter(item => {
      // Category filter
      if (this.currentCategory !== "All" && item.category !== this.currentCategory) {
        return false;
      }

      // Tool filter
      if (this.currentTool !== "All" && item.tool.toLowerCase() !== this.currentTool.toLowerCase()) {
        return false;
      }

      // Favorites filter
      if (this.showOnlyFavorites && !this.favorites.has(item.id)) {
        return false;
      }

      // Search query
      if (this.searchQuery) {
        const q = this.searchQuery;
        const matchesTitle = item.title.toLowerCase().includes(q);
        const matchesPrompt = item.prompt.toLowerCase().includes(q);
        const matchesTool = item.tool.toLowerCase().includes(q);
        const matchesCategory = item.category.toLowerCase().includes(q);
        const matchesTags = item.tags && item.tags.some(t => t.toLowerCase().includes(q));

        if (!matchesTitle && !matchesPrompt && !matchesTool && !matchesCategory && !matchesTags) {
          return false;
        }
      }

      return true;
    }).sort((a, b) => {
      if (this.sortBy === "popular") {
        return (b.copyCount || 0) - (a.copyCount || 0);
      } else if (this.sortBy === "newest") {
        return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
      } else if (this.sortBy === "az") {
        return a.title.localeCompare(b.title);
      }
      return 0;
    });
  }

  renderPrompts() {
    const grid = document.getElementById("prompts-grid");
    const countDisplay = document.getElementById("filtered-count-display");
    const emptyState = document.getElementById("empty-state");

    if (!grid) return;

    const filtered = this.getFilteredPrompts();

    if (countDisplay) {
      countDisplay.textContent = `Showing ${filtered.length} prompt${filtered.length === 1 ? '' : 's'}`;
    }

    if (filtered.length === 0) {
      grid.innerHTML = "";
      if (emptyState) emptyState.classList.remove("hidden");
      return;
    }

    if (emptyState) emptyState.classList.add("hidden");

    grid.innerHTML = "";

    filtered.forEach(promptItem => {
      const card = this.createPromptCard(promptItem);
      grid.appendChild(card);
    });

    this.initLucideIcons();
  }

  createPromptCard(promptItem) {
    const isFav = this.favorites.has(promptItem.id);
    const catClass = this.getCategoryClass(promptItem.category);
    const toolBadgeClass = this.getToolBadgeClass(promptItem.tool);

    // Extract unique bracketed variables like [Topic], [Character]
    const variableMatches = [...promptItem.prompt.matchAll(/\[([^\]]+)\]/g)];
    const uniqueVariables = [];
    const seenPlaceholders = new Set();
    variableMatches.forEach(m => {
      const full = m[0];
      if (!seenPlaceholders.has(full)) {
        seenPlaceholders.add(full);
        const inner = m[1];
        let label = inner;
        let hint = "";
        if (inner.includes(",")) {
          const parts = inner.split(",");
          label = parts[0].trim();
          hint = parts.slice(1).join(",").trim();
        }
        uniqueVariables.push({ full, label, hint });
      }
    });

    // Local variable replacement state for this card
    const cardVarValues = {};

    const computeCurrentPrompt = () => {
      let result = promptItem.prompt;
      for (const [placeholder, val] of Object.entries(cardVarValues)) {
        if (val && val.trim()) {
          result = result.split(placeholder).join(val.trim());
        }
      }
      return result;
    };

    // Format prompt text with variable tags highlighted
    const highlightedPromptHtml = this.highlightVariables(promptItem.prompt);

    const card = document.createElement("div");
    card.className = "prompt-card glass-panel glass-panel-hover rounded-2xl p-5 flex flex-col justify-between transition-all duration-300 relative group cursor-pointer border border-white/5 hover:border-violet-500/40";
    card.dataset.id = promptItem.id;

    // Render variables editor HTML if template has variables
    let variablesEditorHtml = "";
    if (uniqueVariables.length > 0) {
      variablesEditorHtml = `
        <div class="card-vars-container mb-3.5" onclick="event.stopPropagation()">
          <div class="flex items-center justify-between mb-2">
            <span class="text-[10px] font-bold uppercase tracking-wider text-violet-300 flex items-center gap-1">
              <i data-lucide="sliders" class="w-3 h-3 text-violet-400"></i>
              Edit Variables (${uniqueVariables.length})
            </span>
            <span class="text-[9px] text-slate-400 font-medium">Updates prompt live</span>
          </div>
          <div class="grid grid-cols-1 ${uniqueVariables.length > 1 ? 'sm:grid-cols-2' : ''} gap-2">
            ${uniqueVariables.map(v => `
              <div class="flex flex-col gap-0.5">
                <label class="text-[9px] font-semibold text-slate-300 truncate" title="${this.escapeHtml(v.label)}">
                  ${this.escapeHtml(v.label)}
                </label>
                <input 
                  type="text" 
                  class="card-var-input" 
                  data-placeholder="${this.escapeHtml(v.full)}"
                  placeholder="${this.escapeHtml(v.hint || v.label)}"
                />
              </div>
            `).join("")}
          </div>
        </div>
      `;
    }

    card.innerHTML = `
      <div>
        <!-- Card Top Bar: Badges & Favorite -->
        <div class="flex items-center justify-between gap-2 mb-3">
          <div class="flex items-center gap-2 flex-wrap">
            <span class="text-[11px] font-semibold px-2.5 py-1 rounded-full border ${catClass}">
              ${promptItem.category}
            </span>
            <span class="text-[11px] font-medium px-2 py-0.5 rounded-md ${toolBadgeClass}">
              ${promptItem.tool}
            </span>
          </div>
          <button 
            type="button"
            class="favorite-btn text-slate-400 hover:text-pink-400 p-1.5 rounded-lg hover:bg-pink-500/10 transition-colors"
            title="${isFav ? 'Remove from favorites' : 'Add to favorites'}"
            data-fav-id="${promptItem.id}"
          >
            <i data-lucide="heart" class="w-4 h-4 ${isFav ? 'fill-pink-500 text-pink-500' : ''}"></i>
          </button>
        </div>

        <!-- Prompt Title -->
        <h3 class="text-base font-bold text-white group-hover:text-violet-300 transition-colors line-clamp-2 mb-2.5 leading-snug">
          ${this.escapeHtml(promptItem.title)}
        </h3>

        <!-- Prompt Snippet Preview -->
        <div class="prompt-preview-box rounded-xl p-3 text-xs text-slate-300 font-mono leading-relaxed max-h-28 overflow-hidden mb-3 select-text">
          <div class="prompt-content-text">${highlightedPromptHtml}</div>
          <div class="prompt-fade-overlay"></div>
        </div>

        <!-- Dynamic Inline Variable Fields -->
        ${variablesEditorHtml}
      </div>

      <!-- Card Bottom Bar: Stats & Actions -->
      <div class="pt-3 border-t border-white/5 flex items-center justify-between mt-auto gap-2 flex-wrap">
        <div class="flex items-center gap-1.5 text-xs text-slate-400 shrink-0">
          <i data-lucide="copy" class="w-3.5 h-3.5 text-slate-500"></i>
          <span>${promptItem.copyCount || 0} copies</span>
        </div>

        <div class="flex items-center gap-1.5 flex-wrap justify-end">
          <!-- Try in ChatGPT Button -->
          <button 
            type="button" 
            class="try-chatgpt-btn btn-try-chatgpt px-2.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 active:scale-95 transition-all shadow-sm"
            title="Open prompt directly in ChatGPT with your customized variables"
          >
            <i data-lucide="sparkles" class="w-3.5 h-3.5 text-emerald-400"></i>
            <span>Try in ChatGPT</span>
          </button>

          <!-- Quick Copy Button -->
          <button 
            type="button" 
            class="copy-prompt-btn px-3 py-1.5 rounded-lg text-xs font-semibold bg-violet-600 hover:bg-violet-500 active:scale-95 text-white transition-all shadow-md shadow-violet-600/30 flex items-center gap-1.5"
            data-copy-id="${promptItem.id}"
            title="Copy prompt text directly"
          >
            <i data-lucide="clipboard" class="w-3.5 h-3.5"></i>
            <span>Copy</span>
          </button>
        </div>
      </div>
    `;

    // Click on card body opens detail modal (excluding specific interactive controls)
    card.addEventListener("click", (e) => {
      if (
        e.target.closest(".favorite-btn") ||
        e.target.closest(".copy-prompt-btn") ||
        e.target.closest(".try-chatgpt-btn") ||
        e.target.closest(".card-vars-container")
      ) {
        return;
      }
      this.openDetailModal(promptItem);
    });

    // Wire Card Variable Inputs
    card.querySelectorAll(".card-var-input").forEach(input => {
      input.addEventListener("input", (e) => {
        const placeholder = input.dataset.placeholder;
        cardVarValues[placeholder] = e.target.value;
        const updatedPrompt = computeCurrentPrompt();
        const previewEl = card.querySelector(".prompt-content-text");
        if (previewEl) {
          previewEl.innerHTML = this.highlightVariables(updatedPrompt);
        }
      });
      input.addEventListener("click", (e) => e.stopPropagation());
    });

    // Favorite button click
    const favBtn = card.querySelector(".favorite-btn");
    favBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      this.toggleFavorite(promptItem.id);
    });

    // Copy prompt button click (uses customized prompt)
    const copyBtn = card.querySelector(".copy-prompt-btn");
    copyBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      const textToCopy = computeCurrentPrompt();
      this.copyPromptText(textToCopy, copyBtn, promptItem.id);
    });

    // Direct Try in ChatGPT button click
    const tryGptBtn = card.querySelector(".try-chatgpt-btn");
    if (tryGptBtn) {
      tryGptBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        const textToUse = computeCurrentPrompt();
        // Copy to user clipboard automatically
        this.copyPromptText(textToUse, null, promptItem.id);
        // Direct link to ChatGPT with prompt query parameter
        const gptUrl = `https://chatgpt.com/?q=${encodeURIComponent(textToUse)}`;
        window.open(gptUrl, "_blank");
        this.showToast("Prompt copied & opening ChatGPT! 🚀", "success");
      });
    }

    return card;
  }

  getCategoryClass(category) {
    switch (category) {
      case "Animation & Visuals": return "cat-animation";
      case "YouTube & Video": return "cat-youtube";
      case "Web Dev & Coding": return "cat-webdev";
      case "Social Media": return "cat-social";
      case "Stories & Scripts": return "cat-stories";
      default: return "text-purple-400 bg-purple-500/10 border-purple-500/30";
    }
  }

  getToolBadgeClass(tool) {
    const t = tool.toLowerCase();
    if (t.includes("chatgpt")) return "badge-chatgpt";
    if (t.includes("midjourney")) return "badge-midjourney";
    if (t.includes("autodraft")) return "badge-autodraft";
    if (t.includes("claude")) return "badge-claude";
    if (t.includes("sora") || t.includes("runway")) return "badge-sora";
    if (t.includes("dall")) return "badge-dalle";
    return "bg-slate-800 text-slate-300 border border-slate-700";
  }

  highlightVariables(text) {
    const escaped = this.escapeHtml(text);
    return escaped.replace(/\[([^\]]+)\]/g, (match, inner) => {
      return `<span class="prompt-variable-tag">${match}</span>`;
    });
  }

  escapeHtml(str) {
    if (!str) return "";
    return str
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  toggleFavorite(promptId) {
    if (this.favorites.has(promptId)) {
      this.favorites.delete(promptId);
      this.showToast("Removed from favorites", "info");
    } else {
      this.favorites.add(promptId);
      this.showToast("Added to favorites ❤️", "success");
    }
    this.saveFavorites();
    this.updateStats();
    this.renderPrompts();
  }

  // Copy to clipboard with fallback and toast
  copyPromptText(text, btnElement = null, promptId = null) {
    if (!navigator.clipboard) {
      // Fallback
      const textarea = document.createElement("textarea");
      textarea.value = text;
      textarea.style.position = "fixed";
      textarea.style.left = "-9999px";
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
    } else {
      navigator.clipboard.writeText(text).catch(err => {
        console.error("Clipboard copy failed: ", err);
      });
    }

    // Increment copy count
    if (promptId) {
      const target = this.prompts.find(p => p.id === promptId);
      if (target) {
        target.copyCount = (target.copyCount || 0) + 1;
        this.savePrompts();
      }
    }

    // Button micro-interaction
    if (btnElement) {
      const originalHtml = btnElement.innerHTML;
      btnElement.innerHTML = `
        <i data-lucide="check" class="w-3.5 h-3.5 text-emerald-300"></i>
        <span class="text-emerald-200">Copied!</span>
      `;
      btnElement.classList.add("bg-emerald-600", "hover:bg-emerald-500");
      btnElement.classList.remove("bg-violet-600", "hover:bg-violet-500");
      this.initLucideIcons();

      setTimeout(() => {
        btnElement.innerHTML = originalHtml;
        btnElement.classList.remove("bg-emerald-600", "hover:bg-emerald-500");
        btnElement.classList.add("bg-violet-600", "hover:bg-violet-500");
        this.initLucideIcons();
      }, 1600);
    }

    this.showToast("Copied to Clipboard! 🚀", "success");
  }

  // Toast Notification System
  showToast(message, type = "success") {
    const container = document.getElementById("toast-container");
    if (!container) return;

    const toast = document.createElement("div");
    toast.className = "toast";

    let icon = "check-circle";
    let iconColor = "text-emerald-400";
    if (type === "info") {
      icon = "info";
      iconColor = "text-sky-400";
    } else if (type === "warning") {
      icon = "alert-triangle";
      iconColor = "text-amber-400";
    }

    toast.innerHTML = `
      <div class="p-2 rounded-lg bg-slate-800/80 ${iconColor} flex items-center justify-center shrink-0">
        <i data-lucide="${icon}" class="w-5 h-5"></i>
      </div>
      <div class="flex-1">
        <p class="text-xs font-semibold text-white">${message}</p>
        <span class="text-[10px] text-slate-400">Ready to paste in your AI tool</span>
      </div>
      <button class="text-slate-500 hover:text-slate-300 p-1" onclick="this.parentElement.remove()">
        <i data-lucide="x" class="w-3.5 h-3.5"></i>
      </button>
    `;

    container.appendChild(toast);
    this.initLucideIcons();

    // Trigger animation
    requestAnimationFrame(() => {
      toast.classList.add("show");
    });

    // Auto dismiss
    setTimeout(() => {
      toast.classList.remove("show");
      setTimeout(() => toast.remove(), 300);
    }, 2800);
  }

  // Detail & Customizer Modal
  openDetailModal(promptItem) {
    this.activeModalPrompt = promptItem;
    this.variableValues = {};

    const modal = document.getElementById("detail-modal");
    if (!modal) return;

    // Fill Title & Badges
    document.getElementById("modal-prompt-title").textContent = promptItem.title;
    
    const catBadge = document.getElementById("modal-category-badge");
    catBadge.textContent = promptItem.category;
    catBadge.className = `text-xs font-semibold px-3 py-1 rounded-full border ${this.getCategoryClass(promptItem.category)}`;

    const toolBadge = document.getElementById("modal-tool-badge");
    toolBadge.textContent = promptItem.tool;
    toolBadge.className = `text-xs font-medium px-2.5 py-1 rounded-md ${this.getToolBadgeClass(promptItem.tool)}`;

    // Set tips
    const tipsBox = document.getElementById("modal-prompt-tips");
    if (tipsBox) {
      tipsBox.textContent = promptItem.tips || "Paste directly into your AI tool for the highest quality generations.";
    }

    // Extract variables e.g. [Topic, e.g. ...]
    const variableMatches = [...promptItem.prompt.matchAll(/\[([^\]]+)\]/g)];
    const variablesContainer = document.getElementById("modal-variables-container");
    const variablesSection = document.getElementById("modal-variables-section");

    if (variableMatches.length > 0) {
      variablesSection.classList.remove("hidden");
      variablesContainer.innerHTML = "";

      variableMatches.forEach((match, idx) => {
        const fullPlaceholder = match[0];
        const innerText = match[1];

        // Format nice field label
        let label = innerText;
        let placeholderHint = "";
        if (innerText.includes(",")) {
          const parts = innerText.split(",");
          label = parts[0].trim();
          placeholderHint = parts.slice(1).join(",").trim();
        }

        const fieldDiv = document.createElement("div");
        fieldDiv.className = "flex flex-col gap-1.5";
        fieldDiv.innerHTML = `
          <label class="text-xs font-semibold text-violet-300 flex items-center justify-between">
            <span>${this.escapeHtml(label)}</span>
            ${placeholderHint ? `<span class="text-[10px] text-slate-400 font-normal italic">${this.escapeHtml(placeholderHint)}</span>` : ''}
          </label>
          <input 
            type="text" 
            class="variable-input w-full bg-slate-900/90 border border-slate-700 focus:border-violet-500 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 outline-none transition-colors"
            placeholder="${this.escapeHtml(placeholderHint || label)}"
            data-placeholder="${this.escapeHtml(fullPlaceholder)}"
          />
        `;

        const input = fieldDiv.querySelector("input");
        input.addEventListener("input", (e) => {
          this.variableValues[fullPlaceholder] = e.target.value;
          this.updateDetailModalPreview();
        });

        variablesContainer.appendChild(fieldDiv);
      });
    } else {
      variablesSection.classList.add("hidden");
    }

    // Update prompt preview display
    this.updateDetailModalPreview();

    // Wire Copy Customized Button
    const copyModalBtn = document.getElementById("modal-copy-btn");
    copyModalBtn.onclick = () => {
      const textToCopy = this.computeCustomizedPrompt();
      this.copyPromptText(textToCopy, copyModalBtn, promptItem.id);
    };

    // Wire External AI Tool Launch Buttons
    this.setupExternalToolLinks(promptItem.tool);

    modal.classList.remove("hidden");
    document.body.classList.add("overflow-hidden");
    this.initLucideIcons();
  }

  computeCustomizedPrompt() {
    if (!this.activeModalPrompt) return "";
    let customized = this.activeModalPrompt.prompt;
    for (const [placeholder, value] of Object.entries(this.variableValues)) {
      if (value && value.trim()) {
        customized = customized.split(placeholder).join(value.trim());
      }
    }
    return customized;
  }

  updateDetailModalPreview() {
    const previewEl = document.getElementById("modal-prompt-preview");
    if (!previewEl) return;

    const currentText = this.computeCustomizedPrompt();
    previewEl.innerHTML = this.highlightVariables(currentText);

    const lengthCount = document.getElementById("modal-char-count");
    if (lengthCount) {
      lengthCount.textContent = `${currentText.length} characters • ${currentText.split(/\s+/).filter(Boolean).length} words`;
    }
  }

  setupExternalToolLinks(toolName) {
    const launchBtn = document.getElementById("modal-launch-tool-btn");
    if (!launchBtn) return;

    const t = toolName.toLowerCase();
    let url = "https://chatgpt.com";
    let label = "Open in ChatGPT";

    if (t.includes("midjourney")) {
      url = "https://discord.com/app";
      label = "Open Midjourney";
    } else if (t.includes("claude")) {
      url = "https://claude.ai";
      label = "Open Claude";
    } else if (t.includes("autodraft")) {
      url = "https://autodraft.in";
      label = "Open AutoDraft";
    } else if (t.includes("runway") || t.includes("sora")) {
      url = "https://runwayml.com";
      label = "Open Runway";
    }

    launchBtn.href = url;
    launchBtn.innerHTML = `
      <span>${label}</span>
      <i data-lucide="external-link" class="w-3.5 h-3.5"></i>
    `;
  }

  // Submit Prompt Modal Handling
  openSubmitModal() {
    const modal = document.getElementById("submit-modal");
    if (!modal) return;
    modal.classList.remove("hidden");
    document.body.classList.add("overflow-hidden");

    // Reset form
    const form = document.getElementById("submit-prompt-form");
    if (form) form.reset();

    const titleInput = document.getElementById("new-prompt-title");
    if (titleInput) titleInput.focus();

    this.initLucideIcons();
  }

  handleNewPromptSubmit(e) {
    e.preventDefault();

    const title = document.getElementById("new-prompt-title").value.trim();
    const category = document.getElementById("new-prompt-category").value;
    const tool = document.getElementById("new-prompt-tool").value.trim();
    const promptText = document.getElementById("new-prompt-text").value.trim();
    const tips = document.getElementById("new-prompt-tips").value.trim();
    const tagsRaw = document.getElementById("new-prompt-tags").value.trim();

    if (!title || !promptText) {
      this.showToast("Please provide both Title and Prompt text", "warning");
      return;
    }

    const tags = tagsRaw
      ? tagsRaw.split(",").map(t => t.trim().toLowerCase()).filter(Boolean)
      : [category.toLowerCase()];

    const newPrompt = {
      id: "pv-" + Date.now(),
      title: title,
      category: category,
      tool: tool || "ChatGPT",
      tags: tags,
      copyCount: 0,
      isFavorite: false,
      createdAt: new Date().toISOString().split("T")[0],
      tips: tips || "Tested and verified prompt for optimal generations.",
      prompt: promptText
    };

    // Prepend to list
    this.prompts.unshift(newPrompt);
    this.savePrompts();
    this.closeAllModals();

    // Re-render
    this.renderCategoryPills();
    this.renderPrompts();
    this.updateStats();

    this.showToast("Prompt published successfully! 🎉", "success");
  }

  // Prompt Generator Studio Logic
  openGeneratorModal() {
    const modal = document.getElementById("generator-modal");
    if (!modal) return;
    modal.classList.remove("hidden");
    document.body.classList.add("overflow-hidden");

    const resultBox = document.getElementById("gen-result-container");
    if (resultBox) resultBox.classList.add("hidden");

    this.initLucideIcons();
  }

  handleGeneratePrompt(e) {
    e.preventDefault();

    const type = document.getElementById("gen-type").value;
    const tool = document.getElementById("gen-tool").value;
    const topic = document.getElementById("gen-topic").value.trim() || "modern sustainable architectural design";
    const tone = document.getElementById("gen-tone").value;
    const complexity = document.getElementById("gen-complexity").value;

    let generatedPrompt = "";
    let title = "";
    let category = "Web Dev & Coding";

    if (type === "visual") {
      category = "Animation & Visuals";
      title = `Cinematic 3D Visual: ${topic}`;
      generatedPrompt = `A visually stunning masterwork depiction of [${topic}], rendered in ${tone} aesthetic, dramatic volumetric lighting with ambient occlusion, 8k resolution, octane render, photorealistic textures, intricate details, cinematic framing, ray-traced reflections --ar 16:9 --style raw --v 6.0`;
    } else if (type === "coding") {
      category = "Web Dev & Coding";
      title = `Full-Stack Architecture: ${topic}`;
      generatedPrompt = `Act as a Staff Software Engineer. Write a production-grade, highly scalable implementation of [${topic}] using modern industry best practices.\n\nKey Requirements:\n1. Architecture: Clean Architecture / Modular pattern with strict type definitions.\n2. Security & Validation: Defensive sanitization and robust error boundaries.\n3. Performance: Optimized for low latency and high concurrency.\n4. Documentation: Provide clear usage examples, environment variables, and testing strategies.\nTone: ${tone}. Level of detail: ${complexity}.`;
    } else if (type === "video") {
      category = "YouTube & Video";
      title = `Viral Video Concept & Script: ${topic}`;
      generatedPrompt = `Act as an expert YouTube director with 1M+ subscribers. Create a high-converting video outline and hook script for [${topic}].\n\nStructure:\n1. First 15-second retention hook with visual cues & audio sound effects.\n2. 3 core narrative beats with escalating tension.\n3. Visual B-Roll recommendations for editor.\n4. Compelling call to action.\nTone: ${tone}.`;
    } else if (type === "story") {
      category = "Stories & Scripts";
      title = `Compelling Narrative Screenplay: ${topic}`;
      generatedPrompt = `You are a master storyteller and scriptwriter. Write an evocative, cinematic narrative scene exploring [${topic}].\n\nInclude:\n- Deep emotional stakes and subtle character body language.\n- Realistic, gripping dialogue without exposition dumps.\n- Evocative sensory descriptions (sound, light, atmosphere).\nTone: ${tone}.`;
    } else {
      category = "Social Media";
      title = `High-Growth Social Campaign: ${topic}`;
      generatedPrompt = `Act as a top-tier growth strategist. Craft an irresistible, viral social media post about [${topic}].\n\nFormat:\n- Scroll-stopping hook on line 1.\n- 5 punchy bullet insights delivering immense value.\n- Conversational ${tone} tone with high whitespace.\n- Engagement CTA designed to generate 50+ comments.`;
    }

    // Display result in generator modal
    const resultBox = document.getElementById("gen-result-container");
    const resultText = document.getElementById("gen-result-text");
    const copyGenBtn = document.getElementById("gen-copy-btn");
    const saveToHubBtn = document.getElementById("gen-save-hub-btn");

    if (resultText) resultText.textContent = generatedPrompt;
    if (resultBox) {
      resultBox.classList.remove("hidden");
      resultBox.scrollIntoView({ behavior: "smooth" });
    }

    if (copyGenBtn) {
      copyGenBtn.onclick = () => {
        this.copyPromptText(generatedPrompt, copyGenBtn);
      };
    }

    if (saveToHubBtn) {
      saveToHubBtn.onclick = () => {
        const newPrompt = {
          id: "pv-" + Date.now(),
          title: title,
          category: category,
          tool: tool,
          tags: ["generated", type, "custom"],
          copyCount: 1,
          isFavorite: true,
          createdAt: new Date().toISOString().split("T")[0],
          tips: `Generated via PromptBox Studio. Tailored for ${tool}.`,
          prompt: generatedPrompt
        };

        this.prompts.unshift(newPrompt);
        this.favorites.add(newPrompt.id);
        this.savePrompts();
        this.saveFavorites();

        this.closeAllModals();
        this.renderCategoryPills();
        this.renderPrompts();
        this.updateStats();

        this.showToast("Generated prompt saved to your collection! 🌟", "success");
      };
    }

    this.initLucideIcons();
  }

  closeAllModals() {
    document.querySelectorAll(".modal-container").forEach(m => m.classList.add("hidden"));
    document.body.classList.remove("overflow-hidden");
  }
}

// ─── Auth Manager ─────────────────────────────────────────────────────────────
class AuthManager {
  constructor(app) {
    this.app = app;
    this.currentUser = null;
    this.isAdmin = false;
    this.authMode = 'signin'; // 'signin' | 'signup'

    this._bindElements();
    this._listenAuthState();
    this._bindEvents();
  }

  _bindElements() {
    this.el = {
      authModal:         document.getElementById('auth-modal'),
      btnOpenAuth:       document.getElementById('btn-open-auth-modal'),
      btnLogout:         document.getElementById('btn-auth-logout'),
      userProfile:       document.getElementById('auth-user-profile'),
      signInBtn:         document.getElementById('btn-open-auth-modal'),
      modalTitle:        document.getElementById('auth-modal-title'),
      emailInput:        document.getElementById('auth-email-input'),
      passwordInput:     document.getElementById('auth-password-input'),
      nameInput:         document.getElementById('auth-name-input'),
      nameField:         document.getElementById('auth-name-field'),
      form:              document.getElementById('auth-email-form'),
      submitBtn:         document.getElementById('auth-submit-btn'),
      submitLabel:       document.getElementById('auth-submit-label'),
      errorMsg:          document.getElementById('auth-error-msg'),
      errorText:         document.getElementById('auth-error-text'),
      modeToggle:        document.getElementById('auth-mode-toggle'),
      toggleText:        document.getElementById('auth-toggle-text'),
      googleBtn:         document.getElementById('btn-google-auth'),
      togglePassword:    document.getElementById('auth-toggle-password'),
      userName:          document.getElementById('auth-user-name'),
      userAvatar:        document.getElementById('auth-user-avatar'),
      userRoleBadge:     document.getElementById('auth-user-role-badge'),
      navTabAdmin:       document.getElementById('nav-tab-admin'),
    };
  }

  _listenAuthState() {
    if (!supabaseClient) {
      console.warn('[Auth] Supabase not available — running in offline mode.');
      return;
    }
    supabaseClient.auth.getSession().then(({ data }) => {
      if (data?.session?.user) this._onLogin(data.session.user);
    });
    supabaseClient.auth.onAuthStateChange((event, session) => {
      if (session?.user) {
        this._onLogin(session.user);
      } else {
        this._onLogout();
      }
    });
  }

  _onLogin(user) {
    this.currentUser = user;
    this.isAdmin = user.email === ADMIN_EMAIL;

    const name = user.user_metadata?.full_name || user.email?.split('@')[0] || 'User';
    const initial = name.charAt(0).toUpperCase();

    if (this.el.userName) this.el.userName.textContent = name;
    if (this.el.userAvatar) this.el.userAvatar.textContent = initial;

    if (this.el.userRoleBadge) {
      if (this.isAdmin) {
        this.el.userRoleBadge.textContent = 'Admin';
        this.el.userRoleBadge.className = 'text-[9px] px-1 py-0.2 rounded font-medium auth-admin-badge';
      } else {
        this.el.userRoleBadge.textContent = 'Member';
        this.el.userRoleBadge.className = 'text-[9px] px-1 py-0.2 rounded font-medium auth-user-badge';
      }
    }

    // Show profile, hide sign-in button
    if (this.el.signInBtn) this.el.signInBtn.classList.add('hidden');
    if (this.el.userProfile) this.el.userProfile.classList.remove('hidden');

    // Show admin tab only for admins
    if (this.el.navTabAdmin) {
      this.el.navTabAdmin.classList.toggle('hidden', !this.isAdmin);
    }

    this._closeModal();
    this.app.showToast(`Welcome back, ${name}! 👋`, 'success');
  }

  _onLogout() {
    this.currentUser = null;
    this.isAdmin = false;
    if (this.el.signInBtn) this.el.signInBtn.classList.remove('hidden');
    if (this.el.userProfile) this.el.userProfile.classList.add('hidden');
    if (this.el.navTabAdmin) this.el.navTabAdmin.classList.add('hidden');
    // If currently on admin view, switch back to hub
    this.app.switchView('hub');
  }

  _bindEvents() {
    // Open modal
    if (this.el.btnOpenAuth) {
      this.el.btnOpenAuth.addEventListener('click', () => this._openModal());
    }

    // Logout
    if (this.el.btnLogout) {
      this.el.btnLogout.addEventListener('click', async () => {
        if (supabaseClient) await supabaseClient.auth.signOut();
        this._onLogout();
        this.app.showToast('Signed out successfully.', 'info');
      });
    }

    // Google OAuth
    if (this.el.googleBtn) {
      this.el.googleBtn.addEventListener('click', async () => {
        if (!supabaseClient) {
          this.app.showToast('Supabase not connected. Check credentials.', 'error');
          return;
        }
        this._setLoading(true, 'Connecting...');
        const { error } = await supabaseClient.auth.signInWithOAuth({
          provider: 'google',
          options: { redirectTo: window.location.origin }
        });
        if (error) {
          this._showError(error.message);
          this._setLoading(false);
        }
      });
    }

    // Email form submit
    if (this.el.form) {
      this.el.form.addEventListener('submit', async (e) => {
        e.preventDefault();
        await this._handleEmailAuth();
      });
    }

    // Mode toggle (Sign In ↔ Sign Up)
    if (this.el.modeToggle) {
      this.el.modeToggle.addEventListener('click', () => this._toggleMode());
    }

    // Password visibility toggle
    if (this.el.togglePassword) {
      this.el.togglePassword.addEventListener('click', () => {
        const inp = this.el.passwordInput;
        if (!inp) return;
        const isPassword = inp.type === 'password';
        inp.type = isPassword ? 'text' : 'password';
        const icon = this.el.togglePassword.querySelector('i');
        if (icon) {
          icon.setAttribute('data-lucide', isPassword ? 'eye-off' : 'eye');
          window.lucide?.createIcons();
        }
      });
    }

    // Close on backdrop
    if (this.el.authModal) {
      const backdrop = this.el.authModal.querySelector('.modal-backdrop');
      if (backdrop) backdrop.addEventListener('click', () => this._closeModal());
    }
  }

  async _handleEmailAuth() {
    if (!supabaseClient) {
      this._showError('Supabase not connected. Please check your API credentials.');
      return;
    }
    const email = this.el.emailInput?.value.trim();
    const password = this.el.passwordInput?.value;
    if (!email || !password) { this._showError('Please enter email and password.'); return; }

    this._setLoading(true);
    this._hideError();

    try {
      let result;
      if (this.authMode === 'signup') {
        const fullName = this.el.nameInput?.value.trim() || '';
        result = await supabaseClient.auth.signUp({
          email, password,
          options: { data: { full_name: fullName } }
        });
        if (!result.error && result.data?.user && !result.data.session) {
          // Email confirmation needed
          this._setLoading(false);
          this._showError('Check your email to confirm your account!', 'info');
          return;
        }
      } else {
        result = await supabaseClient.auth.signInWithPassword({ email, password });
      }
      if (result.error) throw result.error;
    } catch (err) {
      this._showError(err.message || 'Authentication failed.');
    } finally {
      this._setLoading(false);
    }
  }

  _toggleMode() {
    this.authMode = this.authMode === 'signin' ? 'signup' : 'signin';
    const isSignUp = this.authMode === 'signup';
    if (this.el.modalTitle) this.el.modalTitle.textContent = isSignUp ? 'Create PromptBox Account' : 'Sign In to PromptBox';
    if (this.el.submitLabel) this.el.submitLabel.textContent = isSignUp ? 'Create Account' : 'Sign In';
    if (this.el.modeToggle) this.el.modeToggle.textContent = isSignUp ? 'Sign In' : 'Sign Up';
    if (this.el.toggleText) this.el.toggleText.textContent = isSignUp ? 'Already have an account?' : "Don't have an account?";
    if (this.el.nameField) this.el.nameField.classList.toggle('hidden', !isSignUp);
    this._hideError();
  }

  _openModal() {
    if (this.el.authModal) this.el.authModal.classList.remove('hidden');
    document.body.classList.add('overflow-hidden');
    setTimeout(() => this.el.emailInput?.focus(), 100);
    this.app.initLucideIcons();
  }

  _closeModal() {
    if (this.el.authModal) this.el.authModal.classList.add('hidden');
    document.body.classList.remove('overflow-hidden');
  }

  _setLoading(loading, label = null) {
    if (this.el.submitBtn) this.el.submitBtn.disabled = loading;
    if (this.el.googleBtn) this.el.googleBtn.disabled = loading;
    if (this.el.submitLabel && label) this.el.submitLabel.textContent = label;
    else if (this.el.submitLabel && !loading) {
      this.el.submitLabel.textContent = this.authMode === 'signup' ? 'Create Account' : 'Sign In';
    }
  }

  _showError(msg, type = 'error') {
    if (this.el.errorMsg) {
      this.el.errorMsg.classList.remove('hidden');
      if (type === 'info') {
        this.el.errorMsg.className = 'text-xs text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 rounded-lg px-3 py-2 flex items-center gap-2';
      }
    }
    if (this.el.errorText) this.el.errorText.textContent = msg;
  }

  _hideError() {
    if (this.el.errorMsg) {
      this.el.errorMsg.classList.add('hidden');
      this.el.errorMsg.className = 'hidden text-xs text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2 flex items-center gap-2';
    }
  }
}

// ─── Global bootstrap on DOM ready ────────────────────────────────────────────
document.addEventListener("DOMContentLoaded", () => {
  const app = new PromptBoxApp();
  window.promptBox = app;
  window.promptVerse = app; // backwards compatibility alias

  // Initialize Auth Manager
  window.authManager = new AuthManager(app);

  // ── Nav Tab Switching (Explore ↔ Admin) ─────────────────────────────────────
  const navTabHub   = document.getElementById('nav-tab-hub');
  const navTabAdmin = document.getElementById('nav-tab-admin');

  // Hide admin tab until logged in as admin (auth state listener will re-show)
  if (navTabAdmin) navTabAdmin.classList.add('hidden');

  if (navTabHub)   navTabHub.addEventListener('click',   () => app.switchView('hub'));
  if (navTabAdmin) navTabAdmin.addEventListener('click',  () => {
    if (window.authManager?.isAdmin) {
      app.switchView('admin');
    } else {
      app.showToast('Admin access required. Please sign in.', 'error');
      window.authManager?._openModal();
    }
  });

  // "Back to Hub" button inside admin panel
  const backBtn = document.getElementById('btn-admin-back-hub');
  if (backBtn) backBtn.addEventListener('click', () => app.switchView('hub'));

  // Admin "Add Prompt" button → reuses submit modal
  const adminAddBtn = document.getElementById('btn-admin-add-prompt');
  if (adminAddBtn) adminAddBtn.addEventListener('click', () => app.openSubmitModal());

  // Admin table filters
  const adminSearch   = document.getElementById('admin-table-search');
  const adminCatFlt   = document.getElementById('admin-category-filter');
  const adminOrigFlt  = document.getElementById('admin-origin-filter');

  [adminSearch, adminCatFlt, adminOrigFlt].forEach(el => {
    if (el) el.addEventListener('input', () => app.renderAdminTable());
  });

  // Close auth modal via data-close-modal inside auth-modal
  document.querySelectorAll('#auth-modal [data-close-modal]').forEach(btn => {
    btn.addEventListener('click', () => window.authManager?._closeModal());
  });
});

