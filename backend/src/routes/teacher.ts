import { Router, Response, NextFunction } from "express";
import { AuthenticatedRequest, authenticateJWT } from "../middlewares/auth";
import Course from "../models/Course";

const router = Router();

// Middleware to restrict access to teachers
const teacherMiddleware = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): void => {
  if (req.user?.role !== "teacher") {
    res.status(403).json({ message: "Access forbidden: Teachers only" });
    return; // Ensure the function terminates after sending a response
  }
  next(); // Pass control to the next middleware
};

// Route for teachers to view their courses
router.get(
  "/courses",
  authenticateJWT,
  teacherMiddleware,
  async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const teacherId = req.user!.id;

      const courses = await Course.find({ teacherId });
      res.status(200).json(courses);
    } catch (error) {
      next(error); // Pass errors to the default error handler
    }
  }
);

// Route for teachers to view course details
router.get(
  "/courses/:id",
  authenticateJWT,
  teacherMiddleware,
  async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const courseId = req.params.id;

      // Populate the students field
      const course = await Course.findById(courseId).populate(
        "students",
        "name email"
      );
      if (!course) {
        res.status(404).json({ message: "Course not found" });
        return;
      }

      res.status(200).json(course);
    } catch (error) {
      next(error); // Pass errors to the default error handler
    }
  }
);

export default router;
