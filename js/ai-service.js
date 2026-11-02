// ai-service.js - Universal Multi-Disciplinary Gemini API Integration & Offline Synthesis Engine

class AIService {
  static getGeminiURL() {
    return "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent";
  }

  // ==========================================
  // 1. PERSONALIZED CAREER RECOMMENDATIONS (ALL FIELDS)
  // ==========================================

  /**
   * Generates personalized career recommendations based on user's background,
   * skills, interests, and ambitions. Uses Gemini API with structured JSON schema or local multi-field heuristic fallback.
   */
  static async generateCareerRecommendations(profile, apiKey = "") {
    if (apiKey && apiKey.trim() !== "") {
      try {
        return await this.generateCareerRecommendationsWithGemini(profile, apiKey);
      } catch (error) {
        console.error("Gemini Career Recommendations API error, falling back to local engine:", error);
      }
    }
    return this.generateCareerRecommendationsOffline(profile);
  }

  static async generateCareerRecommendationsWithGemini(profile, apiKey) {
    const prompt = `You are an Elite AI Career Guidance Counselor & Strategic Mentor for students and professionals across ALL fields and academic disciplines (Technology, AI, Data Science, Business, Product Management, Finance & Accounting, Design & Creative Arts, Marketing & Growth, Healthcare & Life Sciences, Core Engineering, Law & Policy, Psychology, etc.).
Analyze the candidate's academic background, current skills, core passions, and career ambitions to generate 3 to 4 personalized, high-growth career recommendations specifically tailored to their domain.

Candidate Profile:
- Background / Education: ${profile.background || "General Student / Higher Education"}
- Current Skills: ${profile.currentSkills && profile.currentSkills.length ? profile.currentSkills.join(", ") : "General Problem Solving & Communication"}
- Interests & Passions: ${profile.interests && profile.interests.length ? profile.interests.join(", ") : "High-impact career growth, modern industry tools"}
- Work Style & Ambition: ${profile.workPreference || "High-growth organizations, leadership opportunities, continuous learning"}
- Experience Level: ${profile.experienceLevel || "Intermediate"}

You MUST return your response as a valid, parsable JSON object (ONLY JSON, no markdown codeblocks or extra text).
The JSON structure MUST follow this exact schema:
{
  "summary": "string (2-sentence holistic assessment of the candidate's unique potential and strengths in their field)",
  "recommendations": [
    {
      "id": "string (career slug, e.g. 'product-manager', 'financial-analyst', 'data-scientist', 'ui-ux-designer', 'ai-ml-engineer', 'biomedical-scientist', 'digital-marketer', 'mechanical-engineer', 'corporate-lawyer', or custom kebab-case slug)",
      "title": "string (official career title, e.g. Product Manager, Financial Analyst, Biomedical Scientist)",
      "matchScore": number (percentage between 72 and 98 based on profile fit),
      "badge": "string (e.g. 'Highest Match', 'Fastest Growing', 'Strategic Leadership', 'High Impact', 'Creative Tech')",
      "salaryRange": "string (e.g. '$85,000 - $140,000 / ₹12L - ₹25L')",
      "marketDemand": "string (e.g. 'High Demand (+28% YoY in 2026)')",
      "fitRationale": "string (2-3 sentences explaining exactly why this role matches their background, passions, and skills)",
      "strengthsYouHave": ["string (skills/qualities they already possess that apply directly)"],
      "skillsToAcquire": ["string (top 3-4 key industry skills or methodologies needed to become job-ready)"],
      "recommendedFirstStep": "string (immediate actionable mini-goal, certification, or project to start with)",
      "keyTechnologies": ["string (4-5 key tools, software, or methodologies used in this profession)"]
    }
  ]
}

Ensure recommendations:
- Respect their declared field of interest (if they are in Finance, recommend Finance/Fintech; if Healthcare, recommend Life Sciences/Health; if Design, recommend Creative/UX; if Tech, recommend Software/AI).
- Provide realistic 2026 industry growth benchmarks and salary ranges.
- Offer actionable next steps so the student can immediately launch a custom roadmap.`;

    const response = await fetch(`${this.getGeminiURL()}?key=${apiKey}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          responseMimeType: "application/json",
          temperature: 0.4
        }
      })
    });

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`Gemini Recommendations error ${response.status}: ${errText}`);
    }

    const data = await response.json();
    const resultText = data.candidates[0].content.parts[0].text;
    return JSON.parse(resultText);
  }

  static generateCareerRecommendationsOffline(profile) {
    const skills = (profile.currentSkills || []).map(s => s.toLowerCase());
    const interests = (profile.interests || []).map(i => i.toLowerCase());
    const background = (profile.background || "").toLowerCase();

    // Comprehensive multi-disciplinary career pool
    const pool = [
      {
        id: "ai-ml-engineer",
        title: "AI Application Developer",
        category: "Tech & AI",
        badge: "Fastest Growing (2026)",
        salaryRange: "$105,000 - $160,000 / ₹14L - ₹28L",
        marketDemand: "Explosive Growth (+38% YoY)",
        baseScore: 70,
        keywords: ["ai", "machine learning", "python", "pytorch", "deep learning", "nlp", "llm", "neural", "computer science", "b.tech", "data"],
        fitRationale: "Your analytical mindset and interest in emerging technologies make you an ideal fit for building intelligent AI assistants, RAG pipelines, and agentic workflows.",
        strengthsYouHave: ["Analytical Thinking", "Core Logic", "Modern Tooling"],
        skillsToAcquire: ["LangChain", "Vector Databases (ChromaDB)", "Prompt Architecture", "FastAPI Serving"],
        recommendedFirstStep: "Build a document retrieval RAG assistant with Gemini API and local vector storage.",
        keyTechnologies: ["Python", "Gemini API", "ChromaDB", "LangChain", "Docker"]
      },
      {
        id: "data-scientist",
        title: "Data Scientist & AI Analyst",
        category: "Data & Analytics",
        badge: "High Impact & Analytics",
        salaryRange: "$85,000 - $145,000 / ₹12L - ₹24L",
        marketDemand: "High Demand (+30% YoY)",
        baseScore: 70,
        keywords: ["data", "statistics", "sql", "analytics", "pandas", "python", "power bi", "tableau", "math", "economics", "modeling"],
        fitRationale: "Transforms complex raw datasets into predictive machine learning models and high-impact executive intelligence dashboards that steer business decisions.",
        strengthsYouHave: ["Statistical Reasoning", "Pattern Recognition", "Data Modeling"],
        skillsToAcquire: ["Advanced SQL (Window Functions)", "XGBoost & Scikit-Learn", "Feature Engineering", "Tableau Dashboarding"],
        recommendedFirstStep: "Perform exploratory data analysis (EDA) and build a predictive customer churn model in Python.",
        keyTechnologies: ["Python", "SQL", "Pandas", "Scikit-Learn", "Power BI"]
      },
      {
        id: "product-manager",
        title: "Product Manager",
        category: "Business & Management",
        badge: "Strategic Leadership",
        salaryRange: "$85,000 - $140,000 / ₹14L - ₹26L",
        marketDemand: "High Demand (+25% YoY)",
        baseScore: 70,
        keywords: ["product", "management", "business", "agile", "scrum", "bba", "mba", "strategy", "marketing", "leadership", "user experience"],
        fitRationale: "Connects business goals, user empathy, and execution to define product roadmaps, write actionable PRDs, and guide cross-functional teams to market.",
        strengthsYouHave: ["Strategic Vision", "Stakeholder Alignment", "Problem Discovery"],
        skillsToAcquire: ["PRD Writing", "RICE Prioritization", "A/B Testing Hypothesis", "Product Analytics (Mixpanel)"],
        recommendedFirstStep: "Draft a 3-page Product Requirements Document (PRD) for a modern onboarding feature.",
        keyTechnologies: ["Jira", "Figma", "Mixpanel", "Miro", "Agile/Scrum"]
      },
      {
        id: "ui-ux-designer",
        title: "UI/UX & Product Designer",
        category: "Design & Creative",
        badge: "Creative Tech & UX",
        salaryRange: "$70,000 - $125,000 / ₹8L - ₹20L",
        marketDemand: "Steady Growth (+22% YoY)",
        baseScore: 70,
        keywords: ["design", "ui", "ux", "figma", "graphic", "creative", "arts", "wireframing", "prototyping", "visual", "multimedia"],
        fitRationale: "Transforms complex user friction into intuitive, accessible, and delightful digital interfaces through structured research, wireframing, and Figma design systems.",
        strengthsYouHave: ["Visual Empathy", "Attention to Detail", "Creative Ideation"],
        skillsToAcquire: ["Figma Auto Layout & Variables", "Design Systems Governance", "Usability Testing (Maze)", "WCAG 2.1 Accessibility"],
        recommendedFirstStep: "Design an interactive high-fidelity mobile app prototype with cohesive typography and micro-interactions.",
        keyTechnologies: ["Figma", "Design Tokens", "Prototyping", "WCAG 2.1", "Miro"]
      },
      {
        id: "financial-analyst",
        title: "Financial Analyst & Valuation Specialist",
        category: "Finance & Banking",
        badge: "High Earning Potential",
        salaryRange: "$80,000 - $135,000 / ₹10L - ₹24L",
        marketDemand: "Consistent Growth (+20% YoY)",
        baseScore: 70,
        keywords: ["finance", "accounting", "b.com", "commerce", "valuation", "investment", "banking", "excel", "dcf", "equity", "cfa", "ca"],
        fitRationale: "Evaluates corporate financial statements, constructs dynamic three-statement models, and performs DCF company valuations for strategic investments.",
        strengthsYouHave: ["Quantitative Modeling", "Financial Analysis", "Attention to Detail"],
        skillsToAcquire: ["3-Statement Integrated Modeling", "DCF & Comparable Valuation", "Advanced Excel (Financial Functions)", "Corporate FP&A"],
        recommendedFirstStep: "Build a dynamic 3-statement financial model for a publicly traded company in Excel.",
        keyTechnologies: ["Excel", "DCF Modeling", "Power BI", "Financial Accounting", "Capital IQ"]
      },
      {
        id: "digital-marketer",
        title: "Digital Marketing & Growth Strategist",
        category: "Marketing & Growth",
        badge: "High Growth & Creative",
        salaryRange: "$65,000 - $115,000 / ₹7L - ₹18L",
        marketDemand: "Rapid Expansion (+26% YoY)",
        baseScore: 70,
        keywords: ["marketing", "seo", "content", "social media", "growth", "advertising", "copywriting", "sales", "brand", "media", "pr"],
        fitRationale: "Drives customer acquisition funnels, crafts compelling copy, and maximizes revenue through data-backed performance marketing and technical SEO.",
        strengthsYouHave: ["Storytelling", "Consumer Psychology", "Campaign Ideation"],
        skillsToAcquire: ["Google Analytics 4 (GA4)", "Performance Ads (Meta & Google)", "Conversion Rate Optimization (CRO)", "Technical SEO"],
        recommendedFirstStep: "Launch a multi-channel acquisition campaign with targeted ad creatives and automated email flows.",
        keyTechnologies: ["GA4", "Meta Ads Manager", "Google Ads", "HubSpot", "Semrush"]
      },
      {
        id: "biomedical-scientist",
        title: "Biomedical & Healthcare Scientist",
        category: "Healthcare & Life Sciences",
        badge: "Humanitarian Impact",
        salaryRange: "$70,000 - $130,000 / ₹9L - ₹22L",
        marketDemand: "High Demand (+24% YoY)",
        baseScore: 70,
        keywords: ["biology", "biomedical", "medical", "mbbs", "healthcare", "pharma", "biotech", "clinical", "genetics", "chemistry", "science", "lab"],
        fitRationale: "Investigates human disease mechanisms, designs clinical trial protocols compliant with GCP, and accelerates diagnostic and therapeutic innovations.",
        strengthsYouHave: ["Scientific Rigor", "Clinical Understanding", "Laboratory Safety"],
        skillsToAcquire: ["Good Clinical Practice (ICH-GCP)", "Biostatistics & Survival Analysis (R)", "Molecular Assays (qPCR / ELISA)", "Regulatory Affairs (FDA)"],
        recommendedFirstStep: "Draft a standardized Phase II clinical trial protocol with inclusion criteria and statistical power sizing.",
        keyTechnologies: ["NCBI/BLAST", "GraphPad Prism", "Clinical Protocols", "qPCR", "R"]
      },
      {
        id: "mechanical-engineer",
        title: "Mechanical & Systems Engineer",
        category: "Core Engineering",
        badge: "Physical Innovation",
        salaryRange: "$75,000 - $125,000 / ₹8L - ₹18L",
        marketDemand: "Stable Growth (+18% YoY)",
        baseScore: 70,
        keywords: ["mechanical", "engineering", "cad", "solidworks", "autocad", "fea", "robotics", "automotive", "manufacturing", "thermal", "physics"],
        fitRationale: "Designs, simulates, and manufactures physical hardware, electromechanical assemblies, and thermal management systems from CAD sketch to physical prototype.",
        strengthsYouHave: ["Spatial Reasoning", "Physics Fundamentals", "Engineering Graphics"],
        skillsToAcquire: ["SolidWorks 3D Parametric Modeling", "Geometric Dimensioning & Tolerancing (GD&T)", "Finite Element Analysis (FEA)", "DFMA Principles"],
        recommendedFirstStep: "Model an assembly in SolidWorks and perform structural FEA to optimize weight while maintaining safety factor > 2.0.",
        keyTechnologies: ["SolidWorks", "AutoCAD", "FEA Simulation", "GD&T", "MATLAB"]
      },
      {
        id: "corporate-lawyer",
        title: "Corporate Legal & Compliance Consultant",
        category: "Law & Public Policy",
        badge: "High Prestige & Trust",
        salaryRange: "$80,000 - $150,000 / ₹12L - ₹28L",
        marketDemand: "High Demand (+20% YoY)",
        baseScore: 70,
        keywords: ["law", "legal", "llb", "corporate", "contracts", "compliance", "policy", "governance", "arbitration", "intellectual property", "court"],
        fitRationale: "Advises organizations on corporate governance, drafts robust commercial agreements, navigates regulatory compliance, and protects valuable intellectual property.",
        strengthsYouHave: ["Analytical Argumentation", "Statutory Interpretation", "Precision Drafting"],
        skillsToAcquire: ["Commercial Contract Drafting (MSA / SLA)", "Corporate Due Diligence", "Data Privacy Laws (GDPR / DPDP)", "Negotiation & Dispute Resolution"],
        recommendedFirstStep: "Draft an enterprise-grade SaaS Master Services Agreement with comprehensive liability caps and IP assignments.",
        keyTechnologies: ["Westlaw", "Contract Redlining", "Due Diligence Checklists", "Corporate Governance", "GDPR Compliance"]
      },
      {
        id: "cybersecurity-analyst",
        title: "Cybersecurity & SOC Analyst",
        category: "Security & IT",
        badge: "Mission-Critical Defense",
        salaryRange: "$80,000 - $135,000 / ₹10L - ₹22L",
        marketDemand: "High Shortage (+34% YoY)",
        baseScore: 70,
        keywords: ["cybersecurity", "security", "network", "linux", "ethical hacking", "soc", "splunk", "wireshark", "penetration", "defense", "infosec"],
        fitRationale: "Safeguards critical digital infrastructure, monitors Security Operations Centers (SOC), performs network packet forensics, and manages incident containment.",
        strengthsYouHave: ["Investigative Mindset", "Network Awareness", "Risk Mitigation"],
        skillsToAcquire: ["SIEM Log Analysis (Splunk)", "Packet Inspection (Wireshark)", "Incident Response (NIST SP 800-61)", "Vulnerability Scanning (Nmap/Nessus)"],
        recommendedFirstStep: "Set up a virtual lab to capture and analyze malicious network packets in Wireshark.",
        keyTechnologies: ["Splunk", "Wireshark", "Linux", "Nmap", "Snort IDS"]
      },
      {
        id: "fullstack-developer",
        title: "Full-Stack Web Engineer",
        category: "Tech & Software",
        badge: "Most Versatile",
        salaryRange: "$90,000 - $135,000 / ₹10L - ₹22L",
        marketDemand: "High Demand (+22% YoY)",
        baseScore: 70,
        keywords: ["fullstack", "web", "javascript", "react", "node", "html", "css", "database", "sql", "git", "software"],
        fitRationale: "Owns entire features from responsive frontends to database architectures and REST APIs, offering unparalleled versatility across development teams.",
        strengthsYouHave: ["Web Technologies", "End-to-End Problem Solving", "Modular Design"],
        skillsToAcquire: ["Next.js (App Router)", "TypeScript", "PostgreSQL & Prisma", "Docker Containerization"],
        recommendedFirstStep: "Create a full-stack dashboard with authentication, database persistence, and clean API endpoints.",
        keyTechnologies: ["React", "Node.js", "TypeScript", "PostgreSQL", "Next.js"]
      }
    ];

    // Score each role by keyword overlap with user background, skills, and interests
    pool.forEach(role => {
      let scoreBoost = 0;
      role.keywords.forEach(kw => {
        if (background.includes(kw)) scoreBoost += 9;
        if (skills.some(s => s.includes(kw))) scoreBoost += 7;
        if (interests.some(i => i.includes(kw))) scoreBoost += 8;
      });
      role.calculatedScore = Math.min(Math.max(role.baseScore + scoreBoost, 72), 98);
    });

    // Sort descending by calculated score
    pool.sort((a, b) => b.calculatedScore - a.calculatedScore);

    const topRecommendations = pool.slice(0, 4).map(role => ({
      id: role.id,
      title: role.title,
      matchScore: role.calculatedScore,
      badge: role.badge,
      salaryRange: role.salaryRange,
      marketDemand: role.marketDemand,
      fitRationale: role.fitRationale,
      strengthsYouHave: profile.currentSkills && profile.currentSkills.length ? profile.currentSkills.slice(0, 3) : role.strengthsYouHave,
      skillsToAcquire: role.skillsToAcquire,
      recommendedFirstStep: role.recommendedFirstStep,
      keyTechnologies: role.keyTechnologies
    }));

    const summary = `Based on your background in ${profile.background || "your field"} and your unique interests, you demonstrate outstanding potential in ${topRecommendations[0].title}. Your core competencies position you for rapid advancement in 2026.`;

    return {
      summary: summary,
      recommendations: topRecommendations
    };
  }

  // ==========================================
  // 2. RESUME SKILL-GAP ANALYSIS (DUAL ENGINE)
  // ==========================================

  /**
   * Analyzes resume text against target job description.
   */
  static async analyzeResumeSkillGap(resumeText, jdText, apiKey = "") {
    if (apiKey && apiKey.trim() !== "") {
      try {
        return await this.analyzeResumeSkillGapWithGemini(resumeText, jdText, apiKey);
      } catch (error) {
        console.error("Gemini Resume Analysis API error, falling back to local regex engine:", error);
      }
    }
    return null; // Signals caller to use local rule-based analyzer
  }

  static async analyzeResumeSkillGapWithGemini(resumeText, jdText, apiKey) {
    const prompt = `You are a Principal AI Recruiter and Senior Technical Hiring Manager.
Conduct a deep semantic skill-gap and readiness analysis between the candidate's resume and the job description.
Do NOT just perform simple keyword counting. Evaluate contextual seniority, depth of engineering/domain ownership, and practical delivery impact.

Candidate Resume:
${resumeText}

Target Job Description:
${jdText}

You MUST return your response as a valid, parsable JSON object (ONLY JSON, no markdown codeblocks or extra text).
The JSON structure MUST follow this exact schema:
{
  "matchScore": number (integer between 0 and 100 representing overall hiring compatibility),
  "aiRecruiterVerdict": "string (a punchy 2-3 sentence hiring committee verdict on the candidate's candidacy)",
  "matchedSkills": [
    {
      "name": "string (skill name)",
      "evidence": "string (brief quote or snippet from resume showing where they demonstrated this)",
      "proficiency": "string ('Strong' or 'Working Knowledge')"
    }
  ],
  "missingSkills": [
    {
      "name": "string (missing or underdeveloped skill)",
      "whyRequired": "string (how the job description relies on this skill)",
      "importance": "string ('Critical' or 'Preferred')",
      "suggestedMiniProject": "string (a quick practical project or action to prove capability)"
    }
  ],
  "weakAreas": ["string (e.g. 'Production Scale & Deployment', 'System Architecture', 'Testing Coverage')"],
  "learningPriority": ["string (ordered list of 3-4 skills to master first)"],
  "resumeImprovementTips": [
    "string (specific, actionable resume bullet advice using STAR/XYZ format: Accomplished X by doing Y as measured by Z)"
  ]
}

Ensure the analysis is candid, highly actionable, and professional.`;

    const response = await fetch(`${this.getGeminiURL()}?key=${apiKey}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          responseMimeType: "application/json",
          temperature: 0.3
        }
      })
    });

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`Gemini Resume Analysis error ${response.status}: ${errText}`);
    }

    const data = await response.json();
    const resultText = data.candidates[0].content.parts[0].text;
    const parsed = JSON.parse(resultText);

    return {
      isLLM: true,
      matchScore: parsed.matchScore || 0,
      aiRecruiterVerdict: parsed.aiRecruiterVerdict || "",
      matchedSkills: parsed.matchedSkills || [],
      missingSkills: parsed.missingSkills || [],
      weakAreas: parsed.weakAreas || [],
      learningPriority: parsed.learningPriority || [],
      resumeImprovementTips: parsed.resumeImprovementTips || []
    };
  }

  // ==========================================
  // 3. INTELLIGENT JOB MATCHING & CAREER GUIDANCE
  // ==========================================

  /**
   * Generates bespoke career guidance, tailored interview prep, and resume bullet
   * recommendations for a candidate targeting a specific job listing.
   */
  static async generateJobCareerGuidance(job, userProfile, apiKey = "") {
    if (apiKey && apiKey.trim() !== "") {
      try {
        return await this.generateJobCareerGuidanceWithGemini(job, userProfile, apiKey);
      } catch (error) {
        console.error("Gemini Job Guidance API error, falling back to local heuristic:", error);
      }
    }
    return this.generateJobCareerGuidanceOffline(job, userProfile);
  }

  static async generateJobCareerGuidanceWithGemini(job, userProfile, apiKey) {
    const prompt = `You are a Principal Career Coach & Domain Interview Strategist.
Analyze this candidate's current profile and roadmap progress against this specific job opening across any industry. Provide actionable career guidance, tailored interview questions, and customized resume bullets.

Job Opening:
- Title: ${job.title}
- Company: ${job.company}
- Location: ${job.location}
- Stated Requirements / Tools: ${job.tags.join(", ")}
- Job Description: ${job.description}

Candidate Profile:
- Target Track: ${userProfile.career}
- Mastered / Current Skills: ${userProfile.skills && userProfile.skills.length ? userProfile.skills.join(", ") : "General Domain Concepts"}
- Experience Level: ${userProfile.level || "Intermediate"}
- Roadmap Progress: ${userProfile.progress || 0}% completed

You MUST return your response as a valid, parsable JSON object (ONLY JSON, no markdown codeblocks or extra text).
The JSON structure MUST follow this exact schema:
{
  "readinessScore": number (0 to 100 percentage fit),
  "readinessVerdict": "string (e.g. 'Strong Contender', 'Ready With Quick Upskill', 'Prerequisite Building Needed')",
  "personalizedGuidance": "string (2-3 sentences advising the candidate on how to position themselves for this opening)",
  "skillsYouMatch": ["string"],
  "skillsToSharpen": ["string"],
  "tailoredInterviewQuestions": [
    {
      "question": "string (a realistic technical or behavioral question this company will likely ask)",
      "coachingTip": "string (how to structure an impressive response highlighting projects)"
    }
  ],
  "recommendedResumeBullets": [
    "string (STAR-formatted bullet point tailored to this role that the user can adapt for their resume)"
  ],
  "oneWeekSprintPlan": "string (concrete 7-day action item to maximize odds before applying)"
}

Ensure high quality, specific questions and resume bullets that reference the exact skills demanded in this job.`;

    const response = await fetch(`${this.getGeminiURL()}?key=${apiKey}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          responseMimeType: "application/json",
          temperature: 0.3
        }
      })
    });

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`Gemini Job Guidance error ${response.status}: ${errText}`);
    }

    const data = await response.json();
    const resultText = data.candidates[0].content.parts[0].text;
    return JSON.parse(resultText);
  }

  static generateJobCareerGuidanceOffline(job, userProfile) {
    const userSkills = (userProfile.skills || []).map(s => s.toLowerCase());
    const jobTags = (job.tags || []).map(t => t.toLowerCase());

    const matched = [];
    const missing = [];

    job.tags.forEach(tag => {
      const tagLower = tag.toLowerCase();
      if (userSkills.some(s => s.includes(tagLower) || tagLower.includes(s))) {
        matched.push(tag);
      } else {
        missing.push(tag);
      }
    });

    const matchRatio = jobTags.length > 0 ? (matched.length / jobTags.length) : 0.5;
    const progressBonus = Math.min((userProfile.progress || 0) * 0.2, 20);
    const readinessScore = Math.min(Math.round(matchRatio * 75 + progressBonus + 10), 96);

    let verdict = "Ready With Quick Upskill";
    if (readinessScore >= 80) verdict = "Strong Contender";
    else if (readinessScore < 50) verdict = "Prerequisite Building Needed";

    return {
      readinessScore: readinessScore,
      readinessVerdict: verdict,
      personalizedGuidance: `You possess strong foundations in ${matched.join(", ") || "core domain principles"}. Focusing on ${missing.slice(0, 2).join(" and ") || "polishing execution quality"} will bridge your final gap for ${job.company}.`,
      skillsYouMatch: matched,
      skillsToSharpen: missing,
      tailoredInterviewQuestions: [
        {
          question: `How have you used ${job.tags[0] || "modern tools"} to deliver high-quality outcomes under tight deadlines?`,
          coachingTip: "Highlight architectural decisions, methodologies, and how you handled edge cases."
        },
        {
          question: `Walk us through a technical challenge you encountered while collaborating on a ${job.title} deliverable.`,
          coachingTip: "Use the STAR method: explain the specific bottleneck, the diagnostic tools you used, and the measurable outcome."
        }
      ],
      recommendedResumeBullets: [
        `Spearheaded deliverables utilizing ${job.tags.slice(0, 2).join(" & ")}, driving a 28% improvement in efficiency and accuracy.`,
        `Integrated standardized quality checks and modular workflows, reducing regression errors and enhancing operational reliability.`
      ],
      oneWeekSprintPlan: `Dedicate 5 hours this week to completing a dedicated project milestone utilizing ${missing[0] || job.tags[0]} and document it in your portfolio.`
    };
  }

  // ==========================================
  // 4. PERSONALIZED LEARNING ROADMAPS (UNIVERSAL)
  // ==========================================

  /**
   * Generates a career roadmap based on inputs, utilizing Gemini API if a key is provided,
   * otherwise fallback to predefined templates or dynamic synthesis for any custom career.
   */
  static async generateRoadmap(career, currentSkills, level, hoursPerWeek, apiKey = "") {
    if (apiKey && apiKey.trim() !== "") {
      try {
        return await this.generateRoadmapWithGemini(career, currentSkills, level, hoursPerWeek, apiKey);
      } catch (error) {
        console.error("Gemini Roadmap API error, falling back to local template:", error);
      }
    }
    return this.generateRoadmapOffline(career, currentSkills, level, hoursPerWeek);
  }

  static async generateRoadmapWithGemini(career, currentSkills, level, hoursPerWeek, apiKey) {
    const prompt = `You are a professional AI Career Mentor and Domain Strategist.
Generate a comprehensive, highly customized learning roadmap for a student/professional aiming to become a "${career}".

User Profile:
- Target Track / Career: ${career}
- Current Experience Level: ${level}
- Already Mastered Skills: ${currentSkills.join(", ") || "None"}
- Available study time: ${hoursPerWeek} hours per week

You MUST return your response as a valid, parsable JSON object (and ONLY JSON, do not wrap in markdown \`\`\`json block or other text). The JSON structure MUST be exactly:
{
  "title": "string (the career name)",
  "description": "string (brief overview of the career)",
  "skills": ["string (skills to master, excluding their existing skills)"],
  "roadmap": {
    "weeks": [
      {
        "title": "string (Week theme)",
        "topics": ["string (detailed learning concept)"],
        "tasks": ["string (practical action step/mini-lab)"],
        "hoursRequired": number
      }
    ]
  },
  "projects": [
    {
      "name": "string (Project title)",
      "difficulty": "string (Beginner/Intermediate/Advanced)",
      "tech": ["string (technologies/tools/methodologies used)"],
      "description": "string (brief summary)",
      "features": ["string (key feature requirements)"]
    }
  ],
  "interviewPrep": {
    "topics": ["string (core interview topics)"],
    "questions": [
      {
        "q": "string (interview question)",
        "a": "string (model answer)"
      }
    ]
  }
}

Ensure the content is tailored:
- If experience level is "beginner", start from foundational elements. If "advanced", skip basic tutorials and introduce architecture, scaling, and systems.
- Exclude the user's "Already Mastered Skills" from the direct topics or flag them as pre-requisites.
- Customize the tasks and depth to match their available ${hoursPerWeek} hours/week.
- Ensure you return exactly 4 weeks of structured learning.
- Provide 3 distinct progressive projects appropriate to this discipline (e.g. for finance: models; for design: prototypes; for tech: code/apps; for healthcare: protocols).
- Provide 5 domain-specific interview questions.`;

    const response = await fetch(`${this.getGeminiURL()}?key=${apiKey}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          responseMimeType: "application/json"
        }
      })
    });

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`Gemini API returned code ${response.status}: ${errText}`);
    }

    const data = await response.json();
    const resultText = data.candidates[0].content.parts[0].text;
    return JSON.parse(resultText);
  }

  static generateRoadmapOffline(career, currentSkills, level, hoursPerWeek) {
    // If predefined template exists in CAREER_TEMPLATES, customize it
    if (typeof CAREER_TEMPLATES !== 'undefined' && CAREER_TEMPLATES[career]) {
      const template = JSON.parse(JSON.stringify(CAREER_TEMPLATES[career]));
      let baseRoadmapWeeks = template.roadmap[level] ? template.roadmap[level].weeks : template.roadmap.beginner.weeks;
      const lowerCurrentSkills = currentSkills.map(s => s.toLowerCase().trim());
      
      const customizedWeeks = baseRoadmapWeeks.map((week, idx) => {
        let adjustedTopics = week.topics.map(topic => {
          const matchesSkill = lowerCurrentSkills.some(skill => topic.toLowerCase().includes(skill));
          if (matchesSkill) {
            return `${topic} [Already Familiar - Review Only]`;
          }
          return topic;
        });

        let tasks = [...week.tasks];
        let finalTasks = tasks;
        if (hoursPerWeek < week.hoursRequired) {
          finalTasks = tasks.map((t, i) => i === tasks.length - 1 ? `${t} (Optional / Extension)` : t);
        }

        return {
          title: week.title,
          topics: adjustedTopics,
          tasks: finalTasks,
          hoursRequired: Math.min(week.hoursRequired, hoursPerWeek)
        };
      });

      return {
        title: template.title,
        description: template.description,
        skills: template.skills.filter(s => !lowerCurrentSkills.includes(s.toLowerCase())),
        roadmap: { weeks: customizedWeeks },
        projects: template.projects,
        interviewPrep: template.interviewPrep
      };
    }

    // Dynamic offline roadmap generator for ANY custom career in ANY field!
    return this.synthesizeDynamicRoadmap(career, currentSkills, level, hoursPerWeek);
  }

  static synthesizeDynamicRoadmap(career, currentSkills, level, hoursPerWeek) {
    let formattedTitle = career.split(/[-_ ]+/).map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
    if (!formattedTitle || formattedTitle.trim() === "") formattedTitle = "Professional Specialist";

    const hours = Math.max(hoursPerWeek || 15, 8);
    const existingSkillsStr = currentSkills && currentSkills.length ? currentSkills.join(", ") : "foundational academic skills";

    return {
      title: formattedTitle,
      description: `A customized 4-week professional mastery roadmap designed for aspiring ${formattedTitle}s. Scales from core foundations and practical tooling to capstone projects, portfolio building, and interview success.`,
      skills: [
        `${formattedTitle} Core Frameworks`,
        "Applied Industry Methodologies",
        "Problem Formulation & Diagnostics",
        "Quality Control & Standards",
        "Portfolio Case Studies",
        "Professional Communication & Ethics"
      ],
      roadmap: {
        weeks: [
          {
            title: `Week 1: Core Principles & Theoretical Foundations of ${formattedTitle}`,
            topics: [
              `Fundamental principles, historical evolution, and key frameworks in ${formattedTitle}`,
              "Essential industry terminology, standards, and ethical codes of conduct",
              `Diagnostic tools and foundational workflows (leveraging your ${existingSkillsStr})`,
              "Survey of modern benchmarks, regulatory guidelines, and operating procedures"
            ],
            tasks: [
              `Conduct an in-depth review of 3 industry-leading case studies in ${formattedTitle}`,
              `Configure your professional workspace, tools, and digital resources for ${formattedTitle}`,
              "Create a structured conceptual map linking core methodologies to practical outcomes"
            ],
            hoursRequired: Math.min(hours, 14)
          },
          {
            title: `Week 2: Practical Tooling, Applied Methodologies & Execution`,
            topics: [
              `Hands-on execution workflows and standard operating procedures for a ${formattedTitle}`,
              "Data analysis, evidence gathering, and problem formulation",
              "Iterative testing, peer feedback mechanisms, and quality assurance",
              "Troubleshooting common operational bottlenecks and failure modes"
            ],
            tasks: [
              `Execute a practical mini-case study applying key methodologies of ${formattedTitle}`,
              "Document a complete Standard Operating Procedure (SOP) for your first deliverable",
              "Perform a peer-level review evaluating accuracy and industry compliance"
            ],
            hoursRequired: Math.min(hours, 16)
          },
          {
            title: `Week 3: Advanced Applications, Case Studies & Cross-Functional Strategy`,
            topics: [
              `Complex real-world problem scenarios and strategic decision-making in ${formattedTitle}`,
              "Cross-functional collaboration and translating findings for non-technical stakeholders",
              "Risk management, compliance auditing, and safety/security protocols",
              "2026 Industry innovations, AI/automation tools, and modern productivity drivers"
            ],
            tasks: [
              `Analyze a high-stakes real-world challenge or incident report in ${formattedTitle}`,
              "Author a comprehensive strategic remediation proposal with quantifiable metrics",
              "Optimize your execution speed and document key decision rationales"
            ],
            hoursRequired: Math.min(hours, 18)
          },
          {
            title: `Week 4: Capstone Portfolio, Strategic Synthesis & Interview Readiness`,
            topics: [
              `Finalizing an impressive, public-facing professional portfolio for ${formattedTitle}`,
              "Behavioral & technical interview mastery using the STAR methodology",
              "Career trajectory planning, industry networking, and continuous learning roadmaps",
              "Presenting capstone deliverables and negotiating career opportunities"
            ],
            tasks: [
              `Polish and package your signature capstone project for ${formattedTitle}`,
              "Complete a simulated interview recording answering 5 domain-specific technical questions",
              "Publish your case study or portfolio deliverable for peer review and recruitment"
            ],
            hoursRequired: Math.min(hours, 15)
          }
        ]
      },
      projects: [
        {
          name: `${formattedTitle} Foundational Diagnostic Case Study`,
          difficulty: "Beginner",
          tech: [`${formattedTitle} Frameworks`, "Analytical Methods", "Documentation"],
          description: `A structured investigation addressing a real-world scenario in ${formattedTitle}, establishing baseline metrics and preliminary solutions.`,
          features: ["Problem statement and scope definition", "Diagnostic analysis and evidence compilation", "Standardized deliverable report", "Actionable recommendations"]
        },
        {
          name: `${formattedTitle} Comprehensive Capstone Project`,
          difficulty: "Intermediate",
          tech: [`Applied ${formattedTitle} Tooling`, "Industry Best Practices", "Quality Control"],
          description: `An end-to-end practical project demonstrating mastery over execution, compliance, and deliverables in ${formattedTitle}.`,
          features: ["Complete workflow execution plan", "Iterative validation and audit logs", "Risk management matrix", "Executive summary presentation"]
        },
        {
          name: `Strategic Innovation & Industry Leadership in ${formattedTitle}`,
          difficulty: "Advanced",
          tech: ["Modern Methodologies", "AI & Automation", "Strategic Analysis"],
          description: `A forward-looking research or technical initiative proposing an innovative, scalable solution to a major industry challenge in ${formattedTitle}.`,
          features: ["Multi-stakeholder impact assessment", "Scalability and cost-benefit model", "Peer-reviewed presentation slide deck", "Published portfolio deliverable"]
        }
      ],
      interviewPrep: {
        topics: [
          `Foundational principles and methodologies in ${formattedTitle}`,
          "Problem-solving process under high-pressure constraints",
          "Stakeholder communication and ethical judgment",
          "Adapting to modern technology and industry shifts",
          "Walkthrough of your signature capstone project"
        ],
        questions: [
          {
            q: `What motivated you to pursue a career as a ${formattedTitle}, and what are your core strengths?`,
            a: `Explain your passion for ${formattedTitle}, connect your past academic or practical background to key requirements, and highlight 2-3 specific strengths such as analytical rigor, practical execution, and collaborative problem-solving with concrete examples.`
          },
          {
            q: `Walk us through a challenging project or problem you encountered in ${formattedTitle} and how you solved it.`,
            a: `Use the STAR method (Situation, Task, Action, Result). Clearly explain the context, the specific obstacle, the methodological actions and tools you employed, and the measurable positive outcome.`
          },
          {
            q: `How do you stay up-to-date with emerging trends, technologies, and regulatory changes in ${formattedTitle}?`,
            a: `Mention specific industry publications, professional associations, continuous education courses, hands-on experimentation with modern tools, and participating in peer communities.`
          },
          {
            q: `How do you handle disagreements with colleagues or stakeholders regarding a project approach?`,
            a: `Focus on objective evidence, active listening, seeking to understand the underlying constraints, and working collaboratively toward shared goals while adhering to safety and quality standards.`
          },
          {
            q: `Where do you see the field of ${formattedTitle} evolving over the next 3 to 5 years?`,
            a: `Discuss the impact of digital transformation, AI/automation tools, cross-functional collaboration, sustainability, and how professionals must adapt their skillset to drive higher strategic impact.`
          }
        ]
      }
    };
  }

  // ==========================================
  // 5. INTERACTIVE AI MENTOR CHATBOT
  // ==========================================

  /**
   * Universal multi-turn AI career mentor supporting any discipline.
   */
  static async getChatReply(chatHistory, userMessage, careerContext, apiKey = "") {
    if (apiKey && apiKey.trim() !== "") {
      try {
        return await this.getChatReplyWithGemini(chatHistory, userMessage, careerContext, apiKey);
      } catch (error) {
        console.error("Gemini Chat API error, falling back to local mentor reply:", error);
      }
    }
    return this.getChatReplyOffline(userMessage, careerContext);
  }

  static async getChatReplyWithGemini(chatHistory, userMessage, careerContext, apiKey) {
    const contents = [];
    
    // Process previous history ensuring alternating turns
    chatHistory.forEach(msg => {
      const role = msg.sender === "bot" ? "model" : "user";
      if (contents.length > 0 && contents[contents.length - 1].role === role) {
        contents[contents.length - 1].parts[0].text += `\n${msg.text}`;
      } else {
        contents.push({ role: role, parts: [{ text: msg.text }] });
      }
    });

    // Ensure user message is appended cleanly
    if (contents.length > 0 && contents[contents.length - 1].role === "user") {
      contents[contents.length - 1].parts[0].text += `\n${userMessage}`;
    } else {
      contents.push({ role: "user", parts: [{ text: userMessage }] });
    }

    // Google Gemini multi-turn API requires the first turn to be role: 'user'
    if (contents.length > 0 && contents[0].role === "model") {
      contents.shift();
    }

    const systemPrompt = `You are an elite, inspiring, and deeply knowledgeable AI Career Mentor named "GetCareerPilot Mentor".
You mentor students and professionals across ALL disciplines—including Technology, AI, Data Science, Business, Finance, UI/UX Design, Healthcare & Medicine, Core Engineering, Marketing, Law, and Public Policy.
You are mentoring a candidate on their journey to becoming an expert in "${careerContext || 'their chosen profession'}".
Always respond in a supportive, motivating, and highly actionable tone. Provide real-world domain examples, step-by-step methodologies, practical frameworks, and concrete next steps tailored directly to their target field ("${careerContext}"). Keep responses well-structured with clear markdown bullet points and headers.`;

    const response = await fetch(`${this.getGeminiURL()}?key=${apiKey}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        systemInstruction: {
          parts: [{ text: systemPrompt }]
        },
        contents: contents
      })
    });

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`Gemini Chat API returned ${response.status}: ${errText}`);
    }

    const data = await response.json();
    return data.candidates[0].content.parts[0].text;
  }

  static getChatReplyOffline(userMessage, careerContext) {
    const msg = userMessage.toLowerCase();
    let careerName = careerContext || "Professional Specialist";
    if (typeof CAREER_TEMPLATES !== 'undefined' && CAREER_TEMPLATES[careerContext]) {
      careerName = CAREER_TEMPLATES[careerContext].title;
    }

    if (msg.includes("in-demand") || msg.includes("skill") || msg.includes("trend")) {
      return `### Top Industry Priorities & In-Demand Skills for 2026:

For a **${careerName}**, leaders and recruiters are prioritizing:
- **Domain Specialization**: Deep mastery of foundational frameworks, regulatory standards, and modern workflows.
- **AI & Modern Tooling Integration**: Leveraging Generative AI copilots, automation tools, and data analytics to 10x output speed.
- **Cross-Functional Communication**: Translating technical or complex findings into actionable executive decisions.
- **Practical Evidence & Portfolio**: Verified real-world capstone projects, case studies, and quantifiable outcomes.`;
    }

    if (msg.includes("interview") || msg.includes("prep") || msg.includes("question")) {
      return `### Elite Interview Strategy for ${careerName}:

1. **Master the STAR Method**:
   - **Situation**: Contextualize the challenge and stakes clearly.
   - **Task**: Define the exact objective and your specific responsibility.
   - **Action**: Explain the analytical choices, methodologies, and tools you chose.
   - **Result**: Quantify the impact (e.g., *"reduced error rate by 24%", "improved turnaround time by 3 days"*).

2. **Anchor Around Signature Projects**:
   Always connect theoretical questions back to hands-on case studies in your roadmap portfolio.`;
    }

    return `Hello! As your AI Career Mentor in **${careerName}**, I am here to help you navigate:
- **Custom Learning Roadmaps & Milestones**
- **Domain-Specific Best Practices & Tooling**
- **Resume Tailoring & Skill-Gap Elimination**
- **Interview Preparation & Mock Scenarios**

What specific topic or challenge would you like to dive into today?`;
  }
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { AIService };
}
