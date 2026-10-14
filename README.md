# PromptBox 📦
> **An AI Prompt Generator & Copy-Paste Hub**

PromptBox is a modern, high-contrast dark theme single-page web application engineered for creators, developers, writers, and marketers to discover, customize, and copy production-tested prompts for leading AI models (ChatGPT, Midjourney, AutoDraft, Claude, Runway/Sora, and DALL-E 3).

---

## ✨ Key Features & Enhancements

### 1. Modern High-Contrast Dark UI & Micro-Interactions
- **Futuristic Dark Palette**: Deep slate/obsidian backdrop with ambient radial glows and glassmorphism cards.
- **Micro-Interactions**: Hover lifts, glowing borders, active scale effects, dynamic button state flips, and responsive layout.
- **Glassmorphic Toast Notifications**: Smooth floating alerts confirming clipboard copy operations.

### 2. 82+ Curated Real-World Prompts Across 6 Broad Verticals
- 🎥 **YouTube & Video**: High-CTR thumbnails (gaming 1v1, unboxing, finance, food reviews), 10-minute scripts with B-roll cues.
- 🎨 **Animation & Visuals**: 2D Indian village animation scenes (Studio Ghibli/Makoto Shinkai style), Midjourney character art (Solapunk, Eldritch Void Knights, Haute Couture, Steampunk airships).
- 📖 **Stories & Scripts**: Hindi moral stories (Panchatantra, Akbar-Birbal court wit, village panchayat fables), psychological thrillers, and mythological sci-fi series outlines.
- 💻 **Web Dev & Coding**: React 19 Server Actions, FastAPI streaming AI agents, Docker multi-stage pipelines, PostgreSQL RLS multi-tenancy, and autonomous agent loops.
- 📱 **Social Media**: High-converting LinkedIn thought leadership narratives, Instagram carousels & captions, TikTok 60-second voiceover scripts, and developer meme captions.

### 3. Dynamic Inline Variable Replacement on Cards
- Each card now features an interactive **"Edit Variables"** inline panel for templates with bracketed placeholders (`[Topic]`, `[Style]`, `[Character]`).
- As you type into any variable field, the prompt preview snippet on the card updates **in real-time**.
- Clicking "Copy" or "Try in ChatGPT" automatically uses your customized prompt with replaced values!

### 4. Direct "Try in ChatGPT" Button
- Positioned directly next to the "Copy" button on every card.
- In a single click, it copies your customized prompt to the clipboard and launches ChatGPT (`https://chatgpt.com/?q=...`) with your prompt pre-filled in the prompt bar!

### 5. SEO-Optimized FAQ Section
- Comprehensive, accessible accordion FAQ section with Schema.org `FAQPage` microdata for Google search rich snippets.
- Answers key user questions regarding variable placeholders, supported AI models, commercial usage rights, and custom submissions.

### 6. Built-in AI Studio & Local Persistence
- **Prompt Generator Studio**: Craft bespoke prompts by choosing objective, model, tone, and complexity.
- **Submit Prompt Modal**: Contribute new custom templates saved directly to browser `localStorage`.
- **Keyboard Shortcuts**: Press `/` or `Ctrl+K` from anywhere to jump to the search bar.

---

## 🚀 How to Run

### Method 1: Local Server (Included)
Run the lightweight built-in Node server:
```bash
node server.js
```
Then open [http://localhost:3000](http://localhost:3000) in your web browser.

### Method 2: Direct File Open
You can also open [index.html](file:///C:/Users/user/.gemini\antigravity\scratch\promptverse\index.html) directly in any modern browser (Chrome, Edge, Firefox, Brave).

---

## 📁 File Structure
```
promptverse/
├── index.html       # Single-page application structure, modals & SEO FAQ
├── styles.css       # Custom design system, ambient glow & micro-animations
├── app.js           # 82 seed prompts, card inline variable editor & ChatGPT launcher
├── server.js        # Lightweight zero-dependency HTTP server
└── README.md        # Comprehensive documentation
```
