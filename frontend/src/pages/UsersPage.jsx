import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Sidebar } from "../components/ui/Sidebar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { api } from "../services/api";
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

/**
 * UsersPage Component
 *
 * Admin-only page for managing user accounts.
 * Features include:
 * - Creating new users
 * - Setting admin privileges
 * - Protected route (admin only)
 */
export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingUser, setEditingUser] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState(null);
  const [newUser, setNewUser] = useState({
    email: "",
    password: "",
    isAdmin: false,
  });
  const { user, isAdmin, loading: authLoading, logout } = useAuth();
  const navigate = useNavigate();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);

  // Add showSuccessMessage function
  const showSuccessMessage = (message) => {
    setSuccessMessage(message);
    setTimeout(() => setSuccessMessage(null), 3000); // Hide after 3 seconds
  };

  // Handle navigation for non-admin users
  useEffect(() => {
    if (!authLoading && (!user || !isAdmin)) {
      navigate("/dashboard");
    }
  }, [user, isAdmin, authLoading, navigate]);

  useEffect(() => {
    // Redirect if not admin
    if (!user || !isAdmin) {
      return;
    }
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const response = await api.users.getAll();
      setUsers(response);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    try {
      await api.users.create(newUser);
      setShowCreateModal(false);
      setNewUser({ email: "", password: "", isAdmin: false });
      loadUsers();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleEdit = (user) => {
    setEditingUser(user);
  };

  const handleUpdate = async (userId, userData) => {
    try {
      setError(null);
      await api.users.update(userId, { role: userData.role });
      setUsers(
        users.map((user) =>
          user.id === userId ? { ...user, role: userData.role } : user
        )
      );
      setEditingUser(null);

      const currentUser = JSON.parse(localStorage.getItem("user"));
      if (currentUser && currentUser.id === userId) {
        localStorage.setItem(
          "user",
          JSON.stringify({
            ...currentUser,
            role: userData.role,
          })
        );
        window.location.reload();
      }
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDeleteClick = (user) => {
    setUserToDelete(user);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    try {
      await api.users.delete(userToDelete.id);
      loadUsers();
      showSuccessMessage("User deleted successfully!");
    } catch (err) {
      setError(err.message);
    } finally {
      setDeleteDialogOpen(false);
      setUserToDelete(null);
    }
  };

  // Show loading spinner while authentication is being checked
  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // Redirect non-admin users
  if (!user || !isAdmin) {
    return null;
  }

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <Sidebar user={user} isAdmin={isAdmin} onLogout={logout} />

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <div className="p-8">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">
                Users Management
              </h1>
              <p className="mt-1 text-sm text-gray-600">
                Manage user accounts and their roles
              </p>
            </div>
            <Button
              onClick={() => setShowCreateModal(true)}
              variant="default"
              className="bg-blue-600 hover:bg-blue-700"
            >
              Add New User
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

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Email</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Created At</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>
                        {editingUser?.id === user.id ? (
                          <select
                            value={editingUser.role}
                            onChange={(e) =>
                              setEditingUser({
                                ...editingUser,
                                role: e.target.value,
                              })
                            }
                            className="border rounded px-2 py-1"
                          >
                            <option value="user">User</option>
                            <option value="admin">Admin</option>
                          </select>
                        ) : (
                          <span
                            className={
                              user.role === "admin"
                                ? "text-blue-600 font-semibold"
                                : ""
                            }
                          >
                            {user.role}
                          </span>
                        )}
                      </TableCell>
                      <TableCell>
                        {new Date(user.created_at).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="text-right">
                        {editingUser?.id === user.id ? (
                          <div className="space-x-2">
                            <Button
                              variant="default"
                              size="sm"
                              onClick={() => handleUpdate(user.id, editingUser)}
                            >
                              Save
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setEditingUser(null)}
                            >
                              Cancel
                            </Button>
                          </div>
                        ) : (
                          <div className="space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleEdit(user)}
                            >
                              Edit
                            </Button>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => handleDeleteClick(user)}
                            >
                              Delete
                            </Button>
                          </div>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </div>
      </div>

      {/* Create User Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h2 className="text-xl font-bold mb-4">Create New User</h2>
            <form onSubmit={handleCreateUser} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  required
                  placeholder="Enter email address"
                  value={newUser.email}
                  onChange={(e) =>
                    setNewUser({ ...newUser, email: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  required
                  placeholder="Enter password"
                  value={newUser.password}
                  onChange={(e) =>
                    setNewUser({ ...newUser, password: e.target.value })
                  }
                />
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="isAdmin"
                  checked={newUser.isAdmin}
                  onCheckedChange={(checked) =>
                    setNewUser({ ...newUser, isAdmin: checked })
                  }
                />
                <Label htmlFor="isAdmin" className="cursor-pointer">
                  Admin User
                </Label>
              </div>
              <div className="flex justify-end space-x-3 mt-6">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowCreateModal(false)}
                >
                  Cancel
                </Button>
                <Button type="submit">Create</Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add AlertDialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete{" "}
              <span className="font-semibold">{userToDelete?.email}</span>'s
              account and all associated data.
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
