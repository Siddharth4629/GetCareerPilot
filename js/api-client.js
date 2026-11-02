// api-client.js - Full-Stack Supabase Cloud & Local REST API Client

const ApiClient = (function() {
  const SUPABASE_URL = 'https://eomaowtmpnglyvvdnbbi.supabase.co';
  const SUPABASE_KEY = 'sb_publishable_AJTng_9RpRJX8OV7-bDsGg_HkwQgiH4';
  const LOCAL_API_BASE = (typeof window !== 'undefined' && window.location.port === '3000') ? '/api' : 'http://localhost:3000/api';

  function getToken() {
    return localStorage.getItem('devpath_token') || '';
  }

  function setToken(token) {
    if (token) {
      localStorage.setItem('devpath_token', token);
    } else {
      localStorage.removeItem('devpath_token');
    }
  }

  // Direct Supabase REST fetch helper (works everywhere, zero port dependency)
  async function supabaseFetch(table, query = '', options = {}) {
    const url = `${SUPABASE_URL}/rest/v1/${table}${query}`;
    const headers = {
      'apikey': SUPABASE_KEY,
      'Authorization': `Bearer ${SUPABASE_KEY}`,
      'Content-Type': 'application/json',
      'Prefer': options.prefer || 'return=representation',
      ...(options.headers || {})
    };
    const res = await fetch(url, { ...options, headers });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ message: `HTTP ${res.status}` }));
      throw new Error(err.message || `HTTP ${res.status}`);
    }
    return await res.json();
  }

  // Normalize user row
  function normalize(u) {
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

  return {
    getToken,
    setToken,
    SUPABASE_URL,

    // Check Database Health & Connectivity
    async checkStatus() {
      // 1. Direct Supabase Cloud check
      try {
        const rows = await supabaseFetch('user_profiles', '?select=id&limit=1');
        return {
          status: 'ok',
          database: 'supabase',
          supabaseConnected: true,
          supabaseTableReady: true,
          directCloud: true
        };
      } catch (cloudErr) {
        console.warn('Direct Supabase status check:', cloudErr.message);
      }

      // 2. Try Local Server
      try {
        const res = await fetch(`${LOCAL_API_BASE}/status`);
        if (res.ok) return await res.json();
      } catch (localErr) {}

      return { status: 'offline', database: 'local_client', supabaseConnected: false };
    },

    // User Signup
    async signup(username, email, password) {
      const normEmail = email.toLowerCase().trim();

      const newUserPayload = {
        username: username.trim(),
        email: normEmail,
        password: password,
        career: 'frontend-developer',
        level: 'intermediate',
        hours: 15,
        skills: [],
        active_roadmap: null,
        checklist_progress: {},
        chat_history: [],
        streak_count: 1,
        last_active_date: new Date().toDateString()
      };

      // 1. Direct Supabase Cloud
      try {
        const existing = await supabaseFetch('user_profiles', `?email=eq.${encodeURIComponent(normEmail)}&select=id,password`);
        if (existing && existing.length > 0) {
          if (existing[0].password === password) {
            setToken(`sb_token_${Date.now()}`);
            const safeUser = { ...newUserPayload };
            delete safeUser.password;
            return { user: safeUser, database: 'supabase', alreadyExisted: true };
          }
          throw new Error('An account with this email already exists. Please Sign In.');
        }

        const inserted = await supabaseFetch('user_profiles', '', {
          method: 'POST',
          body: JSON.stringify(newUserPayload)
        });

        const safeUser = normalize(inserted[0] || newUserPayload);
        delete safeUser.password;
        setToken(`sb_token_${Date.now()}`);
        return { user: safeUser, database: 'supabase' };
      } catch (err) {
        if (err.message && err.message.includes('already exists')) throw err;
        console.warn('Direct Supabase signup fallback to local store:', err.message);
      }

      // 2. Local browser accounts fallback
      const accounts = (typeof getRegisteredAccounts === 'function') ? getRegisteredAccounts() : {};
      if (accounts[normEmail] && accounts[normEmail].password !== password) {
        throw new Error('An account with this email already exists. Please Sign In.');
      }

      accounts[normEmail] = newUserPayload;
      if (typeof saveRegisteredAccounts === 'function') {
        saveRegisteredAccounts(accounts);
      }
      setToken(`local_token_${Date.now()}`);
      const safeUser = { ...newUserPayload };
      delete safeUser.password;
      return { user: safeUser, database: 'local_store' };
    },

    // User Login
    async login(email, password) {
      const normEmail = email.toLowerCase().trim();

      // 1. Check Demo Account special case (fast & works offline or on Vercel)
      if (normEmail === 'alex@getcareerpilot.com' && (password === 'password123' || password === 'demo')) {
        const demoUser = {
          username: 'Alex Coder',
          email: 'alex@getcareerpilot.com',
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
        setToken(`sb_token_${Date.now()}`);
        return { user: demoUser, database: 'demo_store' };
      }

      // 2. Direct Supabase Cloud
      try {
        const users = await supabaseFetch('user_profiles', `?email=eq.${encodeURIComponent(normEmail)}&select=*`);
        if (users && users.length > 0) {
          const u = users[0];
          let isMatch = (u.password === password);

          // If password was hashed with bcrypt ($2a$), try local server to verify
          if (!isMatch && u.password && u.password.startsWith('$2a$')) {
            try {
              const srvRes = await fetch(`${LOCAL_API_BASE}/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
              });
              if (srvRes.ok) {
                const srvData = await srvRes.json();
                if (srvData.token) setToken(srvData.token);
                return srvData;
              }
            } catch (e) {}

            // Also check if local registered account matches
            const accounts = (typeof getRegisteredAccounts === 'function') ? getRegisteredAccounts() : {};
            if (accounts[normEmail] && accounts[normEmail].password === password) {
              isMatch = true;
            }
          }

          if (!isMatch) {
            throw new Error('Incorrect password. Please try again.');
          }

          const safeUser = normalize(u);
          delete safeUser.password;
          setToken(`sb_token_${Date.now()}`);
          return { user: safeUser, database: 'supabase' };
        }
      } catch (err) {
        if (err.message && err.message.includes('Incorrect password')) {
          throw err;
        }
        console.warn('Supabase query failed, checking local accounts:', err.message);
      }

      // 3. Fallback to Local Server if on localhost
      if (typeof window !== 'undefined' && window.location.hostname === 'localhost') {
        try {
          const response = await fetch(`${LOCAL_API_BASE}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
          });
          if (response.ok) {
            const data = await response.json();
            if (data.token) setToken(data.token);
            return data;
          }
        } catch (e) {}
      }

      // 4. Local browser storage fallback
      const accounts = (typeof getRegisteredAccounts === 'function') ? getRegisteredAccounts() : {};
      const localAcc = accounts[normEmail];
      if (localAcc) {
        if (localAcc.password === password) {
          const safeUser = { ...localAcc };
          delete safeUser.password;
          setToken(`local_token_${Date.now()}`);
          return { user: safeUser, database: 'local_store' };
        } else {
          throw new Error('Incorrect password. Please try again.');
        }
      }

      throw new Error('No account found for this email. Click "Create Account" to sign up.');
    },

    // Save Active Roadmap
    async saveRoadmap(activeRoadmap, career, level, hours, skills) {
      const savedUser = localStorage.getItem('devpath_user');
      const email = savedUser ? JSON.parse(savedUser).email : '';
      if (!email) return;

      const normEmail = email.toLowerCase().trim();
      const payload = {
        active_roadmap: activeRoadmap,
        checklist_progress: {},
        updated_at: new Date().toISOString()
      };
      if (career) payload.career = career;
      if (level) payload.level = level;
      if (hours) payload.hours = hours;
      if (skills) payload.skills = skills;

      try {
        await supabaseFetch('user_profiles', `?email=eq.${encodeURIComponent(normEmail)}`, {
          method: 'PATCH',
          body: JSON.stringify(payload)
        });
        return { message: 'Saved to Supabase' };
      } catch (e) {
        await fetch(`${LOCAL_API_BASE}/user/roadmap`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json', 'x-user-email': email },
          body: JSON.stringify({ activeRoadmap, career, level, hours, skills })
        }).catch(() => {});
      }
    },

    // Save Progress
    async saveProgress(checklistProgress) {
      const savedUser = localStorage.getItem('devpath_user');
      const email = savedUser ? JSON.parse(savedUser).email : '';
      if (!email) return;

      const normEmail = email.toLowerCase().trim();
      try {
        await supabaseFetch('user_profiles', `?email=eq.${encodeURIComponent(normEmail)}`, {
          method: 'PATCH',
          body: JSON.stringify({ checklist_progress: checklistProgress, updated_at: new Date().toISOString() })
        });
      } catch (e) {
        await fetch(`${LOCAL_API_BASE}/user/progress`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json', 'x-user-email': email },
          body: JSON.stringify({ checklistProgress })
        }).catch(() => {});
      }
    },

    // Save Chat
    async saveChat(chatHistory) {
      const savedUser = localStorage.getItem('devpath_user');
      const email = savedUser ? JSON.parse(savedUser).email : '';
      if (!email) return;

      const normEmail = email.toLowerCase().trim();
      try {
        await supabaseFetch('user_profiles', `?email=eq.${encodeURIComponent(normEmail)}`, {
          method: 'PATCH',
          body: JSON.stringify({ chat_history: chatHistory, updated_at: new Date().toISOString() })
        });
      } catch (e) {
        await fetch(`${LOCAL_API_BASE}/user/chat`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json', 'x-user-email': email },
          body: JSON.stringify({ chatHistory })
        }).catch(() => {});
      }
    },

    // Save Recommendations
    async saveRecommendations(careerRecommendations) {
      const savedUser = localStorage.getItem('devpath_user');
      const email = savedUser ? JSON.parse(savedUser).email : '';
      if (!email) return;

      const normEmail = email.toLowerCase().trim();
      try {
        await supabaseFetch('user_profiles', `?email=eq.${encodeURIComponent(normEmail)}`, {
          method: 'PATCH',
          body: JSON.stringify({ career_recommendations: careerRecommendations, updated_at: new Date().toISOString() })
        });
      } catch (e) {}
    },

    // Update Profile
    async updateProfile(profileData) {
      const savedUser = localStorage.getItem('devpath_user');
      const email = savedUser ? JSON.parse(savedUser).email : '';
      if (!email) return;

      const normEmail = email.toLowerCase().trim();
      const payload = { updated_at: new Date().toISOString() };
      if (profileData.username) payload.username = profileData.username;
      if (profileData.career) payload.career = profileData.career;
      if (profileData.level) payload.level = profileData.level;
      if (profileData.hours) payload.hours = profileData.hours;
      if (profileData.skills) payload.skills = profileData.skills;
      if (profileData.apiKey !== undefined) payload.api_key = profileData.apiKey;
      if (profileData.password) payload.password = profileData.password;

      try {
        const updated = await supabaseFetch('user_profiles', `?email=eq.${encodeURIComponent(normEmail)}`, {
          method: 'PATCH',
          body: JSON.stringify(payload)
        });
        return { user: normalize(updated[0]) };
      } catch (e) {
        const res = await fetch(`${LOCAL_API_BASE}/user/profile`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json', 'x-user-email': email },
          body: JSON.stringify(profileData)
        });
        return await res.json();
      }
    },

    logout() {
      setToken(null);
    }
  };
})();

window.ApiClient = ApiClient;
