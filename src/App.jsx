import "./App.css";
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
import { Signup } from "./components/Signup";
import { useAuth } from "./context/AuthContext";
import "./styles/common.css";

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
  const { user, isAdmin } = useAuth();
  const [showSignup, setShowSignup] = useState(false);

  useEffect(() => {
    loadFriends();
  }, []);

  async function loadFriends() {
    try {
      const data = await getFriends();
      setFriends(data);
    } catch (error) {
      console.error("Error loading friends:", error);
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
    // Only set the editable fields
    setNewFriend({
      name: friend.name,
      age: friend.age,
      address: friend.address,
      job: friend.job,
      email: friend.email,
      phone: friend.phone,
    });
  }

  if (!user) {
    return (
      <div>
        {showSignup ? (
          <>
            <Signup />
            <button 
              className="button button-primary"
              style={{ margin: '0 auto', display: 'block' }}
              onClick={() => setShowSignup(false)}
            >
              Back to Login
            </button>
          </>
        ) : (
          <>
            <Login />
            <button 
              className="button button-primary"
              style={{ margin: '0 auto', display: 'block' }}
              onClick={() => setShowSignup(true)}
            >
              Create Admin User
            </button>
          </>
        )}
      </div>
    );
  }

  return (
    <div className="container">
      <h1 className="title">Friends List</h1>
      
      {isAdmin && (
        <FriendForm 
          onSubmit={handleSubmit}
          initialData={editingFriend}
          onCancel={() => setEditingFriend(null)}
        />
      )}

      <div className="friends-grid">
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
