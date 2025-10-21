// Centralized auth service for login, register, refresh, logout
let accessToken: string | null = null;

export const setAccessToken = (token: string | null) => {
  accessToken = token;
};

export const getAccessToken = () => accessToken;

const API_BASE = 'http://localhost:8080/api/auth';

interface RegisterPayload {
  username: string;
  email: string;
  password: string;
}

interface LoginPayload {
  username: string;
  password: string;
}

interface AuthResponse {
  accessToken: string;
  user?: any;
}

/** Register new user */
export async function register(payload: RegisterPayload): Promise<AuthResponse> {
  const res = await fetch(`${API_BASE}/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  
  if (!res.ok) {
    const error = await res.text();
    throw new Error(error || 'Registration failed');
  }
  
  const data = await res.json();
  // Assuming backend returns JWT token in response
  if (data.token) {
    setAccessToken(data.token);
  } else if (data.accessToken) {
    setAccessToken(data.accessToken);
  }
  return data;
}

/** Login user */
export async function login(payload: LoginPayload): Promise<AuthResponse> {
  const res = await fetch(`${API_BASE}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  
  if (!res.ok) {
    const error = await res.text();
    throw new Error(error || 'Login failed');
  }
  
  const data = await res.json();

  if (data.token) {
    setAccessToken(data.token);
  } else if (data.accessToken) {
    setAccessToken(data.accessToken);
  }
  return data;
}

/** Logout user - just clear token from memory */
export async function logout(): Promise<void> {
  setAccessToken(null);
}
