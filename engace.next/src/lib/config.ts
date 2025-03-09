/**
 * Configuration for API endpoints and settings
 */

// Get API domain from environment variables with fallback
export const API_DOMAIN = process.env.NEXT_PUBLIC_API_DOMAIN || 'https://localhost:5000'

/**
 * Get full API URL for a given endpoint
 * @param endpoint - The API endpoint path (e.g., '/api/auth')
 * @returns Full API URL
 */
export const getApiUrl = (endpoint: string): string => {
  // Remove leading slash if present
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint.slice(1) : endpoint
  return `${API_DOMAIN}/api/${cleanEndpoint}`
}

/**
 * Common API endpoints used in the application
 */
export const API_ENDPOINTS = {
  // Auth endpoints
  auth: {
    login: '/auth/login',
    register: '/auth/register',
    verify: '/auth/verify',
  },
  // Writing review endpoints
  writing: {
    submit: '/writing/submit',
    feedback: '/writing/feedback',
  },
  // Dictionary endpoints
  dictionary: {
    search: '/dictionary/search',
    suggest: '/dictionary/suggest',
  },
  // Quiz endpoints
  quiz: {
    generate: '/quiz/generate',
    submit: '/quiz/submit',
  },
} as const

/**
 * API request configuration
 */
export const API_CONFIG = {
  // Default headers for API requests
  headers: {
    'Content-Type': 'application/json',
  },
  // Request timeout in milliseconds
  timeout: 30000,
  // Default request options
  defaultOptions: {
    credentials: 'include' as RequestCredentials,
  },
} as const

/**
 * Helper to create full API URL with domain
 * @param path - API endpoint path
 * @returns Full API URL
 */
export const createApiUrl = (path: string): string => {
  return `${API_DOMAIN}${path}`
}

/**
 * Create headers with authentication token
 * @param token - Authentication token
 * @returns Headers object with authorization
 */
export const createAuthHeaders = (token?: string): HeadersInit => {
  const headers: HeadersInit = {
    ...API_CONFIG.headers,
  }

  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }

  return headers
}