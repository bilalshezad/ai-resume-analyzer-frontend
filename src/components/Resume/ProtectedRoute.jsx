import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("Token");

  if (!token) {
    return <Navigate to="/user/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
