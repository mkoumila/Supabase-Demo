const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5001/api";

export const authService = {
  async login(email, password) {
    const url = `${API_URL}/auth/login`;
    const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    };

    const response = await fetch(url, requestOptions);

    if (!response.ok) {
      const error = await response.json();
      console.error("Login error:", error);
      throw new Error(error.error || "Login failed");
    }

    const data = await response.json();

    localStorage.setItem("token", data.token);
    return data;
  },

  async logout() {
    const token = localStorage.getItem("token");
    if (!token) {
      console.log("No token found, clearing session");
      localStorage.removeItem("token");
      return;
    }

    try {
      const response = await fetch(`${API_URL}/auth/logout`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        console.error("Logout failed:", response.status);
        localStorage.removeItem("token");
        const error = await response.json();
        throw new Error(error.error || "Logout failed");
      }

      localStorage.removeItem("token");
    } catch (error) {
      localStorage.removeItem("token");
      throw error;
    }
  },

  async getCurrentSession() {
    const token = localStorage.getItem("token");
    if (!token) return null;

    const response = await fetch(`${API_URL}/auth/session`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      localStorage.removeItem("token");
      return null;
    }

    const user = await response.json();
    return user;
  },
};
