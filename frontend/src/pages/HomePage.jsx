import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { friendService } from "../services/friendService";
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

function HomePage() {
  const [friends, setFriends] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const itemsPerPage = 5;

  useEffect(() => {
    loadFriends();
  }, []);

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
      setLoading(true);
      const data = await friendService.getAllFriends();
      setFriends(data);
      setError(null);
    } catch (error) {
      console.error("Error loading friends:", error);
      setError("Failed to load friends");
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Friends List</h1>
        <Link
          to="/dashboard"
          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
        >
          Go to Dashboard
        </Link>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
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
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentFriends.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-4">
                    {searchQuery ? "No friends found matching your search" : "No friends found"}
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

export default HomePage; 