const API_URL = import.meta.env.VITE_API_URL;

export async function getFriends() {
  const response = await fetch(`${API_URL}/friends`);
  if (!response.ok) {
    throw new Error('Failed to fetch friends');
  }
  return response.json();
}

export async function createFriend(friendData) {
  const response = await fetch(`${API_URL}/friends`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(friendData),
  });
  if (!response.ok) {
    throw new Error('Failed to create friend');
  }
}

export async function updateFriend(id, friendData) {
  const response = await fetch(`${API_URL}/friends/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(friendData),
  });
  if (!response.ok) {
    throw new Error('Failed to update friend');
  }
}

export async function deleteFriend(id) {
  const response = await fetch(`${API_URL}/friends/${id}`, {
    method: 'DELETE',
  });
  if (!response.ok) {
    throw new Error('Failed to delete friend');
  }
} 