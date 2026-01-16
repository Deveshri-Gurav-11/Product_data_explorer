const API_BASE = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:3000';

export async function fetchNavigation() {
  try {
    const res = await fetch(`${API_BASE}/navigation`, {
      cache: 'no-store',
    });

    if (!res.ok) {
      console.error('Backend returned status:', res.status);
      return [];
    }

    return res.json();
  } catch (error) {
    console.error('fetchNavigation failed:', error);
    return [];
  }
}

