// app.js - Main Application State Coordinator & UI Controller

// Global App State
let state = {
  user: null, // { username, email, career: "frontend-developer", level: "intermediate", hours: 15, skills: [] }
  activeRoadmap: null,
  checklistProgress: {}, // { "weekIndex-taskIndex": true }
  chatHistory: [],
  apiKey: "",
  streakCount: 1,
  lastActiveDate: "",
  careerRecommendations: null,
  analyzerMode: "llm", // "llm" or "local"
  selectedInterests: ["AI & Large Language Models", "Full-Stack Web Applications"],
  activeGuidanceJob: null,
  authMode: "login",
  academicStage: "College",
  activeQuizIndex: 0,
  assessmentAnswers: [],
  assessmentResults: null,
  explorerSelectedDomain: "all",
  collegeSubTab: "degrees",
  mockDomain: "engineering-tech",
  mockQuestionIndex: 0,
  dailyTasks: [
    { id: "task-1", text: "Review key concept fundamentals and notes", category: "Roadmap", time: "45m", completed: true, date: new Date().toDateString() },
    { id: "task-2", text: "Complete practice problem set or challenge", category: "Project", time: "1h", completed: false, date: new Date().toDateString() },
    { id: "task-3", text: "Attempt 1 AI Mock Interview question", category: "Exam Prep", time: "30m", completed: false, date: new Date().toDateString() }
  ],
  pomodoroSeconds: 1500,
  pomodoroRunning: false,
  pomodoroTimerId: null
};

// Initialization on DOM Load
document.addEventListener("DOMContentLoaded", () => {
  loadStateFromLocalStorage();
  initSidebarState();
  lucide.createIcons();
  setupEventListeners();

  // If user profile exists, bypass auth screen and enter dashboard
  if (state.user) {
    showDashboardWorkspace();
  } else {
    showLandingPage();
  }
});

// ==========================================
// 1. STATE & STORAGE MANAGEMENT
// ==========================================

function loadStateFromLocalStorage() {
  const savedUser = localStorage.getItem("devpath_user");
  const savedRoadmap = localStorage.getItem("devpath_roadmap");
  const savedProgress = localStorage.getItem("devpath_progress");
  const savedChat = localStorage.getItem("devpath_chat");
  const savedApiKey = localStorage.getItem("devpath_apikey");
  const savedStreak = localStorage.getItem("devpath_streak");
  const savedLastDate = localStorage.getItem("devpath_lastdate");

  if (savedUser) state.user = JSON.parse(savedUser);
  if (savedRoadmap) state.activeRoadmap = JSON.parse(savedRoadmap);
  if (savedProgress) state.checklistProgress = JSON.parse(savedProgress);
  if (savedChat) state.chatHistory = JSON.parse(savedChat);
  if (savedApiKey) state.apiKey = savedApiKey;
  if (savedStreak) state.streakCount = parseInt(savedStreak) || 1;
  const savedStage = localStorage.getItem("devpath_academic_stage");
  if (savedStage) state.academicStage = savedStage;
  const savedTasks = localStorage.getItem("devpath_daily_tasks");
  if (savedTasks) state.dailyTasks = JSON.parse(savedTasks);
  const savedResults = localStorage.getItem("devpath_assessment_results");
  if (savedResults) state.assessmentResults = JSON.parse(savedResults);
  if (savedLastDate) state.lastActiveDate = savedLastDate;

  const savedRecs = localStorage.getItem("devpath_career_recommendations");
  const savedAnalyzerMode = localStorage.getItem("devpath_analyzer_mode");
  if (savedRecs) state.careerRecommendations = JSON.parse(savedRecs);
  if (savedAnalyzerMode) state.analyzerMode = savedAnalyzerMode;

  // Calculate study streak
  checkStreak();
}

function saveStateToLocalStorage() {
  localStorage.setItem("devpath_user", JSON.stringify(state.user));
  localStorage.setItem("devpath_roadmap", JSON.stringify(state.activeRoadmap));
  localStorage.setItem("devpath_progress", JSON.stringify(state.checklistProgress));
  localStorage.setItem("devpath_chat", JSON.stringify(state.chatHistory));
  localStorage.setItem("devpath_apikey", state.apiKey);
  localStorage.setItem("devpath_streak", state.streakCount.toString());
  localStorage.setItem("devpath_lastdate", state.lastActiveDate);
  if (state.careerRecommendations) {
    localStorage.setItem("devpath_career_recommendations", JSON.stringify(state.careerRecommendations));
  }
  localStorage.setItem("devpath_analyzer_mode", state.analyzerMode);
  localStorage.setItem("devpath_academic_stage", state.academicStage || "College");
  localStorage.setItem("devpath_daily_tasks", JSON.stringify(state.dailyTasks || []));
  if (state.assessmentResults) {
    localStorage.setItem("devpath_assessment_results", JSON.stringify(state.assessmentResults));
  }

  // Sync to registered accounts repository if active user exists
  if (state.user && state.user.email) {
    const accounts = getRegisteredAccounts();
    const emailKey = state.user.email.toLowerCase();
    const existing = accounts[emailKey] || {};
    accounts[emailKey] = {
      ...existing,
      ...state.user,
      activeRoadmap: state.activeRoadmap,
      checklistProgress: state.checklistProgress,
      chatHistory: state.chatHistory,
      streakCount: state.streakCount,
      lastActiveDate: state.lastActiveDate,
      careerRecommendations: state.careerRecommendations
    };
    saveRegisteredAccounts(accounts);

    // Sync to MongoDB / Backend database
    if (window.ApiClient) {
      if (state.activeRoadmap) {
        ApiClient.saveRoadmap(state.activeRoadmap, state.user.career, state.user.level, state.user.hours, state.user.skills).catch(() => {});
      }
      if (state.checklistProgress) {
        ApiClient.saveProgress(state.checklistProgress).catch(() => {});
      }
      if (state.chatHistory && state.chatHistory.length > 0) {
        ApiClient.saveChat(state.chatHistory).catch(() => {});
      }
      if (state.careerRecommendations) {
        ApiClient.saveRecommendations(state.careerRecommendations).catch(() => {});
      }
    }
  }
}

function checkStreak() {
  const today = new Date().toDateString();
  if (state.lastActiveDate === today) {
    return; // Already active today
  }

  if (state.lastActiveDate) {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toDateString();

    if (state.lastActiveDate === yesterdayStr) {
      state.streakCount += 1;
    } else {
      state.streakCount = 1; // Streak broken
    }
  } else {
    state.streakCount = 1; // Initial setup
  }

  state.lastActiveDate = today;
  saveStateToLocalStorage();
}

// ==========================================
// 2. AUTHENTICATION CONTROLLER (Login & Sign Up)
// ==========================================

function getRegisteredAccounts() {
  const data = localStorage.getItem("devpath_accounts");
  let accounts = {};
  if (data) {
    try {
      accounts = JSON.parse(data);
    } catch (e) {
      accounts = {};
    }
  }

  // Pre-seed demo user account if not registered yet
  if (!accounts["alex@getcareerpilot.com"]) {
    accounts["alex@getcareerpilot.com"] = {
      username: "Alex Coder",
      email: "alex@getcareerpilot.com",
      password: "password123",
      career: "frontend-developer",
      level: "intermediate",
      hours: 15,
      skills: ["HTML5", "CSS3", "JavaScript"],
      activeRoadmap: null,
      checklistProgress: {},
      chatHistory: [],
      streakCount: 3,
      createdAt: new Date().toISOString()
    };
    saveRegisteredAccounts(accounts);
  }
  return accounts;
}

function saveRegisteredAccounts(accounts) {
  localStorage.setItem("devpath_accounts", JSON.stringify(accounts));
}

function setAuthMode(mode) {
  state.authMode = mode;
  const loginTab = document.getElementById("tab-login-btn");
  const signupTab = document.getElementById("tab-signup-btn");
  const nameGroup = document.getElementById("auth-name-group");
  const usernameInput = document.getElementById("auth-username");
  const submitBtn = document.getElementById("auth-submit-btn");
  const switchText = document.getElementById("auth-switch-text");
  const subtitle = document.getElementById("auth-subtitle");

  if (mode === "signup") {
    if (loginTab) loginTab.classList.remove("active");
    if (signupTab) signupTab.classList.add("active");
    if (nameGroup) nameGroup.style.display = "block";
    const stageGroup = document.getElementById("auth-stage-group");
    if (stageGroup) stageGroup.style.display = "block";
    if (usernameInput) usernameInput.setAttribute("required", "required");
    if (submitBtn) submitBtn.innerHTML = `<i data-lucide="user-plus"></i> Create AI Profile`;
    if (switchText) switchText.innerHTML = `Already have an account? <a href="javascript:void(0)" onclick="setAuthMode('login')" style="color: var(--color-teal); font-weight: 600;">Sign In</a>`;
    if (subtitle) subtitle.innerText = "Create your account to unlock AI career roadmaps";
  } else {
    // Login mode
    if (signupTab) signupTab.classList.remove("active");
    if (loginTab) loginTab.classList.add("active");
    if (nameGroup) nameGroup.style.display = "none";
    const stageGroup = document.getElementById("auth-stage-group");
    if (stageGroup) stageGroup.style.display = "none";
    if (usernameInput) usernameInput.removeAttribute("required");
    if (submitBtn) submitBtn.innerHTML = `<i data-lucide="log-in"></i> Sign In to Account`;
    if (switchText) switchText.innerHTML = `Don't have an account? <a href="javascript:void(0)" onclick="setAuthMode('signup')" style="color: var(--color-teal); font-weight: 600;">Create Account</a>`;
    if (subtitle) subtitle.innerText = "Welcome back! Sign in to continue your career journey";
  }

  if (window.lucide) window.lucide.createIcons();
}

function fillDemoCredentials() {
  setAuthMode("login");
  const emailInput = document.getElementById("auth-email");
  const passwordInput = document.getElementById("auth-password");
  if (emailInput) emailInput.value = "alex@getcareerpilot.com";
  if (passwordInput) passwordInput.value = "password123";
  showToast("Demo credentials loaded (alex@getcareerpilot.com). Click Sign In!", "info");
}

const careerMapping = {
  "frontend-developer": "Frontend Developer",
  "backend-developer": "Backend Developer",
  "fullstack-developer": "Fullstack Developer",
  "ai-ml-engineer": "AI / ML Engineer",
  "data-scientist": "Data Scientist & AI Analyst",
  "product-manager": "Product Manager",
  "ui-ux-designer": "UI/UX & Product Designer",
  "financial-analyst": "Financial Analyst & Specialist",
  "digital-marketer": "Digital Marketing Strategist",
  "biomedical-scientist": "Biomedical & Healthcare Scientist",
  "mechanical-engineer": "Mechanical Systems Engineer",
  "corporate-lawyer": "Corporate Legal & Compliance Specialist",
  "cybersecurity-analyst": "Cybersecurity & SOC Analyst"
};

function formatCareerTitle(careerKey) {
  if (!careerKey) return "Software Developer";
  if (careerMapping[careerKey]) return careerMapping[careerKey];
  return careerKey.split(/[-_ ]+/).map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
}

// ==========================================
// 1.5 SIDEBAR TOGGLE & MINIMIZE CONTROLLER
// ==========================================

function toggleSidebar(forceState) {
  const sidebar = document.getElementById("app-sidebar") || document.querySelector(".sidebar");
  const workspace = document.getElementById("app-workspace");
  if (!sidebar) return;

  const isCurrentlyCollapsed = sidebar.classList.contains("collapsed");
  const shouldCollapse = forceState !== undefined ? forceState : !isCurrentlyCollapsed;

  if (shouldCollapse) {
    sidebar.classList.add("collapsed");
    if (workspace) workspace.classList.add("sidebar-collapsed");
    localStorage.setItem("devpath_sidebar_collapsed", "true");
    const collapseBtn = document.getElementById("sidebar-collapse-btn");
    if (collapseBtn) collapseBtn.setAttribute("title", "Expand Sidebar (Ctrl+B)");
    const toggleHeaderBtn = document.getElementById("sidebar-toggle-header-btn");
    if (toggleHeaderBtn) toggleHeaderBtn.setAttribute("title", "Expand Sidebar (Ctrl+B)");
  } else {
    sidebar.classList.remove("collapsed");
    if (workspace) workspace.classList.remove("sidebar-collapsed");
    localStorage.setItem("devpath_sidebar_collapsed", "false");
    const collapseBtn = document.getElementById("sidebar-collapse-btn");
    if (collapseBtn) collapseBtn.setAttribute("title", "Minimize Sidebar (Ctrl+B)");
    const toggleHeaderBtn = document.getElementById("sidebar-toggle-header-btn");
    if (toggleHeaderBtn) toggleHeaderBtn.setAttribute("title", "Minimize Sidebar (Ctrl+B)");
  }

  if (window.lucide) {
    lucide.createIcons();
  }
}

function initSidebarState() {
  const saved = localStorage.getItem("devpath_sidebar_collapsed");
  if (saved === "true") {
    toggleSidebar(true);
  }
}

function showAuthScreen() {
  const landing = document.getElementById("landing-view");
  const auth = document.getElementById("auth-view");
  const workspace = document.getElementById("app-workspace");
  if (landing) landing.style.display = "none";
  if (auth) auth.style.display = "flex";
  if (workspace) workspace.style.display = "none";
  window.scrollTo({ top: 0, behavior: "smooth" });
  setAuthMode(state.authMode || "login");
  checkDbStatus();

  // Restore remembered email if available
  const lastEmail = localStorage.getItem("devpath_last_email");
  const emailInput = document.getElementById("auth-email");
  if (lastEmail && emailInput && !emailInput.value) {
    emailInput.value = lastEmail;
  }
  if (window.lucide) window.lucide.createIcons();
}

async function checkDbStatus() {
  const pill = document.getElementById("db-status-pill");
  const dot = document.getElementById("db-status-dot");
  const text = document.getElementById("db-status-text");
  if (!pill || !window.ApiClient) return;

  try {
    const res = await ApiClient.checkStatus();
    if (res.database === "supabase" || res.supabaseTableReady || res.supabaseConnected) {
      if (dot) {
        dot.style.background = "var(--color-teal)";
        dot.style.boxShadow = "0 0 10px var(--color-teal)";
      }
      if (text) text.innerText = "Supabase Database Connected 🟢";
      pill.style.borderColor = "rgba(45, 212, 191, 0.4)";
      pill.style.background = "rgba(45, 212, 191, 0.08)";
    } else if (res.mongodbConnected) {
      if (dot) {
        dot.style.background = "var(--color-teal)";
        dot.style.boxShadow = "0 0 10px var(--color-teal)";
      }
      if (text) text.innerText = "MongoDB Connected 🟢";
      pill.style.borderColor = "rgba(45, 212, 191, 0.4)";
    } else if (res.database === "local_store") {
      if (dot) {
        dot.style.background = "var(--color-indigo)";
        dot.style.boxShadow = "0 0 10px var(--color-indigo)";
      }
      if (text) text.innerText = "Database Active (Local Store) 🟣";
      pill.style.borderColor = "rgba(99, 102, 241, 0.4)";
    } else {
      if (dot) {
        dot.style.background = "var(--color-pink)";
        dot.style.boxShadow = "0 0 10px var(--color-pink)";
      }
      if (text) text.innerText = "Offline Mode 🟡";
    }
  } catch (e) {
    if (dot) {
      dot.style.background = "var(--color-pink)";
      dot.style.boxShadow = "0 0 10px var(--color-pink)";
    }
    if (text) text.innerText = "Offline Mode 🟡";
  }
}

function toggleAuthPasswordVisibility() {
  const input = document.getElementById("auth-password");
  const icon = document.getElementById("auth-password-eye");
  if (!input) return;
  if (input.type === "password") {
    input.type = "text";
    if (icon) icon.setAttribute("data-lucide", "eye-off");
  } else {
    input.type = "password";
    if (icon) icon.setAttribute("data-lucide", "eye");
  }
  if (window.lucide) window.lucide.createIcons();
}

function showDashboardWorkspace() {
  const landing = document.getElementById("landing-view");
  const auth = document.getElementById("auth-view");
  const workspace = document.getElementById("app-workspace");
  if (landing) landing.style.display = "none";
  if (auth) auth.style.display = "none";
  if (workspace) workspace.style.display = "flex";
  window.scrollTo({ top: 0, behavior: "smooth" });
  
  // Restore persisted sidebar minimize preference
  initSidebarState();

  // Render user profile details in sidebar
  if (state.user) {
    const userDisplayName = document.getElementById("user-display-name");
    const userAvatar = document.getElementById("user-avatar");
    const userDisplayCareer = document.getElementById("user-display-career");
    if (userDisplayName) userDisplayName.innerText = state.user.username || "Student";
    if (userAvatar) userAvatar.innerText = (state.user.username || "JD").split(" ").map(n => n[0]).join("").toUpperCase();
    if (userDisplayCareer) userDisplayCareer.innerText = formatCareerTitle(state.user.career || "frontend-developer");
  }

  // If active roadmap is present, render generator container
  if (state.activeRoadmap) {
    const roadmapContainer = document.getElementById("roadmap-output-container");
    if (roadmapContainer) {
      roadmapContainer.style.display = "grid";
      renderActiveRoadmap();
    }
  }

  // Initial tab render
  switchTab("dashboard");
  if (window.lucide) window.lucide.createIcons();
}

async function handleAuth() {
  const emailInput = document.getElementById("auth-email");
  const passwordInput = document.getElementById("auth-password");
  const email = emailInput ? emailInput.value.trim().toLowerCase() : "";
  const password = passwordInput ? passwordInput.value.trim() : "";

  if (!email || !password) {
    showToast("Please enter both email and password.", "warning");
    return;
  }

  // Remember email preference
  const rememberCheckbox = document.getElementById("auth-remember-me");
  if (rememberCheckbox && rememberCheckbox.checked) {
    localStorage.setItem("devpath_last_email", email);
  } else {
    localStorage.removeItem("devpath_last_email");
  }

  if (state.authMode === "signup") {
    const usernameInput = document.getElementById("auth-username");
    const username = usernameInput ? usernameInput.value.trim() : "";
    const stageSelect = document.getElementById("auth-stage");
    const stage = stageSelect ? stageSelect.value : (state.academicStage || "Class 10");

    if (!username) {
      showToast("Please enter your profile name.", "warning");
      return;
    }

    if (password.length < 4) {
      showToast("Password must be at least 4 characters long.", "warning");
      return;
    }

    try {
      let user = null;
      if (window.ApiClient) {
        const res = await ApiClient.signup(username, email, password);
        user = res.user;
      } else {
        const accounts = getRegisteredAccounts();
        if (accounts[email]) {
          showToast("An account with this email already exists. Please Sign In.", "warning");
          setAuthMode("login");
          if (emailInput) emailInput.value = email;
          return;
        }
        const newAccount = {
          username: username,
          email: email,
          password: password,
          career: "frontend-developer",
          level: "intermediate",
          hours: 15,
          skills: [],
          activeRoadmap: null,
          checklistProgress: {},
          chatHistory: [],
          streakCount: 1,
          lastActiveDate: new Date().toDateString(),
          createdAt: new Date().toISOString()
        };
        accounts[email] = newAccount;
        saveRegisteredAccounts(accounts);
        user = newAccount;
      }

      state.user = {
        username: user.username,
        email: user.email,
        career: user.career || "frontend-developer",
        stage: stage,
        level: user.level || "intermediate",
        hours: user.hours || 15,
        skills: user.skills || []
      };
      state.academicStage = stage;
      state.activeRoadmap = null;
      state.checklistProgress = {};
      state.chatHistory = [];
      state.streakCount = 1;
      state.lastActiveDate = new Date().toDateString();

      wizardState.selectedCareer = state.user.career;
      wizardState.skillsList = [...(state.user.skills || [])];

      saveStateToLocalStorage();
      showToast(`Welcome to GetCareerPilot, ${username}! Profile created.`, "success");
      if (typeof onStageChange === "function") onStageChange(stage);
      showDashboardWorkspace();
    } catch (err) {
      if (err.message && err.message.includes("already exists")) {
        showToast(err.message, "warning");
        setAuthMode("login");
        if (emailInput) emailInput.value = email;
      } else {
        showToast(err.message || "Signup failed. Please try again.", "error");
      }
    }
  } else {
    // Login flow
    try {
      let u = null;
      if (window.ApiClient) {
        const res = await ApiClient.login(email, password);
        u = res.user;
      } else {
        const accounts = getRegisteredAccounts();
        const account = accounts[email];
        if (!account) {
          throw new Error("No account found for this email. Click 'Create Account' to sign up.");
        }
        if (account.password !== password) {
          throw new Error("Incorrect password. Please try again.");
        }
        u = account;
      }

      state.user = {
        username: u.username,
        email: u.email,
        career: u.career || "frontend-developer",
        stage: u.stage || state.academicStage || "Class 10",
        level: u.level || "intermediate",
        hours: u.hours || 15,
        skills: u.skills || []
      };
      state.academicStage = state.user.stage;
      state.activeRoadmap = u.activeRoadmap || null;
      state.checklistProgress = u.checklistProgress || {};
      state.chatHistory = u.chatHistory || [];
      state.streakCount = u.streakCount || 1;
      state.lastActiveDate = u.lastActiveDate || "";
      state.careerRecommendations = u.careerRecommendations || null;
      if (u.apiKey) state.apiKey = u.apiKey;

      wizardState.selectedCareer = state.user.career;
      wizardState.skillsList = [...state.user.skills];

      saveStateToLocalStorage();
      showToast(`Welcome back, ${u.username}! Signed in successfully.`, "success");
      if (typeof onStageChange === "function") onStageChange(state.academicStage);
      showDashboardWorkspace();
    } catch (err) {
      showToast(err.message || "Login failed. Please try again.", "error");
    }
  }
}

async function showDemoLogin() {
  const emailInput = document.getElementById("auth-email");
  const passwordInput = document.getElementById("auth-password");
  if (emailInput) emailInput.value = "alex@getcareerpilot.com";
  if (passwordInput) passwordInput.value = "password123";

  if (window.ApiClient) {
    try {
      const res = await ApiClient.login("alex@getcareerpilot.com", "password123");
      const u = res.user;
      state.user = {
        username: u.username,
        email: u.email,
        career: u.career || "frontend-developer",
        level: u.level || "intermediate",
        hours: u.hours || 15,
        skills: u.skills || []
      };
      state.activeRoadmap = u.activeRoadmap || null;
      state.checklistProgress = u.checklistProgress || {};
      state.chatHistory = u.chatHistory || [];
      state.streakCount = u.streakCount || 3;
      wizardState.selectedCareer = state.user.career;
      wizardState.skillsList = [...state.user.skills];

      saveStateToLocalStorage();
      showToast("Demo profile loaded from database!", "success");
      showDashboardWorkspace();
      return;
    } catch (e) {
      console.warn("API demo login fallback:", e.message);
    }
  }

  const accounts = getRegisteredAccounts();
  const demo = accounts["alex@getcareerpilot.com"];
  if (demo) {
    state.user = {
      username: demo.username,
      email: demo.email,
      career: demo.career,
      level: demo.level,
      hours: demo.hours,
      skills: demo.skills
    };
    state.activeRoadmap = demo.activeRoadmap;
    state.checklistProgress = demo.checklistProgress || {};
    state.chatHistory = demo.chatHistory || [];
    state.streakCount = demo.streakCount || 3;
  } else {
    state.user = {
      username: "Alex Coder",
      email: "alex@getcareerpilot.com",
      career: "frontend-developer",
      level: "intermediate",
      hours: 15,
      skills: ["HTML5", "CSS3", "JavaScript"]
    };
  }
  
  wizardState.selectedCareer = state.user.career;
  wizardState.skillsList = [...state.user.skills];

  saveStateToLocalStorage();
  showToast("Demo profile loaded successfully!", "success");
  showDashboardWorkspace();
}

function logout() {
  if (state.user && state.user.email) {
    saveStateToLocalStorage();
  }

  if (window.ApiClient) {
    ApiClient.logout();
  }

  state.user = null;
  state.activeRoadmap = null;
  state.checklistProgress = {};
  state.chatHistory = [];
  state.streakCount = 1;
  state.lastActiveDate = "";
  state.careerRecommendations = null;
  
  localStorage.removeItem("devpath_user");
  localStorage.removeItem("devpath_roadmap");
  localStorage.removeItem("devpath_progress");
  localStorage.removeItem("devpath_chat");
  localStorage.removeItem("devpath_career_recommendations");
  
  // Reset roadmap output container
  const roadmapContainer = document.getElementById("roadmap-output-container");
  if (roadmapContainer) roadmapContainer.style.display = "none";

  // Reset chat window
  const chatWindow = document.getElementById("chat-messages-window");
  if (chatWindow) chatWindow.innerHTML = "";

  showToast("Logged out successfully.", "info");
  showAuthScreen();
}

// ==========================================
// 3. PAGE VIEW / TAB SWITCHER
// ==========================================

const viewData = {
  dashboard: { title: "Dashboard Overview", subtitle: "Track progress, tasks, streaks, and gaps" },
  assessment: { title: "Aptitude Assessment (RIASEC)", subtitle: "10-question scientific interest profiling based on John Holland's framework" },
  explorer: { title: "Universal Career Explorer", subtitle: "Explore 36 specialized career pathways across 12 modern sectors" },
  "stream-guide": { title: "Class 10 Stream Selection Guide", subtitle: "Compare Science PCM/PCB, Commerce, Humanities, and Vocational options" },
  "college-explorer": { title: "Degree & College Explorer", subtitle: "25+ undergraduate programs, national entrance exams, and verified scholarships" },
  colleges: { title: "Degree & College Explorer", subtitle: "25+ undergraduate programs, national entrance exams, and verified scholarships" },
  "mock-interview": { title: "AI Mock Interview Practice", subtitle: "Practice real interview questions across 12 sectors with real-time AI scoring" },
  planner: { title: "Daily Learning Planner & Habit Tracker", subtitle: "Organize daily study priorities, Pomodoro focus sessions, and build streaks" },
  advisor: { title: "AI Career Advisor", subtitle: "Synthesize tailored 2026 tech career directions with Gemini Flash" },
  generator: { title: "AI Roadmap Builder", subtitle: "Define goals and build custom learning tracks" },
  analyzer: { title: "Skill Gap & Resume Analyzer", subtitle: "Audit resume text against target job descriptions" },
  resume: { title: "Skill Gap & Resume Analyzer", subtitle: "Audit resume text against target job descriptions" },
  mentor: { title: "AI Mentor Chat", subtitle: "Get dynamic guidance on frameworks, code, or interviews" },
  tracker: { title: "Tracker & Job Matchmaker", subtitle: "Manage milestone checkpoints and matching job postings" },
  settings: { title: "System Configuration", subtitle: "Profile parameters, API keys, and cache options" }
};

function switchTab(tabName) {
  // Support tab aliases
  if (tabName === "colleges") tabName = "college-explorer";
  if (tabName === "resume") tabName = "analyzer";

  // Hide all tab views
  const views = document.querySelectorAll(".tab-view");
  views.forEach(v => v.classList.remove("active"));

  // Deactivate sidebar options
  const sidebarItems = document.querySelectorAll(".sidebar-item");
  sidebarItems.forEach(item => item.classList.remove("active"));

  // Show active view and highlight menu
  const activeView = document.getElementById(`tab-${tabName}`);
  if (activeView) activeView.classList.add("active");

  const activeNav = document.getElementById(`nav-${tabName}`);
  if (activeNav) activeNav.classList.add("active");

  // Update Header Text
  if (viewData[tabName]) {
    document.getElementById("view-title").innerText = viewData[tabName].title;
    document.getElementById("view-subtitle").innerText = viewData[tabName].subtitle;
  }

  // Trigger tab-specific render sequences
  if (tabName === "dashboard") renderDashboard();
  if (tabName === "assessment" && typeof renderAssessment === "function") renderAssessment();
  if (tabName === "explorer" && typeof renderCareerExplorer === "function") renderCareerExplorer();
  if (tabName === "stream-guide" && typeof renderStreamGuide === "function") renderStreamGuide();
  if (tabName === "college-explorer" && typeof renderCollegeExplorer === "function") renderCollegeExplorer();
  if (tabName === "mock-interview" && typeof renderMockInterview === "function") renderMockInterview();
  if (tabName === "planner" && typeof renderDailyPlanner === "function") renderDailyPlanner();
  if (tabName === "advisor") renderAdvisor();
  if (tabName === "generator") renderGenerator();
  if (tabName === "analyzer") renderAnalyzer();
  if (tabName === "mentor") renderChat();
  if (tabName === "tracker") renderTracker();
  if (tabName === "settings") renderSettings();

  // Re-run Lucide Icons to make sure newly injected icons look crisp
  lucide.createIcons();
}

// ==========================================
// 3.B. AI CAREER ADVISOR & RECOMMENDATIONS
// ==========================================

function renderAdvisor() {
  const skillsInput = document.getElementById("advisor-skills");
  if (skillsInput && !skillsInput.value && state.user && state.user.skills && state.user.skills.length) {
    skillsInput.value = state.user.skills.join(", ");
  }

  // Set active interest chips
  const chips = document.querySelectorAll("#advisor-interest-chips .interest-chip");
  chips.forEach(chip => {
    const text = chip.innerText.trim();
    if (state.selectedInterests.some(interest => text.includes(interest) || interest.includes(text))) {
      chip.classList.add("selected");
    }
  });

  if (state.careerRecommendations) {
    renderCareerRecommendations(state.careerRecommendations);
  }
  lucide.createIcons();
}

