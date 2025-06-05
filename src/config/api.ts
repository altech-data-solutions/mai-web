// API Configuration
// Update this URL to match your backend server
export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_URL || 'http://localhost:8000',
  TIMEOUT: 30000, // 30 seconds
  RETRY_ATTEMPTS: 3,
};

// Environment-specific configurations
export const getApiUrl = () => {
  // Check if we're in development, staging, or production
  if (import.meta.env.DEV) {
    return import.meta.env.VITE_API_URL || 'http://localhost:8000';
  }
  
  if (import.meta.env.PROD) {
    return import.meta.env.VITE_API_URL || 'https://your-production-api.com';
  }
  
  return API_CONFIG.BASE_URL;
};

// CORS and request configuration
export const REQUEST_CONFIG = {
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  credentials: 'include' as RequestCredentials,
};

// API endpoints
export const ENDPOINTS = {
  MODELS: '/models',
  ASSISTANTS: '/assistants',
  THREADS: '/threads',
  CHAT: '/chat',
  FINETUNE: '/finetune',
} as const; 