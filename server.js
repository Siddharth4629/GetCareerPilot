require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { createClient } = require('@supabase/supabase-js');

const app = express();
const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'getcareerpilot_secret_key_2026';

// Supabase Configuration
const SUPABASE_URL = process.env.SUPABASE_URL || '';
const SUPABASE_KEY = process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_KEY || '';

let supabase = null;
let isSupabaseConnected = false;
let supabaseTableExists = false;

if (SUPABASE_URL && SUPABASE_KEY) {
  try {
    supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
    console.log('🔗 Connecting to Supabase at:', SUPABASE_URL);
    checkSupabaseHealth();
  } catch (err) {
    console.warn('Supabase initialization warning:', err.message);
  }
}

// Check Supabase Table Connectivity
async function checkSupabaseHealth() {
  if (!supabase) return;
  try {
    const { data, error } = await supabase.from('user_profiles').select('id').limit(1);
    if (!error) {
      isSupabaseConnected = true;
      supabaseTableExists = true;
      console.log('✅ Supabase connected & user_profiles table verified!');
      seedDemoAccount();
    } else {
      isSupabaseConnected = true;
      supabaseTableExists = false;
      console.log('ℹ️ Supabase connected, waiting for "user_profiles" table to be created via SQL Editor.');
      console.log('👉 Error detail:', error.message);
      seedDemoAccount();
    }
  } catch (e) {
    console.warn('Supabase ping warning:', e.message);
    isSupabaseConnected = false;
    seedDemoAccount();
  }
}

// Local Fallback Store for maximum resilience
const dataDir = path.join(__dirname, 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}
const localDbPath = path.join(dataDir, 'local_db.json');

function getLocalDb() {
  if (fs.existsSync(localDbPath)) {
    try {
      return JSON.parse(fs.readFileSync(localDbPath, 'utf8'));
    } catch (e) {
      return { users: {} };
    }
  }
  return { users: {} };
}

function saveLocalDb(data) {
  try {
    fs.writeFileSync(localDbPath, JSON.stringify(data, null, 2), 'utf8');
  } catch (e) {
    console.error('Error saving local fallback db:', e);
  }
}

// Seed default demo account
async function seedDemoAccount() {
  const demoEmail = 'alex@getcareerpilot.com';
  const salt = bcrypt.genSaltSync(10);
  const hashedPassword = bcrypt.hashSync('password123', salt);

  const demoData = {
    username: 'Alex Coder',
    email: demoEmail,
    password: hashedPassword,
    career: 'frontend-developer',
    level: 'intermediate',
    hours: 15,
    skills: ['HTML5', 'CSS3', 'JavaScript'],
    activeRoadmap: null,
    checklistProgress: {},
    chatHistory: [],
    streakCount: 3,
    lastActiveDate: new Date().toDateString()
  };

  // Seed in Supabase if table is ready
  if (supabase && supabaseTableExists) {
    try {
      const { data } = await supabase.from('user_profiles').select('id').eq('email', demoEmail).maybeSingle();
      if (!data) {
        await supabase.from('user_profiles').insert([{
          username: demoData.username,
          email: demoEmail,
          password: hashedPassword,
          career: demoData.career,
          level: demoData.level,
          hours: demoData.hours,
          skills: demoData.skills,
          active_roadmap: null,
          checklist_progress: {},
          chat_history: [],
          streak_count: 3,
          last_active_date: demoData.lastActiveDate
        }]);
        console.log('🌱 Demo account seeded in Supabase (alex@getcareerpilot.com / password123)');
      }
    } catch (e) {
      console.warn('Demo seed in Supabase:', e.message);
    }
  }

  // Also seed in local store
  const db = getLocalDb();
  if (!db.users[demoEmail]) {
    db.users[demoEmail] = demoData;
    saveLocalDb(db);
    console.log('🌱 Demo account seeded in local database store');
  }
}

// Middlewares
app.use(cors());
app.use(express.json({ limit: '15mb' }));
app.use(express.urlencoded({ extended: true, limit: '15mb' }));

app.use((req, res, next) => {
  if (req.path.startsWith('/api/')) {
    console.log(`[${new Date().toLocaleTimeString()}] ${req.method} ${req.path}`);
  }
  next();
});

