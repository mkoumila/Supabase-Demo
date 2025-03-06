export const api = {
  async request(endpoint, options = {}) {
    const token = localStorage.getItem("token");

    const defaultHeaders = {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };

    const config = {
      ...options,
      headers: {
        ...defaultHeaders,
        ...options.headers,
      },
    };

    const url = `/api${endpoint}`;

    try {
      const response = await fetch(url, config);

      if (!response.ok) {
        const errorData = await response.text();

        let errorMessage;
        try {
          const jsonError = JSON.parse(errorData);
          errorMessage = jsonError.message;
        } catch (e) {
          errorMessage = errorData || `HTTP error! status: ${response.status}`;
        }
        throw new Error(errorMessage);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("API request failed:", error);
      throw error;
    }
  },

  // Users endpoints
  users: {
    getAll: () => api.request('/users'),
    
    create: (userData) => api.request('/users', {
      method: 'POST',
      body: JSON.stringify(userData),
    }),
    
    update: (userId, userData) => api.request(`/users/${userId}`, {
      method: 'PUT',
      body: JSON.stringify(userData),
    }),
    
    delete: (userId) => api.request(`/users/${userId}`, {
      method: 'DELETE',
    }),
    
    updateProfile: (userData) => api.request('/users/profile', {
      method: 'PUT',
      body: JSON.stringify(userData),
    }),
  },
};
