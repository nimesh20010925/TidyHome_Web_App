import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import inventoryRoutes from "./Routes/inventoryRoute.js";

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.error("MongoDB Connection Error:", err));

// Use the inventory route
app.use("/api/inventory", inventoryRoutes);

// Test Route
app.get("/", (req, res) => {
  res.send("Welcome TidyHome");
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