// Authentication Token Helper
function generateToken(user) {
  return jwt.sign(
    { id: user.id || user.email, email: user.email, username: user.username },
    JWT_SECRET,
    { expiresIn: '30d' }
  );
}

// Auth Middleware
async function authenticate(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    let token = null;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.split(' ')[1];
    } else if (req.headers['x-user-email']) {
      req.userEmail = req.headers['x-user-email'].toLowerCase();
      return next();
    }

    if (!token) {
      return res.status(401).json({ error: 'Authentication token required' });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    req.userEmail = decoded.email.toLowerCase();
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid or expired authentication token' });
  }
}

// Normalizer: Convert Supabase snake_case to CamelCase
function normalizeUser(u) {
  if (!u) return null;
  return {
    id: u.id,
    username: u.username,
    email: u.email,
    password: u.password,
    career: u.career || 'frontend-developer',
    level: u.level || 'intermediate',
    hours: u.hours || 15,
    skills: u.skills || [],
    activeRoadmap: u.active_roadmap || u.activeRoadmap || null,
    checklistProgress: u.checklist_progress || u.checklistProgress || {},
    chatHistory: u.chat_history || u.chatHistory || [],
    streakCount: u.streak_count || u.streakCount || 1,
    lastActiveDate: u.last_active_date || u.lastActiveDate || '',
    careerRecommendations: u.career_recommendations || u.careerRecommendations || null,
    apiKey: u.api_key || u.apiKey || '',
    createdAt: u.created_at || u.createdAt
  };
}

// Find user from Supabase or Local Fallback
async function findUserByEmail(email) {
  const normEmail = email.toLowerCase().trim();

  if (supabase && supabaseTableExists) {
    try {
      const { data, error } = await supabase.from('user_profiles').select('*').eq('email', normEmail).maybeSingle();
      if (!error && data) {
        return normalizeUser(data);
      }
    } catch (e) {
      console.warn('Supabase query fallback:', e.message);
    }
  }

  const db = getLocalDb();
  return db.users[normEmail] || null;
}

// Save or Update User in Supabase & Local Fallback
async function saveUser(userData) {
  const normEmail = userData.email.toLowerCase().trim();

  // 1. Try Supabase
  if (supabase && supabaseTableExists) {
    try {
      const dbPayload = {
        email: normEmail,
        username: userData.username,
        password: userData.password,
        career: userData.career || 'frontend-developer',
        level: userData.level || 'intermediate',
        hours: userData.hours || 15,
        skills: userData.skills || [],
        active_roadmap: userData.activeRoadmap !== undefined ? userData.activeRoadmap : null,
        checklist_progress: userData.checklistProgress || {},
        chat_history: userData.chatHistory || [],
        streak_count: userData.streakCount || 1,
        last_active_date: userData.lastActiveDate || '',
        career_recommendations: userData.careerRecommendations || null,
        api_key: userData.apiKey || '',
        updated_at: new Date().toISOString()
      };

      const { data, error } = await supabase.from('user_profiles').upsert(dbPayload, { onConflict: 'email' }).select().single();
      if (!error && data) {
        const normalized = normalizeUser(data);
        // Also cache locally
        const db = getLocalDb();
        db.users[normEmail] = normalized;
        saveLocalDb(db);
        return normalized;
      } else if (error) {
        console.warn('Supabase upsert error:', error.message);
      }
    } catch (e) {
      console.warn('Supabase save error:', e.message);
    }
  }

  // 2. Local Fallback Cache
  const db = getLocalDb();
  db.users[normEmail] = {
    ...(db.users[normEmail] || {}),
    ...userData,
    updatedAt: new Date().toISOString()
  };
  saveLocalDb(db);
  return db.users[normEmail];
}

// Sanitize user for client response (remove password)
function sanitizeUser(user) {
  if (!user) return null;
  const safe = { ...user };
  delete safe.password;
  return safe;
}

// ==========================================
// API ROUTES
// ==========================================

