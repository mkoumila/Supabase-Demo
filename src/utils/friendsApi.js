import { supabase } from './supabaseClient';

const API_URL = import.meta.env.VITE_API_URL;

async function getAuthHeader() {
  const { data: { session } } = await supabase.auth.getSession();
  
  if (!session?.access_token) {
    throw new Error('No active session');
  }
  
  return {
    'Authorization': `${session.token_type.toLowerCase()} ${session.access_token}`,
    'Content-Type': 'application/json',
  };
}

export async function getFriends() {
  const response = await fetch(`${API_URL}/friends`);
  if (!response.ok) {
    throw new Error('Failed to fetch friends');
  }
  return response.json();
}

export async function createFriend(friendData) {
  const headers = await getAuthHeader();
  const response = await fetch(`${API_URL}/friends`, {
    method: 'POST',
    headers,
    body: JSON.stringify(friendData),
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to create friend');
  }
}

export async function updateFriend(id, friendData) {
  try {
    const { id: _, created_at, ...updateData } = friendData;
    const headers = await getAuthHeader();
    
    const response = await fetch(`${API_URL}/friends/${id}`, {
      method: 'PUT',
      headers,
      body: JSON.stringify(updateData),
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || 'Failed to update friend');
    }
    
    return data;
  } catch (error) {
    throw error;
  }
}

export async function deleteFriend(id) {
  const headers = await getAuthHeader();
  const response = await fetch(`${API_URL}/friends/${id}`, {
    method: 'DELETE',
    headers,
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to delete friend');
  }
} 