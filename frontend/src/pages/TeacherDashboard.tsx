import React, { useEffect, useState } from "react";
import Navbar from "@components/Navbar";
import API from "@utils/api";

// Типы для курсов и студентов
interface Course {
  _id: string;
  name: string;
  group: string;
}

interface Student {
  _id: string;
  name: string;
  email: string;
}

const TeacherDashboard: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const { data } = await API.get<Course[]>("/teacher/courses");
        setCourses(data);
      } catch (error) {
        console.error("Error fetching courses:", error);
      }
    };

    fetchCourses();
  }, []);

  const fetchStudents = async (courseId: string) => {
    try {
      const { data } = await API.get<Student[]>(`/teacher/courses/${courseId}`);
      setStudents(data);
      setSelectedCourse(
        courses.find((course) => course._id === courseId) || null
      );
    } catch (error) {
      console.error("Error fetching students:", error);
    }
  };

  return (
    <div>
      <Navbar />
      <div className="p-4">
        <h2 className="text-2xl font-bold">Teacher Dashboard</h2>
        <div>
          <h3>Courses</h3>
          <ul>
            {courses.map((course) => (
              <li key={course._id} onClick={() => fetchStudents(course._id)}>
                {course.name} (Group: {course.group})
              </li>
            ))}
          </ul>
        </div>
        {selectedCourse && (
          <div>
            <h3>
              {selectedCourse.name} (Group: {selectedCourse.group})
            </h3>
            <ul>
              {students.map((student) => (
                <li key={student._id}>
                  {student.name} ({student.email})
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default TeacherDashboard;
