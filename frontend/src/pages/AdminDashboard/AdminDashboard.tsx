import React, { useEffect } from "react";
import Navbar from "../../components/Navbar";
import { useAdminStore } from "./api/store";
import { useForm } from "react-hook-form";

interface FormData {
  name: string;
  role: string;
}
const AdminDashboard: React.FC = () => {
  const {
    users,
    editingUser,
    fetchUsers,
    startEditing,
    cancelEditing,
    saveChanges,
  } = useAdminStore();

  const { register, handleSubmit, reset } = useForm<FormData>();

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  useEffect(() => {
    if (editingUser) {
      reset({ name: editingUser.name, role: editingUser.role });
    }
  }, [editingUser, reset]);

  const onSubmit = async (data: FormData) => {
    await saveChanges(data.name, data.role);
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
                <form onSubmit={handleSubmit(onSubmit)} className="flex gap-2">
                  <input
                    type="text"
                    {...register("name")}
                    className="border rounded px-2 py-1"
                    placeholder="Enter name"
                  />
                  <select
                    {...register("role")}
                    className="border rounded px-2 py-1"
                  >
                    <option value="student">Student</option>
                    <option value="teacher">Teacher</option>
                    <option value="admin">Admin</option>
                  </select>
                  <button
                    type="submit"
                    className="bg-blue-500 text-white px-2 py-1 rounded"
                  >
                    Save
                  </button>
                  <button
                    type="button"
                    onClick={cancelEditing}
                    className="bg-gray-500 text-white px-2 py-1 rounded"
                  >
                    Cancel
                  </button>
                </form>
              ) : (
                <>
                  <span>
                    {user.name} - {user.role}
                  </span>
                  <button
                    onClick={() => startEditing(user)}
                    className="bg-yellow-500 text-white px-2 py-1 rounded"
                  >
                    Edit
                  </button>
                </>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default AdminDashboard;
