import { Router, Request, Response, NextFunction } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User";

const router = Router();

// User registration
router.post(
  "/register",
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { name, email, password, role } = req.body;

      const existingUser = await User.findOne({ email });
      if (existingUser) {
        res.status(400).json({ message: "User already exists" });
        return; // Ensure the function terminates after sending a response
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const user = new User({ name, email, password: hashedPassword, role });
      await user.save();

      res.status(201).json({ message: "User registered successfully" });
    } catch (error) {
      next(error); // Pass errors to the default error handler
    }
  }
);

// User login
router.post("/login", async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      res.status(403).json({ message: "Invalid credentials" });
      return;
    }

    const token = jwt.sign(
      { id: user._id, role: user.role }, // Include role in the token payload
      process.env.JWT_SECRET!,
      { expiresIn: "1d" }
    );

    res.status(200).json({ token, role: user.role }); // Include role in the response
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
});

export default router;