// 1. Health Status
app.get('/api/status', async (req, res) => {
  // Re-check Supabase table in case it was just created
  if (supabase && !supabaseTableExists) {
    await checkSupabaseHealth();
  }

  res.json({
    status: 'ok',
    database: (supabase && supabaseTableExists) ? 'supabase' : 'local_store',
    supabaseConfigured: !!(SUPABASE_URL && SUPABASE_KEY),
    supabaseConnected: isSupabaseConnected,
    supabaseTableReady: supabaseTableExists,
    version: '2.0.0',
    timestamp: new Date().toISOString()
  });
});

// 2. Auth: Register / Sign Up
app.post('/api/auth/signup', async (req, res) => {
  try {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
      return res.status(400).json({ error: 'Username, email, and password are required' });
    }

    if (password.length < 4) {
      return res.status(400).json({ error: 'Password must be at least 4 characters long' });
    }

    const normEmail = email.toLowerCase().trim();
    const existing = await findUserByEmail(normEmail);
    if (existing) {
      return res.status(409).json({ error: 'An account with this email already exists. Please Sign In.' });
    }

    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(password, salt);

    const newUserData = {
      username: username.trim(),
      email: normEmail,
      password: hashedPassword,
      career: 'frontend-developer',
      level: 'intermediate',
      hours: 15,
      skills: [],
      activeRoadmap: null,
      checklistProgress: {},
      chatHistory: [],
      streakCount: 1,
      lastActiveDate: new Date().toDateString()
    };

    const saved = await saveUser(newUserData);
    const token = generateToken(saved);

    res.status(201).json({
      message: 'Account created successfully',
      token,
      user: sanitizeUser(saved),
      database: (supabase && supabaseTableExists) ? 'supabase' : 'local_store'
    });
  } catch (err) {
    console.error('Signup error:', err);
    res.status(500).json({ error: 'Server error creating account' });
  }
});

// 3. Auth: Login
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    // Re-verify Supabase table in case user just created it in SQL Editor
    if (supabase && !supabaseTableExists) {
      await checkSupabaseHealth();
    }

    const normEmail = email.toLowerCase().trim();
    const user = await findUserByEmail(normEmail);
    if (!user) {
      return res.status(404).json({ error: 'No account found with this email. Please create an account.' });
    }

    const isMatch = bcrypt.compareSync(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Incorrect password. Please try again.' });
    }

    const token = generateToken(user);

    res.json({
      message: 'Signed in successfully',
      token,
      user: sanitizeUser(user),
      database: (supabase && supabaseTableExists) ? 'supabase' : 'local_store'
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Server error during sign in' });
  }
});

// 4. User Profile
app.get('/api/user/me', authenticate, async (req, res) => {
  try {
    const user = await findUserByEmail(req.userEmail);
    if (!user) {
      return res.status(404).json({ error: 'User account not found' });
    }
    res.json({
      user: sanitizeUser(user),
      database: (supabase && supabaseTableExists) ? 'supabase' : 'local_store'
    });
  } catch (err) {
    console.error('Fetch user error:', err);
    res.status(500).json({ error: 'Error fetching user profile' });
  }
});

// 5. Save Roadmap
app.put('/api/user/roadmap', authenticate, async (req, res) => {
  try {
    const { activeRoadmap, career, level, hours, skills } = req.body;
    const user = await findUserByEmail(req.userEmail);
    if (!user) return res.status(404).json({ error: 'User not found' });

    user.activeRoadmap = activeRoadmap;
    if (career) user.career = career;
    if (level) user.level = level;
    if (hours) user.hours = hours;
    if (skills) user.skills = skills;
    user.checklistProgress = {}; // Reset tasks checkboxes on new build

    const updated = await saveUser(user);
    res.json({
      message: 'Roadmap saved to database successfully',
      user: sanitizeUser(updated)
    });
  } catch (err) {
    console.error('Save roadmap error:', err);
    res.status(500).json({ error: 'Error saving roadmap to database' });
  }
});

// 6. Save Checklist Progress
app.put('/api/user/progress', authenticate, async (req, res) => {
  try {
    const { checklistProgress } = req.body;
    const user = await findUserByEmail(req.userEmail);
    if (!user) return res.status(404).json({ error: 'User not found' });

    user.checklistProgress = checklistProgress || {};
    const updated = await saveUser(user);

    res.json({
      message: 'Task progress synced to database',
      checklistProgress: updated.checklistProgress
    });
  } catch (err) {
    console.error('Save progress error:', err);
    res.status(500).json({ error: 'Error saving task progress' });
  }
});

