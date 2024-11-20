import { Router, Response } from "express";
import { AuthenticatedRequest, authenticateJWT } from "../middlewares/auth";
import Schedule from "../models/Schedule";
import Course from "../models/Course";
import { ICourse } from "../models/Course";

const router = Router();

// Route for students to register for a course
router.post(
  "/register",
  authenticateJWT,
  async (req: AuthenticatedRequest, res: Response): Promise<any> => {
    try {
      const studentId = req.user!.id;
      const { courseId, timetable } = req.body;

      // Additional validation: Ensure timetable is an array and contains valid entries
      if (!Array.isArray(timetable) || timetable.length === 0) {
        return res.status(400).json({ message: "Invalid timetable format" });
      }

      // Ensure each timetable entry has required fields
      for (const entry of timetable) {
        if (!entry.day || !entry.startTime || !entry.endTime) {
          return res
            .status(400)
            .json({ message: "Incomplete timetable entry" });
        }
      }

      const schedule = new Schedule({ studentId, courseId, timetable });
      await schedule.save();

      res.status(201).json({ message: "Course registered successfully" });
    } catch (error) {
      console.error("Error registering course:", error);
      res.status(500).json({ message: (error as Error).message });
    }
  }
);

// Route for students to view their timetable
router.get(
  "/timetable",
  authenticateJWT,
  async (req: AuthenticatedRequest, res: Response) => {
    try {
      const studentId = req.user!.id;
      console.log("Student ID:", studentId);

      const timetable = await Schedule.find({ studentId })
        .populate({
          path: "courseId",
          select: "name time weekday group classroom teacherId", // Populate necessary course fields
          populate: {
            path: "teacherId", // Assuming teacherId references a Teacher model
            select: "name", // Populate the teacher's name
          },
        })
        .lean();
      console.log("Populated Timetable:", timetable);

      const formattedTimetable = timetable.map((entry) => {
        const course = entry.courseId as unknown as ICourse; // Convert to 'unknown' and assert to 'ICourse'

        if (!course || !course.time || !course.time.includes("-")) {
          // Handle case where courseId is null or time is invalid
          console.error("Invalid course or time format:", course);
          return {
            ...entry,
            message: "Invalid course or time format",
          };
        }

        const [startTime, endTime] = course.time.split("-"); // Split the time string
        return {
          ...entry,
          startTime,
          endTime,
          day: course.weekday,
          group: course.group,
          name: course.name,
          classroom: course.classroom,
          teacherName: course.teacherId || "Unknown", // Set teacher name
        };
      });

      res.status(200).json(formattedTimetable);
    } catch (error) {
      res.status(500).json({ message: (error as Error).message });
    }
  }
);

router.get(
  "/courses",
  authenticateJWT,
  async (req: AuthenticatedRequest, res: Response): Promise<any> => {
    try {
      const group = req.query.group; // Group comes from query params
      if (!group) {
        return res.status(400).json({ message: "Group is required" });
      }

      // Fetch all registered courses for the student
      const studentId = req.user!.id;
      const registeredCourses = await Schedule.find({ studentId }).select(
        "courseId"
      );
      const registeredCourseIds = registeredCourses.map((reg) => reg.courseId);

      // Fetch available courses for the specified group, excluding registered ones
      const courses = await Course.find({
        group: group, // Filter by group
        _id: { $nin: registeredCourseIds },
      });

      res.status(200).json(courses);
    } catch (error) {
      res.status(500).json({ message: (error as Error).message });
    }
  }
);

// Route for students to drop a course
router.delete(
  "/drop/:courseId",
  authenticateJWT,
  async (req: AuthenticatedRequest, res: Response): Promise<any> => {
    try {
      console.log("Student ID:", req.user?.id);
      console.log("Course ID:", req.params.courseId);

      const studentId = req.user!.id;
      const { courseId } = req.params;

      if (!courseId) {
        return res.status(400).json({ message: "Course ID is required" });
      }

      const result = await Schedule.findOneAndDelete({ studentId, courseId });

      if (!result) {
        console.log("Course not found in student's schedule.");
        return res
          .status(404)
          .json({ message: "Course not found in the student's schedule" });
      }

      console.log("Course dropped successfully:", result);
      res.status(200).json({ message: "Course dropped successfully" });
    } catch (error) {
      console.error("Error dropping course:", error);
      res.status(500).json({ message: (error as Error).message });
    }
  }
);

export default router;
