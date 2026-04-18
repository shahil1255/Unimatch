const express = require("express");
const session = require("express-session");
const cors = require("cors");
const path = require("path");
const fs = require("fs");
require("dotenv").config();

const { sequelize } = require("./backend/models/database");
// Import models to ensure they are registered with Sequelize
require("./backend/models/User");
require("./backend/models/University");
require("./backend/models/Application");

const app = express();
const PORT = process.env.PORT || 5000;

// ─── Env Validation ──────────────────────────────────────────────────────────
const REQUIRED_ENV = ["SESSION_SECRET", "CLOUDINARY_CLOUD_NAME", "CLOUDINARY_API_KEY", "CLOUDINARY_API_SECRET"];
const missingEnv = REQUIRED_ENV.filter(key => !process.env[key]);
if (missingEnv.length > 0) {
  console.warn("⚠️  [Server] Missing environment variables:", missingEnv.join(", "));
  console.log("⚠️  [Server] Some features will be disabled.");
}

// ─── Verification ───────────────────────────────────────────────────────────
const FRONTEND_DIR = path.resolve(__dirname, "frontend");
if (!fs.existsSync(FRONTEND_DIR)) {
  console.error("❌ CRITICAL: Frontend directory not found at:", FRONTEND_DIR);
} else {
  console.log("📁 Serving static files from:", FRONTEND_DIR);
}

// ─── Database Synchronization ────────────────────────────────────────────────
sequelize.sync({ alter: true }) // 'alter: true' updates tables to match models without dropping data
  .then(() => {
    console.log("✅ [DB] SQLite Database synced successfully.");
  })
  .catch((err) => {
    console.error("❌ [DB] SQLite Sync Error:", err);
  });

// ─── Middleware ──────────────────────────────────────────────────────────────
app.use((req, res, next) => {
  console.log(`[${new Date().toLocaleTimeString()}] ${req.method} ${req.url}`);
  next();
});
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Session
app.use(
  session({
    secret: process.env.SESSION_SECRET || "unimatch_mega_secret",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false, // Set to true if using HTTPS
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
    },
  }),
);

// ─── API Routes ──────────────────────────────────────────────────────────────
const authRoutes = require("./backend/routes/authRoutes");
const universityRoutes = require("./backend/routes/universityRoutes");
const applicationRoutes = require("./backend/routes/applicationRoutes");
const statsRoutes = require("./backend/routes/statsRoutes");

const adminRoutes = require("./backend/routes/adminRoutes");

app.use("/api/auth", authRoutes);
app.use("/api/universities", universityRoutes);
app.use("/api/applications", applicationRoutes);
app.use("/api/stats", statsRoutes);
app.use("/api/admin", adminRoutes);

// ─── Static Serving Logic ───────────────────────────────────────────────────
// First, serve the static files normally
app.use(express.static(FRONTEND_DIR));

// Explicit route for root to ensure index.html is served
app.get("/", (req, res) => {
  res.sendFile(path.join(FRONTEND_DIR, "index.html"));
});

// Fallback for SPA (Single Page Application)
// This ensures that refreshing on /profile or /login works correctly
app.use((req, res) => {
  // If it's an API call that wasn't caught, return 404 JSON
  if (req.url.startsWith("/api")) {
    return res.status(404).json({ error: "API endpoint not found" });
  }
  // Otherwise, send the index.html
  const indexPath = path.join(FRONTEND_DIR, "index.html");
  if (fs.existsSync(indexPath)) {
    res.sendFile(indexPath);
  } else {
    res
      .status(404)
      .send("Not Found: index.html is missing in the frontend folder.");
  }
});

app.listen(PORT, "0.0.0.0", () => {
    console.log(`🚀 UniMatch Server is LIVE at: http://localhost:${PORT}`);
    console.log(`🌐 Also accessible at: http://127.0.0.1:${PORT}`);
});
