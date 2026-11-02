// api-client.js - Full-Stack MongoDB & Express REST API Client

const ApiClient = (function() {
  const API_BASE = '/api';

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

  function getHeaders() {
    const headers = {
      'Content-Type': 'application/json'
    };
    const token = getToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    const savedUser = localStorage.getItem('devpath_user');
    if (savedUser) {
      try {
        const u = JSON.parse(savedUser);
        if (u && u.email) headers['x-user-email'] = u.email;
      } catch (e) {}
    }
    return headers;
  }

  async function request(endpoint, options = {}) {
    const url = `${API_BASE}${endpoint}`;
    const config = {
      ...options,
      headers: {
        ...getHeaders(),
        ...(options.headers || {})
      }
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || `HTTP ${response.status}`);
      }
      return data;
    } catch (err) {
      console.warn(`API request ${endpoint} failed:`, err.message);
      throw err;
    }
  }

  return {
    getToken,
    setToken,

    // Check Database Health & Connectivity
    async checkStatus() {
      try {
        return await request('/status');
      } catch (e) {
        return { status: 'offline', database: 'local_client', mongodbConnected: false };
      }
    },

    // User Signup
    async signup(username, email, password) {
      const res = await request('/auth/signup', {
        method: 'POST',
        body: JSON.stringify({ username, email, password })
      });
      if (res.token) setToken(res.token);
      return res;
    },

    // User Login
    async login(email, password) {
      const res = await request('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password })
      });
      if (res.token) setToken(res.token);
      return res;
    },

    // Get Logged In User
    async getCurrentUser() {
      return await request('/user/me');
    },

    // Save Active Roadmap
    async saveRoadmap(activeRoadmap, career, level, hours, skills) {
      return await request('/user/roadmap', {
        method: 'PUT',
        body: JSON.stringify({ activeRoadmap, career, level, hours, skills })
      });
    },

    // Save Task Checklist Progress
    async saveProgress(checklistProgress) {
      return await request('/user/progress', {
        method: 'PUT',
        body: JSON.stringify({ checklistProgress })
      });
    },

    // Save Chat History
    async saveChat(chatHistory) {
      return await request('/user/chat', {
        method: 'PUT',
        body: JSON.stringify({ chatHistory })
      });
    },

    // Save Career Recommendations
    async saveRecommendations(careerRecommendations) {
      return await request('/user/recommendations', {
        method: 'PUT',
        body: JSON.stringify({ careerRecommendations })
      });
    },

    // Update Profile Parameters & Password
    async updateProfile(profileData) {
      return await request('/user/profile', {
        method: 'PUT',
        body: JSON.stringify(profileData)
      });
    },

    // Clear Session Token
    logout() {
      setToken(null);
    }
  };
})();

// Attach to window
window.ApiClient = ApiClient;
