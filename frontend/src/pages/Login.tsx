import React, { useState } from "react";
import API from "../utils/api";

const Login = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { data } = await API.post("/auth/login", form);

      // Store the token in localStorage
      localStorage.setItem("token", data.token);

      // Redirect based on role
      if (data.role === "admin") {
        window.location.href = "/admin";
      } else if (data.role === "teacher") {
        window.location.href = "/teacher";
      } else if (data.role === "student") {
        window.location.href = "/student";
      } else {
        window.location.href = "/"; // Default fallback
      }
    } catch (err: any) {
      console.error("Error:", err);
      setError(err.response?.data?.message || "An unknown error occurred");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-96 p-6 bg-white rounded shadow">
        <h2 className="text-xl font-bold text-center">Login</h2>
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <form onSubmit={handleSubmit}>
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
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
