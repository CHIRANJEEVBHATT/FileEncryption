import express from "express";
import fileRoutes from "./routes/fileRoutes.js";
import path from "path";

const app = express();
const PORT = 5000;

// Middleware to parse JSON bodies
app.use(express.json());

// Serve static files (optional, for frontend later)
app.use(express.static(path.join(process.cwd(), "outputs")));

// Routes
app.use("/api/files", fileRoutes);

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