function toggleInterestChip(element, interestName) {
  element.classList.toggle("selected");
  if (element.classList.contains("selected")) {
    if (!state.selectedInterests.includes(interestName)) {
      state.selectedInterests.push(interestName);
    }
  } else {
    state.selectedInterests = state.selectedInterests.filter(i => i !== interestName);
  }
}


function loadAdvisorDemoProfile(field = 'tech') {
  const bgInput = document.getElementById("advisor-background");
  const skillsInput = document.getElementById("advisor-skills");
  const ambitionSelect = document.getElementById("advisor-ambition");
  const levelSelect = document.getElementById("advisor-level");

  if (levelSelect) levelSelect.value = "intermediate";

  if (field === 'school-stream') {
    if (bgInput) bgInput.value = "Class 10 High School Student (CBSE/ICSE)";
    if (skillsInput) skillsInput.value = "Mathematics, Physics, Logical Reasoning, Creative Writing, Scratch Programming";
    if (ambitionSelect) ambitionSelect.value = "High-growth tech, AI innovations & software development";
    state.selectedInterests = ["Software & Artificial Intelligence", "Engineering & Core Systems"];
    showToast("Loaded Class 10 (Stream Selection) profile!", "info");
  } else if (field === 'higher-neet-med') {
    if (bgInput) bgInput.value = "Class 12 Science PCB (NEET Aspirant)";
    if (skillsInput) skillsInput.value = "Human Physiology, Organic Chemistry, Botany, Genetics, Clinical Curiosity";
    if (ambitionSelect) ambitionSelect.value = "Healthcare, biomedical sciences & clinical practice";
    state.selectedInterests = ["Healthcare & Biomedical Sciences", "Data Science & Analytics"];
    showToast("Loaded Class 12 Medical / NEET profile!", "info");
  } else if (field === 'higher-law') {
    if (bgInput) bgInput.value = "Class 12 Humanities / Commerce (CLAT Aspirant)";
    if (skillsInput) skillsInput.value = "Legal Reasoning, Constitutional Awareness, Debate, Critical Reading, Current Affairs";
    if (ambitionSelect) ambitionSelect.value = "Law, corporate governance, civil services & public policy";
    state.selectedInterests = ["Law, Legal Studies & Public Policy", "Product & Business Management"];
    showToast("Loaded Class 12 Law / CLAT profile!", "info");
  } else if (field === 'higher-cuet-commerce') {
    if (bgInput) bgInput.value = "Class 12 Commerce with Mathematics (CUET Aspirant)";
    if (skillsInput) skillsInput.value = "Accountancy, Business Studies, Microeconomics, Calculus, Statistics";
    if (ambitionSelect) ambitionSelect.value = "Finance, investment banking, valuation & wealth advisory";
    state.selectedInterests = ["Finance & Investment Banking", "Product & Business Management"];
    showToast("Loaded Class 12 Commerce / CUET profile!", "info");
  } else if (field === 'gov') {
    if (bgInput) bgInput.value = "Undergraduate Degree in Humanities / Social Sciences / Engineering";
    if (skillsInput) skillsInput.value = "Indian Polity, Public Administration, Essay Writing, Ethics, Socio-Economic Policy";
    if (ambitionSelect) ambitionSelect.value = "Law, corporate governance, civil services & public policy";
    state.selectedInterests = ["Civil Services & Public Administration", "Law, Legal Studies & Public Policy"];
    showToast("Loaded Civil Services / UPSC sample profile!", "info");
  } else if (field === 'defense') {
    if (bgInput) bgInput.value = "Class 12 Science PCM / NDA Aspirant";
    if (skillsInput) skillsInput.value = "Aerodynamics Basics, Physical Fitness, Navigation, Leadership, Mental Agility";
    if (ambitionSelect) ambitionSelect.value = "Core engineering, manufacturing, robotics & physical systems";
    state.selectedInterests = ["Aviation & Defense Services", "Engineering & Core Systems"];
    showToast("Loaded Aviation & Defense sample profile!", "info");
  } else if (field === 'finance') {
    if (bgInput) bgInput.value = "B.Com in Accounting & Financial Management";
    if (skillsInput) skillsInput.value = "Financial Modeling, Advanced Excel, Valuation, Ratio Analysis, Accounting Principles";
    if (ambitionSelect) ambitionSelect.value = "Finance, investment banking, valuation & wealth advisory";
    state.selectedInterests = ["Finance & Investment Banking", "Data Science & Analytics"];
    showToast("Loaded Finance & Commerce sample profile!", "info");
  } else if (field === 'business') {
    if (bgInput) bgInput.value = "BBA / Bachelor in Business Management";
    if (skillsInput) skillsInput.value = "Product Strategy, Agile, Market Research, Jira, PRD Writing, Communication";
    if (ambitionSelect) ambitionSelect.value = "Corporate leadership, product management & business strategy";
    state.selectedInterests = ["Product & Business Management", "Marketing, SEO & Content Strategy"];
    showToast("Loaded Business & Product Management sample profile!", "info");
  } else if (field === 'design') {
    if (bgInput) bgInput.value = "B.Des in Visual Communication / Self-Taught UI Designer";
    if (skillsInput) skillsInput.value = "Figma, Wireframing, User Research, Prototyping, Typography, Adobe XD";
    if (ambitionSelect) ambitionSelect.value = "Creative design, media, UI/UX & digital arts";
    state.selectedInterests = ["UI/UX & Visual Design", "Product & Business Management"];
    showToast("Loaded UI/UX & Creative Arts sample profile!", "info");
  } else if (field === 'healthcare') {
    if (bgInput) bgInput.value = "B.Sc in Biotechnology / Pre-Med Student";
    if (skillsInput) skillsInput.value = "Molecular Biology, PCR, Clinical Protocols, Biostatistics, Laboratory Safety";
    if (ambitionSelect) ambitionSelect.value = "Healthcare, biomedical sciences & clinical practice";
    state.selectedInterests = ["Healthcare & Biomedical Sciences", "Data Science & Analytics"];
    showToast("Loaded Healthcare & Biomedical sample profile!", "info");
  } else {
    // Tech & AI (default)
    if (bgInput) bgInput.value = "B.Tech in Computer Science & Engineering (3rd Year)";
    if (skillsInput) skillsInput.value = "Python, JavaScript, HTML5/CSS3, Git, SQL, Basics of Machine Learning";
    if (ambitionSelect) ambitionSelect.value = "High-growth tech, AI innovations & software development";
    state.selectedInterests = ["Software & Artificial Intelligence", "Data Science & Analytics"];
    showToast("Loaded Tech & AI student profile!", "info");
  }

  // Update interest chips UI
  const chips = document.querySelectorAll("#advisor-interest-chips .interest-chip");
  chips.forEach(chip => {
    const text = chip.innerText.trim();
    const isSelected = state.selectedInterests && state.selectedInterests.some(sel => text.includes(sel.split(" ")[0]) || sel.includes(text.split(" ")[0]));
    if (isSelected) {
      chip.classList.add("selected");
    } else {
      chip.classList.remove("selected");
    }
  });
}


async function generateCareerRecommendations() {
  const background = document.getElementById("advisor-background").value.trim();
  const skillsStr = document.getElementById("advisor-skills").value.trim();
  const ambition = document.getElementById("advisor-ambition").value;
  const level = document.getElementById("advisor-level").value;

  if (!background) {
    showToast("Please specify your background or education.", "info");
    return;
  }

  const currentSkills = skillsStr ? skillsStr.split(",").map(s => s.trim()).filter(Boolean) : [];
  const profile = {
    background: background,
    currentSkills: currentSkills,
    interests: state.selectedInterests,
    workPreference: ambition,
    experienceLevel: level
  };

  const loader = document.getElementById("advisor-loading");
  const resultsContainer = document.getElementById("advisor-results-container");
  const btn = document.getElementById("btn-generate-advisor");

  loader.style.display = "block";
  resultsContainer.style.display = "none";
  btn.disabled = true;

  try {
    const result = await AIService.generateCareerRecommendations(profile, state.apiKey);
    state.careerRecommendations = result;
    saveStateToLocalStorage();
    renderCareerRecommendations(result);
    resultsContainer.style.display = "block";
    resultsContainer.scrollIntoView({ behavior: "smooth" });
    showToast("Personalized career recommendations generated!", "success");
  } catch (err) {
    console.error("Career Recommendations error:", err);
    showToast(`Generation failed: ${err.message}`, "error");
  } finally {
    loader.style.display = "none";
    btn.disabled = false;
    lucide.createIcons();
  }
}

function renderCareerRecommendations(data) {
  const container = document.getElementById("advisor-results-container");
  const summaryText = document.getElementById("advisor-summary-text");
  const cardsGrid = document.getElementById("advisor-cards-grid");

  if (!data || !data.recommendations || data.recommendations.length === 0) {
    container.style.display = "none";
    return;
  }

  container.style.display = "block";
  summaryText.innerText = data.summary || "Based on your technical profile and engineering passions, here are your top 2026 career trajectories:";
  cardsGrid.innerHTML = "";

  data.recommendations.forEach(rec => {
    const card = document.createElement("div");
    card.className = "recommendation-card";

    const strengthsHTML = (rec.strengthsYouHave || []).map(s => 
      `<span class="tag" style="background: rgba(20, 184, 166, 0.12); color: var(--color-teal); border-color: rgba(20, 184, 166, 0.3); font-size: 11px;">✓ ${s}</span>`
    ).join(" ");

    const skillsToAcquireHTML = (rec.skillsToAcquire || []).map(s => 
      `<span class="tag" style="background: rgba(236, 72, 153, 0.1); color: var(--color-pink); border-color: rgba(236, 72, 153, 0.3); font-size: 11px;">+ ${s}</span>`
    ).join(" ");

    const techHTML = (rec.keyTechnologies || []).map(t => 
      `<span class="tag" style="font-size: 10px; padding: 2px 8px;">${t}</span>`
    ).join(" ");

    card.innerHTML = `
      <div>
        <div class="rec-header">
          <span class="ai-badge">${rec.badge || 'Recommended Track'}</span>
          <span class="rec-match-score">${rec.matchScore}% Match</span>
        </div>

        <h4 class="rec-title">${rec.title}</h4>

        <div class="rec-meta-row">
          <span class="rec-meta-item"><i data-lucide="dollar-sign" style="width: 13px; height: 13px; color: var(--color-teal);"></i> ${rec.salaryRange}</span>
          <span class="rec-meta-item"><i data-lucide="trending-up" style="width: 13px; height: 13px; color: var(--color-indigo);"></i> ${rec.marketDemand}</span>
        </div>

        <p class="rec-rationale">${rec.fitRationale}</p>

        <div class="rec-skills-sect">
          <div class="rec-skills-label">Transferable Strengths You Have</div>
          <div style="display: flex; flex-wrap: wrap; gap: 6px; margin-bottom: 10px;">${strengthsHTML || '<span style="font-size: 11px; color: var(--text-muted);">Core analytical foundations</span>'}</div>

          <div class="rec-skills-label">Skills to Master (Upskilling Gap)</div>
          <div style="display: flex; flex-wrap: wrap; gap: 6px; margin-bottom: 12px;">${skillsToAcquireHTML}</div>

          <div class="rec-skills-label">Core Tech Stack</div>
          <div style="display: flex; flex-wrap: wrap; gap: 5px;">${techHTML}</div>
        </div>

        <div style="background: rgba(255, 255, 255, 0.02); border-left: 2px solid var(--color-teal); padding: 8px 12px; border-radius: 0 8px 8px 0; margin-bottom: 18px;">
          <span style="font-size: 11px; font-weight: 700; color: var(--color-teal); text-transform: uppercase;">Next Milestone:</span>
          <p style="font-size: 12px; color: var(--text-secondary); margin-top: 2px;">${rec.recommendedFirstStep || 'Build a capstone project targeting this stack.'}</p>
        </div>
      </div>

      <button class="btn btn-pink" onclick="adoptCareerRecommendation('${rec.id}', '${rec.title}')" style="width: 100%; padding: 10px 16px; font-size: 13px;">
        Adopt Career & Build Roadmap <i data-lucide="arrow-right"></i>
      </button>
    `;

    cardsGrid.appendChild(card);
  });

  lucide.createIcons();
}

function adoptCareerRecommendation(careerKey, title) {
  if (!state.user) {
    state.user = {
      username: "Aspiring Engineer",
      email: "user@getcareerpilot.com",
      career: careerKey,
      level: "intermediate",
      hours: 15,
      skills: []
    };
  } else {
    state.user.career = careerKey;
  }

  saveStateToLocalStorage();
  showToast(`Selected "${title}"! Opening Roadmap Builder...`, "success");

  careerMapping[careerKey] = title;
  switchTab("generator");
  selectCareer(careerKey);

  setTimeout(() => {
    nextStep(2);
  }, 400);
}

// ==========================================
// 4. ROADMAP WIZARD GENERATOR
// ==========================================

let wizardState = {
  currentStep: 1,
  selectedCareer: "frontend-developer",
  skillsList: []
};

function renderGenerator() {
  wizardState.currentStep = 1;
  nextStep(1); // Reset to first step on reload

  // Load career options selection
  if (state.user && state.user.career) {
    selectCareer(state.user.career);
  }

  // Populate dynamic suggestions based on career
  populateSuggestions();

  // If roadmap is already generated and saved, display it
  if (state.activeRoadmap) {
    document.getElementById("roadmap-output-container").style.display = "grid";
    renderActiveRoadmap();
  } else {
    document.getElementById("roadmap-output-container").style.display = "none";
  }
}

function nextStep(stepNum) {
  const steps = [1, 2, 3];
  steps.forEach(s => {
    const el = document.getElementById(`generator-step-${s}`);
    const dot = document.getElementById(`step-dot-${s}`);
    
    if (s === stepNum) {
      el.classList.add("active");
      dot.className = "indicator-dot active";
    } else {
      el.classList.remove("active");
      dot.className = s < stepNum ? "indicator-dot completed" : "indicator-dot";
    }
  });

  wizardState.currentStep = stepNum;

  if (stepNum === 2) {
    // Sync skills from user state on first access
    if (wizardState.skillsList.length === 0 && state.user && state.user.skills) {
      wizardState.skillsList = [...state.user.skills];
      renderSkillTags();
    }
    populateSuggestions();
  }
}


function filterCareerCards(domain, btn) {
  const pills = document.querySelectorAll(".domain-pill");
  pills.forEach(p => p.classList.remove("active"));
  if (btn) btn.classList.add("active");

  const cards = document.querySelectorAll("#career-selector-grid .career-option");
  cards.forEach(card => {
    const cardDomain = card.getAttribute("data-domain");
    if (domain === "all" || cardDomain === domain) {
      card.style.display = "flex";
    } else {
      card.style.display = "none";
    }
  });
}

function applyCustomCareer() {
  const input = document.getElementById("custom-career-input");
  if (!input || !input.value.trim()) {
    showToast("Please enter a career title or field name", "info");
    return;
  }
  const rawTitle = input.value.trim();
  const slug = rawTitle.toLowerCase().replace(/[^a-z0-9]+/g, "-");
  
  wizardState.selectedCareer = slug;
  careerMapping[slug] = rawTitle;

  // Unselect predefined cards
  document.querySelectorAll(".career-option").forEach(opt => opt.classList.remove("selected"));

  // Highlight custom box
  const customBox = document.getElementById("custom-career-box");
  if (customBox) {
    customBox.style.borderColor = "var(--color-teal)";
    customBox.style.background = "rgba(45, 212, 191, 0.12)";
  }

  showToast(`Target career set to "${rawTitle}"! Click Continue to pick skills.`, "success");
}

function selectCareer(careerKey) {
  wizardState.selectedCareer = careerKey;
  
  // Highlight card UI
  const careerOptions = document.querySelectorAll(".career-option");
  careerOptions.forEach(opt => {
    opt.classList.remove("selected");
  });

  const selectedOpt = Array.from(careerOptions).find(opt => 
    opt.getAttribute("onclick").includes(careerKey)
  );
  if (selectedOpt) selectedOpt.classList.add("selected");
}

function setupEventListeners() {
  setupDragAndDrop();

  // Global Keyboard Shortcuts (Ctrl+B or Cmd+B to toggle sidebar)
  window.addEventListener("keydown", (e) => {
    if ((e.ctrlKey || e.metaKey) && (e.key === "b" || e.key === "B")) {
      const activeEl = document.activeElement;
      const tag = activeEl ? activeEl.tagName.toLowerCase() : "";
      if (tag === "input" || tag === "textarea" || (activeEl && activeEl.isContentEditable)) {
        return; // Don't intercept while typing in forms
      }
      e.preventDefault();
      toggleSidebar();
    }
  });

  // Skill tags input enter trigger
  const skillField = document.getElementById("skills-input-text");
  if (skillField) {
    skillField.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        const value = skillField.value.trim();
        if (value) {
          addSkillTag(value);
          skillField.value = "";
        }
      }
    });
  }
}

function addSkillTag(tagText) {
  const formatted = tagText.trim();
  if (formatted && !wizardState.skillsList.includes(formatted)) {
    wizardState.skillsList.push(formatted);
    renderSkillTags();
    
    // Auto remove from suggestion list
    populateSuggestions();
  }
}

function removeSkillTag(tagText) {
  wizardState.skillsList = wizardState.skillsList.filter(s => s !== tagText);
  renderSkillTags();
  populateSuggestions();
}

function renderSkillTags() {
  const list = document.getElementById("selected-skills-list");
  list.innerHTML = "";
  wizardState.skillsList.forEach(skill => {
    const chip = document.createElement("div");
    chip.className = "tag";
    chip.innerHTML = `${skill} <i class="tag-remove" data-lucide="x" onclick="removeSkillTag('${skill}')"></i>`;
    list.appendChild(chip);
  });
  lucide.createIcons();
}

function populateSuggestions() {
  const box = document.getElementById("skills-suggestions-box");
  if (!box) return;
  box.innerHTML = "";

  const careerKey = wizardState.selectedCareer;
  let suggestions = [];
  
  if (typeof CAREER_TEMPLATES !== 'undefined' && CAREER_TEMPLATES[careerKey]) {
    suggestions = CAREER_TEMPLATES[careerKey].skills;
  } else {
    // Universal suggested skills for any custom career
    suggestions = [
      "Critical Problem Solving",
      "Domain Best Practices",
      "Data Analysis & Excel",
      "Executive Communication",
      "Project Management",
      "Quality Assurance & Auditing",
      "Industry Software Tools",
      "Research & Strategy"
    ];
  }
  
  const filtered = suggestions.filter(s => !wizardState.skillsList.includes(s));

  filtered.slice(0, 10).forEach(s => {
    const chip = document.createElement("div");
    chip.className = "suggestion-chip";
    chip.innerText = s;
    chip.onclick = () => addSkillTag(s);
    box.appendChild(chip);
  });
}

async function buildRoadmap() {
  const loader = document.getElementById("generator-loading");
  const btnBack = document.getElementById("btn-generator-back");
  const btnBuild = document.getElementById("btn-generator-build");
  const level = document.getElementById("logistics-level").value;
  const hours = parseInt(document.getElementById("logistics-hours").value);

  // Show loader
  loader.style.display = "block";
  btnBack.setAttribute("disabled", "true");
  btnBuild.setAttribute("disabled", "true");

  // Sync back to state user details
  state.user.career = wizardState.selectedCareer;
  state.user.skills = [...wizardState.skillsList];
  state.user.level = level;
  state.user.hours = hours;
  saveStateToLocalStorage();

  try {
    const result = await AIService.generateRoadmap(
      state.user.career,
      state.user.skills,
      state.user.level,
      state.user.hours,
      state.apiKey
    );

    state.activeRoadmap = result;
    state.checklistProgress = {}; // Reset tasks checkboxes on new build
    saveStateToLocalStorage();

    showToast("AI Custom Roadmap built successfully!", "success");
    
    // Render and show visualizer
    document.getElementById("roadmap-output-container").style.display = "grid";
    renderActiveRoadmap();

    // Scroll to roadmap view
    document.getElementById("roadmap-output-container").scrollIntoView({ behavior: 'smooth' });

    // Sync sidebar name
    showDashboardWorkspace();

  } catch (err) {
    showToast(`Error formulating roadmap: ${err.message}`, "error");
  } finally {
    loader.style.display = "none";
    btnBack.removeAttribute("disabled");
    btnBuild.removeAttribute("disabled");
  }
}

// ==========================================
// 5. TIMELINE VISUALIZER RENDERER
// ==========================================

function renderActiveRoadmap() {
  const r = state.activeRoadmap;
  if (!r) return;

  // Title & description
  document.getElementById("roadmap-out-title").innerText = `${r.title} Roadmap`;
  document.getElementById("roadmap-out-desc").innerText = r.description;

  // Meta indicators
  const meta = document.getElementById("roadmap-out-meta");
  meta.innerHTML = `
    <span class="week-duration-badge" style="background: rgba(20, 184, 166, 0.1); color: var(--color-teal);">${state.user.level}</span>
    <span class="week-duration-badge" style="background: rgba(236, 72, 153, 0.1); color: var(--color-pink);">${state.user.hours} hours/week</span>
  `;

  // Tech stack master list
  const stackBox = document.getElementById("roadmap-out-skills");
  stackBox.innerHTML = "";
  r.skills.forEach(s => {
    const span = document.createElement("span");
    span.className = "tag";
    span.style.background = "rgba(99, 102, 241, 0.1)";
    span.style.borderColor = "rgba(99, 102, 241, 0.25)";
    span.style.color = "var(--color-indigo)";
    span.innerText = s;
    stackBox.appendChild(span);
  });

  // Checklist of projects
  const projBox = document.getElementById("roadmap-out-projects");
  projBox.innerHTML = "";
  r.projects.forEach(p => {
    const card = document.createElement("div");
    card.className = "project-card";
    
    // Choose diff badge style
    let diffBadge = "beginner";
    if (p.difficulty.toLowerCase() === "intermediate") diffBadge = "intermediate";
    if (p.difficulty.toLowerCase() === "advanced" || p.difficulty.toLowerCase() === "expert") diffBadge = "advanced";

    const techTags = p.tech.map(t => `<span class="tech-tag">${t}</span>`).join("");
    const featuresList = p.features.map(f => `<li>${f}</li>`).join("");

    card.innerHTML = `
      <div style="display: flex; justify-content: space-between; align-items: center;">
        <h4 style="font-family: var(--font-heading); font-size: 14px; font-weight: 700;">${p.name}</h4>
        <span class="project-difficulty ${diffBadge}">${p.difficulty}</span>
      </div>
      <p style="font-size: 12px; color: var(--text-secondary); line-height: 1.4;">${p.description}</p>
      <div class="project-tech">${techTags}</div>
      <ul class="project-features">${featuresList}</ul>
    `;
    projBox.appendChild(card);
  });

  // Interview Prep Questions
  const prepBox = document.getElementById("roadmap-out-interview");
  prepBox.innerHTML = "";
  if (r.interviewPrep && r.interviewPrep.questions) {
    r.interviewPrep.questions.slice(0, 3).forEach((q, idx) => {
      const details = document.createElement("details");
      details.style.fontSize = "13px";
      details.style.marginBottom = "8px";
      details.style.cursor = "pointer";
      details.innerHTML = `
        <summary style="font-weight: 600; color: var(--color-teal); outline: none; margin-bottom: 5px;">Q${idx+1}: ${q.q}</summary>
        <p style="color: var(--text-secondary); line-height: 1.5; padding-left: 10px; border-left: 2px solid rgba(255,255,255,0.05); margin-top: 5px;">${q.a}</p>
      `;
      prepBox.appendChild(details);
    });
  }

  // Weeks list accordion
  const timeline = document.getElementById("roadmap-weeks-timeline");
  timeline.innerHTML = "";

  r.roadmap.weeks.forEach((week, weekIdx) => {
    const weekDiv = document.createElement("div");
    weekDiv.id = `roadmap-week-${weekIdx}`;
    
    // Check if week is completed (all tasks checked)
    let isWeekFinished = true;
    week.tasks.forEach((_, tIdx) => {
      if (!state.checklistProgress[`${weekIdx}-${tIdx}`]) {
        isWeekFinished = false;
      }
    });

    weekDiv.className = isWeekFinished ? "timeline-week completed" : "timeline-week";

    // Build topics list
    const topicsHtml = week.topics.map(t => `
      <div class="topic-item">
        <i data-lucide="book-open"></i> <span>${t}</span>
      </div>
    `).join("");

    // Build tasks list
    const tasksHtml = week.tasks.map((task, taskIdx) => {
      const isChecked = state.checklistProgress[`${weekIdx}-${taskIdx}`] ? "checked" : "";
      return `
        <div class="checklist-item ${isChecked}" onclick="toggleTask(${weekIdx}, ${taskIdx})">
          <div class="checklist-checkbox">
            <i data-lucide="check"></i>
          </div>
          <span class="checklist-text">${task}</span>
        </div>
      `;
    }).join("");

    weekDiv.innerHTML = `
      <div class="week-header" onclick="toggleWeekAccordion(${weekIdx})">
        <h4 class="week-title-badge">${week.title}</h4>
        <span class="week-duration-badge">${week.hoursRequired} Hours Scheduled</span>
      </div>
      
      <div id="week-details-${weekIdx}" style="display: block; margin-top: 15px; padding-left: 10px;">
        <h5 class="input-label" style="font-size: 11px; margin-bottom: 8px;">Topics to Study</h5>
        <div class="topics-grid">${topicsHtml}</div>
        
        <h5 class="input-label" style="font-size: 11px; margin-bottom: 10px; margin-top: 15px;">Tasks & Exercises</h5>
        <div class="tasks-checklist">${tasksHtml}</div>
      </div>
    `;

    timeline.appendChild(weekDiv);
  });

  lucide.createIcons();
}

function toggleWeekAccordion(weekIdx) {
  const container = document.getElementById(`week-details-${weekIdx}`);
  if (container.style.display === "none") {
    container.style.display = "block";
  } else {
    container.style.display = "none";
  }
}

function toggleTask(weekIdx, taskIdx) {
  const key = `${weekIdx}-${taskIdx}`;
  state.checklistProgress[key] = !state.checklistProgress[key];
  saveStateToLocalStorage();

  // Re-render Roadmap Visualizer & Tracker checklists
  renderActiveRoadmap();
  
  // Show achievement congratulations if relevant
  showChecklistAchievements();

  // Trigger metrics update
  showProgressMetrics();
}

function showChecklistAchievements() {
  // Simple check for full milestones reached
  const r = state.activeRoadmap;
  if (!r) return;

  let totalTasks = 0;
  let finishedTasks = 0;
  
  r.roadmap.weeks.forEach((week, weekIdx) => {
    let weekComplete = true;
    week.tasks.forEach((_, tIdx) => {
      totalTasks++;
      if (state.checklistProgress[`${weekIdx}-${tIdx}`]) {
        finishedTasks++;
      } else {
        weekComplete = false;
      }
    });

    // Check if this week just completed
    const weekNode = document.getElementById(`roadmap-week-${weekIdx}`);
    if (weekComplete && weekNode && !weekNode.classList.contains("completed")) {
      showToast(`Achievement unlocked: Completed Week ${weekIdx+1} milestones!`, "success");
    }
  });

  if (finishedTasks === totalTasks && totalTasks > 0) {
    showToast("Mastery Unlocked! You've finished 100% of your career roadmap!", "success");
  }
}

// ==========================================
// 6. DASHBOARD & PROGRESS METRICS RENDERER
// ==========================================


function getSavedCareers() {
  try {
    const saved = localStorage.getItem("devpath_saved_careers");
    return saved ? JSON.parse(saved) : ["UI/UX & Product Designer", "Astrophysicist & Space Scientist"];
  } catch (e) {
    return ["UI/UX & Product Designer", "Astrophysicist & Space Scientist"];
  }
}

function toggleSaveCareer(career) {
  let list = getSavedCareers();
  const idx = list.indexOf(career);
  if (idx !== -1) {
    list.splice(idx, 1);
    showToast(`Removed "${career}" from saved list.`, "info");
  } else {
    list.push(career);
    showToast(`Saved "${career}" to your favorites!`, "success");
  }
  localStorage.setItem("devpath_saved_careers", JSON.stringify(list));
  if (state.activeTab === "dashboard") {
    renderDashboard();
  }
}

function sendMentorPrompt(promptText) {
  switchTab("mentor");
  const input = document.getElementById("mentor-input");
  if (input) {
    input.value = promptText;
    if (typeof sendMentorMessage === "function") {
      setTimeout(() => sendMentorMessage(), 150);
    }
  }
}

