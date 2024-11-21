import { Router, Request, Response, NextFunction } from "express";
import bcrypt from "bcryptjs";
import User from "../models/User";
import Course from "../models/Course";
import { AuthenticatedRequest, authenticateJWT } from "../middlewares/auth";

const router = Router();

// Middleware to restrict access to admins
const adminMiddleware = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): void | Promise<void> => {
  if (req.user?.role !== "admin") {
    res.status(403).json({ message: "Access forbidden: Admins only" });
    return;
  }
  next();
};

// Route to create a new user
router.post(
  "/users",
  authenticateJWT,
  adminMiddleware,
  async (req: AuthenticatedRequest, res: Response) => {
    try {
      const { name, email, password, role } = req.body;

      const hashedPassword = await bcrypt.hash(password, 10);

      const user = new User({ name, email, password: hashedPassword, role });
      await user.save();

      res.status(201).json({ message: "User created successfully" });
    } catch (error) {
      res.status(500).json({ message: (error as Error).message });
    }
  }
);

// Route to manage courses
router.post(
  "/courses",
  authenticateJWT,
  adminMiddleware,
  async (req: AuthenticatedRequest, res: Response) => {
    try {
      const { name, description, teacherId, classroom, time, weekday, group } =
        req.body;

      // Extract start and end times from the `time` string
      const [startTime, endTime] = time.split("-");

      const course = new Course({
        name,
        description,
        teacherId,
        classroom,
        time,
        startTime, // Save startTime
        endTime, // Save endTime
        weekday,
        group,
      });

      await course.save();
      res.status(201).json({ message: "Course created successfully", course });
    } catch (error) {
      res.status(500).json({ message: (error as Error).message });
    }
  }
);

// Route to get all users
router.get(
  "/users",
  authenticateJWT,
  adminMiddleware,
  async (req: AuthenticatedRequest, res: Response) => {
    try {
      const users = await User.find(); // Fetch all users
      res.status(200).json(users);
    } catch (error) {
      res.status(500).json({ message: (error as Error).message });
    }
  }
);

// Route to update a user
router.put(
  "/users/:id",
  authenticateJWT,
  adminMiddleware,
  async (
    req: Request<{ id: string }, {}, { name: string; role: string }>,
    res: Response
  ): Promise<any> => {
    try {
      const { id: userId } = req.params;
      const { name, role } = req.body;

      const updatedUser = await User.findByIdAndUpdate(
        userId,
        { name, role },
        { new: true }
      );

      if (!updatedUser) {
        return res.status(404).json({ message: "User not found" });
      }

      res.status(200).json(updatedUser);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Failed to update user" });
    }
  }
);

export default router;
