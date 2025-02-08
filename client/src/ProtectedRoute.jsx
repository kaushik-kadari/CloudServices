import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = () => {
  const login = localStorage.getItem("login");

  return login ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
