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

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const { data } = await API.get("/admin/users");
        setUsers(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchUsers();
  }, []);

  return (
    <div>
      <Navbar />
      <div className="p-4">
        <h2 className="text-2xl font-bold">Admin Dashboard</h2>
        <ul>
          {users.map((user) => (
            <li key={user._id} className="my-2">
              {user.name} - {user.role}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default AdminDashboard;
