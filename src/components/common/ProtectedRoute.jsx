import { Navigate, useLocation } from "react-router-dom";

import LoadingSpinner from "./LoadingSpinner";
import useAuth from "../../hooks/useAuth";

const ProtectedRoute = ({ children, roles = [] }) => {
  const { authReady, isAuthenticated, user } = useAuth();
  const location = useLocation();

  if (!authReady) {
    return <LoadingSpinner label="Checking your session..." />;
  }

  if (!isAuthenticated) {
    return (
      <Navigate
        to={`/auth?redirect=${encodeURIComponent(location.pathname + location.search)}`}
        replace
      />
    );
  }

  if (roles.length > 0 && !roles.includes(user?.role)) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export default ProtectedRoute;
