// src/components/Route/ProtectedRoute.jsx

/**
 * 🛡️ PROTECTED ROUTE - Route guard for authenticated users
 *
 * This component protects routes that require:
 * 1. User authentication (logged in)
 * 2. Admin privileges (optional)
 *
 * How it works:
 * 1. Checks if user is authenticated
 * 2. If not, redirects to login page
 * 3. If admin route, checks if user has admin role
 * 4. If not admin, redirects to login
 * 5. If all checks pass, renders the protected component
 *
 * 📦 Packages Used:
 * - react-router-dom v6: Navigate, Outlet
 * - react-redux: useSelector
 *
 * 🔄 Migration from v5 to v6:
 * - Redirect → Navigate
 * - Route render props → Outlet component
 * - component prop → element prop
 */

import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

// ✅ Redux Toolkit selectors
import {
  selectIsAuthenticated,
  selectUser,
  selectUserLoading,
} from "../../features/user/userSlice";

import Loader from "../layout/Loader/Loader";

/**
 * 🛡️ ProtectedRoute Component
 *
 * @param {Object} props - Component props
 * @param {boolean} props.isAdmin - If true, only admin users can access
 * @param {React.ReactNode} props.children - Child components to render
 * @param {string} props.redirectTo - Where to redirect if not authenticated (default: '/login')
 *
 * @returns {JSX.Element} Protected route or redirect
 */
const ProtectedRoute = ({
  isAdmin = false,
  children,
  redirectTo = "/login",
}) => {
  // 📊 Get authentication state from Redux
  const loading = useSelector(selectUserLoading);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const user = useSelector(selectUser);

  // ⏳ Show loader while checking authentication
  if (loading) {
    return <Loader />;
  }

  // 🚫 Not authenticated - Redirect to login
  if (!isAuthenticated) {
    return (
      <Navigate to={redirectTo} state={{ from: window.location.pathname }} />
    );
  }

  // 🔒 Admin check - If admin route and user is not admin
  if (isAdmin && user?.role !== "admin") {
    return <Navigate to={redirectTo} />;
  }

  // ✅ All checks passed - Render the protected content
  return children ? <>{children}</> : <Outlet />;
};

export default ProtectedRoute;
