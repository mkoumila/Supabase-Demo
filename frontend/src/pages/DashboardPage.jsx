import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { studentService } from "../services/studentService";
import { StudentForm } from "../components/StudentForm";
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
 * Protected admin dashboard that provides CRUD operations for students.
 * Features include:
 * - Authentication check
 * - Admin-only actions (add, edit, delete)
 * - Search functionality
 * - Pagination
 * - Form handling for adding/editing students
 */
function DashboardPage() {
  // State management for students and UI controls
  const [students, setStudents] = useState([]);
  const [editingStudent, setEditingStudent] = useState(null);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [showForm, setShowForm] = useState(false);
  const itemsPerPage = 5; // Number of items to display per page
  const [successMessage, setSuccessMessage] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [studentToDelete, setStudentToDelete] = useState(null);

  // Auth context and navigation
  const { user, isAdmin, loading, logout } = useAuth();
  const navigate = useNavigate();

  // Load students when user is authenticated
  useEffect(() => {
    if (user) {
      loadStudents();
    }
  }, [user]);

  // Filter students based on search query (case-insensitive)
  const filteredStudents = students.filter((student) =>
    student.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Calculate pagination values
  const totalPages = Math.ceil(filteredStudents.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentStudents = filteredStudents.slice(startIndex, endIndex);

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
   * Fetch students data from the API
   * Handles loading state and error handling
   */
  async function loadStudents() {
    try {
      const data = await studentService.getAllStudents();
      setStudents(data);
      setError(null);
    } catch (error) {
      console.error("Error loading students:", error);
      setError("Failed to load students");
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
   * Handle editing a student
   * Shows the form and scrolls to top
   * @param {Object} student - The student object to edit
   */
  function handleEdit(student) {
    setEditingStudent(student);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  /**
   * Handle form cancellation
   * Resets form state and hides the form
   */
  const handleCancel = () => {
    setEditingStudent(null);
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
   * Handle form submission for creating/updating a student
   * @param {Object} formData - The form data to submit
   */
  async function handleSubmit(formData) {
    try {
      if (editingStudent) {
        await studentService.updateStudent(editingStudent.id, formData);
        setEditingStudent(null);
        showSuccessMessage("Student updated successfully!");
      } else {
        await studentService.createStudent(formData);
        showSuccessMessage("Student created successfully!");
      }
      loadStudents();
      setError(null);
      setShowForm(false);
    } catch (error) {
      console.error("Error saving student:", error);
      setError(error.message || "Failed to save student");
    }
  }

  /**
   * Handle student deletion
   * Shows confirmation dialog before deleting
   * @param {string} id - The ID of the student to delete
   */
  const handleDeleteClick = (student) => {
    setStudentToDelete(student);
    setDeleteDialogOpen(true);
  };

  /**
   * New function to handle actual deletion
   */
  const handleConfirmDelete = async () => {
    try {
      await studentService.deleteStudent(studentToDelete.id);
      loadStudents();
      setError(null);
      showSuccessMessage("Student deleted successfully!");
    } catch (error) {
      console.error("Error deleting student:", error);
      setError(error.message || "Failed to delete student");
    } finally {
      setDeleteDialogOpen(false);
      setStudentToDelete(null);
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
                Students List
              </h1>
              <p className="mt-1 text-sm text-gray-600">
                Manage and organize your students
              </p>
            </div>
            <Button
              onClick={() => setShowForm(true)}
              variant="default"
              className="bg-blue-600 hover:bg-blue-700"
            >
              Add New Student
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

          {/* Student form for adding/editing - only visible to admin users when needed */}
          {showForm && (
            <div className="bg-white shadow rounded-lg mb-8">
              <StudentForm
                onSubmit={handleSubmit}
                initialData={editingStudent}
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
                  placeholder="Search students by name..."
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
                  {/* Show message when no students are found */}
                  {currentStudents.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={isAdmin ? 8 : 7}
                        className="text-center py-4"
                      >
                        {searchQuery
                          ? "No students found matching your search"
                          : "No students found"}
                      </TableCell>
                    </TableRow>
                  ) : (
                    // Map through students and display their data
                    currentStudents.map((student) => (
                      <TableRow key={student.id}>
                        <TableCell className="font-medium">
                          {student.name}
                        </TableCell>
                        <TableCell>{student.age}</TableCell>
                        <TableCell>{student.job}</TableCell>
                        <TableCell>{student.email}</TableCell>
                        <TableCell>{student.phone}</TableCell>
                        <TableCell>{student.address}</TableCell>
                        <TableCell>
                          {new Date(student.created_at).toLocaleDateString()}
                        </TableCell>
                        {isAdmin && (
                          <TableCell>
                            <div className="flex space-x-2">
                              <Button
                                onClick={() => handleEdit(student)}
                                variant="outline"
                                size="sm"
                                className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                              >
                                Edit
                              </Button>
                              <Button
                                onClick={() => handleDeleteClick(student)}
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
              {filteredStudents.length > itemsPerPage && (
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
              <span className="font-semibold">{studentToDelete?.name}</span>'s data
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
