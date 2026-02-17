import { Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const ProtectedRoute = ({ children, allowedRoles }) => {
  const token = localStorage.getItem("token");

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  try {
    const decoded = jwtDecode(token);

    if (!allowedRoles.includes(decoded.systemRole)) {
      return <Navigate to="/login" replace />;
    }

    return children;
  } catch (err) {
    localStorage.clear();
    return <Navigate to="/login" replace />;
  }
};

export default ProtectedRoute;
