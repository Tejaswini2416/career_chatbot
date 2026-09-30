# 🚀 Apex — AI Career Coach & Strategic Advisor

> An executive-grade, AI-powered career accelerator built with **Next.js 14**, **TypeScript**, and **Tailwind CSS**.

---

## 🌟 Overview

**Apex** is an intelligent, hyper-contextual career coaching platform engineered to guide professionals through career inflection points — securing promotions, acing high-stakes technical & executive interviews, drafting ATS-tailored career collateral, and engineering top-of-market compensation packages.

Apex features a **dual AI engine**:
- **Plug-and-Play Mode**: Fully operational offline with zero configuration or API keys — ideal for instant evaluation
- **BYOK (Bring Your Own Key)**: Direct streaming integration with OpenAI (`gpt-4o`, `gpt-4o-mini`) via the Vercel AI SDK

---

## ✨ Key Features

### 🎯 Career Strategy & Executive Growth
- Personalized 16-question diagnostic assessment (student/fresher vs experienced tracks)
- Role-specific roadmaps for 50+ tech roles (ML Engineer, Data Scientist, PM, SWE, DevOps, Security, etc.)
- AI-generated 30-60-90 day execution plans tailored to your target company and role

### 🎤 Mock Interview Studio
- Live topic selection across Behavioral/STAR, System Design, ML Design, Causal Inference, and more
- Real-time STAR framework scoring (Situation, Task, Action, Result — 0–10)
- Live camera & microphone with eye-contact telemetry, WPM counter, and filler-word detection
- AI voice reads questions aloud; speech recognition captures candidate answers
- 3-round sequential interview with comprehensive performance report

### 📄 Document Studio & ATS Optimization
- Resume generation via guided Q&A questionnaire (student & experienced tracks)
- ATS keyword match scoring against live job postings (95%+ ATS match)
- Cover letter and LinkedIn outreach pitch generation
- PDF export with 1-page compression and quantified achievement insertion

### 📊 Market Intelligence & Job RAG
- Role-aware job recommendations (ML Engineer, Data Scientist, PM, Frontend, DevOps, Security, Data Engineer, SWE)
- Real-time "Actively Hiring" indicators with direct apply links to company career pages
- Skill delta radar: match your skills against job requirements
- Tech stack volatility scoring and market demand index

### 💰 Compensation & Tax Engineering Lab
- 4-year equity vesting schedule modeler (Standard / Backloaded Amazon / Frontloaded)
- Multi-currency tax arbitrage calculator (San Francisco / London / Bengaluru)
- Net purchasing power normalization across geographies
- Dynamic negotiation branching trees with AI-generated counter-offer scripts

### 🗺️ Skill Gap & Career Roadmap
- Benchmark current skills against tier-1 company requirements
- Automated skill gap identification with learning resource recommendations
- 30-60-90 day milestone planning

### 📋 Application Pipeline (Kanban)
- Track job applications across stages (Saved → Applied → Phone Screen → Technical → Offer)
- Auto-generate post-interview debriefs and thank-you notes

### 🏢 On-the-Job Companion
- First-90-days onboarding blueprint
- Continuous brag sheet logging for performance reviews
- Burnout radar and work-life balance monitoring

---

## 🏗️ Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS v3 |
| AI Streaming | Vercel AI SDK + OpenAI |
| Icons | Lucide React |
| PDF Export | jsPDF + html2canvas |
| State | React Hooks (useState, useReducer) |
| Storage | localStorage (client-side persistence) |
| Speech | Web Speech API (SpeechRecognition + SpeechSynthesis) |
| Camera | MediaDevices API (getUserMedia) |

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/Tejaswini2416/career_chatbot.git
cd career_chatbot

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Optional: Add OpenAI API Key

For AI-powered responses (instead of the built-in plug-and-play mode):

1. Click the **Settings** (⚙️) icon in the top-right header
2. Enter your OpenAI API key
3. Select model: `gpt-4o` or `gpt-4o-mini`
4. All chat responses will now stream directly from OpenAI

> Without an API key, Apex runs in **local simulation mode** with pre-built intelligent responses for all features.

---

## 📁 Project Structure

```
src/
├── app/
│   ├── api/chat/          # OpenAI streaming API route
│   ├── globals.css        # Theme variables (B&W Dark, B&W Light, ChatGPT)
│   ├── layout.tsx         # Root HTML layout
│   └── page.tsx           # Main app shell & mode router
├── components/
│   ├── audio/             # Live Audio & Vision interview
│   ├── auth/              # Multi-user auth modal
│   ├── chat/              # ChatInterface, ChatMessage, ChatInput, QuickStarters
│   ├── companion/         # On-the-Job Companion
│   ├── interview/         # MockInterviewStudio, MockInterviewPanel, ScoreCard
│   ├── kanban/            # ApplicationKanban
│   ├── market/            # MarketIntelligence (job recommendations & RAG)
│   ├── negotiation/       # OfferCalculator (compensation lab)
│   ├── platform/          # DeviceFrame (desktop/tablet/mobile preview)
│   ├── profile/           # CareerAssessmentModal (16-question diagnostic)
│   ├── roadmap/           # SkillGapRoadmap
│   ├── sandbox/           # TechnicalSandbox
│   ├── settings/          # SettingsModal
│   ├── studio/            # DocumentStudio + ResumeQuestionsModal
│   └── ui/                # Button, Badge, shared UI components
└── lib/
    ├── ai-stream.ts       # AI response generation (local + OpenAI streaming)
    ├── auth.ts            # Multi-user session management
    ├── constants.ts       # Default user profiles & career data
    ├── episodic-memory.ts # Chat memory persistence
    ├── pii-vault.ts       # PII redaction utilities
    ├── resources.ts       # Role-specific learning resources
    ├── storage.ts         # localStorage persistence layer
    ├── types.ts           # TypeScript interfaces & types
    └── utils.ts           # Markdown parsing, document extraction
```

---

## 🎨 Themes

Apex ships with **3 built-in themes** togglable from the header:

| Theme | Description |
|---|---|
| **B&W Light** | Clean white background (default) |
| **B&W Dark** | Monochrome dark mode |
| **ChatGPT** | OpenAI-inspired green accent |

---

## 🔑 Modes / Pillars

| Mode | Description |
|---|---|
| `strategy` | Career strategy chatbot |
| `interview` | Mock Interview Studio with live video/audio |
| `studio` | Document Studio (resume + cover letter) |
| `roadmap` | Skill Gap & 30-60-90 Day Roadmap |
| `negotiation` | Compensation & Tax Engineering Lab |
| `market_intel` | Market Intelligence & Job Recommendations |
| `kanban` | Application Pipeline Tracker |
| `on_the_job` | On-the-Job Companion |
| `audio_interview` | Live Multimodal Audio & Vision |
| `sandbox` | Technical Architecture Sandbox |

---

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/my-feature`
3. Commit your changes: `git commit -m 'Add my feature'`
4. Push to the branch: `git push origin feature/my-feature`
5. Open a Pull Request

---

## 📄 License

MIT License — free to use and modify.

---

## 👩‍💻 Author

**Tejaswini** — [@Tejaswini2416](https://github.com/Tejaswini2416)

---

*Built with ❤️ using Next.js 14, TypeScript, Tailwind CSS, and the OpenAI API*
