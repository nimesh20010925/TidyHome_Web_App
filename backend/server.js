
import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import inventoryRoutes from "./Routes/inventoryRoute.js";
import authRoutes from "./Routes/authRoutes.js"
import homeRoutes from "./Routes/homeRoutes.js"
import consumptionRoutes from "./Routes/consumptionRoutes.js"
// Load environment variables
dotenv.config();

const app = express();



const corsOptions = {
  origin: 'http://localhost:5173',  // No trailing slash here
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

app.use(cors(corsOptions));

app.use(cors(corsOptions));

// Middleware
app.use(express.json());
app.use(cors());

//Routes
app.use("/api/auth", authRoutes);
app.use("/api/home", homeRoutes);
app.use("/api/inventory", inventoryRoutes);
app.use("/api/consumption", consumptionRoutes);

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.error("MongoDB Connection Error:", err));

// Test Route
app.get("/", (req, res) => {
  res.send("Welcome TidyHome");
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));




