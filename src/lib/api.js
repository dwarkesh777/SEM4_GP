const rawApiUrl = import.meta.env.VITE_API_URL || `http://${window.location.hostname}:8000`;
export const API_URL = rawApiUrl.endsWith('/') ? rawApiUrl.slice(0, -1) : rawApiUrl;
