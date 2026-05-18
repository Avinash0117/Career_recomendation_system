/**
 * API base URL. Set VITE_API_BASE_URL at build time for production (e.g. https://your-api.onrender.com).
 * No trailing slash.
 */
const raw = import.meta.env.VITE_API_BASE_URL ?? 'http://127.0.0.1:8000';
export const API_BASE_URL = String(raw).replace(/\/$/, '');
