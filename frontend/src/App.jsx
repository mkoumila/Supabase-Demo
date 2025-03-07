import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import HomePage from './pages/HomePage';
import DashboardPage from './pages/DashboardPage';
import UsersPage from './pages/UsersPage';
import CitiesPage from './pages/CitiesPage';
import LoginPage from './pages/LoginPage';
import { useAuth } from './context/AuthContext';

function App() {
  const { user, loading, isAdmin } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        {/* Public routes - accessible whether logged in or not */}
        <Route path="/" element={<HomePage />} />
        <Route
          path="/login"
          element={user ? <Navigate to="/dashboard/students" /> : <LoginPage />}
        />

        {/* Protected routes */}
        <Route
          path="/dashboard/*"
          element={
            user ? (
              <Routes>
                <Route path="students" element={<DashboardPage />} />
                <Route path="cities" element={<CitiesPage />} />
                <Route
                  path="users"
                  element={isAdmin ? <UsersPage /> : <Navigate to="/dashboard/students" />}
                />
                <Route index element={<Navigate to="/dashboard/students" replace />} />
              </Routes>
            ) : (
              <Navigate to="/login" />
            )
          }
        />

        {/* Catch all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
