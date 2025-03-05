import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { friendService } from "../services/friendService";
import { FriendForm } from "../components/FriendForm";
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import Pagination from "../components/ui/pagination";
import { Sidebar } from "../components/ui/Sidebar";
import { Button } from "../components/ui/button";
import LoginPage from "./LoginPage";

/**
 * DashboardPage Component
 *
 * Protected admin dashboard that provides CRUD operations for friends.
 * Features include:
 * - Authentication check
 * - Admin-only actions (add, edit, delete)
 * - Search functionality
 * - Pagination
 * - Form handling for adding/editing friends
 */
function DashboardPage() {
  // State management for friends and UI controls
  const [friends, setFriends] = useState([]);
  const [editingFriend, setEditingFriend] = useState(null);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [showForm, setShowForm] = useState(false);
  const itemsPerPage = 5; // Number of items to display per page
  const [successMessage, setSuccessMessage] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [friendToDelete, setFriendToDelete] = useState(null);

  // Auth context and navigation
  const { user, isAdmin, loading, logout } = useAuth();
  const navigate = useNavigate();

  // Load friends when user is authenticated
  useEffect(() => {
    if (user) {
      loadFriends();
    }
  }, [user]);

  // Filter friends based on search query (case-insensitive)
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

  /**
   * Handle page change in pagination
   * @param {number} page - The page number to navigate to
   */
  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  /**
   * Fetch friends data from the API
   * Handles loading state and error handling
   */
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

  /**
   * Handle user logout
   * Redirects to home page after successful logout
   */
  async function handleLogout() {
    try {
      await logout();
      navigate("/");
    } catch (error) {
      console.error("Error logging out:", error);
      navigate("/");
    }
  }

  /**
   * Handle editing a friend
   * Shows the form and scrolls to top
   * @param {Object} friend - The friend object to edit
   */
  function handleEdit(friend) {
    setEditingFriend(friend);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  /**
   * Handle form cancellation
   * Resets form state and hides the form
   */
  const handleCancel = () => {
    setEditingFriend(null);
    setShowForm(false);
  };

  /**
   * Add function to show temporary success message
   * @param {string} message - The message to show
   */
  const showSuccessMessage = (message) => {
    setSuccessMessage(message);
    setTimeout(() => setSuccessMessage(null), 3000); // Hide after 3 seconds
  };

  /**
   * Handle form submission for creating/updating a friend
   * @param {Object} formData - The form data to submit
   */
  async function handleSubmit(formData) {
    try {
      if (editingFriend) {
        await friendService.updateFriend(editingFriend.id, formData);
        setEditingFriend(null);
        showSuccessMessage("Friend updated successfully!");
      } else {
        await friendService.createFriend(formData);
        showSuccessMessage("Friend created successfully!");
      }
      loadFriends();
      setError(null);
      setShowForm(false);
    } catch (error) {
      console.error("Error saving friend:", error);
      setError(error.message || "Failed to save friend");
    }
  }

  /**
   * Handle friend deletion
   * Shows confirmation dialog before deleting
   * @param {string} id - The ID of the friend to delete
   */
  const handleDeleteClick = (friend) => {
    setFriendToDelete(friend);
    setDeleteDialogOpen(true);
  };

  /**
   * New function to handle actual deletion
   */
  const handleConfirmDelete = async () => {
    try {
      await friendService.deleteFriend(friendToDelete.id);
      loadFriends();
      setError(null);
      showSuccessMessage("Friend deleted successfully!");
    } catch (error) {
      console.error("Error deleting friend:", error);
      setError(error.message || "Failed to delete friend");
    } finally {
      setDeleteDialogOpen(false);
      setFriendToDelete(null);
    }
  };

  // Show loading spinner while authentication is being checked
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // Show login page if user is not authenticated
  if (!user) {
    return <LoginPage />;
  }

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <Sidebar user={user} isAdmin={isAdmin} onLogout={handleLogout} />

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <div className="p-8">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">
                Friends List
              </h1>
              <p className="mt-1 text-sm text-gray-600">
                Manage and organize your friends
              </p>
            </div>
            <Button
              onClick={() => setShowForm(true)}
              variant="default"
              className="bg-blue-600 hover:bg-blue-700"
            >
              Add New Friend
            </Button>
          </div>

          {successMessage && (
            <div className="mb-4 p-4 text-sm text-green-800 bg-green-100 rounded-lg">
              {successMessage}
            </div>
          )}

          {error && (
            <div className="mb-4 p-4 text-sm text-red-800 bg-red-100 rounded-lg">
              {error}
            </div>
          )}

          {/* Friend form for adding/editing - only visible to admin users when needed */}
          {showForm && (
            <div className="bg-white shadow rounded-lg mb-8">
              <FriendForm
                onSubmit={handleSubmit}
                initialData={editingFriend}
                onCancel={handleCancel}
              />
            </div>
          )}

          {/* Main content section with search and table */}
          <div className="bg-white shadow rounded-lg overflow-hidden">
            {/* Search input section */}
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

            {/* Table section with horizontal scroll */}
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
                  {/* Show message when no friends are found */}
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
                    // Map through friends and display their data
                    currentFriends.map((friend) => (
                      <TableRow key={friend.id}>
                        <TableCell className="font-medium">
                          {friend.name}
                        </TableCell>
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
                              <Button
                                onClick={() => handleEdit(friend)}
                                variant="outline"
                                size="sm"
                                className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                              >
                                Edit
                              </Button>
                              <Button
                                onClick={() => handleDeleteClick(friend)}
                                variant="destructive"
                                size="sm"
                              >
                                Delete
                              </Button>
                            </div>
                          </TableCell>
                        )}
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>

              {/* Pagination component - only shown if there are more items than itemsPerPage */}
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
      </div>

      {/* Add AlertDialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete{" "}
              <span className="font-semibold">{friendToDelete?.name}</span>'s data
              from the database.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

export default DashboardPage;
