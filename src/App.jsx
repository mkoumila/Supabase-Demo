import { useEffect, useState } from "react";
import {
  getFriends,
  createFriend,
  updateFriend,
  deleteFriend,
} from "./utils/friendsApi";
import { FriendForm } from "./components/FriendForm";
import { FriendCard } from "./components/FriendCard";
import { Login } from "./components/Login";
import { useAuth } from "./context/AuthContext";
import { supabase } from "./utils/supabaseClient";

function App() {
  const [friends, setFriends] = useState([]);
  const [newFriend, setNewFriend] = useState({
    name: "",
    age: "",
    address: "",
    job: "",
    email: "",
    phone: "",
  });
  const [editingFriend, setEditingFriend] = useState(null);
  const { user, isAdmin, loading } = useAuth();

  useEffect(() => {
    if (user) {
      loadFriends();
    }
  }, [user]);

  async function loadFriends() {
    try {
      const data = await getFriends();
      setFriends(data);
    } catch (error) {
      console.error("Error loading friends:", error);
    }
  }

  async function handleLogout() {
    try {
      await supabase.auth.signOut();
    } catch (error) {
      console.error("Error logging out:", error);
    }
  }

  async function handleSubmit(formData) {
    try {
      if (editingFriend) {
        await updateFriend(editingFriend.id, formData);
        setEditingFriend(null);
      } else {
        await createFriend(formData);
      }

      // Reset form
      setNewFriend({
        name: "",
        age: "",
        address: "",
        job: "",
        email: "",
        phone: "",
      });

      // Refresh friends list
      loadFriends();
    } catch (error) {
      console.error("Error saving friend:", error);
    }
  }

  function handleInputChange(e) {
    const { name, value } = e.target;
    setNewFriend((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  async function handleDelete(id) {
    try {
      await deleteFriend(id);
      loadFriends();
    } catch (error) {
      console.error("Error deleting friend:", error);
    }
  }

  function handleEdit(friend) {
    setEditingFriend(friend);
    setNewFriend({
      name: friend.name,
      age: friend.age,
      address: friend.address,
      job: friend.job,
      email: friend.email,
      phone: friend.phone,
    });
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
        <h1 className="text-3xl font-bold text-gray-900">Friends List</h1>
        <div className="flex items-center space-x-4">
          <span className="text-sm text-gray-500">
            Welcome, {user.email}
          </span>
          <button
            onClick={handleLogout}
            className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
          >
            Logout
          </button>
        </div>
      </div>

      {isAdmin && (
        <div className="bg-gray-50 shadow rounded-lg mb-8">
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

export default App;
