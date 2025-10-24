import api from "./api"; // your axios instance
// In-memory access token storage

let accessToken: string | null = null;

export const setAccessToken = (token: string | null) => { 
  accessToken = token; 
};

export const getAccessToken = () => accessToken;



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
  if (token) {
    setAccessToken(token);
  }
  
  
  return { 
    token, 
    user: { username: payload.username, email: payload.email } 
  };
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
  
  
  const token = data.token 
  if (token) {
    setAccessToken(token);
  }
  
  // If backend returns user data, use it; otherwise create minimal user object
  return { 
    token, 
    user: data.user || { username: payload.username } 
  };
}

/** Logout */
export async function logout() {
  setAccessToken(null);
}