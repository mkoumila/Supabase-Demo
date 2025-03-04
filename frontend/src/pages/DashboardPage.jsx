import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { friendService } from "../services/friendService";
import { FriendForm } from "../components/FriendForm";
import { Login } from "../components/Login";
import { useAuth } from "../context/AuthContext";
import { Input } from "../components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table";
import Pagination from "../components/ui/pagination";

function DashboardPage() {
  const [friends, setFriends] = useState([]);
  const [editingFriend, setEditingFriend] = useState(null);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [showForm, setShowForm] = useState(false);
  const itemsPerPage = 5;
  const { user, isAdmin, loading, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      loadFriends();
    }
  }, [user]);

  // Filter friends based on search query
  const filteredFriends = friends.filter((friend) =>
    friend.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Calculate pagination values
  const totalPages = Math.ceil(filteredFriends.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentFriends = filteredFriends.slice(startIndex, endIndex);

  // Reset to first page when search query changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

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

  function handleEdit(friend) {
    setEditingFriend(friend);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  const handleCancel = () => {
    setEditingFriend(null);
    setShowForm(false);
  };

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
      setShowForm(false);
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
            className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 underline transition-colors"
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

      {isAdmin && !showForm && (
        <div className="mb-8">
          <button
            onClick={() => setShowForm(true)}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
          >
            Add New Friend
          </button>
        </div>
      )}

      {isAdmin && showForm && (
        <div className="bg-white shadow rounded-lg mb-8">
          <FriendForm
            onSubmit={handleSubmit}
            initialData={editingFriend}
            onCancel={handleCancel}
          />
        </div>
      )}

      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="p-4 border-b">
          <div className="max-w-sm">
            <Input
              type="text"
              placeholder="Search friends by name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="max-w-sm"
            />
          </div>
        </div>
        <div className="w-full overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="min-w-[150px]">Name</TableHead>
                <TableHead className="min-w-[80px]">Age</TableHead>
                <TableHead className="min-w-[150px]">Job</TableHead>
                <TableHead className="min-w-[200px]">Email</TableHead>
                <TableHead className="min-w-[150px]">Phone</TableHead>
                <TableHead className="min-w-[200px]">Address</TableHead>
                <TableHead className="min-w-[120px]">Created At</TableHead>
                {isAdmin && (
                  <TableHead className="min-w-[120px]">Actions</TableHead>
                )}
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentFriends.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={isAdmin ? 8 : 7}
                    className="text-center py-4"
                  >
                    {searchQuery
                      ? "No friends found matching your search"
                      : "No friends found"}
                  </TableCell>
                </TableRow>
              ) : (
                currentFriends.map((friend) => (
                  <TableRow key={friend.id}>
                    <TableCell className="font-medium">{friend.name}</TableCell>
                    <TableCell>{friend.age}</TableCell>
                    <TableCell>{friend.job}</TableCell>
                    <TableCell>{friend.email}</TableCell>
                    <TableCell>{friend.phone}</TableCell>
                    <TableCell>{friend.address}</TableCell>
                    <TableCell>
                      {new Date(friend.created_at).toLocaleDateString()}
                    </TableCell>
                    {isAdmin && (
                      <TableCell>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleEdit(friend)}
                            className="px-3 py-1 text-sm text-blue-600 hover:text-blue-800 font-medium"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(friend.id)}
                            className="px-3 py-1 text-sm text-red-600 hover:text-red-800 font-medium"
                          >
                            Delete
                          </button>
                        </div>
                      </TableCell>
                    )}
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
          {filteredFriends.length > itemsPerPage && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
              className="border-t"
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default DashboardPage;
