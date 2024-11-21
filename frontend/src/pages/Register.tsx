import React, { useState } from "react";
import API from "../utils/api";

const Register = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "student",
  });
  const [error, setError] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await API.post("/auth/register", form);
      window.location.href = "/login";
    } catch (err: any) {
      setError(err.response.data.message);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-96 p-6 bg-white rounded shadow">
        <h2 className="text-xl font-bold text-center">Register</h2>
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="my-4">
            <label className="block text-sm font-medium">Name</label>
            <input
              type="text"
              name="name"
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded"
            />
          </div>
          <div className="my-4">
            <label className="block text-sm font-medium">Email</label>
            <input
              type="email"
              name="email"
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded"
            />
          </div>
          <div className="my-4">
            <label className="block text-sm font-medium">Password</label>
            <input
              type="password"
              name="password"
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded"
            />
          </div>
          <div className="my-4">
            <label className="block text-sm font-medium">Role</label>
            <select
              name="role"
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded"
            >
              <option value="student">Student</option>
              <option value="teacher">Teacher</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded"
          >
            Register
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register;
