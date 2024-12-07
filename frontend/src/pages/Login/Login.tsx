import React from "react";
import { useForm } from "react-hook-form";
import { useLoginStore } from "./api/store";

interface LoginForm {
  email: string;
  password: string;
}

const Login: React.FC = () => {
  const { login } = useLoginStore();
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<LoginForm>();

  const onSubmit = async (data: LoginForm) => {
    try {
      await login(data.email, data.password);
    } catch (error) {
      setError("email", { message: "Login failed. Please try again." });
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-96 p-6 bg-white rounded shadow">
        <h2 className="text-xl font-bold text-center">Login</h2>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="my-4">
            <label>Email</label>
            <input
              type="email"
              {...register("email", { required: "Email is required" })}
              className="w-full px-4 py-2 border rounded"
            />
            {errors.email && (
              <p className="text-red-500">{errors.email.message}</p>
            )}
          </div>
          <div className="my-4">
            <label>Password</label>
            <input
              type="password"
              {...register("password", { required: "Password is required" })}
              className="w-full px-4 py-2 border rounded"
            />
            {errors.password && (
              <p className="text-red-500">{errors.password.message}</p>
            )}
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
