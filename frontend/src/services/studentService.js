const API_URL = import.meta.env.VITE_API_URL;

export const studentService = {
  async getAllStudents() {
    const response = await fetch(`${API_URL}/api/students`);
    if (!response.ok) {
      throw new Error("Failed to fetch students");
    }
    return response.json();
  },

  async createStudent(studentData) {
    const token = localStorage.getItem("token");
    const response = await fetch(`${API_URL}/api/students`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(studentData),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Failed to create student");
    }
    return response.json();
  },

  async updateStudent(id, studentData) {
    const token = localStorage.getItem("token");
    const response = await fetch(`${API_URL}/api/students/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(studentData),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Failed to update student");
    }
    return response.json();
  },

  async deleteStudent(id) {
    const token = localStorage.getItem("token");
    const response = await fetch(`${API_URL}/api/students/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Failed to delete student");
    }
    return true;
  },
};
