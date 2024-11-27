import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Login from "../pages/Login";
import Register from "../pages/Register";
import StudentDashboard from "../pages/StudentDashboard";
import TeacherDashboard from "../pages/TeacherDashboard";
import AdminDashboard from "../pages/AdminDashboard";
import { getUserFromToken } from "../utils/auth";
import "../index.css";

// Типизация пропсов для ProtectedRoute
interface ProtectedRouteProps {
  role: string;
  children: JSX.Element;
}

// Основной компонент приложения
const App: React.FC = () => {
  const user = getUserFromToken();

  // ProtectedRoute для защиты маршрутов
  const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
    role,
    children,
  }) => {
    if (!user) return <Navigate to="/login" />;
    if (user.role !== role) return <Navigate to="/" />;
    return children;
  };

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/student"
          element={
            <ProtectedRoute role="student">
              <StudentDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/teacher"
          element={
            <ProtectedRoute role="teacher">
              <TeacherDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin"
          element={
            <ProtectedRoute role="admin">
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
};

export default App;
