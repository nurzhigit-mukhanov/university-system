import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import API from "../utils/api";

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
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(false);

  // Fetch the list of courses
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const { data } = await API.get("/teacher/courses");
        setCourses(data);
      } catch (error) {
        console.error("Error fetching courses:", error);
      }
    };

    fetchCourses();
  }, []);

  // Fetch students for the selected course
  const fetchCourseDetails = async (courseId: string) => {
    setLoading(true);
    try {
      const { data } = await API.get(`/teacher/courses/${courseId}`);
      setStudents(data.students);
      const course = courses.find((c) => c._id === courseId);
      setSelectedCourse(course || null);
    } catch (error) {
      console.error("Error fetching course details:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Navbar />
      <div className="p-4">
        <h2 className="text-2xl font-bold mb-4">Teacher Dashboard</h2>
        <div className="flex">
          {/* Course List */}
          <div className="w-1/3">
            <h3 className="text-xl font-semibold mb-2">Courses</h3>
            <ul className="bg-gray-100 rounded p-4 shadow">
              {courses.map((course) => (
                <li
                  key={course._id}
                  className="cursor-pointer p-2 border-b hover:bg-gray-200"
                  onClick={() => fetchCourseDetails(course._id)}
                >
                  <strong>{course.name}</strong> (Group: {course.group})
                </li>
              ))}
            </ul>
          </div>

          {/* Course Details */}
          <div className="w-2/3 ml-4">
            {loading ? (
              <p>Loading...</p>
            ) : selectedCourse ? (
              <div>
                <h3 className="text-xl font-semibold mb-2">
                  {selectedCourse.name} (Group: {selectedCourse.group})
                </h3>
                <h4 className="text-lg font-semibold mb-1">
                  Registered Students:
                </h4>
                {students.length > 0 ? (
                  <ul className="bg-gray-100 rounded p-4 shadow">
                    {students.map((student) => (
                      <li key={student._id} className="p-2 border-b">
                        {student.name} ({student.email})
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p>No students registered for this course.</p>
                )}
              </div>
            ) : (
              <p>Select a course to see details.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherDashboard;
