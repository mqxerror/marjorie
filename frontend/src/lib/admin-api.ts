const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
const API_KEY = process.env.NEXT_PUBLIC_ADMIN_API_KEY || '';

export async function adminFetch(path: string, options: RequestInit = {}) {
  const url = `${API_URL}/api${path}`;
  const res = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': API_KEY,
      ...options.headers,
    },
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.message || `API error: ${res.status}`);
  }

  // Handle empty responses (204, etc.)
  const text = await res.text();
  return text ? JSON.parse(text) : null;
}
