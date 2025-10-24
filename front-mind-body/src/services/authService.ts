import api from "./api"; // your axios instance
// In-memory access token storage

let accessToken: string | null = null;

export const setAccessToken = (token: string | null) => { 
  if (token) {
    localStorage.setItem('token', token);
  } else {
    localStorage.removeItem('token');
  }
};

export const getAccessToken = () => {
  return localStorage.getItem('token');
};

// Helper to store user data
export const setStoredUser = (user: any) => {
  if (user) {
    localStorage.setItem('user', JSON.stringify(user));
  } else {
    localStorage.removeItem('user');
  }
};

export const getStoredUser = () => {
  const userStr = localStorage.getItem('user');
  if (!userStr) return null;
  try {
    return JSON.parse(userStr);
  } catch {
    return null;
  }
};



export async function getCurrentUser() {
  const res = await api.get("/user/me");
  return res.data;
}
/** Register */
export async function register(payload: { username: string; email: string; password: string; }) {
  const res = await fetch('http://localhost:8080/api/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  
  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(errorText || 'Registration failed');
  }
  
  const data = await res.json();
  
  const token = data.token || data.accessToken;
  const user = { username: payload.username, email: payload.email };
  
  if (token) {
    setAccessToken(token);
    setStoredUser(user); // Save user to localStorage
  }
  
  return { token, user };
}

/** Login */
export async function login(payload: { username: string; password: string; }) {
  const res = await fetch('http://localhost:8080/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  
  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(errorText || 'Login failed');
  }
  
  const data = await res.json();
  
  const token = data.token;
  const user = data.user || { username: payload.username };
  
  if (token) {
    setAccessToken(token);
    setStoredUser(user); // Save user to localStorage
  }
  
  return { token, user };
}

/** Logout */
export async function logout() {
  setAccessToken(null);
  setStoredUser(null); // Clear user from localStorage
}