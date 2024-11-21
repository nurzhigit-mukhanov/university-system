import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import API from "../utils/api";

interface User {
  _id: string;
  name: string;
  role: string;
}

const AdminDashboard: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [newName, setNewName] = useState("");
  const [newRole, setNewRole] = useState("");

  // Fetch users from the API
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const { data } = await API.get("/admin/users");
        setUsers(data);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, []);

  // Handle edit button click
  const startEditing = (user: User) => {
    setEditingUser(user);
    setNewName(user.name);
    setNewRole(user.role);
  };

  // Handle cancel button click
  const cancelEditing = () => {
    setEditingUser(null);
    setNewName("");
    setNewRole("");
  };

  // Handle save button click
  const saveChanges = async () => {
    if (!editingUser) return;

    try {
      const updatedUser = { name: newName, role: newRole };
      await API.put(`/admin/users/${editingUser._id}`, updatedUser);

      // Update user list locally
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user._id === editingUser._id
            ? { ...user, name: newName, role: newRole }
            : user
        )
      );

      cancelEditing(); // Reset editing state
    } catch (error) {
      console.error("Error updating user:", error);
    }
  };

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