// 7. Save Chat History
app.put('/api/user/chat', authenticate, async (req, res) => {
  try {
    const { chatHistory } = req.body;
    const user = await findUserByEmail(req.userEmail);
    if (!user) return res.status(404).json({ error: 'User not found' });

    user.chatHistory = Array.isArray(chatHistory) ? chatHistory : [];
    await saveUser(user);

    res.json({ message: 'Chat history synced to database' });
  } catch (err) {
    console.error('Save chat error:', err);
    res.status(500).json({ error: 'Error saving chat history' });
  }
});

// 8. Save Recommendations
app.put('/api/user/recommendations', authenticate, async (req, res) => {
  try {
    const { careerRecommendations } = req.body;
    const user = await findUserByEmail(req.userEmail);
    if (!user) return res.status(404).json({ error: 'User not found' });

    user.careerRecommendations = careerRecommendations;
    await saveUser(user);

    res.json({ message: 'Career recommendations saved to database' });
  } catch (err) {
    console.error('Save recommendations error:', err);
    res.status(500).json({ error: 'Error saving recommendations' });
  }
});

// 9. Update Profile Parameters & Password
app.put('/api/user/profile', authenticate, async (req, res) => {
  try {
    const { username, career, level, hours, skills, apiKey, password } = req.body;
    const user = await findUserByEmail(req.userEmail);
    if (!user) return res.status(404).json({ error: 'User not found' });

    if (username) user.username = username.trim();
    if (career) user.career = career;
    if (level) user.level = level;
    if (hours) user.hours = hours;
    if (skills) user.skills = skills;
    if (apiKey !== undefined) user.apiKey = apiKey;

    if (password && password.length >= 4) {
      const salt = bcrypt.genSaltSync(10);
      user.password = bcrypt.hashSync(password, salt);
    }

    const updated = await saveUser(user);
    res.json({
      message: 'Profile updated in database successfully',
      user: sanitizeUser(updated)
    });
  } catch (err) {
    console.error('Update profile error:', err);
    res.status(500).json({ error: 'Error updating user profile' });
  }
});


// ==========================================
// 10. SECURE SERVER-SIDE AI GATEWAY (GEMINI 2.5 FLASH)
// ==========================================
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY || '';

app.get('/api/ai/status', (req, res) => {
  res.json({
    configured: Boolean(GEMINI_API_KEY && GEMINI_API_KEY.trim() !== ''),
    model: 'gemini-2.5-flash',
    architecture: 'secure_server_proxy',
    message: GEMINI_API_KEY ? 'Backend AI Gateway Active 🟢' : 'Server AI Gateway ready for key or offline fallback'
  });
});

app.post('/api/ai/generateContent', async (req, res) => {
  try {
    const { contents, systemInstruction, generationConfig } = req.body;
    // Support server environment key, or client developer override via header
    const key = GEMINI_API_KEY || req.headers['x-gemini-key'] || (req.body && req.body.apiKey);

    if (!key) {
      return res.status(503).json({
        error: 'Gemini API key is not configured on the backend server',
        fallbackAvailable: true
      });
    }

    const targetUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${key}`;
    const payload = { contents };
    if (systemInstruction) payload.systemInstruction = systemInstruction;
    if (generationConfig) payload.generationConfig = generationConfig;

    const apiRes = await fetch(targetUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (!apiRes.ok) {
      const errText = await apiRes.text();
      return res.status(apiRes.status).json({ error: errText });
    }

    const data = await apiRes.json();
    res.json(data);
  } catch (err) {
    console.error('Server AI Gateway error:', err.message);
    res.status(500).json({ error: err.message, fallbackAvailable: true });
  }
});

// 10. Serve Static Files
app.use(express.static(path.join(__dirname)));

// Catch-all route to serve index.html for SPA
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Start Server
app.listen(PORT, () => {
  console.log(`===================================================`);
  console.log(`🚀 GetCareerPilot Full-Stack Server Running on http://localhost:${PORT}`);
  console.log(`⚡ Supabase Integration Active: ${SUPABASE_URL}`);
  console.log(`===================================================`);
});
