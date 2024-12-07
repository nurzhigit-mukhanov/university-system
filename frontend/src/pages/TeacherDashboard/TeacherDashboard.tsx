import React, { useEffect } from "react";
import Navbar from "../../components/Navbar";
import { useTeacherStore } from "./api/store";

const TeacherDashboard: React.FC = () => {
  const {
    courses,
    students,
    loadCourses,
    loadStudents,
    selectedCourse,
    loading,
  } = useTeacherStore();

  useEffect(() => {
    loadCourses();
  }, []);

  return (
    <div>
      <Navbar />
      <div className="p-4">
        <h2 className="text-2xl font-bold mb-4">Teacher Dashboard</h2>
        <div className="flex">
          {/* Список курсов */}
          <div className="w-1/3">
            <h3 className="text-xl font-semibold mb-2">Courses</h3>
            <ul className="bg-gray-100 rounded p-4 shadow">
              {courses.map((course) => (
                <li
                  key={course._id}
                  className="cursor-pointer p-2 border-b hover:bg-gray-200"
                  onClick={() => loadStudents(course._id)}
                >
                  <strong>{course.name}</strong> (Group: {course.group})
                </li>
              ))}
            </ul>
          </div>

          {/* Детали курса */}
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
