import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import API from "../utils/api";

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
  startTime?: string; // Optional fields if derived on the frontend
  endTime?: string;
  teacherName?: string; // Add the teacherName property
}

const StudentDashboard: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [timetable, setTimetable] = useState<TimetableEntry[]>([]);
  const [selectedGroup, setSelectedGroup] = useState<string>("201");

  const weekdays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
  const timeSlots = [
    { label: "13:20-14:10", start: "13:20", end: "14:10" },
    { label: "14:20-15:10", start: "14:20", end: "15:10" },
    { label: "15:30-16:20", start: "15:30", end: "16:20" },
    { label: "16:30-17:20", start: "16:30", end: "17:20" },
    { label: "17:30-18:20", start: "17:30", end: "18:20" },
  ];

  const fetchTimetable = async () => {
    try {
      const { data } = await API.get<TimetableEntry[]>("/student/timetable");
      setTimetable(
        data.map((entry) => ({
          ...entry,
          startTime: entry.startTime || "00:00", // Ensure a default fallback
          endTime: entry.endTime || "23:59", // Ensure a default fallback
          classroom: entry.courseId.classroom || "N/A", // Default to "N/A" if classroom is undefined
          teacherName: entry.courseId.teacherId || "Unknown", // Set teacher name
          description: entry.courseId.description || "", // Set description
        }))
      );
      console.log("Fetched Timetable:", data); // Log the fetched timetable data
    } catch (error) {
      console.error("Failed to fetch timetable:", error);
    }
  };

  const fetchCoursesByGroup = async (group: string) => {
    try {
      const { data } = await API.get(`/student/courses?group=${group}`);
      setCourses(data);
    } catch (error) {
      console.error("Failed to fetch courses:", error);
    }
  };

  useEffect(() => {
    fetchTimetable();
    fetchCoursesByGroup(selectedGroup);
  }, [selectedGroup]);

  const handleGroupChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedGroup(e.target.value);
  };

  const registerCourse = async (courseId: string) => {
    try {
      const selectedCourse = courses.find((course) => course._id === courseId);

      if (!selectedCourse) {
        alert("Course not found");
        return;
      }

      // Assuming selectedCourse.time is in the format "HH:MM-HH:MM"
      const [startTime, endTime] = selectedCourse.time.split("-");
      const timetableEntry = {
        day: selectedCourse.weekday,
        startTime: startTime,
        endTime: endTime,
        classroom: selectedCourse.classroom,
        name: selectedCourse.name,
        description: selectedCourse.description,
        teacherName: selectedCourse.teacherId,
      };

      await API.post("/student/register", {
        courseId,
        timetable: [timetableEntry], // Send the timetable as an object
      });

      alert("Course registered successfully!");
      setCourses((prevCourses) =>
        prevCourses.filter((course) => course._id !== courseId)
      );
      fetchTimetable();
    } catch (error) {
      console.error("Failed to register course:", error);
    }
  };

  const dropCourse = async (courseId: string) => {
    try {
      console.log("Dropping course with ID:", courseId); // Debug log
      const response = await API.delete(`/student/drop/${courseId}`);

      if (response.status === 200) {
        alert("Course dropped successfully");
        fetchTimetable(); // Refresh the timetable
        fetchCoursesByGroup(selectedGroup); // Refresh the courses
      } else {
        alert(`Failed to drop course: ${response.statusText}`);
      }
    } catch (error) {
      console.error("Failed to drop course:", error);
      alert("Failed to drop course. Check console for details.");
    }
  };

  const renderTableCell = (
    day: string,
    timeSlot: { label: string; start: string; end: string }
  ) => {
    const matchingCourses = timetable.filter((entry) => {
      const courseStartTime = entry.startTime || "00:00";
      const courseEndTime = entry.endTime || "23:59";

      const isDayMatch = entry.day === day;
      const isTimeOverlap =
        courseStartTime <= timeSlot.end && courseEndTime >= timeSlot.start;

      return isDayMatch && isTimeOverlap;
    });

    if (matchingCourses.length > 0) {
      return (
        <div className="p-2 bg-blue-200 text-center rounded">
          {matchingCourses.map((course, index) => (
            <div key={index} className="relative">
              <strong>{course.name}:</strong>
              {course.description}
              <br />
              <span>Teacher: {"Unknown"}</span>
              <br />
              <span>Classroom: {course.classroom}</span>
              {/* Cross button */}
              <button
                onClick={() => dropCourse(course.courseId._id)}
                className="absolute top-1 right-1 text-red-600 font-bold"
                title="Drop Course"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      );
    }

    return <div className="p-2 bg-gray-50 text-center">-</div>;
  };

  return (
    <div>
      <Navbar />
      <div className="p-4">
        <h2 className="text-2xl font-bold">Student Dashboard</h2>
        <div className="mt-6">
          <label className="block text-sm font-medium">Select Group</label>
          <select
            value={selectedGroup}
            onChange={handleGroupChange}
            className="w-full px-4 py-2 border rounded"
          >
            <option value="201">201</option>
            <option value="202">202</option>
            <option value="203">203</option>
          </select>
        </div>
        <div className="mt-6">
          <h3 className="text-xl font-semibold">Available Courses</h3>
          <ul>
            {courses.map((course) => (
              <li
                key={course._id}
                className="flex justify-between items-center my-4"
              >
                <span>
                  {course.name} ({course.weekday} {course.time})
                </span>
                <button
                  className="bg-blue-500 text-white px-3 py-1 rounded"
                  onClick={() => registerCourse(course._id)}
                >
                  Register
                </button>
              </li>
            ))}
          </ul>
        </div>
        <div className="mt-6">
          <h3 className="text-xl font-semibold">Your Timetable</h3>
          <table className="table-auto w-full border-collapse border border-gray-300">
            <thead>
              <tr>
                <th className="border border-gray-300 px-4 py-2">Time</th>
                {weekdays.map((day) => (
                  <th key={day} className="border border-gray-300 px-4 py-2">
                    {day}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {timeSlots.map((timeSlot) => (
                <tr key={timeSlot.label}>
                  <td className="border border-gray-300 px-4 py-2">
                    {timeSlot.label}
                  </td>
                  {weekdays.map((day) => (
                    <td
                      key={`${day}-${timeSlot.label}`}
                      className="border border-gray-300 px-4 py-2"
                    >
                      {renderTableCell(day, timeSlot)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
