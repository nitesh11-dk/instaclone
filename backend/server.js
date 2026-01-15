import express, { urlencoded } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import connectDB from "./utils/db.js";
import userRoute from "./routes/user.route.js";
import postRoute from "./routes/post.route.js";
import messageRoute from "./routes/message.route.js";
import { app, server } from "./socket/socket.js";
import path from "path";

dotenv.config();

const PORT = process.env.PORT || 3000;
const __dirname = path.resolve();

// ---------- MIDDLEWARES ----------
app.use(express.json());
app.use(cookieParser());
app.use(urlencoded({ extended: true }));

// FIXED CORS CONFIG (VERY IMPORTANT)
const corsOptions = {
  origin: "http://localhost:5173", // your React frontend
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));

// Handle preflight requests
app.options("*", cors(corsOptions));

// ---------- ROUTES ----------
app.use("/api/v1/user", userRoute);
app.use("/api/v1/post", postRoute);
app.use("/api/v1/message", messageRoute);

// ---------- STATIC FRONTEND BUILD ----------
app.use(express.static(path.join(__dirname, "/frontend/dist")));

app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"));
});

// ---------- START SERVER ----------
server.listen(PORT, () => {
  connectDB();
  console.log(`Server listen at port ${PORT}`);
});
