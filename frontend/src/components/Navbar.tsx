import React from "react";
import { useNavigate } from "react-router-dom";
import { logout, getUserFromToken, User } from "@utils/auth";

const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const user: User | null = getUserFromToken();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="bg-blue-500 p-4 text-white flex justify-between items-center">
      <h1 className="text-lg font-bold">University System</h1>
      <div>
        {user && (
          <>
            <span className="mr-4">Logged in as {user.role}</span>
            <button
              onClick={handleLogout}
              className="bg-red-500 px-3 py-1 rounded"
            >
              Logout
            </button>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
