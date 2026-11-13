import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  selectIsAuthenticated,
  selectUser,
  selectUserLoading,
} from "../../features/user/userSlice";
import Loader from "../layout/Loader/Loader";

/**
 * @param {Object} props - Component props
 * @param {boolean} props.isAdmin - If true, only admin users can access
 * @param {React.ReactNode} props.children - Child components to render
 * @param {string} props.redirectTo - Where to redirect if not authenticated (default: '/login')
 * @returns {JSX.Element} Protected route or redirect
 */
const ProtectedRoute = ({
  isAdmin = false,
  children,
  redirectTo = "/login",
}) => {
  const location = useLocation();
  const loading = useSelector(selectUserLoading);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const user = useSelector(selectUser);
  if (loading) {
    return <Loader />;
  }
  if (!isAuthenticated) {
    return <Navigate to={redirectTo} state={{ from: location.pathname }} />;
  }
  if (isAdmin && user?.role !== "admin") {
    return <Navigate to={redirectTo} />;
  }
  return children ? <>{children}</> : <Outlet />;
};

export default ProtectedRoute;
