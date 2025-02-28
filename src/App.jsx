import "./App.css";
import { useEffect, useState } from "react";
import {
  getFriends,
  createFriend,
  updateFriend,
  deleteFriend,
} from "./utils/friendsApi";

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

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      if (editingFriend) {
        await updateFriend(editingFriend.id, newFriend);
        setEditingFriend(null);
      } else {
        await createFriend(newFriend);
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

  return (
    <div>
      <h1>Friends List</h1>

      <form
        onSubmit={handleSubmit}
        style={{
          marginBottom: "30px",
          display: "flex",
          flexDirection: "column",
          gap: "10px",
          maxWidth: "400px",
          width: "100%",
        }}
      >
        <h2>{editingFriend ? "Edit Friend" : "Add New Friend"}</h2>
        <input
          type="text"
          name="name"
          placeholder="Name"
          value={newFriend.name}
          onChange={handleInputChange}
          required
          style={{ padding: "8px" }}
        />
        <input
          type="number"
          name="age"
          placeholder="Age"
          value={newFriend.age}
          onChange={handleInputChange}
          required
          style={{ padding: "8px" }}
        />
        <input
          type="text"
          name="address"
          placeholder="Address"
          value={newFriend.address}
          onChange={handleInputChange}
          required
          style={{ padding: "8px" }}
        />
        <input
          type="text"
          name="job"
          placeholder="Job"
          value={newFriend.job}
          onChange={handleInputChange}
          required
          style={{ padding: "8px" }}
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={newFriend.email}
          onChange={handleInputChange}
          required
          style={{ padding: "8px" }}
        />
        <input
          type="tel"
          name="phone"
          placeholder="Phone"
          value={newFriend.phone}
          onChange={handleInputChange}
          required
          style={{ padding: "8px" }}
        />
        <div style={{ display: "flex", gap: "10px" }}>
          <button
            type="submit"
            style={{
              padding: "10px",
              backgroundColor: editingFriend ? "#2196F3" : "#4CAF50",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
              flex: 1,
            }}
          >
            {editingFriend ? "Update Friend" : "Add Friend"}
          </button>
          {editingFriend && (
            <button
              type="button"
              onClick={() => {
                setEditingFriend(null);
                setNewFriend({
                  name: "",
                  age: "",
                  address: "",
                  job: "",
                  email: "",
                  phone: "",
                });
              }}
              style={{
                padding: "10px",
                backgroundColor: "#grey",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
                flex: 1,
              }}
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "20px" }}>
        {friends.map((friend) => (
          <div
            key={friend.id}
            style={{
              border: "1px solid #ccc",
              padding: "15px",
              borderRadius: "8px",
              flex: "1",
            }}
          >
            <h2>{friend.name}</h2>
            <p>
              <strong>Age:</strong> {friend.age}
            </p>
            <p>
              <strong>Job:</strong> {friend.job}
            </p>
            <p>
              <strong>Email:</strong> {friend.email}
            </p>
            <p>
              <strong>Phone:</strong> {friend.phone}
            </p>
            <p>
              <strong>Address:</strong> {friend.address}
            </p>
            <p>
              <strong>Member since:</strong>{" "}
              {new Date(friend.created_at).toLocaleDateString()}
            </p>

            <div
              style={{
                display: "flex",
                gap: "10px",
                marginTop: "15px",
              }}
            >
              <button
                onClick={() => handleEdit(friend)}
                style={{
                  padding: "8px",
                  backgroundColor: "#2196F3",
                  color: "white",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                  flex: 1,
                }}
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(friend.id)}
                style={{
                  padding: "8px",
                  backgroundColor: "#f44336",
                  color: "white",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                  flex: 1,
                }}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
