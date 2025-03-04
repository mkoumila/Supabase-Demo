import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { friendService } from "../services/friendService";
import { FriendForm } from "../components/FriendForm";
import { FriendCard } from "../components/FriendCard";
import { Login } from "../components/Login";
import { useAuth } from "../context/AuthContext";

function DashboardPage() {
  const [friends, setFriends] = useState([]);
  const [editingFriend, setEditingFriend] = useState(null);
  const [error, setError] = useState(null);
  const { user, isAdmin, loading, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      loadFriends();
    }
  }, [user]);

  async function loadFriends() {
    try {
      const data = await friendService.getAllFriends();
      setFriends(data);
      setError(null);
    } catch (error) {
      console.error("Error loading friends:", error);
      setError("Failed to load friends");
    }
  }

  async function handleLogout() {
    try {
      await logout();
      navigate("/");
    } catch (error) {
      console.error("Error logging out:", error);
      navigate("/");
    }
  }

  async function handleSubmit(formData) {
    try {
      if (editingFriend) {
        await friendService.updateFriend(editingFriend.id, formData);
        setEditingFriend(null);
      } else {
        await friendService.createFriend(formData);
      }
      loadFriends();
      setError(null);
    } catch (error) {
      console.error("Error saving friend:", error);
      setError(error.message || "Failed to save friend");
    }
  }

  async function handleDelete(id) {
    try {
      await friendService.deleteFriend(id);
      loadFriends();
      setError(null);
    } catch (error) {
      console.error("Error deleting friend:", error);
      setError(error.message || "Failed to delete friend");
    }
  }

  function handleEdit(friend) {
    setEditingFriend(friend);
    // Scroll to form
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full">
          <Login />
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center space-x-4">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <Link
            to="/"
            className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
          >
            View Public List
          </Link>
        </div>
        <div className="flex items-center space-x-4">
          <span className="text-sm text-gray-500">
            Welcome, {user.email} {isAdmin ? "(Admin)" : ""}
          </span>
          <button
            onClick={handleLogout}
            className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
          >
            Logout
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      {isAdmin && (
        <div className="bg-white shadow rounded-lg mb-8">
          <FriendForm
            onSubmit={handleSubmit}
            initialData={editingFriend}
            onCancel={() => setEditingFriend(null)}
          />
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {friends.map((friend) => (
          <FriendCard
            key={friend.id}
            friend={friend}
            onEdit={isAdmin ? handleEdit : undefined}
            onDelete={isAdmin ? handleDelete : undefined}
          />
        ))}
      </div>
    </div>
  );
}

export default DashboardPage;
