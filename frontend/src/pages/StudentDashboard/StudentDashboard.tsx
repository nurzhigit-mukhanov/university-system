import React, { useEffect } from "react";
import Navbar from "../../components/Navbar";
import { useStudentStore } from "./api/store";

const weekdays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
const timeSlots = [
  { label: "13:20-14:10", start: "13:20", end: "14:10" },
  { label: "14:20-15:10", start: "14:20", end: "15:10" },
  { label: "15:30-16:20", start: "15:30", end: "16:20" },
  { label: "16:30-17:20", start: "16:30", end: "17:20" },
  { label: "17:30-18:20", start: "17:30", end: "18:20" },
];

const StudentDashboard: React.FC = () => {
  const {
    courses,
    timetable,
    selectedGroup,
    setGroup,
    loadCourses,
    loadTimetable,
    register,
    drop,
  } = useStudentStore();

  useEffect(() => {
    loadCourses();
    loadTimetable();
  }, [selectedGroup]);

  const handleGroupChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setGroup(e.target.value);
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
            <div key={index}>
              <strong>{course.name}:</strong> {course.description}
              <br />
              <span>Classroom: {course.classroom}</span>
              <button
                onClick={() => drop(course.courseId._id)}
                className="text-red-600 font-bold"
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
            <option value="204">204</option>
            <option value="205">205</option>
            <option value="206">206</option>
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
                  onClick={() => register(course._id)}
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