function renderDashboard() {
  showProgressMetrics();

  const stage = state.academicStage || "College";
  const container = document.getElementById("tab-dashboard");
  if (!container) return;

  const isSchool = stage.includes("9") || stage.includes("10");
  const isHigherSec = stage.includes("11") || stage.includes("12");
  const isCollege = !isSchool && !isHigherSec;

  // 1. RENDER ADAPTIVE STAGE BANNER
  let bannerHTML = "";
  if (isSchool) {
    bannerHTML = `
      <div class="card col-12 ai-glow-card" style="margin-bottom: 25px; padding: 22px 26px; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 15px; border-left: 4px solid #38bdf8;">
        <div style="display: flex; align-items: center; gap: 16px;">
          <div style="width: 50px; height: 50px; border-radius: 14px; background: #EEF2FF; display: flex; align-items: center; justify-content: center; color: var(--secondary);">
            <i data-lucide="compass" style="width: 26px; height: 26px;"></i>
          </div>
          <div>
            <div style="display: flex; align-items: center; gap: 8px;">
              <h3 style="font-family: var(--font-heading); font-size: 18px; font-weight: 700; color: var(--primary);">Let's discover your interests and explore your future.</h3>
              <span class="ai-badge" style="background: rgba(56, 189, 248, 0.15); color: #0284c7;">${stage} (School)</span>
            </div>
            <p style="font-size: 13px; color: var(--text-secondary); margin-top: 3px;">
              Discover your cognitive strengths with our 10-question Holland RIASEC quiz, compare Science PCM/PCB vs Commerce vs Humanities, and map your high school track.
            </p>
          </div>
        </div>
        <div style="display: flex; gap: 10px; flex-wrap: wrap;">
          <button class="btn" onclick="switchTab('assessment')" style="width: auto; padding: 10px 20px; font-size: 13px;">
            <i data-lucide="sparkles"></i> Take RIASEC Test
          </button>
          <button class="btn btn-secondary" onclick="switchTab('stream-guide')" style="width: auto; padding: 10px 18px; font-size: 13px;">
            <i data-lucide="git-branch"></i> Stream Guide
          </button>
        </div>
      </div>
    `;
  } else if (isHigherSec) {
    bannerHTML = `
      <div class="card col-12 ai-glow-card" style="margin-bottom: 25px; padding: 22px 26px; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 15px; border-left: 4px solid #f59e0b;">
        <div style="display: flex; align-items: center; gap: 16px;">
          <div style="width: 50px; height: 50px; border-radius: 14px; background: #FEF3C7; display: flex; align-items: center; justify-content: center; color: #d97706;">
            <i data-lucide="graduation-cap" style="width: 26px; height: 26px;"></i>
          </div>
          <div>
            <div style="display: flex; align-items: center; gap: 8px;">
              <h3 style="font-family: var(--font-heading); font-size: 18px; font-weight: 700; color: var(--primary);">Explore your opportunities after Class 12.</h3>
              <span class="ai-badge" style="background: rgba(245, 158, 11, 0.15); color: #b45309;">${stage} (Higher Sec)</span>
            </div>
            <p style="font-size: 13px; color: var(--text-secondary); margin-top: 3px;">
              Explore 25+ undergraduate degrees, track national entrance examinations (JEE, NEET, CUET, CLAT, NDA, NATA), and discover verified scholarships.
            </p>
          </div>
        </div>
        <div style="display: flex; gap: 10px; flex-wrap: wrap;">
          <button class="btn" onclick="switchTab('college-explorer'); setCollegeSubTab('colleges');" style="width: auto; padding: 10px 20px; font-size: 13px;">
            <i data-lucide="search"></i> Find Colleges
          </button>
          <button class="btn btn-secondary" onclick="switchTab('college-explorer'); setCollegeSubTab('exams');" style="width: auto; padding: 10px 18px; font-size: 13px;">
            <i data-lucide="calendar"></i> Entrance Exams
          </button>
        </div>
      </div>
    `;
  } else {
    bannerHTML = `
      <div class="card col-12 ai-glow-card" style="margin-bottom: 25px; padding: 22px 26px; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 15px; border-left: 4px solid #7c3aed;">
        <div style="display: flex; align-items: center; gap: 16px;">
          <div style="width: 50px; height: 50px; border-radius: 14px; background: #F3E8FF; display: flex; align-items: center; justify-content: center; color: #7c3aed;">
            <i data-lucide="briefcase" style="width: 26px; height: 26px;"></i>
          </div>
          <div>
            <div style="display: flex; align-items: center; gap: 8px;">
              <h3 style="font-family: var(--font-heading); font-size: 18px; font-weight: 700; color: var(--primary);">Build the skills and confidence for your next career opportunity.</h3>
              <span class="ai-badge" style="background: rgba(124, 58, 237, 0.15); color: #7c3aed;">${stage}</span>
            </div>
            <p style="font-size: 13px; color: var(--text-secondary); margin-top: 3px;">
              Audit multi-discipline skill gaps, track role compatibility with real-time gauges, optimize your ATS resume score, and prepare with domain mock interviews.
            </p>
          </div>
        </div>
        <div style="display: flex; gap: 10px; flex-wrap: wrap;">
          <button class="btn" onclick="switchTab('mock-interview')" style="width: auto; padding: 10px 20px; font-size: 13px;">
            <i data-lucide="mic"></i> Practice Mock Interview
          </button>
          <button class="btn btn-secondary" onclick="switchTab('analyzer')" style="width: auto; padding: 10px 18px; font-size: 13px;">
            <i data-lucide="file-check"></i> ATS Resume Scan
          </button>
        </div>
      </div>
    `;
  }

  const bannerWrapper = document.getElementById("dashboard-stage-banner-wrapper");
  if (bannerWrapper) bannerWrapper.innerHTML = bannerHTML;

  // 2. RENDER DYNAMIC DASHBOARD SECTIONS
  const viewContainer = document.getElementById("dashboard-stage-dynamic-view");
  if (!viewContainer) return;

  const targetCareer = state.user && state.user.career ? formatCareerTitle(state.user.career) : "Senior Data Analyst";
  const savedCareers = getSavedCareers();

  if (isSchool) {
    // ==========================================
    // DASHBOARD A: CLASS 9-10 (7 SECTIONS)
    // ==========================================
    viewContainer.innerHTML = `
      <div style="display: flex; flex-direction: column; gap: 24px;">
        
        <!-- SECTION 1: DISCOVER MY INTERESTS (RIASEC) -->
        <div class="card" style="padding: 24px;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; flex-wrap: wrap; gap: 10px;">
            <div>
              <h3 style="font-family: var(--font-heading); font-size: 18px; font-weight: 700; color: var(--primary); display: flex; align-items: center; gap: 8px;">
                <i data-lucide="sparkles" style="color: var(--secondary);"></i> 1. Discover My Interests & Aptitude
              </h3>
              <p style="font-size: 13px; color: var(--text-secondary); margin-top: 2px;">
                Uncover what naturally motivates you based on the scientifically validated Holland RIASEC psychological framework.
              </p>
            </div>
            <button class="btn" onclick="switchTab('assessment')" style="padding: 8px 18px; font-size: 12.5px; width: auto;">
              Take Assessment (10 Questions) <i data-lucide="arrow-right"></i>
            </button>
          </div>

          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(130px, 1fr)); gap: 12px;">
            <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px; padding: 14px; text-align: center;">
              <div style="font-size: 24px; margin-bottom: 6px;">🛠️</div>
              <strong style="font-size: 13px; color: #1e293b; display: block;">Realistic</strong>
              <span style="font-size: 11px; color: #64748b;">Hands-on, Practical</span>
            </div>
            <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px; padding: 14px; text-align: center;">
              <div style="font-size: 24px; margin-bottom: 6px;">🔬</div>
              <strong style="font-size: 13px; color: #1e293b; display: block;">Investigative</strong>
              <span style="font-size: 11px; color: #64748b;">Analytical, Scientific</span>
            </div>
            <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px; padding: 14px; text-align: center;">
              <div style="font-size: 24px; margin-bottom: 6px;">🎨</div>
              <strong style="font-size: 13px; color: #1e293b; display: block;">Artistic</strong>
              <span style="font-size: 11px; color: #64748b;">Creative, Expressive</span>
            </div>
            <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px; padding: 14px; text-align: center;">
              <div style="font-size: 24px; margin-bottom: 6px;">🤝</div>
              <strong style="font-size: 13px; color: #1e293b; display: block;">Social</strong>
              <span style="font-size: 11px; color: #64748b;">Helping, Mentoring</span>
            </div>
            <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px; padding: 14px; text-align: center;">
              <div style="font-size: 24px; margin-bottom: 6px;">🚀</div>
              <strong style="font-size: 13px; color: #1e293b; display: block;">Enterprising</strong>
              <span style="font-size: 11px; color: #64748b;">Leadership, Persuasion</span>
            </div>
            <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px; padding: 14px; text-align: center;">
              <div style="font-size: 24px; margin-bottom: 6px;">📊</div>
              <strong style="font-size: 13px; color: #1e293b; display: block;">Conventional</strong>
              <span style="font-size: 11px; color: #64748b;">Organized, Detail-driven</span>
            </div>
          </div>
        </div>

        <!-- SECTION 2: EXPLORE DIFFERENT CAREERS -->
        <div class="card" style="padding: 24px;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; flex-wrap: wrap; gap: 10px;">
            <div>
              <h3 style="font-family: var(--font-heading); font-size: 18px; font-weight: 700; color: var(--primary); display: flex; align-items: center; gap: 8px;">
                <i data-lucide="compass" style="color: var(--secondary);"></i> 2. Explore Different Careers
              </h3>
              <p style="font-size: 13px; color: var(--text-secondary); margin-top: 2px;">
                Discover careers even if you don't know what you want to become yet.
              </p>
            </div>
            <button class="btn btn-secondary" onclick="switchTab('explorer')" style="padding: 8px 18px; font-size: 12.5px; width: auto;">
              Browse 30+ Careers <i data-lucide="external-link"></i>
            </button>
          </div>

          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 14px;">
            <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 16px;">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
                <span style="font-size: 11px; font-weight: 700; color: #0284c7; text-transform: uppercase;">Science & Space</span>
                <span style="font-size: 10.5px; background: #e0f2fe; color: #0369a1; padding: 2px 6px; border-radius: 4px; font-weight: 600;">High Growth</span>
              </div>
              <strong style="font-size: 14px; color: #1e293b; display: block;">Astrophysicist & Space Scientist</strong>
              <p style="font-size: 12px; color: #64748b; margin: 4px 0 10px; line-height: 1.4;">Study stars, black holes, and space missions with ISRO and NASA.</p>
              <div style="display: flex; justify-content: space-between; align-items: center; font-size: 12px;">
                <span style="color: #0f172a; font-weight: 700;">₹12 - 25 LPA</span>
                <button onclick="switchTab('explorer')" style="background: none; border: none; color: #4f46e5; font-weight: 600; cursor: pointer;">Explore →</button>
              </div>
            </div>

            <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 16px;">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
                <span style="font-size: 11px; font-weight: 700; color: #7c3aed; text-transform: uppercase;">Design & Tech</span>
                <span style="font-size: 10.5px; background: #f3e8ff; color: #7e22ce; padding: 2px 6px; border-radius: 4px; font-weight: 600;">In Demand</span>
              </div>
              <strong style="font-size: 14px; color: #1e293b; display: block;">UI/UX & Product Designer</strong>
              <p style="font-size: 12px; color: #64748b; margin: 4px 0 10px; line-height: 1.4;">Create beautiful apps, user experiences, and digital interfaces.</p>
              <div style="display: flex; justify-content: space-between; align-items: center; font-size: 12px;">
                <span style="color: #0f172a; font-weight: 700;">₹8 - 20 LPA</span>
                <button onclick="switchTab('explorer')" style="background: none; border: none; color: #4f46e5; font-weight: 600; cursor: pointer;">Explore →</button>
              </div>
            </div>

            <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 16px;">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
                <span style="font-size: 11px; font-weight: 700; color: #059669; text-transform: uppercase;">Medicine</span>
                <span style="font-size: 10.5px; background: #dcfce7; color: #15803d; padding: 2px 6px; border-radius: 4px; font-weight: 600;">Essential</span>
              </div>
              <strong style="font-size: 14px; color: #1e293b; display: block;">Molecular Biologist</strong>
              <p style="font-size: 12px; color: #64748b; margin: 4px 0 10px; line-height: 1.4;">Research genetics, mRNA vaccines, and disease treatments.</p>
              <div style="display: flex; justify-content: space-between; align-items: center; font-size: 12px;">
                <span style="color: #0f172a; font-weight: 700;">₹10 - 22 LPA</span>
                <button onclick="switchTab('explorer')" style="background: none; border: none; color: #4f46e5; font-weight: 600; cursor: pointer;">Explore →</button>
              </div>
            </div>

            <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 16px;">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
                <span style="font-size: 11px; font-weight: 700; color: #d97706; text-transform: uppercase;">Finance & Law</span>
                <span style="font-size: 10.5px; background: #fef3c7; color: #b45309; padding: 2px 6px; border-radius: 4px; font-weight: 600;">High Prestige</span>
              </div>
              <strong style="font-size: 14px; color: #1e293b; display: block;">Corporate & Cyber Lawyer</strong>
              <p style="font-size: 12px; color: #64748b; margin: 4px 0 10px; line-height: 1.4;">Handle intellectual property, data privacy, and global mergers.</p>
              <div style="display: flex; justify-content: space-between; align-items: center; font-size: 12px;">
                <span style="color: #0f172a; font-weight: 700;">₹12 - 30 LPA</span>
                <button onclick="switchTab('explorer')" style="background: none; border: none; color: #4f46e5; font-weight: 600; cursor: pointer;">Explore →</button>
              </div>
            </div>
          </div>
        </div>

        <!-- SECTION 3: CHOOSE MY STREAM & SECTION 4: EXPLORE SUBJECTS -->
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
          <!-- Section 3: Choose Stream -->
          <div class="card" style="padding: 24px;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 14px;">
              <h3 style="font-family: var(--font-heading); font-size: 17px; font-weight: 700; color: var(--primary);">
                3. Choose My Stream (Class 11)
              </h3>
              <button class="btn btn-secondary" onclick="switchTab('stream-guide')" style="padding: 4px 10px; font-size: 11px; width: auto;">
                Compare Matrix →
              </button>
            </div>
            <div style="display: flex; flex-direction: column; gap: 10px;">
              <div style="background: #f0fdf4; border-left: 4px solid #16a34a; padding: 12px; border-radius: 6px;">
                <strong style="font-size: 13px; color: #166534;">Science (PCM / PCB)</strong>
                <p style="font-size: 11.5px; color: #15803d; margin: 2px 0 0;">Engineering, Medicine, AI, Biotechnology, Data Science.</p>
              </div>
              <div style="background: #eff6ff; border-left: 4px solid #2563eb; padding: 12px; border-radius: 6px;">
                <strong style="font-size: 13px; color: #1e40af;">Commerce (with/without Maths)</strong>
                <p style="font-size: 11.5px; color: #1d4ed8; margin: 2px 0 0;">Chartered Accountancy, Finance, Business Analytics, Economics.</p>
              </div>
              <div style="background: #faf5ff; border-left: 4px solid #9333ea; padding: 12px; border-radius: 6px;">
                <strong style="font-size: 13px; color: #6b21a8;">Humanities & Arts</strong>
                <p style="font-size: 11.5px; color: #7e22ce; margin: 2px 0 0;">Law (CLAT), Civil Services (UPSC), Psychology, Media & Design.</p>
              </div>
            </div>
          </div>

          <!-- Section 4: Explore Subjects -->
          <div class="card" style="padding: 24px;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 14px;">
              <h3 style="font-family: var(--font-heading); font-size: 17px; font-weight: 700; color: var(--primary);">
                4. Explore High School Subjects
              </h3>
            </div>
            <p style="font-size: 12.5px; color: var(--text-secondary); margin-bottom: 12px;">
              Pair core curriculum with high-impact electives to prepare for future-proof courses:
            </p>
            <div style="display: flex; flex-wrap: wrap; gap: 8px;">
              <span style="font-size: 11.5px; padding: 4px 10px; border-radius: 6px; background: #e0e7ff; color: #4338ca; font-weight: 600;">💻 Computer Science & Python</span>
              <span style="font-size: 11.5px; padding: 4px 10px; border-radius: 6px; background: #fef3c7; color: #92400e; font-weight: 600;">📈 Applied Mathematics</span>
              <span style="font-size: 11.5px; padding: 4px 10px; border-radius: 6px; background: #dcfce7; color: #166534; font-weight: 600;">🧠 Psychology</span>
              <span style="font-size: 11.5px; padding: 4px 10px; border-radius: 6px; background: #fce7f3; color: #9d174d; font-weight: 600;">🎨 Design & Multimedia</span>
              <span style="font-size: 11.5px; padding: 4px 10px; border-radius: 6px; background: #f1f5f9; color: #475569; font-weight: 600;">💰 Financial Markets</span>
            </div>
          </div>
        </div>

        <!-- SECTION 5: MY CAREER ROADMAP & SECTION 6: ASK AI CAREER MENTOR -->
        <div style="display: grid; grid-template-columns: 2fr 1fr; gap: 20px;">
          <!-- Section 5: Roadmap -->
          <div class="card" style="padding: 24px;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 14px;">
              <h3 style="font-family: var(--font-heading); font-size: 17px; font-weight: 700; color: var(--primary);">
                5. My Foundation Roadmap
              </h3>
              <button class="btn btn-secondary" onclick="switchTab('generator')" style="padding: 4px 12px; font-size: 12px; width: auto;">
                Customize Roadmap →
              </button>
            </div>
            <div id="dashboard-active-roadmap-content">
              <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px; padding: 16px;">
                <div style="font-size: 13px; font-weight: 600; color: #1e293b; margin-bottom: 8px;">Recommended Next Steps for ${stage}:</div>
                <div class="checklist-item" style="padding: 8px 0; border-bottom: 1px solid #e2e8f0; display: flex; align-items: center; gap: 10px;">
                  <span style="color: #4f46e5; font-size: 16px;">📌</span>
                  <span style="font-size: 12.5px; color: #334155;">Take the RIASEC 10-Question Aptitude Assessment to pinpoint natural work traits.</span>
                </div>
                <div class="checklist-item" style="padding: 8px 0; border-bottom: 1px solid #e2e8f0; display: flex; align-items: center; gap: 10px;">
                  <span style="color: #4f46e5; font-size: 16px;">📌</span>
                  <span style="font-size: 12.5px; color: #334155;">Review the Stream Comparison Guide (PCM vs PCB vs Commerce vs Arts).</span>
                </div>
                <div class="checklist-item" style="padding: 8px 0; display: flex; align-items: center; gap: 10px;">
                  <span style="color: #4f46e5; font-size: 16px;">📌</span>
                  <span style="font-size: 12.5px; color: #334155;">Save 3 target careers to explore during vacation.</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Section 6: Ask AI Career Mentor -->
          <div class="card" style="padding: 24px;">
            <h3 style="font-family: var(--font-heading); font-size: 17px; font-weight: 700; color: var(--primary); margin-bottom: 12px;">
              6. Ask AI Mentor
            </h3>
            <p style="font-size: 12px; color: var(--text-secondary); margin-bottom: 14px;">
              Ask anything about subjects, board exams, or future tracks:
            </p>
            <div style="display: flex; flex-direction: column; gap: 8px;">
              <button class="btn btn-secondary" onclick="sendMentorPrompt('Which stream should I choose if I love both coding and biology?')" style="text-align: left; font-size: 11.5px; padding: 8px 12px; background: #f8fafc; border: 1px solid #e2e8f0; color: #334155;">
                💬 "Which stream fits coding & biology?"
              </button>
              <button class="btn btn-secondary" onclick="sendMentorPrompt('How do I choose between PCM and Commerce with Maths?')" style="text-align: left; font-size: 11.5px; padding: 8px 12px; background: #f8fafc; border: 1px solid #e2e8f0; color: #334155;">
                💬 "PCM vs Commerce with Maths?"
              </button>
              <button class="btn btn-secondary" onclick="sendMentorPrompt('What skills can I learn in high school to become an AI engineer?')" style="text-align: left; font-size: 11.5px; padding: 8px 12px; background: #f8fafc; border: 1px solid #e2e8f0; color: #334155;">
                💬 "High school skills for AI?"
              </button>
            </div>
          </div>
        </div>

        <!-- SECTION 7: SAVED CAREERS -->
        <div class="card" style="padding: 24px;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 14px;">
            <h3 style="font-family: var(--font-heading); font-size: 17px; font-weight: 700; color: var(--primary); display: flex; align-items: center; gap: 8px;">
              <i data-lucide="bookmark" style="color: var(--secondary);"></i> 7. Saved Careers
            </h3>
            <button class="btn btn-secondary" onclick="switchTab('explorer')" style="padding: 4px 12px; font-size: 12px; width: auto;">
              + Add More Careers
            </button>
          </div>
          <div id="dashboard-saved-careers-list" style="display: flex; flex-wrap: wrap; gap: 10px;">
            ${savedCareers.length ? savedCareers.map(c => `
              <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 8px 14px; display: flex; align-items: center; gap: 10px;">
                <span style="font-size: 13px; font-weight: 600; color: #1e293b;">${c}</span>
                <button onclick="toggleSaveCareer('${c}')" style="background: none; border: none; color: #ef4444; cursor: pointer; font-size: 13px;">✕</button>
              </div>
            `).join("") : `
              <p style="font-size: 12.5px; color: var(--text-secondary); margin: 0;">No saved careers yet. Browse the Career Discovery tab to pin careers of interest!</p>
            `}
          </div>
        </div>

      </div>
    `;

  } else if (isHigherSec) {
    // ==========================================
    // DASHBOARD B: CLASS 11-12 (7 SECTIONS)
    // ==========================================
    viewContainer.innerHTML = `
      <div style="display: flex; flex-direction: column; gap: 24px;">

        <!-- SECTION 1: CAREER RECOMMENDATIONS -->
        <div class="card" style="padding: 24px;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; flex-wrap: wrap; gap: 10px;">
            <div>
              <h3 style="font-family: var(--font-heading); font-size: 18px; font-weight: 700; color: var(--primary); display: flex; align-items: center; gap: 8px;">
                <i data-lucide="target" style="color: var(--secondary);"></i> 1. Career Recommendations for Class 11-12
              </h3>
              <p style="font-size: 13px; color: var(--text-secondary); margin-top: 2px;">
                Tailored degree programs and professional trajectories matching your higher secondary academic track.
              </p>
            </div>
            <button class="btn btn-secondary" onclick="switchTab('college-explorer'); setCollegeSubTab('degrees');" style="padding: 8px 18px; font-size: 12.5px; width: auto;">
              Explore 25+ Degrees →
            </button>
          </div>

          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 14px;">
            <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 16px;">
              <span style="font-size: 11px; font-weight: 700; color: #0284c7; text-transform: uppercase;">Engineering & AI</span>
              <strong style="font-size: 14px; color: #1e293b; display: block; margin: 4px 0 2px;">B.Tech in Computer Science & AI</strong>
              <span style="font-size: 11.5px; color: #64748b;">Entrance: JEE Main / Advanced • BITSAT</span>
              <div style="margin-top: 10px; font-size: 12px; font-weight: 600; color: #0f172a;">Top: IIT Bombay, BITS Pilani, NITs</div>
            </div>
            <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 16px;">
              <span style="font-size: 11px; font-weight: 700; color: #059669; text-transform: uppercase;">Medical & Life Sciences</span>
              <strong style="font-size: 14px; color: #1e293b; display: block; margin: 4px 0 2px;">MBBS & Biotechnology</strong>
              <span style="font-size: 11.5px; color: #64748b;">Entrance: NEET UG</span>
              <div style="margin-top: 10px; font-size: 12px; font-weight: 600; color: #0f172a;">Top: AIIMS Delhi, CMC Vellore, JIPMER</div>
            </div>
            <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 16px;">
              <span style="font-size: 11px; font-weight: 700; color: #d97706; text-transform: uppercase;">Commerce & Management</span>
              <strong style="font-size: 14px; color: #1e293b; display: block; margin: 4px 0 2px;">Integrated IPM (BBA + MBA)</strong>
              <span style="font-size: 11.5px; color: #64748b;">Entrance: IPMAT • JIPMAT</span>
              <div style="margin-top: 10px; font-size: 12px; font-weight: 600; color: #0f172a;">Top: IIM Indore, IIM Rohtak, SRCC</div>
            </div>
            <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 16px;">
              <span style="font-size: 11px; font-weight: 700; color: #7c3aed; text-transform: uppercase;">Law & Legal</span>
              <strong style="font-size: 14px; color: #1e293b; display: block; margin: 4px 0 2px;">5-Year B.A. LL.B (Hons)</strong>
              <span style="font-size: 11.5px; color: #64748b;">Entrance: CLAT • AILET</span>
              <div style="margin-top: 10px; font-size: 12px; font-weight: 600; color: #0f172a;">Top: NLSIU Bengaluru, NALSAR, NLU Delhi</div>
            </div>
          </div>
        </div>

        <!-- SECTION 2: EXPLORE COURSES & SECTION 3: FIND COLLEGES (IMAGE 3 PREVIEW) -->
        <div class="card" style="padding: 24px;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; flex-wrap: wrap; gap: 10px;">
            <div>
              <h3 style="font-family: var(--font-heading); font-size: 18px; font-weight: 700; color: var(--primary); display: flex; align-items: center; gap: 8px;">
                <i data-lucide="building" style="color: var(--secondary);"></i> 3. Find Colleges Directory (Preview)
              </h3>
              <p style="font-size: 13px; color: var(--text-secondary); margin-top: 2px;">
                Filter colleges by majors, acceptance rates, tuition, and match level (Reach, Target, Safety).
              </p>
            </div>
            <button class="btn btn-secondary" onclick="switchTab('college-explorer'); setCollegeSubTab('colleges');" style="padding: 8px 18px; font-size: 12.5px; width: auto;">
              Open Full Directory (19 Colleges) <i data-lucide="arrow-right"></i>
            </button>
          </div>

          <!-- Preview Table snippet of top colleges -->
          <div style="overflow-x: auto; border: 1px solid #e2e8f0; border-radius: 10px; background: #fff;">
            <table class="colleges-table" style="width: 100%; border-collapse: collapse;">
              <thead>
                <tr style="background: #f8fafc; border-bottom: 2px solid #e2e8f0;">
                  <th style="padding: 10px 14px; font-size: 11px; text-transform: uppercase; color: #475569;">College</th>
                  <th style="padding: 10px 14px; font-size: 11px; text-transform: uppercase; color: #475569;">Location</th>
                  <th style="padding: 10px 14px; font-size: 11px; text-transform: uppercase; color: #475569;">Type</th>
                  <th style="padding: 10px 14px; font-size: 11px; text-transform: uppercase; color: #475569;">Acceptance</th>
                  <th style="padding: 10px 14px; font-size: 11px; text-transform: uppercase; color: #475569;">Match Level</th>
                  <th style="padding: 10px 14px; font-size: 11px; text-transform: uppercase; color: #475569; text-align: right;">Action</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style="padding: 12px 14px;"><strong>IIT Bombay</strong><div style="font-size: 11px; color: #64748b;">India's premier engineering & tech institute</div></td>
                  <td style="padding: 12px 14px; font-size: 12px;">Mumbai, India</td>
                  <td style="padding: 12px 14px;"><span class="type-badge-public">Public</span></td>
                  <td style="padding: 12px 14px; font-weight: 700;">1.2% (JEE Adv)</td>
                  <td style="padding: 12px 14px;"><span class="match-badge-reach">Reach</span></td>
                  <td style="padding: 12px 14px; text-align: right;"><button class="btn btn-secondary" onclick="switchTab('college-explorer'); setCollegeSubTab('colleges');" style="padding: 4px 10px; font-size: 11.5px; width: auto;">View</button></td>
                </tr>
                <tr>
                  <td style="padding: 12px 14px;"><strong>AIIMS New Delhi</strong><div style="font-size: 11px; color: #64748b;">Pinnacle of medical education & research</div></td>
                  <td style="padding: 12px 14px; font-size: 12px;">New Delhi, India</td>
                  <td style="padding: 12px 14px;"><span class="type-badge-public">Public</span></td>
                  <td style="padding: 12px 14px; font-weight: 700;">0.1% (NEET)</td>
                  <td style="padding: 12px 14px;"><span class="match-badge-reach">Reach</span></td>
                  <td style="padding: 12px 14px; text-align: right;"><button class="btn btn-secondary" onclick="switchTab('college-explorer'); setCollegeSubTab('colleges');" style="padding: 4px 10px; font-size: 11.5px; width: auto;">View</button></td>
                </tr>
                <tr>
                  <td style="padding: 12px 14px;"><strong>BITS Pilani</strong><div style="font-size: 11px; color: #64748b;">Leading private engineering university</div></td>
                  <td style="padding: 12px 14px; font-size: 12px;">Pilani, Rajasthan</td>
                  <td style="padding: 12px 14px;"><span class="type-badge-private">Private</span></td>
                  <td style="padding: 12px 14px; font-weight: 700;">8.0% (BITSAT)</td>
                  <td style="padding: 12px 14px;"><span class="match-badge-target">Target</span></td>
                  <td style="padding: 12px 14px; text-align: right;"><button class="btn btn-secondary" onclick="switchTab('college-explorer'); setCollegeSubTab('colleges');" style="padding: 4px 10px; font-size: 11.5px; width: auto;">View</button></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- SECTION 4: ENTRANCE EXAM GUIDANCE & SECTION 5: SCHOLARSHIP FINDER -->
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
          <!-- Section 4: Entrance Exams -->
          <div class="card" style="padding: 24px;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 14px;">
              <h3 style="font-family: var(--font-heading); font-size: 17px; font-weight: 700; color: var(--primary);">
                4. Entrance Exam Guidance
              </h3>
              <button class="btn btn-secondary" onclick="switchTab('college-explorer'); setCollegeSubTab('exams');" style="padding: 4px 10px; font-size: 11px; width: auto;">
                All Exams →
              </button>
            </div>
            <div style="display: flex; flex-direction: column; gap: 10px;">
              <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 12px; display: flex; justify-content: space-between; align-items: center;">
                <div>
                  <strong style="font-size: 13px; color: #1e293b;">JEE Main & Advanced</strong>
                  <div style="font-size: 11px; color: #64748b;">Engineering (IITs, NITs) • Jan / Apr</div>
                </div>
                <span style="font-size: 11px; background: #e0f2fe; color: #0369a1; padding: 3px 8px; border-radius: 4px; font-weight: 700;">National</span>
              </div>
              <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 12px; display: flex; justify-content: space-between; align-items: center;">
                <div>
                  <strong style="font-size: 13px; color: #1e293b;">NEET UG</strong>
                  <div style="font-size: 11px; color: #64748b;">Medicine / MBBS • May</div>
                </div>
                <span style="font-size: 11px; background: #dcfce7; color: #15803d; padding: 3px 8px; border-radius: 4px; font-weight: 700;">Medical</span>
              </div>
              <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 12px; display: flex; justify-content: space-between; align-items: center;">
                <div>
                  <strong style="font-size: 13px; color: #1e293b;">CUET UG</strong>
                  <div style="font-size: 11px; color: #64748b;">Central Universities (DU, BHU, JNU) • May</div>
                </div>
                <span style="font-size: 11px; background: #f3e8ff; color: #7e22ce; padding: 3px 8px; border-radius: 4px; font-weight: 700;">Common</span>
              </div>
            </div>
          </div>

          <!-- Section 5: Scholarships -->
          <div class="card" style="padding: 24px;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 14px;">
              <h3 style="font-family: var(--font-heading); font-size: 17px; font-weight: 700; color: var(--primary);">
                5. Scholarship Finder
              </h3>
              <button class="btn btn-secondary" onclick="switchTab('college-explorer'); setCollegeSubTab('exams');" style="padding: 4px 10px; font-size: 11px; width: auto;">
                View Details →
              </button>
            </div>
            <div style="display: flex; flex-direction: column; gap: 10px;">
              <div style="background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 8px; padding: 12px;">
                <strong style="font-size: 13px; color: #166534;">INSPIRE Scholarship (DST)</strong>
                <p style="font-size: 11.5px; color: #15803d; margin: 2px 0 0;">₹80,000/yr for top 1% Class 12 pursuing Natural Sciences.</p>
              </div>
              <div style="background: #eff6ff; border: 1px solid #bfdbfe; border-radius: 8px; padding: 12px;">
                <strong style="font-size: 13px; color: #1e40af;">Central Sector Scheme of Scholarships (CSSS)</strong>
                <p style="font-size: 11.5px; color: #1d4ed8; margin: 2px 0 0;">₹12,000/yr for college studies for top 80th percentile students.</p>
              </div>
              <div style="background: #faf5ff; border: 1px solid #e9d5ff; border-radius: 8px; padding: 12px;">
                <strong style="font-size: 13px; color: #6b21a8;">AICTE Pragati Scholarship for Girls</strong>
                <p style="font-size: 11.5px; color: #7e22ce; margin: 2px 0 0;">₹50,000/yr for female candidates pursuing technical degrees.</p>
              </div>
            </div>
          </div>
        </div>

        <!-- SECTION 6: CAREER ROADMAP & SECTION 7: AI CAREER MENTOR -->
        <div style="display: grid; grid-template-columns: 2fr 1fr; gap: 20px;">
          <!-- Section 6: Roadmap -->
          <div class="card" style="padding: 24px;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 14px;">
              <h3 style="font-family: var(--font-heading); font-size: 17px; font-weight: 700; color: var(--primary);">
                6. Board & Entrance Roadmap
              </h3>
              <button class="btn btn-secondary" onclick="switchTab('generator')" style="padding: 4px 12px; font-size: 12px; width: auto;">
                View Timeline →
              </button>
            </div>
            <div id="dashboard-active-roadmap-content">
              <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px; padding: 16px;">
                <div style="font-size: 13px; font-weight: 600; color: #1e293b; margin-bottom: 8px;">Key Milestones for ${stage}:</div>
                <div class="checklist-item" style="padding: 8px 0; border-bottom: 1px solid #e2e8f0; display: flex; align-items: center; gap: 10px;">
                  <span style="color: #f59e0b; font-size: 16px;">📌</span>
                  <span style="font-size: 12.5px; color: #334155;">Finalize target list of 5 colleges (2 Reach, 2 Target, 1 Safety) in Find Colleges.</span>
                </div>
                <div class="checklist-item" style="padding: 8px 0; border-bottom: 1px solid #e2e8f0; display: flex; align-items: center; gap: 10px;">
                  <span style="color: #f59e0b; font-size: 16px;">📌</span>
                  <span style="font-size: 12.5px; color: #334155;">Check application deadlines and syllabus weightage for target entrance exams.</span>
                </div>
                <div class="checklist-item" style="padding: 8px 0; display: flex; align-items: center; gap: 10px;">
                  <span style="color: #f59e0b; font-size: 16px;">📌</span>
                  <span style="font-size: 12.5px; color: #334155;">Schedule weekly mock tests and practice question sets.</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Section 7: AI Career Mentor -->
          <div class="card" style="padding: 24px;">
            <h3 style="font-family: var(--font-heading); font-size: 17px; font-weight: 700; color: var(--primary); margin-bottom: 12px;">
              7. Ask AI Mentor
            </h3>
            <p style="font-size: 12px; color: var(--text-secondary); margin-bottom: 14px;">
              Get answers about college admissions, entrance cutoffs, or scholarships:
            </p>
            <div style="display: flex; flex-direction: column; gap: 8px;">
              <button class="btn btn-secondary" onclick="sendMentorPrompt('How do I balance CBSE Board prep with JEE Main?')" style="text-align: left; font-size: 11.5px; padding: 8px 12px; background: #f8fafc; border: 1px solid #e2e8f0; color: #334155;">
                💬 "Balance Boards & JEE?"
              </button>
              <button class="btn btn-secondary" onclick="sendMentorPrompt('What are top computer science colleges in India besides IITs?')" style="text-align: left; font-size: 11.5px; padding: 8px 12px; background: #f8fafc; border: 1px solid #e2e8f0; color: #334155;">
                💬 "Top CS colleges besides IITs?"
              </button>
              <button class="btn btn-secondary" onclick="sendMentorPrompt('Explain the CUET UG exam pattern and eligibility.')" style="text-align: left; font-size: 11.5px; padding: 8px 12px; background: #f8fafc; border: 1px solid #e2e8f0; color: #334155;">
                💬 "CUET UG exam pattern?"
              </button>
            </div>
          </div>
        </div>

      </div>
    `;

  } else {
    // ==========================================
    // DASHBOARD C: COLLEGE & GRADUATE (IMAGE 4 SKILLOPTI SUITE)
    // ==========================================
    viewContainer.innerHTML = `
      <div style="display: flex; flex-direction: column; gap: 24px;">

        <!-- TOP BAR: ROLE FIT SCORE CIRCULAR/ARCH GAUGE (IMAGE 4) -->
        <div class="role-fit-gauge-card">
          <div style="display: flex; align-items: center; gap: 24px; flex-wrap: wrap;">
            <!-- Semi-circle / Arc Gauge -->
            <div style="position: relative; width: 140px; height: 80px; display: flex; flex-direction: column; align-items: center; justify-content: flex-end;">
              <svg viewBox="0 0 100 55" style="width: 130px; overflow: visible;">
                <!-- Background Arc -->
                <path d="M 10 50 A 40 40 0 0 1 90 50" fill="none" stroke="rgba(255,255,255,0.25)" stroke-width="8" stroke-linecap="round" />
                <!-- Foreground Value Arc (78%) -->
                <path d="M 10 50 A 40 40 0 0 1 90 50" fill="none" stroke="#FFFFFF" stroke-width="8" stroke-dasharray="125.6" stroke-dashoffset="27.6" stroke-linecap="round" />
              </svg>
              <div style="position: absolute; bottom: 0; text-align: center;">
                <div style="font-size: 22px; font-weight: 800; color: #ffffff; line-height: 1;">78/100</div>
                <div style="font-size: 10px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: rgba(255,255,255,0.85); margin-top: 2px;">Role Fit Score</div>
              </div>
            </div>

            <div>
              <div style="display: inline-flex; align-items: center; gap: 6px; background: rgba(255,255,255,0.2); backdrop-filter: blur(8px); padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: 700; margin-bottom: 6px;">
                <span>Overall Compatibility Rating:</span>
                <span style="color: #a7f3d0;">High (78%)</span>
                <i data-lucide="trending-up" style="width: 14px; height: 14px;"></i>
              </div>
              <h2 style="font-size: 18px; font-weight: 700; margin-bottom: 2px;">
                Your profile is highly compatible with the target role of "${targetCareer}".
              </h2>
              <p style="font-size: 13px; color: rgba(255,255,255,0.85);">
                Closing 3 critical gaps in cloud and big data will advance your role fit score to 95%+.
              </p>
            </div>
          </div>

          <div style="display: flex; gap: 10px; flex-wrap: wrap;">
            <button class="btn btn-secondary" onclick="switchTab('analyzer')" style="background: rgba(255,255,255,0.15); border-color: rgba(255,255,255,0.3); color: #fff; padding: 8px 18px; font-size: 12.5px; width: auto;">
              <i data-lucide="file-text"></i> Audit Resume
            </button>
            <button class="btn" onclick="switchTab('mock-interview')" style="background: #ffffff; color: #4f46e5; padding: 8px 18px; font-size: 12.5px; width: auto; font-weight: 700;">
              <i data-lucide="mic"></i> Practice Mock
            </button>
          </div>
        </div>

        <!-- 3-COLUMN SUITE (IMAGE 4): CURRENT SKILLS | SKILLS GAP | RECOMMENDED SKILLS -->
        <div style="display: grid; grid-template-columns: 1.1fr 1.3fr 1fr; gap: 20px;">

          <!-- COLUMN 1: CURRENT SKILLS ANALYSIS (IMAGE 4) -->
          <div class="card" style="padding: 22px;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
              <h3 style="font-family: var(--font-heading); font-size: 16px; font-weight: 700; color: var(--primary);">
                Current Skills Analysis
              </h3>
              <span style="font-size: 11px; color: #64748b; font-weight: 600;">Show Advanced Skills 🟢</span>
            </div>

            <!-- Skills with Proficiency Bars & Badges -->
            <div style="display: flex; flex-direction: column; gap: 14px; margin-bottom: 20px;">
              <div>
                <div style="display: flex; justify-content: space-between; font-size: 12.5px; font-weight: 600; color: #1e293b;">
                  <span>Data Analysis</span>
                  <span style="color: #059669; font-size: 11.5px;">92% Proficiency, Expert ✓</span>
                </div>
                <div class="proficiency-bar-wrapper">
                  <div class="proficiency-bar-fill" style="width: 92%;"></div>
                </div>
              </div>

              <div>
                <div style="display: flex; justify-content: space-between; font-size: 12.5px; font-weight: 600; color: #1e293b;">
                  <span>Python</span>
                  <span style="color: #059669; font-size: 11.5px;">85% Proficiency, Advanced ✓</span>
                </div>
                <div class="proficiency-bar-wrapper">
                  <div class="proficiency-bar-fill" style="width: 85%;"></div>
                </div>
              </div>

              <div>
                <div style="display: flex; justify-content: space-between; font-size: 12.5px; font-weight: 600; color: #1e293b;">
                  <span>SQL</span>
                  <span style="color: #059669; font-size: 11.5px;">85% Proficiency, Advanced ✓</span>
                </div>
                <div class="proficiency-bar-wrapper">
                  <div class="proficiency-bar-fill" style="width: 85%;"></div>
                </div>
              </div>

              <div>
                <div style="display: flex; justify-content: space-between; font-size: 12.5px; font-weight: 600; color: #1e293b;">
                  <span>Machine Learning</span>
                  <span style="color: #2563eb; font-size: 11.5px;">75% Proficiency, Intermediate ✓</span>
                </div>
                <div class="proficiency-bar-wrapper">
                  <div class="proficiency-bar-fill" style="width: 75%;"></div>
                </div>
              </div>

              <div>
                <div style="display: flex; justify-content: space-between; font-size: 12.5px; font-weight: 600; color: #1e293b;">
                  <span>Communication</span>
                  <span style="color: #059669; font-size: 11.5px;">80% Proficiency, Advanced ✓</span>
                </div>
                <div class="proficiency-bar-wrapper">
                  <div class="proficiency-bar-fill" style="width: 80%;"></div>
                </div>
              </div>

              <div>
                <div style="display: flex; justify-content: space-between; font-size: 12.5px; font-weight: 600; color: #1e293b;">
                  <span>Project Management</span>
                  <span style="color: #2563eb; font-size: 11.5px;">70% Proficiency, Intermediate ✓</span>
                </div>
                <div class="proficiency-bar-wrapper">
                  <div class="proficiency-bar-fill" style="width: 70%;"></div>
                </div>
              </div>

              <div>
                <div style="display: flex; justify-content: space-between; font-size: 12.5px; font-weight: 600; color: #1e293b;">
                  <span>Tableau</span>
                  <span style="color: #059669; font-size: 11.5px;">78% Proficiency, Advanced ✓</span>
                </div>
                <div class="proficiency-bar-wrapper">
                  <div class="proficiency-bar-fill" style="width: 78%;"></div>
                </div>
              </div>
            </div>

            <!-- Top Skills Highlighted Pills -->
            <div style="border-top: 1px solid #e2e8f0; padding-top: 14px;">
              <div style="font-size: 12px; font-weight: 700; color: #475569; margin-bottom: 8px;">Top Skills Highlighted:</div>
              <div style="display: flex; flex-wrap: wrap; gap: 6px;">
                <span style="font-size: 11px; font-weight: 700; background: #059669; color: #fff; padding: 4px 10px; border-radius: 20px;">Data Analysis</span>
                <span style="font-size: 11px; font-weight: 700; background: #059669; color: #fff; padding: 4px 10px; border-radius: 20px;">Python</span>
                <span style="font-size: 11px; font-weight: 700; background: #059669; color: #fff; padding: 4px 10px; border-radius: 20px;">SQL</span>
              </div>
            </div>

            <!-- Accordion Counters -->
            <div style="display: flex; flex-direction: column; gap: 8px; margin-top: 16px; font-size: 12px; color: #334155;">
              <div style="background: #f8fafc; padding: 8px 12px; border-radius: 6px; display: flex; justify-content: space-between;">
                <strong>Technical Skills: 12</strong>
                <span style="color: #64748b;">(Advanced Average)</span>
              </div>
              <div style="background: #f8fafc; padding: 8px 12px; border-radius: 6px; display: flex; justify-content: space-between;">
                <strong>Soft Skills: 8</strong>
                <span style="color: #64748b;">(Advanced Average)</span>
              </div>
              <div style="background: #f8fafc; padding: 8px 12px; border-radius: 6px; display: flex; justify-content: space-between;">
                <strong>Industry-Specific: 5</strong>
                <span style="color: #64748b;">(Intermediate Average)</span>
              </div>
            </div>
          </div>

          <!-- COLUMN 2: SKILLS GAP ANALYSIS & MATCHING FLOWCHART (IMAGE 4) -->
          <div class="card" style="padding: 22px;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 14px;">
              <h3 style="font-family: var(--font-heading); font-size: 16px; font-weight: 700; color: var(--primary);">
                Skills Gap Analysis
              </h3>
            </div>

            <!-- Gap Overview Bar Chart & Severity Indicators -->
            <div style="display: grid; grid-template-columns: 1fr 1.6fr; gap: 14px; margin-bottom: 20px;">
              <!-- Overview Stack -->
              <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px; padding: 12px; text-align: center;">
                <div style="font-size: 11px; font-weight: 700; color: #64748b; margin-bottom: 8px;">Gap Overview</div>
                <div style="height: 90px; width: 44px; margin: 0 auto; background: #fee2e2; border-radius: 8px; overflow: hidden; display: flex; flex-direction: column; justify-content: flex-end;">
                  <div style="background: linear-gradient(180deg, #6366f1 0%, #8b5cf6 100%); height: 78%;" title="Present Skills (78%)"></div>
                </div>
                <div style="display: flex; justify-content: space-around; margin-top: 8px; font-size: 10px; font-weight: 700;">
                  <span style="color: #4f46e5;">Present (78%)</span>
                  <span style="color: #ef4444;">Missing (22%)</span>
                </div>
              </div>

              <!-- Severity Indicators -->
              <div style="display: flex; flex-direction: column; gap: 8px; justify-content: center;">
                <div style="display: flex; align-items: center; gap: 10px;">
                  <div class="gap-severity-circle critical">3</div>
                  <div>
                    <strong style="font-size: 12px; color: #991b1b; display: block;">Critical Gaps:</strong>
                    <span style="font-size: 11px; color: #475569;">AWS, Cloud Computing, Big Data</span>
                  </div>
                </div>
                <div style="display: flex; align-items: center; gap: 10px;">
                  <div class="gap-severity-circle important">5</div>
                  <div>
                    <strong style="font-size: 12px; color: #c2410c; display: block;">Important Gaps:</strong>
                    <span style="font-size: 11px; color: #475569;">Docker, Kubernetes, A/B Testing</span>
                  </div>
                </div>
                <div style="display: flex; align-items: center; gap: 10px;">
                  <div class="gap-severity-circle nice">4</div>
                  <div>
                    <strong style="font-size: 12px; color: #854d0e; display: block;">Nice-to-have Gaps:</strong>
                    <span style="font-size: 11px; color: #475569;">Git, Jenkins, Agile</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- PROFILE VS TARGET ROLE MATCHING FLOWCHART (IMAGE 4) -->
            <div style="margin-top: 14px;">
              <div style="font-size: 12.5px; font-weight: 700; color: #1e293b; margin-bottom: 10px; text-align: center;">
                Profile vs. Target Role Requirements
              </div>

              <div class="flowchart-container">
                <!-- Left Column: Current Profile -->
                <div>
                  <div class="flowchart-column-title">Current Profile</div>
                  <div class="flowchart-node">Python (Advanced)</div>
                  <div class="flowchart-node">SQL (Advanced)</div>
                  <div class="flowchart-node">Tableau (Advanced)</div>
                  <div class="flowchart-node">Machine Learning (Intermediate)</div>
                </div>

                <!-- Right Column: Target Role Requirements -->
                <div>
                  <div class="flowchart-column-title">Target: ${targetCareer}</div>
                  <div class="flowchart-node target-match">Python (Expert) ✓</div>
                  <div class="flowchart-node target-match">SQL (Expert) ✓</div>
                  <div class="flowchart-node target-gap">AWS (Required) ⚠️</div>
                  <div class="flowchart-node target-gap">Cloud Computing (Required) ⚠️</div>
                  <div class="flowchart-node target-gap">Big Data (Required) ⚠️</div>
                  <div class="flowchart-node target-preferred">Docker (Preferred)</div>
                  <div class="flowchart-node target-preferred">Kubernetes (Preferred)</div>
                </div>
              </div>
            </div>
          </div>

          <!-- COLUMN 3: RECOMMENDED SKILLS TO ADD (IMAGE 4) -->
          <div class="card" style="padding: 22px;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 14px;">
              <h3 style="font-family: var(--font-heading); font-size: 16px; font-weight: 700; color: var(--primary);">
                Recommended Skills to Add
              </h3>
            </div>

            <!-- Prioritized Suggestions -->
            <div style="font-size: 12px; font-weight: 700; color: #475569; margin-bottom: 10px;">Prioritized Skill Suggestions:</div>
            
            <div style="display: flex; flex-direction: column; gap: 12px; margin-bottom: 20px;">
              <!-- Skill 1 -->
              <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 12px;">
                <div style="display: flex; justify-content: space-between; align-items: flex-start;">
                  <div>
                    <strong style="font-size: 12.5px; color: #1e293b;">1. AWS (Cloud Services)</strong>
                    <div style="font-size: 11px; color: #059669; font-weight: 600; margin-top: 2px;">High Impact (95%)</div>
                  </div>
                  <button class="btn btn-secondary" onclick="showToast('Added AWS to your resume skill targets', 'success')" style="padding: 3px 8px; font-size: 10.5px; width: auto; background: #e0e7ff; color: #4338ca; border-color: #c7d2fe;">
                    + Add to Resume
                  </button>
                </div>
                <div style="display: flex; gap: 8px; margin-top: 8px; font-size: 11px;">
                  <a href="https://aws.amazon.com/certification/" target="_blank" style="color: #4f46e5; text-decoration: none;">Learning Resource ↗</a>
                </div>
              </div>

              <!-- Skill 2 -->
              <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 12px;">
                <div style="display: flex; justify-content: space-between; align-items: flex-start;">
                  <div>
                    <strong style="font-size: 12.5px; color: #1e293b;">2. Cloud Computing</strong>
                    <div style="font-size: 11px; color: #059669; font-weight: 600; margin-top: 2px;">High Impact (90%)</div>
                  </div>
                  <button class="btn btn-secondary" onclick="showToast('Added Cloud Computing to target skills', 'success')" style="padding: 3px 8px; font-size: 10.5px; width: auto; background: #e0e7ff; color: #4338ca; border-color: #c7d2fe;">
                    + Add to Resume
                  </button>
                </div>
                <div style="display: flex; gap: 8px; margin-top: 8px; font-size: 11px;">
                  <a href="https://www.coursera.org/learn/cloud-computing-basics" target="_blank" style="color: #4f46e5; text-decoration: none;">Learning Resource ↗</a>
                </div>
              </div>

              <!-- Skill 3 -->
              <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 12px;">
                <div style="display: flex; justify-content: space-between; align-items: flex-start;">
                  <div>
                    <strong style="font-size: 12.5px; color: #1e293b;">3. Big Data Technologies</strong>
                    <div style="font-size: 11px; color: #059669; font-weight: 600; margin-top: 2px;">High Impact (88%)</div>
                  </div>
                  <button class="btn btn-secondary" onclick="showToast('Added Big Data to target skills', 'success')" style="padding: 3px 8px; font-size: 10.5px; width: auto; background: #e0e7ff; color: #4338ca; border-color: #c7d2fe;">
                    + Add to Resume
                  </button>
                </div>
                <div style="display: flex; gap: 8px; margin-top: 8px; font-size: 11px;">
                  <a href="https://spark.apache.org/" target="_blank" style="color: #4f46e5; text-decoration: none;">Learning Resource ↗</a>
                </div>
              </div>

              <!-- Skill 4 -->
              <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 12px;">
                <div style="display: flex; justify-content: space-between; align-items: flex-start;">
                  <div>
                    <strong style="font-size: 12.5px; color: #1e293b;">4. Docker & Containers</strong>
                    <div style="font-size: 11px; color: #2563eb; font-weight: 600; margin-top: 2px;">Medium Impact (75%)</div>
                  </div>
                  <button class="btn btn-secondary" onclick="showToast('Added Docker to target skills', 'success')" style="padding: 3px 8px; font-size: 10.5px; width: auto; background: #e0e7ff; color: #4338ca; border-color: #c7d2fe;">
                    + Add to Resume
                  </button>
                </div>
                <div style="display: flex; gap: 8px; margin-top: 8px; font-size: 11px;">
                  <a href="https://docs.docker.com/get-started/" target="_blank" style="color: #4f46e5; text-decoration: none;">Learning Resource ↗</a>
                </div>
              </div>
            </div>

            <!-- Learning Resources Links -->
            <div style="border-top: 1px solid #e2e8f0; padding-top: 14px;">
              <div style="font-size: 12px; font-weight: 700; color: #475569; margin-bottom: 8px;">Learning Resources:</div>
              <ul style="margin: 0; padding-left: 16px; font-size: 11.5px; line-height: 1.6; color: #4f46e5;">
                <li><a href="https://aws.amazon.com/certification/" target="_blank" style="color: #4f46e5; text-decoration: none;">AWS Certified Solutions Architect (Course) ↗</a></li>
                <li><a href="https://cloud.google.com/training" target="_blank" style="color: #4f46e5; text-decoration: none;">Introduction to Cloud Computing (Article) ↗</a></li>
                <li><a href="https://www.edx.org" target="_blank" style="color: #4f46e5; text-decoration: none;">Big Data Fundamentals (Webinar) ↗</a></li>
              </ul>
            </div>
          </div>
        </div>

        <!-- LOWER SUITE: RESUME ANALYZER | MOCK INTERVIEWS | JOBS TRACKER | PROGRESS -->
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 20px;">
          <!-- Card: Resume Analyzer -->
          <div class="card" style="padding: 20px;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
              <strong style="font-size: 14px; color: #1e293b; display: flex; align-items: center; gap: 6px;">
                <i data-lucide="file-check" style="color: var(--secondary);"></i> ATS Resume Score
              </strong>
              <span style="font-size: 12px; font-weight: 800; color: #16a34a; background: #dcfce7; padding: 2px 8px; border-radius: 12px;">74 / 100</span>
            </div>
            <p style="font-size: 12px; color: #64748b; margin-bottom: 12px;">
              Your resume matches 8 core keywords. Add Cloud and Docker to exceed 85+.
            </p>
            <button class="btn btn-secondary" onclick="switchTab('analyzer')" style="padding: 6px 14px; font-size: 12px; width: 100%;">
              Open Resume Analyzer →
            </button>
          </div>

          <!-- Card: AI Mock Interview -->
          <div class="card" style="padding: 20px;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
              <strong style="font-size: 14px; color: #1e293b; display: flex; align-items: center; gap: 6px;">
                <i data-lucide="mic" style="color: var(--secondary);"></i> AI Mock Interview
              </strong>
              <span class="ai-badge" style="font-size: 9px; padding: 2px 6px;">AI LIVE</span>
            </div>
            <p style="font-size: 12px; color: #64748b; margin-bottom: 12px;">
              Practice Technical & Behavioral questions with instant AI scoring and feedback.
            </p>
            <button class="btn" onclick="switchTab('mock-interview')" style="padding: 6px 14px; font-size: 12px; width: 100%;">
              Start Mock Interview →
            </button>
          </div>

          <!-- Card: Jobs & Internships -->
          <div class="card" style="padding: 20px;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
              <strong style="font-size: 14px; color: #1e293b; display: flex; align-items: center; gap: 6px;">
                <i data-lucide="briefcase" style="color: var(--secondary);"></i> Jobs & Internships
              </strong>
              <span style="font-size: 11px; color: #64748b;">3 Active</span>
            </div>
            <div style="display: flex; gap: 6px; margin-bottom: 12px;">
              <span style="font-size: 11px; background: #e0f2fe; color: #0369a1; padding: 2px 6px; border-radius: 4px;">Applied: 3</span>
              <span style="font-size: 11px; background: #fef3c7; color: #92400e; padding: 2px 6px; border-radius: 4px;">Interview: 1</span>
              <span style="font-size: 11px; background: #dcfce7; color: #166534; padding: 2px 6px; border-radius: 4px;">Offer: 0</span>
            </div>
            <button class="btn btn-secondary" onclick="switchTab('tracker')" style="padding: 6px 14px; font-size: 12px; width: 100%;">
              Track Applications →
            </button>
          </div>
        </div>

      </div>
    `;
  }

  if (window.lucide) window.lucide.createIcons();
}

