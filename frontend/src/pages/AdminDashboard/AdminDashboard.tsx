import React, { useEffect } from "react";
import Navbar from "../../components/Navbar";
import { useAdminStore } from "./api/store";

const AdminDashboard: React.FC = () => {
  const {
    users,
    editingUser,
    newName,
    newRole,
    setNewName,
    setNewRole,
    fetchUsers,
    startEditing,
    cancelEditing,
    saveChanges,
  } = useAdminStore();

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  return (
    <div>
      <Navbar />
      <div className="p-4">
        <h2 className="text-2xl font-bold">Admin Dashboard</h2>
        <ul className="bg-gray-100 rounded shadow p-4">
          {users.map((user) => (
            <li
              key={user._id}
              className="flex justify-between items-center py-2 border-b"
            >
              {editingUser && editingUser._id === user._id ? (
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    className="border rounded px-2 py-1"
                    placeholder="Enter name"
                  />
                  <select
                    value={newRole}
                    onChange={(e) => setNewRole(e.target.value)}
                    className="border rounded px-2 py-1"
                  >
                    <option value="student">Student</option>
                    <option value="teacher">Teacher</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
              ) : (
                <span>
                  {user.name} - {user.role}
                </span>
              )}
              {editingUser && editingUser._id === user._id ? (
                <div className="flex gap-2">
                  <button
                    onClick={saveChanges}
                    className="bg-blue-500 text-white px-2 py-1 rounded"
                  >
                    Save
                  </button>
                  <button
                    onClick={cancelEditing}
                    className="bg-gray-500 text-white px-2 py-1 rounded"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => startEditing(user)}
                  className="bg-yellow-500 text-white px-2 py-1 rounded"
                >
                  Edit
                </button>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default AdminDashboard;
