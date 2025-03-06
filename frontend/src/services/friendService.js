const API_URL = import.meta.env.VITE_API_URL;

export const friendService = {
  async getAllFriends() {
    const response = await fetch(`${API_URL}/api/friends`);
    if (!response.ok) {
      throw new Error("Failed to fetch friends");
    }
    return response.json();
  },

  async createFriend(friendData) {
    const token = localStorage.getItem("token");
    const response = await fetch(`${API_URL}/api/friends`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(friendData),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Failed to create friend");
    }
    return response.json();
  },

  async updateFriend(id, friendData) {
    const token = localStorage.getItem("token");
    const response = await fetch(`${API_URL}/api/friends/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(friendData),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Failed to update friend");
    }
    return response.json();
  },

  async deleteFriend(id) {
    const token = localStorage.getItem("token");
    const response = await fetch(`${API_URL}/api/friends/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Failed to delete friend");
    }
    return true;
  },
};
