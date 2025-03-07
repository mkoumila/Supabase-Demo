import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  HomeIcon,
  UsersIcon,
  UserGroupIcon,
  BuildingOffice2Icon,
} from "@heroicons/react/24/outline";

/**
 * Sidebar Component
 *
 * Navigation sidebar with links and user information
 * @param {Object} props - Component props
 * @param {Object} props.user - Current user object
 * @param {boolean} props.isAdmin - Whether the current user is an admin
 * @param {Function} props.onLogout - Logout handler function
 */
export function Sidebar({ user, isAdmin, onLogout }) {
  const location = useLocation();

  const navigation = [
    { name: "Home", href: "/", icon: HomeIcon },
    { name: "Students List", href: "/dashboard/students", icon: UsersIcon },
    { name: "Cities", href: "/dashboard/cities", icon: BuildingOffice2Icon },
    ...(isAdmin
      ? [{ name: "Users", href: "/dashboard/users", icon: UserGroupIcon }]
      : []),
  ];

  return (
    <div className="hidden md:flex md:w-64 md:flex-col">
      <div className="flex flex-col flex-grow pt-5 bg-white overflow-y-auto">
        <div className="flex items-center flex-shrink-0 px-4">
          <h1 className="text-xl font-semibold text-gray-900">
            Students Manager
          </h1>
        </div>
        <div className="mt-5 flex-grow flex flex-col">
          <nav className="flex-1 px-2 pb-4 space-y-1">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={cn(
                  location.pathname === item.href
                    ? "bg-gray-100 text-gray-900"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900",
                  "group flex items-center px-2 py-2 text-sm font-medium rounded-md"
                )}
              >
                <item.icon
                  className={cn(
                    location.pathname === item.href
                      ? "text-gray-500"
                      : "text-gray-400 group-hover:text-gray-500",
                    "mr-3 flex-shrink-0 h-6 w-6"
                  )}
                  aria-hidden="true"
                />
                {item.name}
              </Link>
            ))}
          </nav>
        </div>
        <div className="flex-shrink-0 flex flex-col gap-2 border-t border-gray-200 p-4">
          <div className="flex-1">
            <div className="flex flex-col">
              <p className="text-sm font-medium text-gray-700">{user.email}</p>
              <p className="text-xs font-medium text-gray-500">
                {isAdmin ? "Admin" : "User"}
              </p>
            </div>
          </div>

          <Button
            onClick={onLogout}
            variant="destructive"
            className="w-full justify-start"
          >
            Logout
          </Button>
        </div>
      </div>
    </div>
  );
}
