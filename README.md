# GetCareerPilot – AI-Powered Career Discovery & Development Platform 🚀

> **Discover. Explore. Plan. Achieve.**  
> *One platform for every student, regardless of academic background or career interest.*

[![Live Demo](https://img.shields.io/badge/Live%20Demo-getcareerpilot.vercel.app-4F46E5?style=for-the-badge&logo=vercel&logoColor=white)](https://getcareerpilot.vercel.app/)
[![GitHub Repo](https://img.shields.io/badge/GitHub-Repository-172554?style=for-the-badge&logo=github&logoColor=white)](https://github.com/Siddharth4629/GetCareerPilot)
[![Google Gemini API](https://img.shields.io/badge/Gemini%202.5%20Flash-8E75C2?style=for-the-badge&logo=google-gemini&logoColor=white)](https://ai.google.dev/)
[![Supabase Database](https://img.shields.io/badge/Supabase-Database%20Ready-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)](https://supabase.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)

---

## 🌟 Overview

**GetCareerPilot** is an intelligent, full-spectrum career guidance and skill development platform designed for students from Class 9 onwards through university and professional graduation.

Rather than focusing solely on computer science or engineering, GetCareerPilot guides students across **12 comprehensive sectors**—including Technology, Healthcare & Medicine, Business & Management, Finance & Banking, Law & Legal Services, Creative Design & Media, Government & Civil Services, Education, Defense, and Vocational Sciences.

The platform adapts dynamically to three primary educational milestones:
- 🎒 **School Students (Class 9 & 10)**: Discover passions, understand stream requirements (Science PCM/PCB, Commerce, Humanities, Vocational), and select the right academic track.
- 🏛️ **Higher Secondary Students (Class 11 & 12)**: Explore 25+ undergraduate degrees, track national entrance examinations (JEE, NEET, CUET, CLAT, NDA, NATA), and discover verified merit scholarships.
- 💼 **College Students & Graduates**: Identify missing industry skills, optimize resumes with ATS scoring, prepare with AI mock interviews, practice daily study habits, and build personalized learning roadmaps.

---

## 📸 Key Platform Highlights

```
                                GETCAREERPILOT ARCHITECTURE
   
    [ Public Landing Page ]  ──►  [ 5-Step Adaptive Onboarding ]  ──►  [ Auth & Cloud Sync ]
           (9 Sections)                  (RIASEC Quiz & Stage)           (Supabase + Offline)
                                                   │
                                                   ▼
                ┌─────────────────────────────────────────────────────────────┐
                │             PERSONALIZED MULTI-STAGE DASHBOARDS             │
                ├──────────────────────────────┬──────────────────────────────┤
                │  Class 9-10 (School)         │ Stream Guide & RIASEC Traits │
                │  Class 11-12 (Higher Sec)    │ Degree & Entrance Explorer   │
                │  College & Graduates         │ Resume Audit & Mock Cockpit  │
                └──────────────────────────────┴──────────────────────────────┘
                                                   │
        ┌───────────────────────┬──────────────────┴────┬───────────────────────┐
        ▼                       ▼                       ▼                       ▼
  [ AI Career Advisor ]   [ Roadmap Builder ]     [ Mock Interview ]      [ Skill Gap Analyzer ]
  (12 Modern Sectors)     (4-Week Action Plans)   (AI Speech & Scoring)   (Resume vs Job Desc)
```

---

## 🎯 Target Audience Pathways

### A. School Students (Class 9 & 10)
* **Interest Discovery**: Scientific 10-question aptitude assessment based on John Holland's RIASEC framework (Realistic, Investigative, Artistic, Social, Enterprising, Conventional).
* **Stream & Subject Selection**: Side-by-side comparison of Science (PCM & PCB), Commerce (with/without Math), Humanities, and Vocational options.
* **Subject-to-Career Mapping**: Clear explanations of what subjects are required for careers like Medicine, Law, Civil Services, Product Design, and Engineering.
* **Foundational Educational Roadmap**: Step-by-step guidance preparing for Class 11 subject decisions without forcing premature specialization.

### B. Higher Secondary Students (Class 11 & 12)
* **Undergraduate Degree Explorer**: Curated profiles for 25+ popular undergraduate programs (B.Tech, MBBS, BBA, B.Com, B.Des, BA LLB, BCA, BSc Nursing, etc.) detailing duration, eligibility, entrance routes, and career paths.
* **Competitive Entrance Exam Directory**: Eligibility criteria, exam frequency, subjects tested, and conducting bodies for major national exams: JEE Main/Advanced, NEET-UG, CUET-UG, CLAT, NDA, NATA, and UCEED.
* **Scholarship Finder**: National and state scholarship eligibility guides (Central Sector Scheme, INSPIRE, PMSSS, AICTE Pragati).

### C. College Students & Graduates
* **Skill Gap & Resume Analyzer**: Dual-engine semantic parser evaluating resumes against target job descriptions, identifying missing skills categorized by priority (*Critical*, *High*, *Medium*).
* **AI Mock Interview Cockpit**: Practice realistic interview questions tailored across 12 sectors, with speech/text answers and instant scoring on relevance, clarity, and depth.
* **Daily Learning Planner & Habit Tracker**: Daily task prioritization, study streak counter, and integrated Pomodoro focus timer (25/5 min cycles).
* **AI Roadmap Builder**: 4-week structured curriculums with daily tasks, progressive capstone projects, and technical milestone checklists.
* **Contextual Career Mentor Chat**: 24/7 AI chat companion for code debugging, portfolio review, and career transition strategy.

---

## 🛠️ Technology Stack & Engineering Architecture

| Layer | Technologies Used | Description |
|---|---|---|
| **Frontend UI** | HTML5, Vanilla ES6+, CSS3 Custom Properties | Modern SaaS theme (Deep Navy `#172554`, Indigo `#4F46E5`, Violet `#7C3AED`, Slate `#F8FAFC`, Pure White `#FFFFFF`). Zero heavyweight framework dependencies. |
| **Icons & Visuals** | Lucide Icons, Canvas Confetti, CSS Grid/Flexbox | Fast, responsive, accessible layouts with smooth transitions. |
| **Backend AI Gateway** | Node.js, Express.js | Secure server proxy (`/api/ai/generateContent`) protecting API credentials from client-side exposure. |
| **Generative AI** | Google Gemini 2.5 Flash / 1.5 Flash | Strict JSON schema output (`responseMimeType: "application/json"`) with deterministic structured parsing. |
| **Cloud Database** | Supabase Cloud (PostgreSQL / REST) | Real-time user profile sync, roadmap persistence, and credential storage. |
| **Offline Resilience** | Browser LocalStorage API | Transparent offline heuristic engines for 100% functionality without internet or database connectivity. |
| **Deployment** | Vercel Serverless / Node.js Host | Continuous integration and deployment from GitHub repository. |

---

## 📂 Project Directory Structure

```text
GetCareerPilot/
├── index.html                   # High-converting Landing Page, Auth Portal & Student Workspace
├── server.js                    # Node.js backend with secure Gemini AI Gateway & local auth
├── package.json                 # Project dependencies and startup scripts
├── README.md                    # Platform documentation and architecture overview
│
├── css/
│   └── styles.css               # SaaS design system, responsive typography, and high-contrast tokens
│
└── js/
    ├── app.js                   # Application controller, stage switcher, and event orchestrator
    ├── api-client.js            # Unified cloud client (Supabase + local server + offline fallback)
    ├── ai-service.js            # Secure Gemini AI router, JSON schemas, and offline fallbacks
    ├── data-templates.js        # Knowledge base: 36 career tracks, 25+ degrees, RIASEC questions
    └── resume-analyzer.js       # NLP resume parser, regex extractor, and skill gap scoring
```

---

## ⚡ Quick Start & Installation

### Option 1: Direct Web Access (No Setup Required)
Visit the live deployment at [getcareerpilot.vercel.app](https://getcareerpilot.vercel.app/).
- Click **"Try Interactive Demo"** to explore with pre-loaded profiles (`alex@getcareerpilot.com` / `password123`).
- Or click **"Start Career Discovery"** to run through the 5-step onboarding wizard.

---

### Option 2: Running Locally with Node.js & Secure AI Gateway

1. **Clone the repository**:
   ```bash
   git clone https://github.com/Siddharth4629/GetCareerPilot.git
   cd GetCareerPilot
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables** (Optional but recommended):
   Create a `.env` file in the project root:
   ```env
   PORT=3000
   GEMINI_API_KEY=your_google_gemini_api_key_here
   SUPABASE_URL=your_supabase_project_url
   SUPABASE_ANON_KEY=your_supabase_anon_key
   ```
   *(Note: You can get a free Gemini API key from [Google AI Studio](https://aistudio.google.com/)).*

4. **Start the server**:
   ```bash
   npm start
   ```

5. **Open in browser**:
   Navigate to `http://localhost:3000`.

---

### Option 3: Static Browser Run (Zero-Server Mode)
Because GetCareerPilot contains intelligent offline heuristics, you can simply open `index.html` directly in any modern browser:
* Double-click `index.html`, or
* Run with VS Code **Live Server** extension.

---

## 🔒 Security & Privacy Architecture

* **Secure AI Gateway**: Gemini API keys are held securely on the Node.js backend. Client requests pass through `/api/ai/generateContent` so API keys are never exposed in client-side network tabs or source code.
* **Hybrid Storage Architecture**: Profiles automatically sync to Supabase Cloud when connected, and gracefully cache in encrypted local storage when offline or running in standalone mode.
* **Data Privacy**: Resume audits and career assessments can be run 100% client-side with zero external data sharing.

---

## 🤝 Contributing

Contributions, feedback, and feature suggestions are welcome!
1. Fork the Project (`https://github.com/Siddharth4629/GetCareerPilot/fork`)
2. Create your Feature Branch (`git checkout -b feature/NewCareerPathway`)
3. Commit your Changes (`git commit -m 'feat: add Environmental Engineering track'`)
4. Push to the Branch (`git push origin feature/NewCareerPathway`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License – see the [LICENSE](LICENSE) file for details.

---

<p align="center">
  <b>GetCareerPilot</b> — Discover your interests, explore possibilities, and build your future.
</p>
