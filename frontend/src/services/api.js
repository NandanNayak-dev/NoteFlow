const API_BASE = (import.meta.env.VITE_API_URL || '') + '/api/notes';

export const getNote = async (slug) => {
  const response = await fetch(`${API_BASE}/${slug}`, {
    method: 'GET',
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || 'Failed to fetch note');
  }
  return { status: response.status, data };
};

export const updateNote = async (slug, payload) => {
  const response = await fetch(`${API_BASE}/${slug}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || 'Failed to update note');
  }
  return data;
};
