import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Button } from "@/components/ui/button";

export default function HomePage() {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      {/* Navigation */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex-shrink-0">
              <h1 className="text-xl font-bold text-gray-900">
                Friends Manager
              </h1>
            </div>
            <div className="flex items-center gap-4">
              {user ? (
                <>
                  <span className="text-gray-600">Welcome, {user.email}</span>
                  <Button
                    variant="default"
                    className="bg-blue-600 hover:bg-blue-700"
                    onClick={() => navigate("/dashboard")}
                  >
                    Dashboard
                  </Button>
                </>
              ) : (
                <Button
                  variant="default"
                  className="bg-blue-600 hover:bg-blue-700"
                  onClick={() => navigate("/login")}
                >
                  Sign in
                </Button>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center py-20">
          <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
            <span className="block">Manage Your Friends List</span>
            <span className="block text-blue-600">With Ease</span>
          </h1>
          <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
            A simple and intuitive way to keep track of your friends. Add, edit,
            and organize your contacts in one place.
          </p>
          <div className="mt-5 max-w-md mx-auto sm:flex sm:justify-center md:mt-8">
            <div className="rounded-md shadow">
              {user ? (
                <Button
                  size="lg"
                  variant="default"
                  className="bg-blue-600 hover:bg-blue-700 w-full sm:w-auto"
                  onClick={() => navigate("/dashboard")}
                >
                  Go to Dashboard
                </Button>
              ) : (
                <Button
                  size="lg"
                  variant="default"
                  className="bg-blue-600 hover:bg-blue-700 w-full sm:w-auto"
                  onClick={() => navigate("/login")}
                >
                  Get Started
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="py-12">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {/* Feature 1 */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-medium text-gray-900">
                Easy Management
              </h3>
              <p className="mt-2 text-gray-500">
                Add and manage your friends list with a simple and intuitive
                interface.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-medium text-gray-900">
                Secure Access
              </h3>
              <p className="mt-2 text-gray-500">
                Your data is protected with secure authentication and role-based
                access control.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-medium text-gray-900">
                Admin Controls
              </h3>
              <p className="mt-2 text-gray-500">
                Administrators can manage users and their permissions
                efficiently.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
