import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { friendService } from "../services/friendService";
import { FriendCard } from "../components/FriendCard";
import { useAuth } from "../context/AuthContext";

function HomePage() {
  const [friends, setFriends] = useState([]);
  const { user } = useAuth();

  useEffect(() => {
    loadFriends();
  }, []);

  async function loadFriends() {
    try {
      const data = await friendService.getAllFriends();
      setFriends(data);
    } catch (error) {
      console.error("Error loading friends:", error);
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Friends List</h1>
        <Link
          to="/dashboard"
          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
        >
          {user ? "Go to Dashboard" : "Login"}
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {friends.map((friend) => (
          <FriendCard
            key={friend.id}
            friend={friend}
            readonly
          />
        ))}
      </div>
    </div>
  );
}

export default HomePage; 