import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import API from "../utils/api";

interface Course {
  _id: string;
  name: string;
}

const TeacherDashboard: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const { data } = await API.get("/teacher/courses");
        setCourses(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchCourses();
  }, []);

  return (
    <div>
      <Navbar />
      <div className="p-4">
        <h2 className="text-2xl font-bold">Teacher Dashboard</h2>
        <ul>
          {courses.map((course) => (
            <li key={course._id} className="my-2">
              {course.name}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default TeacherDashboard;
