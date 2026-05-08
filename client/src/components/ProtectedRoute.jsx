import { Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const ProtectedRoute = ({ children, allowedRoles }) => {

  // Get authentication token from local storage
  const token = localStorage.getItem("token");

  // Redirect user to login page if token is not available
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  try {

    // Decode JWT token to get user details
    const decoded = jwtDecode(token);

    // Check whether user role is allowed to access route
    if (!allowedRoles.includes(decoded.systemRole)) {

      return <Navigate to="/login" replace />;
    }

    // Render protected component if user is authorized
    return children;

  } catch (err) {

    // Clear invalid token and redirect to login page
    localStorage.clear();

    return <Navigate to="/login" replace />;
  }
};

export default ProtectedRoute;