function showProgressMetrics() {
  const r = state.activeRoadmap;
  const careerMapping = {
    "frontend-developer": "Frontend Dev",
    "backend-developer": "Backend Dev",
    "fullstack-developer": "Fullstack Dev",
    "ai-ml-engineer": "AI/ML Eng"
  };

  // 1. Active Career
  document.getElementById("metric-career").innerText = state.user ? (careerMapping[state.user.career] || "Software Dev") : "-";

  // 2. Streak count
  document.getElementById("metric-streak").innerText = `${state.streakCount} Day${state.streakCount > 1 ? 's' : ''}`;

  // 3. Roadmap progress percentage
  let percent = 0;
  if (r) {
    let totalTasks = 0;
    let finishedTasks = 0;
    r.roadmap.weeks.forEach((week, weekIdx) => {
      week.tasks.forEach((_, tIdx) => {
        totalTasks++;
        if (state.checklistProgress[`${weekIdx}-${tIdx}`]) {
          finishedTasks++;
        }
      });
    });
    if (totalTasks > 0) {
      percent = Math.round((finishedTasks / totalTasks) * 100);
    }
  }
  document.getElementById("metric-progress").innerText = `${percent}%`;

  // 4. Detected Gaps
  let gapCount = 0;
  const savedGaps = localStorage.getItem("devpath_gaps_count");
  if (savedGaps) gapCount = parseInt(savedGaps) || 0;
  document.getElementById("metric-gaps").innerText = gapCount;
}

// ==========================================
// 7. SKILL GAP ANALYZER
// ==========================================

function renderAnalyzer() {
  const resultsDiv = document.getElementById("analyzer-results-container");
  
  // Restore analysis if exists in local storage
  const savedAnalysis = localStorage.getItem("devpath_analysis_result");
  if (savedAnalysis) {
    resultsDiv.style.display = "grid";
    renderAnalysisResults(JSON.parse(savedAnalysis));
  } else {
    resultsDiv.style.display = "none";
  }
}


// ==========================================
// 6.B. CLIENT-SIDE RESUME & JD FILE UPLOADER
// ==========================================

