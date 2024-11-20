import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db";
import authRoutes from "./routes/auth";
import studentRoutes from "./routes/student";
import teacherRoutes from "./routes/teacher";
import adminRoutes from "./routes/admin";
import cors from "cors";

dotenv.config();
connectDB();

const app = express();

const corsOptions = {
  origin: "http://localhost:3000", // Allow requests only from your frontend origin
  methods: ["GET", "POST", "PUT", "DELETE"], // Allowed HTTP methods
  allowedHeaders: ["Content-Type", "Authorization"], // Allowed headers
  credentials: true, // If cookies or authentication are required
};

// Enable CORS
app.use(cors(corsOptions));

app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/student", studentRoutes);
app.use("/api/teacher", teacherRoutes);
app.use("/api/admin", adminRoutes);

// Default route for '/'
app.get("/", (req, res) => {
  res.send("Welcome to the API!");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
