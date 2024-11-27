import React, { useEffect, useState } from "react";
import Navbar from "@components/Navbar";
import API from "@utils/api";

// Типы для курсов и расписания
interface Course {
  _id: string;
  name: string;
  description: string;
  teacherId: string;
  classroom: string;
  time: string;
  weekday: string;
  group: string;
}

interface TimetableEntry {
  _id: string;
  courseId: Course;
  name: string;
  description: string;
  time: string;
  classroom: string;
  day: string;
  startTime?: string;
  endTime?: string;
  teacherName?: string;
}

const StudentDashboard: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [timetable, setTimetable] = useState<TimetableEntry[]>([]);
  const [selectedGroup, setSelectedGroup] = useState<string>("201");

  const fetchTimetable = async () => {
    try {
      const { data } = await API.get<TimetableEntry[]>("/student/timetable");
      setTimetable(data);
    } catch (error) {
      console.error("Failed to fetch timetable:", error);
    }
  };

  const fetchCoursesByGroup = async (group: string) => {
    try {
      const { data } = await API.get<Course[]>(
        `/student/courses?group=${group}`
      );
      setCourses(data);
    } catch (error) {
      console.error("Failed to fetch courses:", error);
    }
  };

  useEffect(() => {
    fetchTimetable();
    fetchCoursesByGroup(selectedGroup);
  }, [selectedGroup]);

  const registerCourse = async (courseId: string) => {
    try {
      await API.post("/student/register", { courseId });
      alert("Course registered successfully!");
      fetchTimetable();
      fetchCoursesByGroup(selectedGroup);
    } catch (error) {
      console.error("Failed to register course:", error);
    }
  };

  const dropCourse = async (courseId: string) => {
    try {
      await API.delete(`/student/drop/${courseId}`);
      alert("Course dropped successfully!");
      fetchTimetable();
    } catch (error) {
      console.error("Failed to drop course:", error);
    }
  };

  return (
    <div>
      <Navbar />
      <div className="p-4">
        <h2 className="text-2xl font-bold">Student Dashboard</h2>
        <div>
          <label>Select Group</label>
          <select
            value={selectedGroup}
            onChange={(e) => setSelectedGroup(e.target.value)}
          >
            <option value="201">201</option>
            <option value="202">202</option>
          </select>
        </div>
        <div>
          <h3>Your Timetable</h3>
          <ul>
            {timetable.map((entry) => (
              <li key={entry._id}>
                {entry.name} - {entry.time} ({entry.classroom})
                <button onClick={() => dropCourse(entry.courseId._id)}>
                  Drop
                </button>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h3>Available Courses</h3>
          <ul>
            {courses.map((course) => (
              <li key={course._id}>
                {course.name} - {course.time}
                <button onClick={() => registerCourse(course._id)}>
                  Register
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