function setupDragAndDrop() {
  const zones = [
    { id: "resume-drop-zone", type: "resume" },
    { id: "jd-drop-zone", type: "jd" }
  ];

  zones.forEach(z => {
    const el = document.getElementById(z.id);
    if (!el) return;

    ['dragenter', 'dragover'].forEach(eventName => {
      el.addEventListener(eventName, (e) => {
        e.preventDefault();
        e.stopPropagation();
        el.classList.add('dragover');
      }, false);
    });

    ['dragleave', 'drop'].forEach(eventName => {
      el.addEventListener(eventName, (e) => {
        e.preventDefault();
        e.stopPropagation();
        el.classList.remove('dragover');
      }, false);
    });

    el.addEventListener('drop', (e) => {
      const dt = e.dataTransfer;
      const files = dt.files;
      if (files && files.length > 0) {
        parseUploadedFile(files[0], z.type);
      }
    }, false);
  });
}

function triggerResumeUpload() {
  const input = document.getElementById("resume-file-input");
  if (input) input.click();
}

function triggerJDUpload() {
  const input = document.getElementById("jd-file-input");
  if (input) input.click();
}

function handleResumeFileSelect(event) {
  const file = event.target.files[0];
  if (file) {
    parseUploadedFile(file, "resume");
  }
}

function handleJDFileSelect(event) {
  const file = event.target.files[0];
  if (file) {
    parseUploadedFile(file, "jd");
  }
}

async function parseUploadedFile(file, targetType) {
  const textareaId = targetType === "resume" ? "analyzer-resume-text" : "analyzer-jd-text";
  const badgeId = targetType === "resume" ? "resume-file-badge" : "jd-file-badge";
  const nameId = targetType === "resume" ? "resume-file-name" : "jd-file-name";
  const metaId = targetType === "resume" ? "resume-file-meta" : "jd-file-meta";
  const dropZoneId = targetType === "resume" ? "resume-drop-zone" : "jd-drop-zone";

  const sizeKB = Math.round(file.size / 1024);
  const sizeStr = sizeKB > 1024 ? `${(sizeKB / 1024).toFixed(1)} MB` : `${sizeKB} KB`;

  showToast(`Parsing ${file.name} (${sizeStr})...`, "info");

  try {
    let extractedText = "";
    const ext = file.name.split('.').pop().toLowerCase();

    if (ext === "pdf") {
      if (typeof pdfjsLib === "undefined") {
        throw new Error("PDF.js library is loading. Please check network connection.");
      }
      pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
      
      const arrayBuffer = await file.arrayBuffer();
      const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
      const pdf = await loadingTask.promise;
      let textContent = [];

      for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
        const page = await pdf.getPage(pageNum);
        const textObj = await page.getTextContent();
        const pageStrings = textObj.items.map(item => item.str);
        textContent.push(pageStrings.join(" "));
      }
      extractedText = textContent.join("\n\n");
    } else if (ext === "docx") {
      if (typeof mammoth === "undefined") {
        throw new Error("Mammoth.js library is loading. Please check network connection.");
      }
      const arrayBuffer = await file.arrayBuffer();
      const result = await mammoth.extractRawText({ arrayBuffer: arrayBuffer });
      extractedText = result.value;
    } else {
      // Plain text, markdown, rtf
      extractedText = await file.text();
    }

    if (!extractedText || extractedText.trim().length === 0) {
      throw new Error("No readable text found in this file. (If it is a scanned image, please paste text directly).");
    }

    // Populate textarea
    const textarea = document.getElementById(textareaId);
    if (textarea) textarea.value = extractedText.trim();

    // Show badge
    const badge = document.getElementById(badgeId);
    const nameEl = document.getElementById(nameId);
    const metaEl = document.getElementById(metaId);
    const wordCount = extractedText.trim().split(/\s+/).length;

    if (nameEl) nameEl.innerText = file.name;
    if (metaEl) metaEl.innerText = `(${sizeStr} • ${wordCount} words)`;
    if (badge) badge.style.display = "flex";

    const dropZone = document.getElementById(dropZoneId);
    if (dropZone) {
      dropZone.style.borderColor = "var(--color-teal)";
    }

    showToast(`Extracted ${wordCount} words from ${file.name}!`, "success");
    lucide.createIcons();
  } catch (err) {
    console.error("File extraction error:", err);
    showToast(`Upload failed: ${err.message}`, "error");
  }
}

function clearUploadedFile(targetType) {
  const textareaId = targetType === "resume" ? "analyzer-resume-text" : "analyzer-jd-text";
  const badgeId = targetType === "resume" ? "resume-file-badge" : "jd-file-badge";
  const inputId = targetType === "resume" ? "resume-file-input" : "jd-file-input";
  const dropZoneId = targetType === "resume" ? "resume-drop-zone" : "jd-drop-zone";

  const textarea = document.getElementById(textareaId);
  const badge = document.getElementById(badgeId);
  const input = document.getElementById(inputId);
  const dropZone = document.getElementById(dropZoneId);

  if (textarea) textarea.value = "";
  if (badge) badge.style.display = "none";
  if (input) input.value = "";
  if (dropZone) dropZone.style.borderColor = "rgba(255, 255, 255, 0.15)";

  showToast(`Cleared ${targetType === "resume" ? "resume" : "job description"}`, "info");
}

function toggleDriveInput(targetType) {
  const boxId = targetType === "resume" ? "resume-drive-import-box" : "jd-drive-import-box";
  const box = document.getElementById(boxId);
  if (!box) return;

  if (box.style.display === "none" || !box.style.display) {
    box.style.display = "block";
    const input = document.getElementById(targetType === "resume" ? "resume-drive-url" : "jd-drive-url");
    if (input) input.focus();
  } else {
    box.style.display = "none";
  }
}

