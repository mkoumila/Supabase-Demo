import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { cityService } from "../services/cityService";
import { CityForm } from "../components/CityForm";
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
 * CitiesPage Component
 *
 * Protected page that provides CRUD operations for cities.
 * Features include:
 * - Authentication check
 * - Admin-only actions (add, edit, delete)
 * - Search functionality
 * - Pagination
 * - Form handling for adding/editing cities
 */
function CitiesPage() {
  // State management for cities and UI controls
  const [cities, setCities] = useState([]);
  const [editingCity, setEditingCity] = useState(null);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [showForm, setShowForm] = useState(false);
  const itemsPerPage = 5;
  const [successMessage, setSuccessMessage] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [cityToDelete, setCityToDelete] = useState(null);

  // Auth context and navigation
  const { user, isAdmin, loading, logout } = useAuth();
  const navigate = useNavigate();

  // Load cities when user is authenticated
  useEffect(() => {
    if (user) {
      loadCities();
    }
  }, [user]);

  // Filter cities based on search query (case-insensitive)
  const filteredCities = cities.filter((city) =>
    city.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Calculate pagination values
  const totalPages = Math.ceil(filteredCities.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentCities = filteredCities.slice(startIndex, endIndex);

  // Reset to first page when search query changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  async function loadCities() {
    try {
      const data = await cityService.getAllCities();
      setCities(data);
      setError(null);
    } catch (error) {
      console.error("Error loading cities:", error);
      setError("Failed to load cities");
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

  function handleEdit(city) {
    setEditingCity(city);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  const handleCancel = () => {
    setEditingCity(null);
    setShowForm(false);
  };

  const showSuccessMessage = (message) => {
    setSuccessMessage(message);
    setTimeout(() => setSuccessMessage(null), 3000);
  };

  async function handleSubmit(formData) {
    try {
      if (editingCity) {
        await cityService.updateCity(editingCity.id, formData);
        setEditingCity(null);
        showSuccessMessage("City updated successfully!");
      } else {
        await cityService.createCity(formData);
        showSuccessMessage("City created successfully!");
      }
      loadCities();
      setError(null);
      setShowForm(false);
    } catch (error) {
      console.error("Error saving city:", error);
      setError(error.message || "Failed to save city");
    }
  }

  const handleDeleteClick = (city) => {
    setCityToDelete(city);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    try {
      await cityService.deleteCity(cityToDelete.id);
      loadCities();
      setError(null);
      showSuccessMessage("City deleted successfully!");
    } catch (error) {
      console.error("Error deleting city:", error);
      setError(error.message || "Failed to delete city");
    } finally {
      setDeleteDialogOpen(false);
      setCityToDelete(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

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
                Cities List
              </h1>
              <p className="mt-1 text-sm text-gray-600">
                Manage and organize your cities
              </p>
            </div>
            {isAdmin && (
              <Button
                onClick={() => setShowForm(true)}
                variant="default"
                className="bg-blue-600 hover:bg-blue-700"
              >
                Add New City
              </Button>
            )}
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

          {/* City form for adding/editing - only visible to admin users when needed */}
          {showForm && isAdmin && (
            <div className="bg-white shadow rounded-lg mb-8">
              <CityForm
                onSubmit={handleSubmit}
                initialData={editingCity}
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
                  placeholder="Search cities by name..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="max-w-sm"
                />
              </div>
            </div>

            {/* Table section */}
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    {/* <TableHead>Weight</TableHead> */}
                    <TableHead>Created At</TableHead>
                    <TableHead>Updated At</TableHead>
                    {isAdmin && <TableHead>Actions</TableHead>}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {currentCities.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={isAdmin ? 5 : 4}
                        className="text-center py-4"
                      >
                        {searchQuery
                          ? "No cities found matching your search"
                          : "No cities found"}
                      </TableCell>
                    </TableRow>
                  ) : (
                    currentCities.map((city) => (
                      <TableRow key={city.id}>
                        <TableCell className="font-medium">
                          {city.name}
                        </TableCell>
                        {/* <TableCell>{city.weight}</TableCell> */}
                        <TableCell>
                          {new Date(city.created_at).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          {city.updated_at
                            ? new Date(city.updated_at).toLocaleDateString()
                            : "-"}
                        </TableCell>
                        {isAdmin && (
                          <TableCell>
                            <div className="flex space-x-2">
                              <Button
                                onClick={() => handleEdit(city)}
                                variant="outline"
                                size="sm"
                                className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                              >
                                Edit
                              </Button>
                              <Button
                                onClick={() => handleDeleteClick(city)}
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

              {filteredCities.length > itemsPerPage && (
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

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete{" "}
              <span className="font-semibold">{cityToDelete?.name}</span> from the
              database.
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

export default CitiesPage; 