async function importFromDriveOrUrl(targetType) {
  const inputId = targetType === "resume" ? "resume-drive-url" : "jd-drive-url";
  const textareaId = targetType === "resume" ? "analyzer-resume-text" : "analyzer-jd-text";
  const boxId = targetType === "resume" ? "resume-drive-import-box" : "jd-drive-import-box";

  const input = document.getElementById(inputId);
  if (!input || !input.value.trim()) {
    showToast("Please enter a valid link or URL", "info");
    return;
  }

  let url = input.value.trim();
  showToast("Fetching document from cloud source...", "info");

  try {
    // If Google Docs link: convert to text export format
    const gdocsMatch = url.match(/\/document\/d\/([a-zA-Z0-9-_]+)/);
    if (gdocsMatch && gdocsMatch[1]) {
      url = `https://docs.google.com/document/d/${gdocsMatch[1]}/export?format=txt`;
    }

    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: Ensure the file is shared publicly ('Anyone with the link can view').`);
    }

    const text = await response.text();
    if (!text || text.trim().length === 0) {
      throw new Error("No text content found at this URL.");
    }

    const textarea = document.getElementById(textareaId);
    if (textarea) textarea.value = text.trim();

    const box = document.getElementById(boxId);
    if (box) box.style.display = "none";

    showToast("Successfully imported document text!", "success");
  } catch (err) {
    console.error("Drive import error:", err);
    showToast(`Cloud provider CORS restriction prevented direct fetch. Tip: Download file to device and drag-drop directly!`, "error");
  }
}

const DEMO_RESUMES = {
  tech: `ALEX CODER - Full Stack & AI Enthusiast\nEmail: alex@getcareerpilot.com | GitHub: github.com/alexcoder\n\nSUMMARY:\nHighly motivated software graduate passionate about designing interactive frontends, scalable APIs, and building AI tools.\n\nTECHNICAL SKILLS:\n- Languages: JavaScript, Python, HTML5, CSS3, SQL\n- Frameworks: React, Node.js, Express\n- Databases: PostgreSQL, MongoDB\n- Developer Tools: Git, VS Code, Docker Basics\n\nPROJECTS:\n1. BookTracker SaaS App (React, Express, SQLite)\nBuilt user login systems, routes to query book collections, and styled list pages.\n2. AI Document Search (Python, Basic LangChain)\nBuilt semantic chunk search script over local text documents.`,

  finance: `JORDAN SMITH - Aspiring Financial & Valuation Analyst\nEmail: jordan.smith@email.com | LinkedIn: linkedin.com/in/jordansmith\n\nSUMMARY:\nCommerce graduate with high honors in Corporate Finance & Accounting. Proven aptitude in dynamic three-statement modeling, DCF valuation, and Excel financial analysis.\n\nFINANCIAL & TECHNICAL SKILLS:\n- Financial Modeling: 3-Statement Forecasting, DCF Valuation, Comps Analysis\n- Software: Microsoft Excel (VBA, XLOOKUP, Pivot Tables), Power BI\n- Core Concepts: Ratio Analysis, Corporate Finance, Working Capital Management, Accounting Principles (GAAP)\n\nACADEMIC PROJECTS:\n1. Public Equity DCF Valuation (Retail Sector)\nConstructed 5-year DCF model calculating WACC and terminal exit multiples for a Fortune 500 retailer.\n2. Corporate Liquidity & Solvency Audit\nPerformed DuPont ROE decomposition and debt schedule stress tests across 5 industry competitors.`,

  design: `MAYA PATEL - UI/UX & Product Designer\nEmail: maya.patel@designhub.io | Portfolio: mayapatel.design\n\nSUMMARY:\nUser-centric product designer experienced in translating user research and friction into elegant, accessible mobile and web prototypes.\n\nDESIGN CAPABILITIES:\n- Design & Prototyping: Figma (Auto Layout 5.0, Component Variants), Adobe XD, Miro\n- UX Methodologies: User Interviews, Journey Mapping, Wireframing, Usability Testing, Heuristic Audits\n- Foundations: Design Systems, Typography, WCAG 2.1 Accessibility, Color Theory\n\nKEY PROJECTS:\n1. MedCare Telehealth Mobile App (Figma)\nConducted 6 patient discovery interviews, built wireframes, and created an interactive appointment booking prototype.\n2. EcoShop Responsive Design System\nConstructed an Atomic UI library of 25+ reusable components adhering to 4.5:1 contrast accessibility guidelines.`,

  healthcare: `DR. AVERY CHEN - Biomedical Researcher & Life Sciences Specialist\nEmail: avery.chen@bioresearch.org | ORCID: 0000-0002-1823-4567\n\nSUMMARY:\nBiomedical science researcher with hands-on expertise in molecular assays, clinical protocol compliance, and biostatistical analysis.\n\nLABORATORY & RESEARCH SKILLS:\n- Assays & Lab: PCR, qPCR, Gel Electrophoresis, ELISA, Cell Culture, Good Laboratory Practice (GLP)\n- Compliance: ICH-GCP Clinical Guidelines, IRB Protocol Documentation, HIPAA\n- Computational: Biostatistics in R, GraphPad Prism, NCBI BLAST, Sequence Alignment\n\nRESEARCH CONTRIBUTIONS:\n1. Oncology Biomarker Expression Profiling\nQuantified oncogene expression changes using real-time qPCR assays across 30 tissue specimens.\n2. Phase II Clinical Trial Protocol Design\nDrafted complete clinical protocol, informed consent documentation, and safety monitoring rules compliant with GCP.`
};

const DEMO_JDS = {
  tech: `NeuralPulse Systems - Full Stack & AI Integrations Developer\n\nABOUT THE ROLE:\nWe are seeking a developer to build modern web modules and connect LLM workflows into production applications.\n\nREQUIREMENTS:\n- Proficiency with React, TypeScript, and modern frontend styling (Tailwind CSS).\n- Backend experience with Node.js, Express, or Python (FastAPI).\n- Relational databases (PostgreSQL, Prisma) and cloud deployments (Docker).\n- Exposure to Vector Databases (ChromaDB) and Generative AI APIs.`,

  finance: `Beacon Capital Partners - Junior Financial Analyst (Valuation & M&A)\n\nABOUT THE ROLE:\nJoin our investment analytics team supporting equity research, financial due diligence, and valuation modeling for corporate acquisitions.\n\nKEY RESPONSIBILITIES:\n- Construct detailed 3-statement financial forecasting models and DCF valuations.\n- Conduct comparable company trading comps and precedent transaction analyses.\n- Perform monthly budget-to-actual variance audits and working capital stress tests.\n- Prepare investment committee presentation decks and sensitivity football fields.`,

  design: `StudioVerve Digital - Product & UI/UX Designer\n\nABOUT THE ROLE:\nSeeking a UI/UX Designer to own user journeys, build scalable design systems, and deliver delightful mobile and web experiences.\n\nQUALIFICATIONS:\n- High proficiency in Figma (Auto Layout, Design Tokens, Interactive Variables).\n- Deep empathy for user research, usability testing, and wireframing.\n- Solid grasp of WCAG 2.1 AA accessibility standards and responsive UI patterns.\n- Experience delivering clear specs and component documentation for engineering handoff.`,

  healthcare: `BioHealth Diagnostics - Clinical Trial & Research Associate\n\nABOUT THE ROLE:\nSeeking an associate to assist in the oversight of Phase II clinical research protocols and laboratory assay evaluations.\n\nQUALIFICATIONS:\n- Working knowledge of ICH-GCP regulatory guidelines and clinical trial ethics.\n- Experience with molecular biology techniques (qPCR, ELISA, cell culture).\n- Strong biostatistical foundations (R or GraphPad Prism for survival curves).\n- Clear scientific documentation and Standard Operating Procedure (SOP) writing.`
};

function loadDemoResume(discipline = null) {
  let disc = discipline;
  if (!disc) {
    const career = state.user ? state.user.career : "tech";
    if (career.includes("finance")) disc = "finance";
    else if (career.includes("design") || career.includes("ui")) disc = "design";
    else if (career.includes("biomedical") || career.includes("health")) disc = "healthcare";
    else disc = "tech";
  }

  const resume = DEMO_RESUMES[disc] || DEMO_RESUMES.tech;
  const el = document.getElementById("analyzer-resume-text");
  if (el) el.value = resume;
  showToast(`Loaded sample ${disc.toUpperCase()} resume!`, "info");
}

function loadDemoJD(discipline = null) {
  let disc = discipline;
  if (!disc) {
    const career = state.user ? state.user.career : "tech";
    if (career.includes("finance")) disc = "finance";
    else if (career.includes("design") || career.includes("ui")) disc = "design";
    else if (career.includes("biomedical") || career.includes("health")) disc = "healthcare";
    else disc = "tech";
  }

  const jd = DEMO_JDS[disc] || DEMO_JDS.tech;
  const el = document.getElementById("analyzer-jd-text");
  if (el) el.value = jd;
  showToast(`Loaded sample ${disc.toUpperCase()} job description!`, "info");
}

function setAnalyzerMode(mode) {
  state.analyzerMode = mode;
  saveStateToLocalStorage();

  const llmBtn = document.getElementById("toggle-analyzer-llm");
  const localBtn = document.getElementById("toggle-analyzer-local");

  if (mode === "llm") {
    if (llmBtn) llmBtn.classList.add("active");
    if (localBtn) localBtn.classList.remove("active");
    showToast("Switched to Gemini LLM Semantic Analysis", "info");
  } else {
    if (localBtn) localBtn.classList.add("active");
    if (llmBtn) llmBtn.classList.remove("active");
    showToast("Switched to Fast Local Regex Matcher", "info");
  }
}

async function runAnalysis() {
  const resumeText = document.getElementById("analyzer-resume-text").value.trim();
  const jdText = document.getElementById("analyzer-jd-text").value.trim();

  if (!resumeText || !jdText) {
    showToast("Please provide both Resume and Job Description text.", "info");
    return;
  }

  const loader = document.getElementById("analyzer-loading");
  loader.style.display = "block";
  document.getElementById("analyzer-results-container").style.display = "none";

  try {
    let result;
    if (state.analyzerMode === "llm") {
      result = await AIService.analyzeResumeSkillGap(resumeText, jdText, state.apiKey);
    } else {
      result = ResumeAnalyzer.analyzeGap(resumeText, jdText);
    }

    // Save result
    localStorage.setItem("devpath_analysis_result", JSON.stringify(result));
    localStorage.setItem("devpath_gaps_count", result.missingSkills.length.toString());

    renderAnalysisResults(result);
    document.getElementById("analyzer-results-container").style.display = "grid";
    document.getElementById("analyzer-results-container").scrollIntoView({ behavior: 'smooth' });
    showToast("Skill gap audit completed!", "success");
  } catch (err) {
    console.error("Skill Gap Analysis error:", err);
    showToast(`Analysis failed: ${err.message}`, "error");
  } finally {
    loader.style.display = "none";
    lucide.createIcons();
  }
}

function renderAnalysisResults(r) {
  // AI Recruiter Verdict Banner
  const verdictCard = document.getElementById("analyzer-verdict-card");
  const verdictText = document.getElementById("analyzer-verdict-text");
  const engineTag = document.getElementById("analyzer-engine-tag");

  if (r.isLLM && r.aiRecruiterVerdict) {
    verdictCard.style.display = "block";
    verdictText.innerText = r.aiRecruiterVerdict;
    if (engineTag) engineTag.innerText = "Gemini 1.5 Flash • Semantic Evaluation";
  } else if (verdictCard) {
    verdictCard.style.display = "none";
  }

  // Score indicator
  document.getElementById("analyzer-match-score").innerText = `${r.matchScore}%`;
  
  // Color scale score
  const scoreCircle = document.querySelector(".score-circle");
  if (r.matchScore < 40) {
    scoreCircle.style.borderColor = "var(--color-pink)";
  } else if (r.matchScore < 70) {
    scoreCircle.style.borderColor = "var(--color-indigo)";
  } else {
    scoreCircle.style.borderColor = "var(--color-teal)";
  }

  // Weak Areas recommendations
  const weakBox = document.getElementById("analyzer-weak-areas-box");
  weakBox.innerHTML = r.weakAreas.map(w => `<p>• ${w}</p>`).join("");

  // Matched Skills tags
  const matchedBox = document.getElementById("analyzer-matched-skills");
  matchedBox.innerHTML = "";
  if (r.matchedSkills.length === 0) {
    matchedBox.innerHTML = `<span style="font-size: 12px; color: var(--text-muted);">None detected</span>`;
  } else {
    r.matchedSkills.forEach(skill => {
      const span = document.createElement("span");
      span.className = "tag";
      span.innerText = skill;
      matchedBox.appendChild(span);
    });
  }

  // Missing Gaps table lists
  const missingBox = document.getElementById("analyzer-missing-skills-list");
  missingBox.innerHTML = "";
  
  if (r.missingSkills.length === 0) {
    missingBox.innerHTML = `
      <div style="text-align: center; padding: 25px 0;">
        <i data-lucide="check-circle" style="color: var(--color-teal); width: 24px; height: 24px; margin-bottom: 5px;"></i>
        <p style="font-size: 13px; font-weight: 600;">100% Matching Competencies!</p>
      </div>
    `;
    document.getElementById("btn-add-gaps-roadmap").style.display = "none";
  } else {
    document.getElementById("btn-add-gaps-roadmap").style.display = "block";
    r.missingSkills.forEach(item => {
      const row = document.createElement("div");
      row.className = "gap-item-row";
      row.innerHTML = `
        <span class="gap-item-name">${item.name}</span>
        <div class="gap-item-meta">
          <span class="badge-category">${item.category}</span>
          <span class="badge-priority ${item.priority.toLowerCase()}">${item.priority}</span>
        </div>
      `;
      missingBox.appendChild(row);
    });
  }

  // Suggested Actions List
  const actionsBox = document.getElementById("analyzer-suggested-actions");
  actionsBox.innerHTML = "";
  if (r.learningPriority.length === 0) {
    actionsBox.innerHTML = `<p style="font-size: 12px; color: var(--text-muted);">No urgent actions required.</p>`;
  } else {
    r.learningPriority.forEach(item => {
      const div = document.createElement("div");
      div.style.background = "rgba(255, 255, 255, 0.02)";
      div.style.border = "1px solid var(--border-glass)";
      div.style.borderRadius = "8px";
      div.style.padding = "10px 14px";
      div.style.fontSize = "13px";
      div.innerHTML = `
        <div style="display: flex; justify-content: space-between; font-weight: 600; margin-bottom: 4px;">
          <span>Study ${item.skill}</span>
          <span style="color: ${item.urgency.includes('Immediate') ? 'var(--color-pink)' : 'var(--color-indigo)'}; font-size: 10px; text-transform: uppercase;">${item.urgency}</span>
        </div>
        <p style="color: var(--text-secondary); font-size: 12px; line-height: 1.4;">${item.action}</p>
      `;
      actionsBox.appendChild(div);
    });
  }
}

function addGapsToRoadmap() {
  const savedAnalysis = localStorage.getItem("devpath_analysis_result");
  if (!savedAnalysis || !state.activeRoadmap) {
    showToast("Please run gap analysis and ensure you have an active roadmap first.", "info");
    return;
  }

  const analysis = JSON.parse(savedAnalysis);
  const criticalMissing = analysis.missingSkills.filter(item => 
    item.priority === "Critical" || item.priority === "High"
  ).map(item => item.name);

  if (criticalMissing.length === 0) {
    showToast("No critical gaps to inject.", "info");
    return;
  }

  // Inject a remediation section into the active roadmap
  const r = state.activeRoadmap;
  
  // Look if there is already a custom remediation week
  let remediationWeekIdx = r.roadmap.weeks.findIndex(week => 
    week.title.includes("Skill Gap Remediation")
  );

  if (remediationWeekIdx !== -1) {
    // Append topics/tasks to existing remediation week
    criticalMissing.forEach(skill => {
      if (!r.roadmap.weeks[remediationWeekIdx].topics.includes(`Master ${skill}`)) {
        r.roadmap.weeks[remediationWeekIdx].topics.push(`Master ${skill}`);
        r.roadmap.weeks[remediationWeekIdx].tasks.push(`Complete tutorial and build sandbox testing application for ${skill}`);
      }
    });
  } else {
    // Create new remediation week
    const newWeek = {
      title: "Week 5: Custom Skill Gap Remediation",
      topics: criticalMissing.map(skill => `Master ${skill}`),
      tasks: criticalMissing.map(skill => `Complete tutorial and build sandbox testing application for ${skill}`),
      hoursRequired: Math.min(criticalMissing.length * 4, 25)
    };
    r.roadmap.weeks.push(newWeek);
  }

  // Also add missing skills to Master stack list
  criticalMissing.forEach(skill => {
    if (!r.skills.includes(skill)) r.skills.push(skill);
  });

  saveStateToLocalStorage();
  showToast(`Injected ${criticalMissing.length} critical gap tasks into your active roadmap!`, "success");
  
  // Re-render views
  renderActiveRoadmap();
  renderDashboard();
}

// ==========================================
// 8. AI MENTOR CHAT CONTROLLER
// ==========================================

function renderChat() {
  const windowDiv = document.getElementById("chat-messages-window");
  windowDiv.innerHTML = "";

  if (state.chatHistory.length === 0) {
    // Initial bot welcome
    const careerMapping = {
      "frontend-developer": "Frontend Developer",
      "backend-developer": "Backend Developer",
      "fullstack-developer": "Fullstack Developer",
      "ai-ml-engineer": "AI / ML Engineer"
    };
    const careerName = state.user ? (careerMapping[state.user.career] || "Software Developer") : "Software Developer";
    
    state.chatHistory = [
      {
        sender: "bot",
        text: `Hi ${state.user ? state.user.username : 'there'}! I am your AI Career Mentor. I've analyzed your goals and targets to become a **${careerName}**.

What specific questions can I help you with today? You can ask me how to structure your projects, clarify technical concepts, or practice mock interview questions.`,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ];
    saveStateToLocalStorage();
  }

  // Populate chats
  state.chatHistory.forEach(msg => {
    const bubble = document.createElement("div");
    bubble.className = msg.sender === "bot" ? "chat-bubble bot" : "chat-bubble user";
    
    // Parse basic markdown-like syntax for bold and backticks code blocks
    let parsedText = msg.text
      .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
      .replace(/\*([^*]+)\*/g, '<em>$1</em>')
      .replace(/\`([^`]+)\`/g, '<code style="background: rgba(255,255,255,0.08); padding: 2px 5px; border-radius: 4px; font-family: monospace;">$1</code>');

    bubble.innerHTML = `
      <p style="white-space: pre-line;">${parsedText}</p>
      <span style="font-size: 9px; color: var(--text-muted); display: block; margin-top: 5px; text-align: right;">${msg.time}</span>
    `;
    windowDiv.appendChild(bubble);
  });

  // Scroll to bottom
  windowDiv.scrollTop = windowDiv.scrollHeight;
}

async function sendChatMessage() {
  const field = document.getElementById("chat-input-field");
  const text = field.value.trim();
  if (!text) return;

  // Clear input
  field.value = "";

  const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  // Add user bubble
  state.chatHistory.push({
    sender: "user",
    text: text,
    time: timeStr
  });
  saveStateToLocalStorage();
  renderChat();

  // Render typing indicator
  const windowDiv = document.getElementById("chat-messages-window");
  const typingDiv = document.createElement("div");
  typingDiv.id = "chat-typing-indicator";
  typingDiv.className = "chat-bubble bot";
  typingDiv.innerHTML = `<span style="color: var(--text-muted);">Mentor is typing...</span>`;
  windowDiv.appendChild(typingDiv);
  windowDiv.scrollTop = windowDiv.scrollHeight;

  try {
    const careerContext = state.user ? state.user.career : "Software Developer";
    const reply = await AIService.getChatReply(
      state.chatHistory.slice(0, -1), // feed previous history (exclude current typing placeholder)
      text,
      careerContext,
      state.apiKey
    );

    // Remove typing placeholder
    const placeholder = document.getElementById("chat-typing-indicator");
    if (placeholder) placeholder.remove();

    // Add bot reply
    state.chatHistory.push({
      sender: "bot",
      text: reply,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    });
    saveStateToLocalStorage();
    renderChat();

  } catch (err) {
    const placeholder = document.getElementById("chat-typing-indicator");
    if (placeholder) placeholder.remove();

    state.chatHistory.push({
      sender: "bot",
      text: `Apologies, I encountered a communication error: ${err.message}. Please verify your network or local API settings.`,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    });
    saveStateToLocalStorage();
    renderChat();
  }
}

function sendPresetChat(msgText) {
  document.getElementById("chat-input-field").value = msgText;
  sendChatMessage();
}

function clearChatHistory() {
  state.chatHistory = [];
  saveStateToLocalStorage();
  renderChat();
  showToast("Chat transcript cleared", "info");
}

// ==========================================
// 9. PROGRESS TRACKER & JOB SEARCH MATCHES
// ==========================================

function renderTracker() {
  const r = state.activeRoadmap;
  const box = document.getElementById("tracker-checklist-box");
  const badge = document.getElementById("tracker-progress-badge");
  const progressPct = document.getElementById("tracker-progress-pct");
  const progressBar = document.getElementById("tracker-progress-bar");

  if (!r) {
    box.innerHTML = `
      <p class="text-secondary" style="font-size: 14px; text-align: center; padding: 40px 0;">
        Create a roadmap to populate the progress tracker checklist!
      </p>
    `;
    badge.innerText = "0 / 0 Tasks";
    progressPct.innerText = "0%";
    progressBar.style.width = "0%";
    renderAchievements(0);
    renderJobOpenings();
    return;
  }

  // Count items
  let total = 0;
  let checked = 0;
  let checklistHtml = [];

  r.roadmap.weeks.forEach((week, weekIdx) => {
    checklistHtml.push(`<h4 style="font-family: var(--font-heading); font-size: 14px; font-weight: 600; margin-top: 15px; margin-bottom: 5px; color: var(--color-indigo);">${week.title}</h4>`);
    
    week.tasks.forEach((task, taskIdx) => {
      total++;
      const key = `${weekIdx}-${taskIdx}`;
      const isChecked = state.checklistProgress[key];
      if (isChecked) checked++;

      checklistHtml.push(`
        <div class="checklist-item ${isChecked ? 'checked' : ''}" onclick="toggleTrackerTask(${weekIdx}, ${taskIdx})">
          <div class="checklist-checkbox">
            <i data-lucide="check"></i>
          </div>
          <span class="checklist-text">${task}</span>
        </div>
      `);
    });
  });

  box.innerHTML = checklistHtml.join("");
  badge.innerText = `${checked} / ${total} Tasks`;
  
  const pct = total > 0 ? Math.round((checked / total) * 100) : 0;
  progressPct.innerText = `${pct}%`;
  progressBar.style.width = `${pct}%`;

  lucide.createIcons();

  // Render milestone badges and jobs
  renderAchievements(pct);
  renderJobOpenings();
}

function toggleTrackerTask(weekIdx, taskIdx) {
  toggleTask(weekIdx, taskIdx);
  renderTracker();
}

function renderAchievements(percentage) {
  const box = document.getElementById("tracker-achievements-box");
  box.innerHTML = "";

  const achievements = [
    { name: "Code Explorer", desc: "Initialize AI Roadmap", icon: "compass", unlocked: state.activeRoadmap !== null },
    { name: "First Milestone", desc: "Cross 25% complete mark", icon: "award", unlocked: percentage >= 25 },
    { name: "Halfway There", desc: "Cross 50% complete mark", icon: "shield", unlocked: percentage >= 50 },
    { name: "Career Ready", desc: "Audit resume skill gaps", icon: "sparkles", unlocked: localStorage.getItem("devpath_analysis_result") !== null }
  ];

  achievements.forEach(ach => {
    const card = document.createElement("div");
    card.style.background = ach.unlocked ? "rgba(20, 184, 166, 0.05)" : "rgba(255, 255, 255, 0.02)";
    card.style.border = "1px solid " + (ach.unlocked ? "rgba(20, 184, 166, 0.25)" : "var(--border-glass)");
    card.style.borderRadius = "10px";
    card.style.padding = "12px";
    card.style.display = "flex";
    card.style.alignItems = "center";
    card.style.gap = "12px";
    card.style.opacity = ach.unlocked ? 1 : 0.5;

    card.innerHTML = `
      <div style="width: 36px; height: 36px; border-radius: 50%; background: ${ach.unlocked ? 'var(--color-teal)' : 'rgba(255,255,255,0.05)'}; color: ${ach.unlocked ? 'white' : 'var(--text-muted)'}; display: flex; justify-content: center; align-items: center;">
        <i data-lucide="${ach.icon}"></i>
      </div>
      <div>
        <h5 style="font-size: 13px; font-weight: 600; color: ${ach.unlocked ? 'var(--text-primary)' : 'var(--text-secondary)'};">${ach.name}</h5>
        <p style="font-size: 11px; color: var(--text-muted);">${ach.desc}</p>
      </div>
    `;
    box.appendChild(card);
  });
  lucide.createIcons();
}

function renderJobOpenings() {
  const box = document.getElementById("tracker-jobs-box");
  if (!box) return;
  box.innerHTML = "";

  const userCareer = state.user ? state.user.career : "frontend-developer";
  const userSkills = state.user ? state.user.skills.map(s => s.toLowerCase()) : [];

  let relevantJobs = MOCK_JOBS.filter(job => job.career === userCareer);
  if (relevantJobs.length === 0) {
    relevantJobs = MOCK_JOBS.slice(0, 5); // Fallback to showcase available opportunities
  }

  relevantJobs.forEach(job => {
    const matched = job.tags.filter(tag => userSkills.includes(tag.toLowerCase()));
    const missing = job.tags.filter(tag => !userSkills.includes(tag.toLowerCase()));
    const score = Math.max(30, Math.round((matched.length / job.tags.length) * 100));

    const div = document.createElement("div");
    div.style.background = "rgba(255, 255, 255, 0.02)";
    div.style.border = "1px solid var(--border-glass)";
    div.style.borderRadius = "12px";
    div.style.padding = "18px";
    div.style.display = "flex";
    div.style.flexDirection = "column";
    div.style.gap = "10px";
    div.style.transition = "var(--transition-smooth)";

    const tagsHTML = job.tags.map(tag => {
      const isMatched = userSkills.includes(tag.toLowerCase());
      return `<span class="tag" style="font-size: 10px; padding: 2px 7px; ${isMatched ? 'background: rgba(20, 184, 166, 0.15); color: var(--color-teal); border-color: rgba(20, 184, 166, 0.3);' : 'background: rgba(236, 72, 153, 0.08); color: var(--color-pink); border-color: rgba(236, 72, 153, 0.2);'}">${isMatched ? '✓ ' : '+ '}${tag}</span>`;
    }).join(" ");

    div.innerHTML = `
      <div style="display: flex; justify-content: space-between; align-items: flex-start;">
        <div>
          <h5 style="font-size: 15px; font-weight: 700; color: var(--primary);">${job.title}</h5>
          <span style="font-size: 12px; color: var(--text-secondary);">${job.company} • ${job.location}</span>
        </div>
        <span class="ai-badge" style="${score >= 70 ? 'border-color: var(--color-teal); color: var(--color-teal);' : 'border-color: var(--color-indigo); color: var(--color-indigo);'}">${score}% Match</span>
      </div>
      <p style="font-size: 12px; color: var(--text-secondary); line-height: 1.4; margin: 0;">${job.description}</p>
      
      <div style="display: flex; flex-wrap: wrap; gap: 5px; margin-top: 4px;">
        ${tagsHTML}
      </div>

      <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 6px; padding-top: 10px; border-top: 1px solid var(--border-glass);">
        <span style="font-size: 12px; font-weight: 700; color: var(--color-pink);">${job.salary}</span>
        <div style="display: flex; gap: 8px;">
          <button class="btn btn-secondary" onclick="openJobGuidanceModal('${job.id}')" style="padding: 6px 12px; font-size: 11px; width: auto; border-color: rgba(99, 102, 241, 0.4); display: flex; align-items: center; gap: 5px;">
            <i data-lucide="sparkles" style="width: 12px; height: 12px; color: var(--color-teal);"></i> AI Guidance
          </button>
          <button class="btn btn-secondary" onclick="applyJobMock('${job.title}')" style="padding: 6px 12px; font-size: 11px; width: auto; border-color: rgba(255,255,255,0.08);">
            Quick Apply
          </button>
        </div>
      </div>
    `;
    box.appendChild(div);
  });
  lucide.createIcons();
}

async function openJobGuidanceModal(jobId) {
  const job = MOCK_JOBS.find(j => j.id === jobId);
  if (!job) return;

  state.activeGuidanceJob = job;
  const modal = document.getElementById("job-guidance-modal");
  const modalTitle = document.getElementById("modal-job-title");
  const modalCompany = document.getElementById("modal-job-company");
  const loader = document.getElementById("modal-guidance-loading");
  const content = document.getElementById("modal-guidance-content");

  modalTitle.innerText = `${job.title} — AI Career Guidance`;
  modalCompany.innerText = `${job.company} • ${job.location} • Target: ${job.career.replace("-", " ").toUpperCase()}`;

  modal.style.display = "flex";
  loader.style.display = "block";
  content.style.display = "none";

  const userProfile = {
    career: state.user ? state.user.career : "frontend-developer",
    skills: state.user ? state.user.skills : [],
    level: state.user ? state.user.level : "intermediate",
    progress: document.getElementById("metric-progress") ? parseInt(document.getElementById("metric-progress").innerText) || 0 : 0
  };

  try {
    const guidance = await AIService.generateJobCareerGuidance(job, userProfile, state.apiKey);
    renderJobGuidanceModalContent(job, guidance);
    content.style.display = "block";
  } catch (err) {
    console.error("Job Guidance error:", err);
    content.innerHTML = `<p style="color: var(--color-pink); padding: 20px 0;">Error generating guidance: ${err.message}</p>`;
    content.style.display = "block";
  } finally {
    loader.style.display = "none";
    lucide.createIcons();
  }
}

function renderJobGuidanceModalContent(job, g) {
  const content = document.getElementById("modal-guidance-content");

  const questionsHTML = (g.tailoredInterviewQuestions || []).map((q, idx) => `
    <div class="qa-card">
      <div style="font-size: 13px; font-weight: 700; color: var(--primary); margin-bottom: 4px;">
        Q${idx + 1}: ${q.question}
      </div>
      <div style="font-size: 12px; color: var(--color-teal); line-height: 1.4;">
        💡 <strong>Coaching Strategy:</strong> ${q.coachingTip}
      </div>
    </div>
  `).join("");

  const bulletsHTML = (g.recommendedResumeBullets || []).map((b, idx) => `
    <div class="bullet-suggestion">
      <span>• ${b}</span>
      <button class="btn btn-secondary" onclick="copyToClipboard('${b.replace(/'/g, "\'")}')" style="padding: 4px 8px; font-size: 10px; width: auto; white-space: nowrap;">
        Copy Bullet
      </button>
    </div>
  `).join("");

  content.innerHTML = `
    <!-- Top Readiness Summary -->
    <div class="guidance-metric-box">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
        <span class="ai-badge">${g.readinessVerdict || 'Candidate Assessment'}</span>
        <span style="font-family: var(--font-heading); font-size: 18px; font-weight: 700; color: var(--color-teal);">${g.readinessScore}% Fit Quotient</span>
      </div>
      <p style="font-size: 13px; color: var(--text-secondary); line-height: 1.6; margin: 0;">
        ${g.personalizedGuidance}
      </p>
    </div>

    <!-- 7-Day Sprint Action Plan -->
    <div style="background: rgba(99, 102, 241, 0.08); border: 1px solid rgba(99, 102, 241, 0.25); border-radius: 12px; padding: 14px 18px; margin-bottom: 20px;">
      <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 4px;">
        <i data-lucide="zap" style="width: 16px; height: 16px; color: var(--color-teal);"></i>
        <h5 style="font-family: var(--font-heading); font-size: 13px; font-weight: 700; color: var(--primary); text-transform: uppercase;">7-Day Sprint Plan</h5>
      </div>
      <p style="font-size: 12px; color: var(--text-secondary); margin: 0; line-height: 1.5;">${g.oneWeekSprintPlan}</p>
    </div>

    <!-- Tailored Interview Questions -->
    <div style="margin-bottom: 20px;">
      <h5 style="font-family: var(--font-heading); font-size: 14px; font-weight: 700; color: var(--primary); margin-bottom: 12px; display: flex; align-items: center; gap: 6px;">
        <i data-lucide="help-circle" style="width: 16px; height: 16px; color: var(--color-indigo);"></i> Anticipated Interview Questions & Defense
      </h5>
      ${questionsHTML}
    </div>

    <!-- Recommended STAR Resume Bullets -->
    <div>
      <h5 style="font-family: var(--font-heading); font-size: 14px; font-weight: 700; color: var(--primary); margin-bottom: 12px; display: flex; align-items: center; gap: 6px;">
        <i data-lucide="file-check-2" style="width: 16px; height: 16px; color: var(--color-pink);"></i> Tailored STAR Resume Bullets to Add
      </h5>
      ${bulletsHTML}
    </div>
  `;
}

function closeJobGuidanceModal() {
  document.getElementById("job-guidance-modal").style.display = "none";
}

function copyToClipboard(text) {
  navigator.clipboard.writeText(text).then(() => {
    showToast("Copied resume bullet to clipboard!", "success");
  }).catch(() => {
    showToast("Failed to copy to clipboard", "error");
  });
}

function applyJobMock(title) {
  showToast(`Mock application submitted for "${title}"!`, "success");
}

// ==========================================
// 10. CONFIGURATION & SETTINGS
// ==========================================

let activeSettingsSection = "profile";

function renderSettings() {
  if (!state.user) return;
  document.getElementById("set-username").value = state.user.username;
  document.getElementById("set-email").value = state.user.email;
  document.getElementById("set-apikey").value = state.apiKey;
}

function switchSettingsSection(sect) {
  activeSettingsSection = sect;
  const sections = ["profile", "api", "system"];
  
  sections.forEach(s => {
    const el = document.getElementById(`settings-sect-${s}`);
    const btn = document.getElementById(`settings-tab-${s}`);
    
    if (s === sect) {
      el.style.display = "block";
      btn.classList.add("active");
    } else {
      el.style.display = "none";
      btn.classList.remove("active");
    }
  });
}

function saveUserProfile() {
  const username = document.getElementById("set-username").value.trim();
  if (username) {
    state.user.username = username;
    saveStateToLocalStorage();
    showToast("Profile credentials updated successfully", "success");
    showDashboardWorkspace();
  }
}

function saveApiKey() {
  const key = document.getElementById("set-apikey").value.trim();
  state.apiKey = key;
  saveStateToLocalStorage();
  showToast("Gemini API key configured successfully!", "success");
}

function toggleApiKeyVisibility() {
  const input = document.getElementById("set-apikey");
  const icon = document.getElementById("eye-icon");
  if (input.type === "password") {
    input.type = "text";
    icon.setAttribute("data-lucide", "eye-off");
  } else {
    input.type = "password";
    icon.setAttribute("data-lucide", "eye");
  }
  lucide.createIcons();
}

function clearAllAppData() {
  if (confirm("Are you absolutely sure you want to purge all configuration data? This resets the dashboard fully.")) {
    localStorage.clear();
    state = {
      user: null,
      activeRoadmap: null,
      checklistProgress: {},
      chatHistory: [],
      apiKey: "",
      streakCount: 1,
      lastActiveDate: ""
    };
    showToast("Application cache deleted successfully", "info");
    showAuthScreen();
  }
}

// ==========================================
// 11. TOAST NOTIFICATION SERVICE
// ==========================================

function showToast(message, type = "info") {
  const container = document.getElementById("toast-container");
  if (!container) return;

  const toast = document.createElement("div");
  toast.className = "toast-notification";
  
  let icon = "info";
  if (type === "success") {
    icon = "check-circle";
    toast.style.borderColor = "var(--color-teal)";
    toast.style.boxShadow = "var(--glow-shadow-teal)";
  } else if (type === "error") {
    icon = "alert-octagon";
    toast.style.borderColor = "var(--color-pink)";
    toast.style.boxShadow = "0 0 20px rgba(236, 72, 153, 0.3)";
  } else {
    toast.style.borderColor = "var(--color-indigo)";
    toast.style.boxShadow = "var(--glow-shadow-indigo)";
  }

  toast.innerHTML = `
    <i data-lucide="${icon}"></i>
    <span style="font-size: 13px; font-weight: 500;">${message}</span>
  `;

  container.appendChild(toast);
  lucide.createIcons();

  // Slide out and remove
  setTimeout(() => {
    toast.style.animation = "slideOutRight 0.4s forwards";
    toast.addEventListener("animationend", () => {
      toast.remove();
    });
  }, 4000);
}
// Add styling code for exit transition dynamically
const styleSheet = document.createElement("style");
styleSheet.innerText = `
@keyframes slideOutRight {
  from { transform: translateX(0); opacity: 1; }
  to { transform: translateX(120%); opacity: 0; }
}
@keyframes spin {
  to { transform: rotate(360deg); }
}
`;
document.head.appendChild(styleSheet);


// ==========================================
// 8. STAGE-ADAPTIVE PERSONALIZATION ENGINE
// ==========================================

function onStageChange(stage) {
  state.academicStage = stage;
  localStorage.setItem("devpath_academic_stage", stage);

  // Sync header dropdown if triggered programmatically
  const select = document.getElementById("stage-select-global");
  if (select && select.value !== stage) {
    select.value = stage;
  }

  // Update User Profile object if logged in
  if (state.user) {
    state.user.academicStage = stage;
    saveStateToLocalStorage();
    if (window.ApiClient && ApiClient.saveProfile) {
      ApiClient.saveProfile({ academicStage: stage }).catch(() => {});
    }
  }

  updateStageUI(stage);
  showToast(`Switched perspective to ${stage}`, "info");
}

function updateStageUI(stage) {
  // Dynamically filter primary sidebar navigation items according to student stage (Section 6 & 7)
  const eduGroup = document.getElementById("sidebar-sect-education");
  const careerGroup = document.getElementById("sidebar-sect-career");

  const isSchool = stage.includes("9") || stage.includes("10");
  const isHigherSec = stage.includes("11") || stage.includes("12");
  const isCollege = !isSchool && !isHigherSec;

  if (eduGroup) {
    eduGroup.style.display = (isSchool || isHigherSec) ? "block" : "none";
  }

  if (careerGroup) {
    careerGroup.style.display = isCollege ? "block" : "none";
  }

  // Specific item tweaks
  const streamGuideNav = document.getElementById("nav-stream-guide");
  if (streamGuideNav) {
    streamGuideNav.style.display = isSchool ? "flex" : (isHigherSec ? "flex" : "none");
  }

  // Adaptive Dashboard Hero Banner & Metrics Render
  if (state.activeTab === "dashboard" || document.getElementById("dashboard-stage-dynamic-view")) {
    renderDashboard();
  }

  if (window.lucide) window.lucide.createIcons();
}

// ==========================================
// 9. AI INTEREST & APTITUDE ASSESSMENT
// ==========================================

function renderAssessment() {
  const questions = typeof APTITUDE_ASSESSMENT_QUESTIONS !== 'undefined' ? APTITUDE_ASSESSMENT_QUESTIONS : [];
  if (!questions.length) return;

  // If results exist and not currently retaking, show results
  const resultsContainer = document.getElementById("quiz-results-container");
  const activeCard = document.getElementById("quiz-active-card");

  if (state.assessmentResults && resultsContainer && resultsContainer.innerHTML.trim() !== "" && resultsContainer.style.display !== "none") {
    activeCard.style.display = "none";
    resultsContainer.style.display = "block";
    return;
  }

  activeCard.style.display = "block";
  if (resultsContainer) resultsContainer.style.display = "none";

  const qIndex = state.activeQuizIndex || 0;
  const currentQ = questions[qIndex];

  // Update progress bar & badge
  const progressBadge = document.getElementById("quiz-progress-badge");
  const progressBar = document.getElementById("quiz-progress-bar");
  if (progressBadge) progressBadge.innerText = `Question ${qIndex + 1} of ${questions.length}`;
  if (progressBar) progressBar.style.width = `${((qIndex + 1) / questions.length) * 100}%`;

  // Update scenario & title
  const scenarioTag = document.getElementById("quiz-scenario-tag");
  const titleEl = document.getElementById("quiz-question-title");
  if (scenarioTag) scenarioTag.innerText = currentQ.scenario || "Scenario";
  if (titleEl) titleEl.innerText = currentQ.question;

  // Render 4 options
  const optionsList = document.getElementById("quiz-options-list");
  if (!optionsList) return;

  const currentAnswer = state.assessmentAnswers[qIndex];

  optionsList.innerHTML = currentQ.options.map((opt, idx) => {
    const isSelected = currentAnswer && currentAnswer.text === opt.text;
    return `
      <div class="card quiz-option-card ${isSelected ? 'selected' : ''}" onclick="selectQuizOption(${idx})">
        <div style="display: flex; align-items: flex-start; gap: 14px;">
          <div class="quiz-option-radio">
            ${isSelected ? '<i data-lucide="check" style="width: 13px; height: 13px; color: #FFFFFF; stroke-width: 3;"></i>' : ''}
          </div>
          <div style="flex: 1;">
            <div class="quiz-option-text">${opt.text}</div>
            <div style="display: flex; gap: 8px; flex-wrap: wrap;">
              <span class="quiz-tag-trait">${opt.trait}</span>
              <span class="quiz-tag-holland">Holland: ${opt.riasec}</span>
            </div>
          </div>
        </div>
      </div>
    `;
  }).join("");

  // Navigation button states
  const prevBtn = document.getElementById("quiz-prev-btn");
  const nextBtn = document.getElementById("quiz-next-btn");
  const submitBtn = document.getElementById("quiz-submit-btn");

  if (prevBtn) prevBtn.style.display = qIndex > 0 ? "inline-flex" : "none";
  if (nextBtn) nextBtn.style.display = qIndex < questions.length - 1 ? "inline-flex" : "none";
  if (submitBtn) submitBtn.style.display = qIndex === questions.length - 1 ? "inline-flex" : "none";

  lucide.createIcons();
}

function selectQuizOption(optIndex) {
  const questions = typeof APTITUDE_ASSESSMENT_QUESTIONS !== 'undefined' ? APTITUDE_ASSESSMENT_QUESTIONS : [];
  const currentQ = questions[state.activeQuizIndex];
  if (!currentQ) return;

  state.assessmentAnswers[state.activeQuizIndex] = currentQ.options[optIndex];
  renderAssessment();
}

function nextQuizQuestion() {
  const questions = typeof APTITUDE_ASSESSMENT_QUESTIONS !== 'undefined' ? APTITUDE_ASSESSMENT_QUESTIONS : [];
  if (!state.assessmentAnswers[state.activeQuizIndex]) {
    showToast("Please choose an option to continue.", "warning");
    return;
  }
  if (state.activeQuizIndex < questions.length - 1) {
    state.activeQuizIndex++;
    renderAssessment();
  }
}

function prevQuizQuestion() {
  if (state.activeQuizIndex > 0) {
    state.activeQuizIndex--;
    renderAssessment();
  }
}

async function submitAssessment() {
  const questions = typeof APTITUDE_ASSESSMENT_QUESTIONS !== 'undefined' ? APTITUDE_ASSESSMENT_QUESTIONS : [];
  // Auto-fill any unanswered questions with first option to prevent crash
  for (let i = 0; i < questions.length; i++) {
    if (!state.assessmentAnswers[i]) {
      state.assessmentAnswers[i] = questions[i].options[0];
    }
  }

  showToast("Synthesizing your cognitive aptitude profile with AI...", "info");

  const results = AIService.analyzeInterestAssessment(
    state.assessmentAnswers,
    state.academicStage || "College"
  );

  state.assessmentResults = results;
  saveStateToLocalStorage();

  // Save to Supabase
  if (window.ApiClient && ApiClient.saveProfile) {
    ApiClient.saveProfile({ assessmentResults: results }).catch(() => {});
  }

  renderAssessmentResults(results);
}

function renderAssessmentResults(res) {
  const activeCard = document.getElementById("quiz-active-card");
  const container = document.getElementById("quiz-results-container");
  if (!container) return;

  if (activeCard) activeCard.style.display = "none";
  container.style.display = "block";

  const domainNames = {
    "science-research": "Science & Fundamental Research",
    "medical-healthcare": "Medical & Clinical Healthcare",
    "commerce-finance": "Commerce, Banking & High Finance",
    "business-management": "Business Strategy & Management",
    "arts-humanities": "Humanities, Policy & Creative Writing",
    "law-legal": "Law, Advocacy & Corporate Legal",
    "engineering-tech": "Engineering & Software Architecture",
    "design-creative": "Design, UI/UX & Digital Creative Arts",
    "education-teaching": "Education, Pedagogy & Research",
    "sports-fitness": "Sports Science & High Performance",
    "government-civil": "Civil Services & Public Administration",
    "agriculture-environment": "Agritech & Environmental Sustainability"
  };

  container.innerHTML = `
    <div class="card col-12" style="padding: 30px; margin-bottom: 24px; background: linear-gradient(135deg, rgba(99, 102, 241, 0.08), rgba(20, 184, 166, 0.06)); border: 1.5px solid #C7D2FE;">
      <div style="display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 20px;">
        <div>
          <div style="font-size: 11.5px; text-transform: uppercase; font-weight: 700; color: #4F46E5; letter-spacing: 0.08em; margin-bottom: 4px;">
            Aptitude & Strengths Archetype
          </div>
          <h2 style="font-family: var(--font-heading); font-size: 26px; font-weight: 800; color: var(--primary);">
            ${res.archetypeTitle}
          </h2>
          <p style="font-size: 14px; color: var(--text-secondary); max-width: 650px; line-height: 1.6; margin-top: 8px;">
            ${res.archetypeDesc}
          </p>
        </div>
        <button class="btn btn-secondary" onclick="restartAssessment()" style="padding: 8px 16px; font-size: 12.5px;">
          <i data-lucide="rotate-ccw"></i> Retake Evaluation
        </button>
      </div>

      <!-- RIASEC Personality Traits -->
      <div style="display: flex; gap: 12px; margin-top: 20px; flex-wrap: wrap;">
        <div style="padding: 10px 18px; border-radius: 8px; background: #FFFFFF; border: 1px solid #E2E8F0; box-shadow: 0 1px 3px rgba(0,0,0,0.04);">
          <span style="font-size: 11px; color: var(--text-secondary); display: block; font-weight: 500;">Primary Holland Trait</span>
          <span style="font-size: 15px; font-weight: 700; color: #4338CA;">${res.primaryTrait}</span>
        </div>
        <div style="padding: 10px 18px; border-radius: 8px; background: #FFFFFF; border: 1px solid #E2E8F0; box-shadow: 0 1px 3px rgba(0,0,0,0.04);">
          <span style="font-size: 11px; color: var(--text-secondary); display: block; font-weight: 500;">Secondary Trait</span>
          <span style="font-size: 15px; font-weight: 700; color: #0284C7;">${res.secondaryTrait}</span>
        </div>
        <div style="padding: 10px 18px; border-radius: 8px; background: #FFFFFF; border: 1px solid #E2E8F0; box-shadow: 0 1px 3px rgba(0,0,0,0.04);">
          <span style="font-size: 11px; color: var(--text-secondary); display: block; font-weight: 500;">Key Strengths</span>
          <span style="font-size: 14px; font-weight: 600; color: #0F172A;">${res.keyTraits.slice(0, 3).join(" • ")}</span>
        </div>
      </div>
    </div>

    <!-- Stage-Adaptive Action Box -->
    <div class="card col-12" style="padding: 24px; margin-bottom: 24px; border-left: 4px solid var(--secondary); background: #FFFFFF;">
      <h3 style="font-family: var(--font-heading); font-size: 17px; font-weight: 700; color: var(--primary); margin-bottom: 8px; display: flex; align-items: center; gap: 8px;">
        <i data-lucide="compass" style="width: 20px; height: 20px; color: var(--secondary);"></i> Recommended Next Step for ${state.academicStage || "Your Academic Level"}
      </h3>
      <p style="font-size: 13.5px; color: var(--text-secondary); line-height: 1.5; margin-bottom: 14px;">
        ${res.stageAdvice}
      </p>
      <div style="display: flex; gap: 10px; flex-wrap: wrap;">
        ${(res.recommendedStreamsOrDegrees || []).map(item => `
          <span style="padding: 6px 14px; border-radius: 20px; background: #EEF2FF; color: #4338CA; font-size: 12.5px; font-weight: 600; border: 1px solid #C7D2FE;">
            ✨ ${item}
          </span>
        `).join("")}
      </div>
    </div>

    <!-- Top 3 Sector Matches -->
    <h3 style="font-family: var(--font-heading); font-size: 18px; font-weight: 700; color: var(--primary); margin-bottom: 16px;">
      Top Recommended Industry Sectors
    </h3>
    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 18px; margin-bottom: 24px;">
      ${res.topDomains.map((dom, i) => `
        <div class="card" style="padding: 22px; border-top: 3px solid ${i === 0 ? '#4F46E5' : i === 1 ? '#0284C7' : '#EC4899'}; background: #FFFFFF; border-left: 1px solid #E2E8F0; border-right: 1px solid #E2E8F0; border-bottom: 1px solid #E2E8F0;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
            <span style="font-size: 11px; font-weight: 700; text-transform: uppercase; color: var(--text-muted);">Match Rank #${i + 1}</span>
            <span style="font-size: 12px; font-weight: 700; color: #4F46E5;">${dom.score * 10}% Compatibility</span>
          </div>
          <h4 style="font-family: var(--font-heading); font-size: 16px; font-weight: 700; color: var(--primary); margin-bottom: 8px;">
            ${domainNames[dom.id] || dom.id}
          </h4>
          <p style="font-size: 12.5px; color: var(--text-secondary); line-height: 1.5; margin-bottom: 16px;">
            Strong alignment with your ${res.primaryTrait} problem-solving approach and natural interests.
          </p>
          <div style="display: flex; gap: 8px;">
            <button class="btn btn-secondary" onclick="exploreSectorFromQuiz('${dom.id}')" style="flex: 1; padding: 7px 12px; font-size: 12px;">
              View Careers <i data-lucide="arrow-right"></i>
            </button>
          </div>
        </div>
      `).join("")}
    </div>

    <div style="display: flex; justify-content: center; gap: 14px; margin-top: 10px; flex-wrap: wrap;">
      <button class="btn btn-secondary" onclick="switchTab('stream-guide')" style="padding: 10px 20px;">
        <i data-lucide="layers"></i> View Stream Guide (Class 9-10)
      </button>
      <button class="btn btn-secondary" onclick="switchTab('college-explorer')" style="padding: 10px 20px;">
        <i data-lucide="graduation-cap"></i> View Colleges & Exams (Class 11-12)
      </button>
      <button class="btn btn-pink" onclick="switchTab('generator')" style="padding: 10px 24px;">
        <i data-lucide="route"></i> Build Custom Roadmap
      </button>
    </div>
  `;

  if (window.lucide) window.lucide.createIcons();
}

function restartAssessment() {
  state.activeQuizIndex = 0;
  state.assessmentAnswers = [];
  state.assessmentResults = null;
  localStorage.removeItem("devpath_assessment_results");
  renderAssessment();
}

function exploreSectorFromQuiz(domainId) {
  state.explorerSelectedDomain = domainId;
  switchTab("explorer");
}

// ==========================================
// 10. UNIVERSAL CAREER EXPLORER CONTROLLER
// ==========================================

function renderCareerExplorer() {
  const data = typeof CAREER_EXPLORER_DATA !== 'undefined' ? CAREER_EXPLORER_DATA : [];
  if (!data.length) return;

  // Render Domain Filter Chips
  const chipsContainer = document.getElementById("explorer-domain-chips");
  if (chipsContainer) {
    const allChip = `
      <button class="interest-chip ${state.explorerSelectedDomain === 'all' ? 'selected' : ''}" onclick="selectExplorerDomain('all')">
        All Sectors (${data.length})
      </button>
    `;

    const domainChips = data.map(dom => `
      <button class="interest-chip ${state.explorerSelectedDomain === dom.id ? 'selected' : ''}" onclick="selectExplorerDomain('${dom.id}')">
        ${dom.name}
      </button>
    `).join("");

    chipsContainer.innerHTML = allChip + domainChips;
  }

  filterCareers();
}

function selectExplorerDomain(domainId) {
  state.explorerSelectedDomain = domainId;
  renderCareerExplorer();
}

function filterCareers() {
  const data = typeof CAREER_EXPLORER_DATA !== 'undefined' ? CAREER_EXPLORER_DATA : [];
  const searchInput = document.getElementById("explorer-search-input");
  const query = searchInput ? searchInput.value.toLowerCase().trim() : "";
  const grid = document.getElementById("explorer-cards-grid");
  if (!grid) return;

  let rolesList = [];

  data.forEach(domain => {
    if (state.explorerSelectedDomain === "all" || state.explorerSelectedDomain === domain.id) {
      domain.roles.forEach(role => {
        rolesList.push({
          ...role,
          domainId: domain.id,
          domainName: domain.name,
          domainIcon: domain.icon,
          domainColor: domain.color,
          pathway: role.pathway || domain.name + " Services",
          cluster: role.cluster || domain.name
        });
      });
    }
  });

  if (query) {
    rolesList = rolesList.filter(r => 
      r.title.toLowerCase().includes(query) ||
      r.domainName.toLowerCase().includes(query) ||
      r.description.toLowerCase().includes(query) ||
      (r.pathway && r.pathway.toLowerCase().includes(query)) ||
      (r.cluster && r.cluster.toLowerCase().includes(query)) ||
      (r.keySkills || []).some(s => s.toLowerCase().includes(query))
    );
  }

  if (!rolesList.length) {
    grid.innerHTML = `
      <div class="card col-12" style="padding: 40px; text-align: center; grid-column: 1 / -1;">
        <i data-lucide="search-x" style="width: 40px; height: 40px; color: var(--text-muted); margin: 0 auto 12px;"></i>
        <h4 style="font-family: var(--font-heading); font-size: 16px; color: #1e293b;">No careers found matching "${query}"</h4>
        <p style="font-size: 13px; color: var(--text-secondary); margin-top: 4px;">Try searching for a different skill, title, pathway, or cluster chip.</p>
      </div>
    `;
    if (window.lucide) window.lucide.createIcons();
    return;
  }

  // Pre-configured Unsplash images for rich visual career cards (Image 2 style)
  const categoryImages = {
    "science-research": "https://images.unsplash.com/photo-1507668077129-56e32842fceb?auto=format&fit=crop&w=600&q=80",
    "medical-healthcare": "https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=600&q=80",
    "commerce-finance": "https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?auto=format&fit=crop&w=600&q=80",
    "business-management": "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=600&q=80",
    "arts-humanities": "https://images.unsplash.com/photo-1457369804613-52c61a468e7d?auto=format&fit=crop&w=600&q=80",
    "law-legal": "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=600&q=80",
    "engineering-tech": "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=600&q=80",
    "design-creative": "https://images.unsplash.com/photo-1509395062183-67c5ad6faff9?auto=format&fit=crop&w=600&q=80",
    "education-teaching": "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=600&q=80",
    "sports-fitness": "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=600&q=80",
    "government-civil": "https://images.unsplash.com/photo-1541872703-74c5e44368f9?auto=format&fit=crop&w=600&q=80",
    "agriculture-environment": "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=600&q=80"
  };

  const saved = getSavedCareers();

  grid.innerHTML = rolesList.map(r => {
    const cardImg = categoryImages[r.domainId] || "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=600&q=80";
    const isSaved = saved.includes(r.title);

    return `
      <div class="card" style="padding: 0; overflow: hidden; display: flex; flex-direction: column; justify-content: space-between; border-radius: 16px; border: 1px solid #e2e8f0; box-shadow: 0 4px 15px rgba(0,0,0,0.03);">
        
        <!-- Image Header with Play Button (Image 2) -->
        <div class="career-video-card-header" style="background-image: url('${cardImg}');">
          <div class="career-play-btn" onclick="selectCareerFromExplorer('${r.title}', '${r.domainName}')" title="Explore Career">
            <i data-lucide="play" style="width: 20px; height: 20px; margin-left: 2px;"></i>
          </div>
          <span style="position: absolute; top: 12px; left: 14px; z-index: 2; font-size: 11px; font-weight: 700; background: rgba(15,23,42,0.7); backdrop-filter: blur(4px); color: #fff; padding: 2px 8px; border-radius: 4px;">
            🌐 Global & National
          </span>
          <button onclick="toggleSaveCareer('${r.title}')" style="position: absolute; top: 12px; right: 14px; z-index: 2; background: rgba(255,255,255,0.85); border: none; border-radius: 50%; width: 32px; height: 32px; cursor: pointer; display: flex; align-items: center; justify-content: center; color: ${isSaved ? '#ef4444' : '#64748b'};" title="Save Career">
            ${isSaved ? '★' : '☆'}
          </button>
        </div>

        <!-- Body Details -->
        <div style="padding: 20px; flex: 1; display: flex; flex-direction: column; justify-content: space-between;">
          <div>
            <!-- Career Title -->
            <h3 style="font-family: var(--font-heading); font-size: 17px; font-weight: 700; color: #1e293b; margin-bottom: 6px; line-height: 1.3;">
              ${r.title}
            </h3>

            <!-- 2-line Description -->
            <p style="font-size: 12.5px; color: #64748b; line-height: 1.5; margin-bottom: 14px;">
              ${r.description}
            </p>

            <!-- MaiaLearning Pathway & Cluster Tags (Image 2) -->
            <div style="font-size: 11.5px; color: #334155; margin-bottom: 6px;">
              <strong>Pathway:</strong> ${r.pathway}
            </div>
            <div style="font-size: 11.5px; color: #334155; margin-bottom: 12px;">
              <strong>Cluster:</strong> ${r.cluster}
            </div>

            <!-- Salary & Growth -->
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; background: #f8fafc; padding: 8px 12px; border-radius: 8px;">
              <span style="font-size: 12px; font-weight: 700; color: #0f172a;">💰 ${r.salary}</span>
              <span style="font-size: 11px; padding: 2px 7px; border-radius: 4px; background: #dcfce7; color: #15803d; font-weight: 600;">${r.growth}</span>
            </div>

            <!-- Education Path -->
            <div style="font-size: 11px; color: #64748b; margin-bottom: 14px;">
              <strong>🎓 Path:</strong> ${r.educationReq}
            </div>

            <!-- Skills -->
            <div style="display: flex; gap: 6px; flex-wrap: wrap; margin-bottom: 16px;">
              ${(r.keySkills || []).slice(0, 3).map(sk => `
                <span style="font-size: 10.5px; padding: 2px 8px; border-radius: 4px; background: #EEF2FF; color: #4338CA; font-weight: 500;">
                  ${sk}
                </span>
              `).join("")}
            </div>
          </div>

          <!-- Bottom Actions -->
          <div style="border-top: 1px solid #f1f5f9; padding-top: 14px; display: flex; gap: 10px;">
            <button class="btn btn-secondary" onclick="toggleSaveCareer('${r.title}')" style="padding: 8px 12px; font-size: 12px; width: auto; background: #fff; border: 1px solid #cbd5e1; color: #334155;">
              ${isSaved ? 'Saved ★' : 'Save Career'}
            </button>
            <button class="btn" onclick="selectCareerFromExplorer('${r.title}', '${r.domainName}')" style="flex: 1; padding: 8px 14px; font-size: 12px;">
              Explore Roadmap →
            </button>
          </div>
        </div>

      </div>
    `;
  }).join("");

  if (window.lucide) window.lucide.createIcons();
}

function selectCareerFromExplorer(title, domain) {
  if (state.user) {
    state.user.career = title.toLowerCase().replace(/\s+/g, "-");
    saveStateToLocalStorage();
  }
  const metricEl = document.getElementById("metric-career");
  if (metricEl) metricEl.innerText = title;

  switchTab("generator");
  showToast(`Configured "${title}" as your active target! Generated customized roadmap.`, "success");
}

// ==========================================
// 11. STREAM & SUBJECT SELECTION GUIDE (Class 9-10)
// ==========================================

function renderStreamGuide() {
  const streams = typeof STREAM_GUIDE_DATA !== 'undefined' ? STREAM_GUIDE_DATA : [];
  if (!streams.length) return;

  // Comparison Matrix Rows
  const tbody = document.getElementById("stream-matrix-tbody");
  if (tbody) {
    tbody.innerHTML = streams.map(s => `
      <tr style="border-bottom: 1px solid rgba(255,255,255,0.06); transition: background 0.2s ease;">
        <td style="padding: 14px; font-weight: 700; color: var(--primary);">
          <span style="color: ${s.color};">●</span> ${s.title}
        </td>
        <td style="padding: 14px; color: var(--text-secondary); max-width: 220px;">${s.badge}</td>
        <td style="padding: 14px; color: var(--text-secondary);">${s.workload.split('(')[0]}</td>
        <td style="padding: 14px; color: ${s.mathRequirement.includes('Very High') ? '#f43f5e' : s.mathRequirement.includes('High') ? '#f59e0b' : '#34d399'}; font-weight: 600;">${s.mathRequirement}</td>
        <td style="padding: 14px; color: var(--text-muted); font-size: 12px;">${s.entranceExams.slice(0, 3).join(", ")}</td>
        <td style="padding: 14px; color: var(--color-teal); font-weight: 500;">${s.careerPaths[0]}</td>
      </tr>
    `).join("");
  }

  // Detailed Stream Cards
  const cardsContainer = document.getElementById("stream-cards-container");
  if (cardsContainer) {
    cardsContainer.innerHTML = streams.map(s => `
      <div class="card" style="padding: 24px; border-top: 3px solid ${s.color}; display: flex; flex-direction: column; justify-content: space-between;">
        <div>
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
            <span style="font-size: 11px; font-weight: 700; padding: 3px 8px; border-radius: 4px; background: rgba(99, 102, 241, 0.15); color: ${s.color}; border: 1px solid rgba(99, 102, 241, 0.3);">
              ${s.badge}
            </span>
          </div>

          <h3 style="font-family: var(--font-heading); font-size: 19px; font-weight: 700; color: var(--primary); margin-bottom: 4px;">
            ${s.title}
          </h3>
          <div style="font-size: 12px; color: var(--text-muted); margin-bottom: 12px;">
            ${s.subtitle}
          </div>

          <p style="font-size: 13px; color: var(--text-secondary); line-height: 1.5; margin-bottom: 14px;">
            ${s.overview}
          </p>

          <div style="margin-bottom: 14px; background: #F8FAFC; border: 1px solid #E2E8F0; padding: 12px; border-radius: 8px;">
            <div style="font-size: 11.5px; font-weight: 700; color: var(--primary); margin-bottom: 4px;">Core Compulsory Subjects:</div>
            <div style="font-size: 12px; color: var(--color-teal); line-height: 1.4;">${s.coreSubjects.join(" • ")}</div>
          </div>

          <div style="margin-bottom: 14px;">
            <div style="font-size: 11.5px; font-weight: 700; color: var(--text-muted); margin-bottom: 4px;">Popular Electives:</div>
            <div style="font-size: 12px; color: var(--text-secondary);">${s.electiveSubjects.join(", ")}</div>
          </div>

          <div style="margin-bottom: 16px;">
            <div style="font-size: 11.5px; font-weight: 700; color: var(--primary); margin-bottom: 4px;">Direct Career Trajectories:</div>
            <ul style="margin: 0; padding-left: 18px; font-size: 12px; color: var(--text-secondary); line-height: 1.5;">
              ${s.careerPaths.slice(0, 4).map(cp => `<li>${cp}</li>`).join("")}
            </ul>
          </div>
        </div>

        <div style="border-top: 1px solid var(--border-glass); padding-top: 14px; display: flex; gap: 10px;">
          <button class="btn btn-secondary" onclick="switchTab('college-explorer')" style="flex: 1; padding: 8px; font-size: 12px;">
            Matching Colleges
          </button>
          <button class="btn btn-pink" onclick="switchTab('assessment')" style="flex: 1; padding: 8px; font-size: 12px;">
            Test Fit Quiz
          </button>
        </div>
      </div>
    `).join("");
  }

  lucide.createIcons();
}

// ==========================================
// 12. COLLEGE & SCHOLARSHIP EXPLORER (Class 11-12)
// ==========================================

function setCollegeSubTab(subTab) {
  state.collegeSubTab = subTab;
  const btnColleges = document.getElementById("college-subtab-colleges");
  const btnDegrees = document.getElementById("college-subtab-degrees");
  const btnExams = document.getElementById("college-subtab-exams");

  const containerColleges = document.getElementById("college-directory-container");
  const containerDegrees = document.getElementById("college-degrees-container");
  const containerExams = document.getElementById("college-exams-container");

  if (btnColleges) btnColleges.className = (subTab === "colleges") ? "btn" : "btn btn-secondary";
  if (btnDegrees) btnDegrees.className = (subTab === "degrees") ? "btn" : "btn btn-secondary";
  if (btnExams) btnExams.className = (subTab === "exams") ? "btn" : "btn btn-secondary";

  if (containerColleges) containerColleges.style.display = (subTab === "colleges") ? "block" : "none";
  if (containerDegrees) containerDegrees.style.display = (subTab === "degrees") ? "block" : "none";
  if (containerExams) containerExams.style.display = (subTab === "exams") ? "block" : "none";

  if (subTab === "colleges") {
    renderCollegesTable();
  } else if (subTab === "degrees") {
    filterDegrees();
  } else {
    filterExams();
  }

  if (window.lucide) window.lucide.createIcons();
}

function renderCollegeExplorer() {
  setCollegeSubTab(state.collegeSubTab || "colleges");
}

function renderCollegesTable() {
  const data = typeof COLLEGES_DIRECTORY_DATA !== 'undefined' ? COLLEGES_DIRECTORY_DATA : [];
  const searchInput = document.getElementById("college-name-search");
  const query = searchInput ? searchInput.value.toLowerCase().trim() : "";
  const countryFilter = document.getElementById("college-country-filter");
  const selectedCountry = (countryFilter && countryFilter.value) ? countryFilter.value : "all";
  const typeFilter = document.getElementById("college-type-filter");
  const selectedType = (typeFilter && typeFilter.value) ? typeFilter.value : "all";
  const majorFilter = document.getElementById("college-major-filter");
  const selectedMajor = (majorFilter && majorFilter.value) ? majorFilter.value : "all";
  const tuitionFilter = document.getElementById("college-tuition-filter");
  const selectedTuition = (tuitionFilter && tuitionFilter.value) ? tuitionFilter.value : "all";
  const housingFilter = document.getElementById("college-housing-filter");
  const selectedHousing = (housingFilter && housingFilter.value) ? housingFilter.value : "all";
  const sizeFilter = document.getElementById("college-size-filter");
  const selectedSize = (sizeFilter && sizeFilter.value) ? sizeFilter.value : "all";
  const tierFilter = document.getElementById("college-tier-filter");
  const selectedTier = (tierFilter && tierFilter.value) ? tierFilter.value : "all";

  const tbody = document.getElementById("colleges-table-body");
  const countEl = document.getElementById("college-results-count");
  if (!tbody) return;

  let filtered = data.filter(c => {
    if (query && !c.name.toLowerCase().includes(query) && !c.location.toLowerCase().includes(query) && !c.description.toLowerCase().includes(query)) return false;
    if (selectedCountry !== "all" && c.country !== selectedCountry) return false;
    if (selectedType !== "all" && c.type !== selectedType) return false;
    if (selectedMajor !== "all" && !(c.majors || []).includes(selectedMajor)) return false;
    if (selectedTuition !== "all" && c.tuitionRange !== selectedTuition) return false;
    if (selectedHousing !== "all" && c.housing !== selectedHousing) return false;
    if (selectedSize !== "all" && c.size !== selectedSize) return false;
    if (selectedTier !== "all" && c.matchLevel !== selectedTier) return false;
    return true;
  });

  if (countEl) {
    countEl.innerText = `Found ${filtered.length} college${filtered.length === 1 ? '' : 's'}`;
  }

  if (!filtered.length) {
    tbody.innerHTML = `
      <tr>
        <td colspan="7" style="padding: 40px; text-align: center; color: #64748b;">
          <i data-lucide="search-x" style="width: 36px; height: 36px; margin: 0 auto 10px; color: #94a3b8; display: block;"></i>
          <strong>No colleges match your current filters.</strong>
          <p style="font-size: 12px; margin-top: 4px;">Try loosening the location, type, or major criteria, or click "Clear Filters".</p>
        </td>
      </tr>
    `;
    if (window.lucide) window.lucide.createIcons();
    return;
  }

  tbody.innerHTML = filtered.map(c => `
    <tr>
      <td style="padding: 14px 16px;">
        <div class="college-logo-pill" style="background: ${c.logoColor || '#4f46e5'};">
          ${c.logoText || c.name.substring(0, 3).toUpperCase()}
        </div>
      </td>
      <td style="padding: 14px 16px;">
        <strong style="color: #0f172a; font-size: 14px;">${c.name}</strong>
        <p style="font-size: 12px; color: #64748b; margin-top: 3px; line-height: 1.4; max-width: 450px;">
          ${c.description}
        </p>
        <div style="font-size: 11px; color: #475569; margin-top: 4px;">
          <strong>Majors:</strong> ${(c.majors || []).slice(0, 3).join(", ")}${c.majors && c.majors.length > 3 ? ' +' + (c.majors.length - 3) : ''}
        </div>
      </td>
      <td style="padding: 14px 16px; white-space: nowrap;">
        <div style="font-weight: 500; color: #1e293b;">${c.location}</div>
        <div style="font-size: 11px; color: #64748b;">${c.country}</div>
      </td>
      <td style="padding: 14px 16px;">
        <span class="type-badge-${c.type.toLowerCase()}">${c.type}</span>
      </td>
      <td style="padding: 14px 16px; font-weight: 700; color: #0f172a;">
        ${c.acceptanceRate}
      </td>
      <td style="padding: 14px 16px;">
        <span class="match-badge-${c.matchLevel.toLowerCase()}">${c.matchLevel}</span>
      </td>
      <td style="padding: 14px 16px; text-align: right; white-space: nowrap;">
        <button type="button" class="btn btn-secondary" onclick="viewCollegeDetails('${c.id}')" style="padding: 6px 12px; font-size: 12px; width: auto; margin-right: 6px; border: 1px solid #cbd5e1; background: #fff; color: #334155;">
          View Details
        </button>
        <button type="button" class="btn ${c.isAdded ? 'btn-secondary' : ''}" onclick="toggleCollegeSaved('${c.id}')" style="padding: 6px 14px; font-size: 12px; width: auto; ${c.isAdded ? 'background: #EEF2FF; color: #4338CA; border: 1px solid #C7D2FE;' : 'background: #4F46E5; color: #fff;'}">
          ${c.isAdded ? 'Added ✓' : 'Add to List'}
        </button>
      </td>
    </tr>
  `).join("");

  if (window.lucide) window.lucide.createIcons();
}

function resetCollegeFilters() {
  clearCollegeFilters();
}

function clearCollegeFilters() {
  const searchInput = document.getElementById("college-name-search");
  if (searchInput) searchInput.value = "";
  const countryFilter = document.getElementById("college-country-filter");
  if (countryFilter) countryFilter.value = "all";
  const typeFilter = document.getElementById("college-type-filter");
  if (typeFilter) typeFilter.value = "all";
  const majorFilter = document.getElementById("college-major-filter");
  if (majorFilter) majorFilter.value = "all";
  const tuitionFilter = document.getElementById("college-tuition-filter");
  if (tuitionFilter) tuitionFilter.value = "all";
  const housingFilter = document.getElementById("college-housing-filter");
  if (housingFilter) housingFilter.value = "all";
  const sizeFilter = document.getElementById("college-size-filter");
  if (sizeFilter) sizeFilter.value = "all";
  const tierFilter = document.getElementById("college-tier-filter");
  if (tierFilter) tierFilter.value = "all";

  renderCollegesTable();
  showToast("Filters reset to default view.", "info");
}

function toggleCollegeSaved(id) {
  const data = typeof COLLEGES_DIRECTORY_DATA !== 'undefined' ? COLLEGES_DIRECTORY_DATA : [];
  const col = data.find(c => c.id === id);
  if (!col) return;
  col.isAdded = !col.isAdded;
  renderCollegesTable();
  showToast(col.isAdded ? `Added ${col.name} to your target list.` : `Removed ${col.name} from your target list.`, "info");
}

function viewCollegeDetails(id) {
  const data = typeof COLLEGES_DIRECTORY_DATA !== 'undefined' ? COLLEGES_DIRECTORY_DATA : [];
  const col = data.find(c => c.id === id);
  if (!col) return;
  alert(`🏛️ ${col.name} (${col.country})\n\nLocation: ${col.location}\nType: ${col.type} University\nAcceptance Rate: ${col.acceptanceRate}\nMatch Level: ${col.matchLevel}\nAvg Tuition: ${col.tuition}\nHousing: ${col.housing}\nCampus Size: ${col.size}\n\nKey Majors: ${col.majors.join(', ')}\n\nOfficial Website: ${col.website}`);
}

function filterColleges() {
  if (state.collegeSubTab === "colleges") {
    renderCollegesTable();
  } else if (state.collegeSubTab === "degrees") {
    filterDegrees();
  } else {
    filterExams();
  }
}

function filterDegrees() {
  const courses = typeof COLLEGE_COURSE_DATA !== 'undefined' ? COLLEGE_COURSE_DATA : [];
  const searchInput = document.getElementById("college-degree-search");
  const query = searchInput ? searchInput.value.toLowerCase().trim() : "";
  const streamFilter = document.getElementById("college-stream-filter");
  const selectedStream = streamFilter ? streamFilter.value : "all";

  const container = document.getElementById("college-degrees-cards-grid");
  if (!container) return;

  let filtered = courses;
  if (selectedStream !== "all") {
    filtered = filtered.filter(c => c.stream.includes(selectedStream) || c.stream.includes("All Streams"));
  }
  if (query) {
    filtered = filtered.filter(c => 
      c.degree.toLowerCase().includes(query) ||
      c.stream.toLowerCase().includes(query) ||
      (c.topInstitutes || []).some(inst => inst.toLowerCase().includes(query)) ||
      (c.careerOpportunities || []).some(opp => opp.toLowerCase().includes(query))
    );
  }

  if (!filtered.length) {
    container.innerHTML = `<div class="card col-12" style="padding: 30px; text-align: center; grid-column: 1 / -1;"><p style="color: var(--text-muted);">No degree programs found matching "${query}".</p></div>`;
    return;
  }

  container.innerHTML = filtered.map(c => `
    <div class="card" style="padding: 22px; display: flex; flex-direction: column; justify-content: space-between;">
      <div>
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
          <span style="font-size: 11px; padding: 2px 7px; border-radius: 4px; background: rgba(56, 189, 248, 0.15); color: #38bdf8; font-weight: 600;">
            ${c.stream}
          </span>
          <span style="font-size: 12px; color: var(--text-muted); font-weight: 500;">
            ⏳ ${c.duration}
          </span>
        </div>

        <h3 style="font-family: var(--font-heading); font-size: 17px; font-weight: 700; color: var(--primary); margin-bottom: 8px;">
          ${c.degree}
        </h3>

        <div style="font-size: 12px; color: var(--text-secondary); margin-bottom: 12px; background: #F8FAFC; border: 1px solid #E2E8F0; padding: 8px 10px; border-radius: 6px;">
          <strong style="color: var(--primary);">Eligibility:</strong> ${c.eligibility}
        </div>

        <div style="font-size: 12px; color: var(--color-teal); font-weight: 600; margin-bottom: 10px;">
          💵 Avg Fees: ${c.avgFees}
        </div>

        <div style="font-size: 12px; color: var(--text-muted); margin-bottom: 12px;">
          <strong style="color: var(--primary);">Gateway Entrances:</strong> ${c.entranceExams.join(", ")}
        </div>

        <div style="font-size: 12px; color: var(--text-secondary); margin-bottom: 14px;">
          <strong style="color: var(--primary);">Top Institutes:</strong> ${c.topInstitutes.slice(0, 4).join(" • ")}
        </div>
      </div>

      <div style="border-top: 1px solid var(--border-glass); padding-top: 12px;">
        <p style="font-size: 11.5px; color: var(--text-muted); margin: 0 0 10px 0; font-style: italic;">
          ✨ ${c.pros}
        </p>
        <button class="btn btn-secondary" onclick="switchTab('generator')" style="width: 100%; padding: 7px; font-size: 12px;">
          <i data-lucide="route"></i> Build Roadmap for this Degree
        </button>
      </div>
    </div>
  `).join("");

  if (window.lucide) window.lucide.createIcons();
}

function filterExams() {
  const items = typeof EXAM_SCHOLARSHIP_DATA !== 'undefined' ? EXAM_SCHOLARSHIP_DATA : [];
  const searchInput = document.getElementById("college-exam-search");
  const query = searchInput ? searchInput.value.toLowerCase().trim() : "";
  const container = document.getElementById("college-exams-cards-grid");
  if (!container) return;

  let filtered = items;
  if (query) {
    filtered = filtered.filter(item => 
      item.name.toLowerCase().includes(query) ||
      item.category.toLowerCase().includes(query) ||
      item.conductingBody.toLowerCase().includes(query)
    );
  }

  container.innerHTML = filtered.map(item => `
    <div class="card" style="padding: 22px; display: flex; flex-direction: column; justify-content: space-between; border-left: 3px solid ${item.type === 'scholarship' ? 'var(--color-teal)' : '#f59e0b'};">
      <div>
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
          <span style="font-size: 11px; padding: 2px 7px; border-radius: 4px; background: ${item.type === 'scholarship' ? 'rgba(20, 184, 166, 0.15)' : 'rgba(245, 158, 11, 0.15)'}; color: ${item.type === 'scholarship' ? 'var(--color-teal)' : '#f59e0b'}; font-weight: 700; text-transform: uppercase;">
            ${item.type === 'scholarship' ? 'Scholarship Grant' : 'National Entrance'}
          </span>
          <span style="font-size: 11.5px; color: var(--text-muted);">
            ${item.frequency}
          </span>
        </div>

        <h3 style="font-family: var(--font-heading); font-size: 17px; font-weight: 700; color: var(--primary); margin-bottom: 6px;">
          ${item.name}
        </h3>

        <div style="font-size: 12px; color: #38bdf8; margin-bottom: 10px; font-weight: 500;">
          🏛️ Conducting: ${item.conductingBody}
        </div>

        <p style="font-size: 12.5px; color: var(--text-secondary); line-height: 1.5; margin-bottom: 12px;">
          ${item.description}
        </p>

        <div style="font-size: 12px; color: var(--text-muted); background: #F8FAFC; border: 1px solid #E2E8F0; padding: 8px 10px; border-radius: 6px; margin-bottom: 16px;">
          <strong style="color: var(--primary);">Eligibility:</strong> ${item.eligibility}
        </div>
      </div>

      <div style="border-top: 1px solid var(--border-glass); padding-top: 12px;">
        <a href="${item.portalUrl}" target="_blank" rel="noopener noreferrer" class="btn btn-secondary" style="display: flex; align-items: center; justify-content: center; gap: 8px; width: 100%; text-decoration: none; font-size: 12.5px; padding: 8px;">
          <span>Visit Official Portal</span>
          <i data-lucide="external-link" style="width: 14px; height: 14px;"></i>
        </a>
      </div>
    </div>
  `).join("");

  if (window.lucide) window.lucide.createIcons();
}

// ==========================================
// 13. AI MOCK INTERVIEW SIMULATOR CONTROLLER
// ==========================================

function onMockDomainChange(domain) {
  state.mockDomain = domain;
  state.mockQuestionIndex = 0;
  renderMockInterview();
}

function renderMockInterview() {
  const presets = typeof MOCK_INTERVIEW_PRESETS !== 'undefined' ? MOCK_INTERVIEW_PRESETS : [];
  const domainData = presets.find(p => p.domain === state.mockDomain) || presets[0];
  if (!domainData || !domainData.questions.length) return;

  const currentQ = domainData.questions[state.mockQuestionIndex % domainData.questions.length];

  // Set select value
  const select = document.getElementById("mock-domain-select");
  if (select && select.value !== state.mockDomain) select.value = state.mockDomain;

  // Set Question Info
  const typeBadge = document.getElementById("mock-type-badge");
  const diffBadge = document.getElementById("mock-difficulty-badge");
  const questionText = document.getElementById("mock-question-text");
  const expectedList = document.getElementById("mock-expected-points");

  if (typeBadge) typeBadge.innerText = `${currentQ.type} Question`;
  if (diffBadge) diffBadge.innerText = `Difficulty: ${currentQ.difficulty || 'Medium'}`;
  if (questionText) questionText.innerText = currentQ.question;

  if (expectedList) {
    expectedList.innerHTML = (currentQ.expectedKeyPoints || []).map(kp => `<li>${kp}</li>`).join("");
  }

  // Clear answer area if switching question
  const answerArea = document.getElementById("mock-answer-input");
  if (answerArea && !answerArea.value) {
    updateMockWordCount();
  }

  lucide.createIcons();
}

function updateMockWordCount() {
  const answerArea = document.getElementById("mock-answer-input");
  const wordCountEl = document.getElementById("mock-word-count");
  if (!answerArea || !wordCountEl) return;

  const words = answerArea.value.trim().split(/\s+/).filter(Boolean);
  wordCountEl.innerText = `${words.length} words`;
}

function fillMockSampleAnswer() {
  const presets = typeof MOCK_INTERVIEW_PRESETS !== 'undefined' ? MOCK_INTERVIEW_PRESETS : [];
  const domainData = presets.find(p => p.domain === state.mockDomain) || presets[0];
  const currentQ = domainData.questions[state.mockQuestionIndex % domainData.questions.length];

  const answerArea = document.getElementById("mock-answer-input");
  if (answerArea && currentQ && currentQ.sampleAnswer) {
    answerArea.value = currentQ.sampleAnswer;
    updateMockWordCount();
    showToast("Filled sample model response. Click 'Evaluate with AI' to analyze!", "info");
  }
}

function loadNextMockQuestion() {
  state.mockQuestionIndex++;
  const answerArea = document.getElementById("mock-answer-input");
  if (answerArea) answerArea.value = "";
  renderMockInterview();
}

async function submitMockInterview() {
  const presets = typeof MOCK_INTERVIEW_PRESETS !== 'undefined' ? MOCK_INTERVIEW_PRESETS : [];
  const domainData = presets.find(p => p.domain === state.mockDomain) || presets[0];
  const currentQ = domainData.questions[state.mockQuestionIndex % domainData.questions.length];
  const answerArea = document.getElementById("mock-answer-input");
  const answer = answerArea ? answerArea.value.trim() : "";

  if (!answer) {
    showToast("Please write or speak an answer before submitting for evaluation.", "warning");
    return;
  }

  const evalBtn = document.getElementById("mock-evaluate-btn");
  if (evalBtn) {
    evalBtn.disabled = true;
    evalBtn.innerHTML = `<i data-lucide="loader-2" class="spin"></i> Evaluating...`;
  }

  try {
    const evaluation = await AIService.evaluateMockInterviewAnswer(
      domainData.label || state.mockDomain,
      currentQ,
      answer,
      state.apiKey
    );

    // Update Scorecard Cockpit
    const scoreVal = document.getElementById("mock-score-val");
    const scoreLabel = document.getElementById("mock-score-label");
    const gauge = document.getElementById("mock-score-gauge");
    const statusPill = document.getElementById("mock-status-pill");
    const feedbackText = document.getElementById("mock-feedback-text");
    const strengthsList = document.getElementById("mock-strengths-list");
    const improvementsList = document.getElementById("mock-improvements-list");
    const modelAnswerText = document.getElementById("mock-model-answer");

    if (scoreVal) scoreVal.innerText = evaluation.score;
    if (scoreLabel) {
      scoreLabel.innerText = evaluation.score >= 80 ? "Superior Candidate" : evaluation.score >= 65 ? "Proficient Candidate" : "Developing Candidate";
      scoreLabel.style.color = evaluation.score >= 80 ? "var(--color-teal)" : evaluation.score >= 65 ? "#38bdf8" : "#f59e0b";
    }
    if (gauge) {
      gauge.style.background = `conic-gradient(${evaluation.score >= 80 ? 'var(--color-teal)' : evaluation.score >= 65 ? '#38bdf8' : '#f59e0b'} ${evaluation.score * 3.6}deg, rgba(255,255,255,0.1) 0deg)`;
    }
    if (statusPill) {
      statusPill.innerText = "Evaluated";
      statusPill.style.background = "rgba(52, 211, 153, 0.2)";
      statusPill.style.color = "#34d399";
    }
    if (feedbackText) feedbackText.innerText = evaluation.feedback;
    if (strengthsList) {
      strengthsList.innerHTML = (evaluation.strengths || []).map(s => `<li>${s}</li>`).join("");
    }
    if (improvementsList) {
      improvementsList.innerHTML = (evaluation.areasToImprove || []).map(gap => `<li>${gap}</li>`).join("");
    }
    if (modelAnswerText) modelAnswerText.innerText = evaluation.modelAnswer || currentQ.sampleAnswer;

    showToast(`Evaluation complete: Score ${evaluation.score}/100`, "success");
  } catch (err) {
    console.error("Mock Interview error:", err);
    showToast("Evaluation error. Check console or try again.", "error");
  } finally {
    if (evalBtn) {
      evalBtn.disabled = false;
      evalBtn.innerHTML = `<i data-lucide="sparkles"></i> Evaluate with AI`;
      lucide.createIcons();
    }
  }
}

// ==========================================
// 14. DAILY LEARNING PLANNER & HABIT TRACKER
// ==========================================

function renderDailyPlanner() {
  const tasks = state.dailyTasks || [];
  const list = document.getElementById("planner-task-list");
  const streakCountEl = document.getElementById("planner-streak-count");
  const completionRateEl = document.getElementById("planner-completion-rate");

  if (streakCountEl) {
    streakCountEl.innerText = `${state.streakCount || 1} Days`;
  }

  const completedCount = tasks.filter(t => t.completed).length;
  const pct = tasks.length ? Math.round((completedCount / tasks.length) * 100) : 0;
  if (completionRateEl) {
    completionRateEl.innerText = `${completedCount} of ${tasks.length} Completed (${pct}%)`;
  }

  if (!list) return;

  if (!tasks.length) {
    list.innerHTML = `<p style="font-size: 13px; color: var(--text-muted); text-align: center; padding: 20px;">No targets set for today. Add your first goal above!</p>`;
    return;
  }

  list.innerHTML = tasks.map(task => `
    <div style="display: flex; align-items: center; justify-content: space-between; padding: 12px 16px; background: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 8px; transition: all 0.2s ease;">
      <div style="display: flex; align-items: center; gap: 12px;">
        <input type="checkbox" ${task.completed ? 'checked' : ''} onchange="togglePlannerTarget('${task.id}')" style="width: 18px; height: 18px; accent-color: var(--color-teal); cursor: pointer;">
        <div>
          <span style="font-size: 13.5px; color: ${task.completed ? 'var(--text-muted)' : 'var(--text-primary)'}; text-decoration: ${task.completed ? 'line-through' : 'none'}; font-weight: 500;">
            ${task.text}
          </span>
          <div style="display: flex; gap: 8px; margin-top: 4px;">
            <span style="font-size: 10px; padding: 1px 6px; border-radius: 4px; background: rgba(99, 102, 241, 0.15); color: var(--color-teal);">${task.category}</span>
            <span style="font-size: 10px; color: var(--text-muted);">⏱️ ${task.time}</span>
          </div>
        </div>
      </div>
      <button onclick="deletePlannerTarget('${task.id}')" style="background: transparent; border: none; color: var(--text-muted); cursor: pointer; padding: 4px;" title="Delete Task">
        <i data-lucide="trash-2" style="width: 15px; height: 15px;"></i>
      </button>
    </div>
  `).join("");

  lucide.createIcons();
}

function addPlannerTarget() {
  const textInput = document.getElementById("planner-input-text");
  const catInput = document.getElementById("planner-input-category");
  const timeInput = document.getElementById("planner-input-time");

  const text = textInput ? textInput.value.trim() : "";
  if (!text) return;

  const newTask = {
    id: "task-" + Date.now(),
    text,
    category: catInput ? catInput.value : "Roadmap",
    time: timeInput ? timeInput.value : "45m",
    completed: false,
    date: new Date().toDateString()
  };

  state.dailyTasks.push(newTask);
  saveStateToLocalStorage();
  if (textInput) textInput.value = "";
  renderDailyPlanner();
  showToast("Learning target added to daily schedule!", "success");
}

function togglePlannerTarget(taskId) {
  const task = state.dailyTasks.find(t => t.id === taskId);
  if (task) {
    task.completed = !task.completed;
    saveStateToLocalStorage();
    renderDailyPlanner();
  }
}

function deletePlannerTarget(taskId) {
  state.dailyTasks = state.dailyTasks.filter(t => t.id !== taskId);
  saveStateToLocalStorage();
  renderDailyPlanner();
}

// Pomodoro Timer Logic
function updatePomodoroDisplay() {
  const display = document.getElementById("pomodoro-timer-display");
  if (!display) return;
  const mins = Math.floor(state.pomodoroSeconds / 60);
  const secs = state.pomodoroSeconds % 60;
  display.innerText = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

function togglePomodoro() {
  const btn = document.getElementById("pomodoro-start-btn");
  if (state.pomodoroRunning) {
    // Pause
    clearInterval(state.pomodoroTimerId);
    state.pomodoroRunning = false;
    if (btn) btn.innerText = "Resume Sprint";
  } else {
    // Start
    state.pomodoroRunning = true;
    if (btn) btn.innerText = "Pause Sprint";
    state.pomodoroTimerId = setInterval(() => {
      if (state.pomodoroSeconds > 0) {
        state.pomodoroSeconds--;
        updatePomodoroDisplay();
      } else {
        clearInterval(state.pomodoroTimerId);
        state.pomodoroRunning = false;
        state.pomodoroSeconds = 1500;
        updatePomodoroDisplay();
        if (btn) btn.innerText = "Start Sprint";
        showToast("🎉 Pomodoro Sprint Complete! Take a 5-minute break.", "success");
      }
    }, 1000);
  }
}

function resetPomodoro() {
  clearInterval(state.pomodoroTimerId);
  state.pomodoroRunning = false;
  state.pomodoroSeconds = 1500;
  const btn = document.getElementById("pomodoro-start-btn");
  if (btn) btn.innerText = "Start Sprint";
  updatePomodoroDisplay();
}


// ========================================================
// PUBLIC LANDING PAGE & ONBOARDING WIZARD CONTROLLERS
// ========================================================

let onboardingState = {
  currentStep: 1,
  name: "",
  targetCareer: "",
  notSure: false,
  academicStage: "Class 10",
  academicDetails: {},
  interests: ["Technology & Software", "Artificial Intelligence"]
};

function showLandingPage() {
  const landing = document.getElementById("landing-view");
  const auth = document.getElementById("auth-view");
  const workspace = document.getElementById("app-workspace");
  if (landing) landing.style.display = "block";
  if (auth) auth.style.display = "none";
  if (workspace) workspace.style.display = "none";
  window.scrollTo({ top: 0, behavior: 'smooth' });
  if (window.lucide) window.lucide.createIcons();
}

function scrollToSection(sectionId) {
  const el = document.getElementById(sectionId);
  if (el) {
    el.scrollIntoView({ behavior: "smooth" });
  }
}

function toggleFaq(item) {
  if (!item) return;
  const wasOpen = item.classList.contains("open");
  document.querySelectorAll(".faq-item").forEach(i => i.classList.remove("open"));
  if (!wasOpen) {
    item.classList.add("open");
  }
  if (window.lucide) window.lucide.createIcons();
}

function openDemoWithSector(sectorKey) {
  showDemoLogin();
  setTimeout(() => {
    switchTab("explorer");
    const searchInput = document.getElementById("career-search-input");
    if (searchInput) {
      const sectorNames = {
        tech: "Software",
        ai: "Artificial Intelligence",
        engineering: "Engineering",
        healthcare: "Doctor",
        business: "Product Manager",
        finance: "Investment",
        design: "Design",
        law: "Law",
        gov: "Civil Services",
        education: "Professor",
        defense: "Pilot",
        vocational: "Automation"
      };
      if (sectorNames[sectorKey]) {
        searchInput.value = sectorNames[sectorKey];
        if (typeof filterCareers === "function") filterCareers();
      }
    }
  }, 400);
}

// ==========================================
// 15. 3-STEP LEVEL ONBOARDING WIZARD (IMAGE 1)
// ==========================================

let onboardingLevelState = {
  currentStep: 1,
  selectedLevel: "Class 10",
  name: "",
  targetCareer: "",
  academics: {}
};

function startOnboardingWithStage(stage) {
  onboardingLevelState.selectedLevel = stage;
  startOnboarding();
  selectOnboardStageOption(stage);
}

function startOnboarding() {
  const modal = document.getElementById("onboarding-modal");
  if (!modal) return;
  
  onboardingLevelState.currentStep = 1;
  onboardingLevelState.selectedLevel = state.academicStage || "Class 10";

  const nameInput = document.getElementById("onboard-name-input");
  const careerInput = document.getElementById("onboard-target-career-input");
  if (nameInput) nameInput.value = state.user ? state.user.username : "";
  if (careerInput) careerInput.value = state.user ? formatCareerTitle(state.user.career) : "";

  selectOnboardStageOption(onboardingLevelState.selectedLevel);
  modal.style.display = "flex";
  renderOnboardingWizardStep();
  if (window.lucide) window.lucide.createIcons();
}

function closeOnboardingModal() {
  const modal = document.getElementById("onboarding-modal");
  if (modal) modal.style.display = "none";
}

function selectOnboardStageOption(stage) {
  onboardingLevelState.selectedLevel = stage;
  const cards = document.querySelectorAll(".level-select-card");
  cards.forEach(c => c.classList.remove("selected"));

  let cardId = "lvl-card-class-10";
  if (stage === "Class 9") cardId = "lvl-card-class-9";
  else if (stage === "Class 10") cardId = "lvl-card-class-10";
  else if (stage === "Class 11") cardId = "lvl-card-class-11";
  else if (stage === "Class 12") cardId = "lvl-card-class-12";
  else if (stage === "Undergraduate") cardId = "lvl-card-undergraduate";
  else if (stage === "Postgraduate") cardId = "lvl-card-postgraduate";
  else if (stage.includes("Graduate")) cardId = "lvl-card-graduate";

  const targetCard = document.getElementById(cardId);
  if (targetCard) targetCard.classList.add("selected");
}

function selectOnboardingStage(stage) {
  selectOnboardStageOption(stage);
}

function renderOnboardingWizardStep() {
  const step = onboardingLevelState.currentStep;

  // Views display
  for (let i = 1; i <= 3; i++) {
    const view = document.getElementById(`onboard-view-${i}`);
    if (view) view.style.display = (i === step) ? "block" : "none";

    const badge = document.getElementById(`onboard-step-badge-${i}`);
    if (badge) {
      if (i === step) {
        badge.style.background = "#e0e7ff";
        badge.style.color = "#4338ca";
        badge.innerText = i;
      } else if (i < step) {
        badge.style.background = "#dcfce7";
        badge.style.color = "#15803d";
        badge.innerText = "✓";
      } else {
        badge.style.background = "#f1f5f9";
        badge.style.color = "#94a3b8";
        badge.innerText = i;
      }
    }
  }

  // Buttons
  const backBtn = document.getElementById("onboard-back-btn");
  const contBtn = document.getElementById("onboard-continue-btn");
  if (backBtn) backBtn.style.display = (step > 1) ? "inline-flex" : "none";
  if (contBtn) contBtn.innerText = (step === 3) ? "Launch Dashboard →" : "Continue →";
}

function nextOnboardStep() {
  if (onboardingLevelState.currentStep === 1) {
    onboardingLevelState.currentStep = 2;
    renderOnboardDynamicFields();
    renderOnboardingWizardStep();
    return;
  }

  if (onboardingLevelState.currentStep === 2) {
    const nameInput = document.getElementById("onboard-name-input");
    const careerInput = document.getElementById("onboard-target-career-input");
    onboardingLevelState.name = nameInput && nameInput.value.trim() ? nameInput.value.trim() : "Student";
    onboardingLevelState.targetCareer = careerInput && careerInput.value.trim() ? careerInput.value.trim() : "Exploring Careers";

    // Summary for step 3
    const confStage = document.getElementById("onboard-conf-stage");
    const confModules = document.getElementById("onboard-conf-modules");
    const confAi = document.getElementById("onboard-conf-ai");

    if (confStage) confStage.innerText = onboardingLevelState.selectedLevel;
    if (confModules) {
      if (onboardingLevelState.selectedLevel.includes("9") || onboardingLevelState.selectedLevel.includes("10")) {
        confModules.innerText = "Interests Assessment, Career Discovery, Stream Guide, Subject Explorer";
      } else if (onboardingLevelState.selectedLevel.includes("11") || onboardingLevelState.selectedLevel.includes("12")) {
        confModules.innerText = "Course & Degree Explorer, Find Colleges, Entrance Exams, Scholarships";
      } else {
        confModules.innerText = "SkillOpti Analysis, Resume ATS Scan, Mock Interviews, Job Pipeline";
      }
    }
    if (confAi) {
      if (onboardingLevelState.selectedLevel.includes("9") || onboardingLevelState.selectedLevel.includes("10")) {
        confAi.innerText = "High School Stream & Subject Guidance";
      } else if (onboardingLevelState.selectedLevel.includes("11") || onboardingLevelState.selectedLevel.includes("12")) {
        confAi.innerText = "College Admissions & Entrance Strategy";
      } else {
        confAi.innerText = "Role Competency & ATS Optimization";
      }
    }

    onboardingLevelState.currentStep = 3;
    renderOnboardingWizardStep();
    return;
  }

  if (onboardingLevelState.currentStep === 3) {
    finishOnboardingLevel();
  }
}

function nextOnboardingStep() {
  nextOnboardStep();
}

function prevOnboardStep() {
  if (onboardingLevelState.currentStep > 1) {
    onboardingLevelState.currentStep--;
    renderOnboardingWizardStep();
  }
}

function prevOnboardingStep() {
  prevOnboardStep();
}

function renderOnboardDynamicFields() {
  const container = document.getElementById("onboard-dynamic-fields-container");
  const sub = document.getElementById("onboard-step-2-subtitle");
  if (!container) return;

  const lvl = onboardingLevelState.selectedLevel;
  if (lvl === "Class 9") {
    if (sub) sub.innerText = "Class 9: Tell us your favorite subjects and exploratory interests.";
    container.innerHTML = `
      <div class="input-group">
        <label class="input-label" style="font-weight: 600; color: #1e293b;">Favorite Subjects (Select all that apply)</label>
        <div style="display: flex; flex-wrap: wrap; gap: 8px; margin-top: 8px;">
          <div class="interest-chip selected" onclick="this.classList.toggle('selected')">📐 Mathematics</div>
          <div class="interest-chip selected" onclick="this.classList.toggle('selected')">🔬 Science (Physics/Chemistry/Bio)</div>
          <div class="interest-chip" onclick="this.classList.toggle('selected')">🌍 Social Studies & History</div>
          <div class="interest-chip" onclick="this.classList.toggle('selected')">📖 English & Literature</div>
          <div class="interest-chip selected" onclick="this.classList.toggle('selected')">💻 Computer Applications / Coding</div>
          <div class="interest-chip" onclick="this.classList.toggle('selected')">🎨 Visual Arts & Craft</div>
        </div>
      </div>
      <div class="input-group" style="margin-top: 16px;">
        <label class="input-label" style="font-weight: 600; color: #1e293b;">Hobbies & Activities You Enjoy</label>
        <div style="display: flex; flex-wrap: wrap; gap: 8px; margin-top: 8px;">
          <div class="interest-chip selected" onclick="this.classList.toggle('selected')">🤖 Building Gadgets / Robotics</div>
          <div class="interest-chip" onclick="this.classList.toggle('selected')">🎮 Gaming & Logic Puzzles</div>
          <div class="interest-chip" onclick="this.classList.toggle('selected')">⚽ Sports & Athletics</div>
          <div class="interest-chip" onclick="this.classList.toggle('selected')">✍️ Creative Writing & Debating</div>
          <div class="interest-chip" onclick="this.classList.toggle('selected')">🎵 Music & Digital Production</div>
        </div>
      </div>
    `;
  } else if (lvl === "Class 10") {
    if (sub) sub.innerText = "Class 10: Tell us your subjects and upcoming stream preferences.";
    container.innerHTML = `
      <div class="input-group">
        <label class="input-label" style="font-weight: 600; color: #1e293b;">Stream Preference for Class 11</label>
        <select class="input-field" id="onboard-class10-stream" style="background: #fff; border-color: #cbd5e1; color: #0f172a;">
          <option value="Science (PCM)">Science (PCM) - Physics, Chemistry, Mathematics (Engineering / Tech)</option>
          <option value="Science (PCB)">Science (PCB) - Physics, Chemistry, Biology (Medicine / Life Sciences)</option>
          <option value="Science (PCMB)">Science (PCMB) - Dual Science (Engineering & Medicine)</option>
          <option value="Commerce with Maths">Commerce with Mathematics (Finance / Economics / CA)</option>
          <option value="Commerce without Maths">Commerce without Mathematics (Business / Management)</option>
          <option value="Humanities / Arts">Humanities / Arts (Law / Psychology / Media / UPSC)</option>
          <option value="Vocational / Applied">Vocational / Applied Skills</option>
          <option value="Undecided">Undecided - Need RIASEC Guidance</option>
        </select>
      </div>
      <div class="input-group" style="margin-top: 16px;">
        <label class="input-label" style="font-weight: 600; color: #1e293b;">Strongest Current Subjects</label>
        <div style="display: flex; flex-wrap: wrap; gap: 8px; margin-top: 8px;">
          <div class="interest-chip selected" onclick="this.classList.toggle('selected')">Mathematics</div>
          <div class="interest-chip selected" onclick="this.classList.toggle('selected')">Science</div>
          <div class="interest-chip" onclick="this.classList.toggle('selected')">Social Science</div>
          <div class="interest-chip" onclick="this.classList.toggle('selected')">English</div>
          <div class="interest-chip selected" onclick="this.classList.toggle('selected')">Computer Applications</div>
        </div>
      </div>
    `;
  } else if (lvl === "Class 11") {
    if (sub) sub.innerText = "Class 11: Share your current stream, core subjects, and interests.";
    container.innerHTML = `
      <div class="input-group">
        <label class="input-label" style="font-weight: 600; color: #1e293b;">Current Class 11 Stream</label>
        <select class="input-field" id="onboard-class11-stream" style="background: #fff; border-color: #cbd5e1; color: #0f172a;">
          <option value="Science PCM">Science (Physics, Chemistry, Mathematics)</option>
          <option value="Science PCB">Science (Physics, Chemistry, Biology)</option>
          <option value="Commerce">Commerce (Accountancy, Business Studies, Economics)</option>
          <option value="Humanities">Humanities (Political Science, History, Psychology)</option>
        </select>
      </div>
      <div class="input-group" style="margin-top: 16px;">
        <label class="input-label" style="font-weight: 600; color: #1e293b;">Elective / Special Subject</label>
        <input type="text" class="input-field" placeholder="e.g. Computer Science, Applied Math, Psychology, Fine Arts" style="background: #fff; border-color: #cbd5e1; color: #0f172a;">
      </div>
    `;
  } else if (lvl === "Class 12") {
    if (sub) sub.innerText = "Class 12: Tell us your stream, preferred undergraduate courses, and entrance goals.";
    container.innerHTML = `
      <div class="input-group">
        <label class="input-label" style="font-weight: 600; color: #1e293b;">Current Stream</label>
        <select class="input-field" id="onboard-class12-stream" style="background: #fff; border-color: #cbd5e1; color: #0f172a;">
          <option value="Science PCM">Science PCM</option>
          <option value="Science PCB">Science PCB</option>
          <option value="Commerce">Commerce</option>
          <option value="Humanities">Humanities</option>
        </select>
      </div>
      <div class="input-group" style="margin-top: 16px;">
        <label class="input-label" style="font-weight: 600; color: #1e293b;">Preferred Undergraduate Degrees (Select)</label>
        <div style="display: flex; flex-wrap: wrap; gap: 8px; margin-top: 8px;">
          <div class="interest-chip selected" onclick="this.classList.toggle('selected')">B.Tech / B.E. (Engineering/CS)</div>
          <div class="interest-chip" onclick="this.classList.toggle('selected')">MBBS / BDS (Medicine)</div>
          <div class="interest-chip" onclick="this.classList.toggle('selected')">B.Com (Hons) / BBA</div>
          <div class="interest-chip" onclick="this.classList.toggle('selected')">B.A. LL.B (5-Yr Law)</div>
          <div class="interest-chip" onclick="this.classList.toggle('selected')">B.Des (Design)</div>
          <div class="interest-chip" onclick="this.classList.toggle('selected')">IPM (5-Yr IIM BBA+MBA)</div>
        </div>
      </div>
      <div class="input-group" style="margin-top: 16px;">
        <label class="input-label" style="font-weight: 600; color: #1e293b;">Target Entrance Exams</label>
        <div style="display: flex; flex-wrap: wrap; gap: 8px; margin-top: 8px;">
          <div class="interest-chip selected" onclick="this.classList.toggle('selected')">JEE Main / Advanced</div>
          <div class="interest-chip" onclick="this.classList.toggle('selected')">NEET UG</div>
          <div class="interest-chip selected" onclick="this.classList.toggle('selected')">CUET UG</div>
          <div class="interest-chip" onclick="this.classList.toggle('selected')">CLAT</div>
          <div class="interest-chip" onclick="this.classList.toggle('selected')">BITSAT</div>
        </div>
      </div>
    `;
  } else if (lvl === "Undergraduate") {
    if (sub) sub.innerText = "Undergraduate: Tell us your current degree, specialization, and mastered skills.";
    container.innerHTML = `
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
        <div class="input-group">
          <label class="input-label" style="font-weight: 600; color: #1e293b;">Degree Program</label>
          <input type="text" class="input-field" placeholder="e.g. B.Tech / B.Sc / B.Com" value="B.Tech" style="background: #fff; border-color: #cbd5e1; color: #0f172a;">
        </div>
        <div class="input-group">
          <label class="input-label" style="font-weight: 600; color: #1e293b;">Specialization / Major</label>
          <input type="text" class="input-field" placeholder="e.g. Computer Science & AI" value="Computer Science" style="background: #fff; border-color: #cbd5e1; color: #0f172a;">
        </div>
      </div>
      <div class="input-group" style="margin-top: 16px;">
        <label class="input-label" style="font-weight: 600; color: #1e293b;">Skills You Currently Know</label>
        <div style="display: flex; flex-wrap: wrap; gap: 8px; margin-top: 8px;">
          <div class="interest-chip selected" onclick="this.classList.toggle('selected')">Python</div>
          <div class="interest-chip selected" onclick="this.classList.toggle('selected')">SQL</div>
          <div class="interest-chip selected" onclick="this.classList.toggle('selected')">Data Analysis</div>
          <div class="interest-chip" onclick="this.classList.toggle('selected')">React / JS</div>
          <div class="interest-chip" onclick="this.classList.toggle('selected')">Machine Learning</div>
          <div class="interest-chip" onclick="this.classList.toggle('selected')">Git & GitHub</div>
        </div>
      </div>
    `;
  } else if (lvl === "Postgraduate") {
    if (sub) sub.innerText = "Postgraduate: Tell us your degree, specialization, and career goal.";
    container.innerHTML = `
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
        <div class="input-group">
          <label class="input-label" style="font-weight: 600; color: #1e293b;">Postgraduate Degree</label>
          <input type="text" class="input-field" placeholder="e.g. M.Tech / MBA / M.Sc" value="M.Tech" style="background: #fff; border-color: #cbd5e1; color: #0f172a;">
        </div>
        <div class="input-group">
          <label class="input-label" style="font-weight: 600; color: #1e293b;">Specialization</label>
          <input type="text" class="input-field" placeholder="e.g. Artificial Intelligence & Robotics" value="Artificial Intelligence" style="background: #fff; border-color: #cbd5e1; color: #0f172a;">
        </div>
      </div>
      <div class="input-group" style="margin-top: 16px;">
        <label class="input-label" style="font-weight: 600; color: #1e293b;">Career Goal / Target Industry</label>
        <input type="text" class="input-field" placeholder="e.g. AI Research Scientist / Quant Analyst" value="AI Research Scientist" style="background: #fff; border-color: #cbd5e1; color: #0f172a;">
      </div>
    `;
  } else {
    // Graduate / Job Seeker
    if (sub) sub.innerText = "Graduate / Job Seeker: Tell us your qualification, skills, experience, and target role.";
    container.innerHTML = `
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
        <div class="input-group">
          <label class="input-label" style="font-weight: 600; color: #1e293b;">Highest Qualification</label>
          <input type="text" class="input-field" placeholder="e.g. B.Tech in CSE / MBA" value="B.Tech" style="background: #fff; border-color: #cbd5e1; color: #0f172a;">
        </div>
        <div class="input-group">
          <label class="input-label" style="font-weight: 600; color: #1e293b;">Work Experience</label>
          <select class="input-field" style="background: #fff; border-color: #cbd5e1; color: #0f172a;">
            <option value="0">Fresh Graduate (0 years)</option>
            <option value="1-2">1 - 2 Years</option>
            <option value="3-5">3 - 5 Years</option>
            <option value="5+">5+ Years</option>
          </select>
        </div>
      </div>
      <div class="input-group" style="margin-top: 16px;">
        <label class="input-label" style="font-weight: 600; color: #1e293b;">Core Skills Mastered</label>
        <div style="display: flex; flex-wrap: wrap; gap: 8px; margin-top: 8px;">
          <div class="interest-chip selected" onclick="this.classList.toggle('selected')">Python</div>
          <div class="interest-chip selected" onclick="this.classList.toggle('selected')">SQL</div>
          <div class="interest-chip selected" onclick="this.classList.toggle('selected')">Data Analysis</div>
          <div class="interest-chip selected" onclick="this.classList.toggle('selected')">Machine Learning</div>
          <div class="interest-chip" onclick="this.classList.toggle('selected')">Cloud / AWS</div>
          <div class="interest-chip" onclick="this.classList.toggle('selected')">Docker</div>
        </div>
      </div>
    `;
  }
}

function finishOnboardingLevel() {
  const name = onboardingLevelState.name || "Explorer";
  const stage = onboardingLevelState.selectedLevel || "Class 10";
  const career = onboardingLevelState.targetCareer || "Software Engineer";

  if (!state.user) {
    state.user = {
      username: name,
      email: name.toLowerCase().replace(/\s+/g, ".") + "@student.getcareerpilot.com",
      career: career.toLowerCase().replace(/\s+/g, "-"),
      stage: stage,
      skills: ["Problem Solving", "Critical Thinking", "Curiosity"]
    };
  } else {
    state.user.username = name;
    state.user.career = career.toLowerCase().replace(/\s+/g, "-");
    state.user.stage = stage;
  }

  state.academicStage = stage;
  saveStateToLocalStorage();

  if (window.ApiClient && ApiClient.saveUserProfile) {
    ApiClient.saveUserProfile({
      user: state.user,
      academicStage: stage,
      career: state.user.career
    }).catch(e => console.warn("Supabase onboarding sync fallback:", e));
  }

  closeOnboardingModal();
  showDashboardWorkspace();
  onStageChange(stage);
  switchTab("dashboard");
  showToast(`Welcome, ${name}! Your personalized ${stage} dashboard is ready.`, "success");
}

function finishOnboarding() {
  finishOnboardingLevel();
}
