import express from "express";
import dotenv from "dotenv";
import webHookRoutes from "./routes/webHookRoutes.js";



dotenv.config();

const app = express();

// Capture raw body for signature verification BEFORE any parsing
app.use(
  express.json({
    verify: (req, res, buf) => {
      req.rawBody = buf;
    },
  })
);

// Health check
app.get("/", (req, res) => {
  res.send("RepoGuardian Webhook Server Running");
});

// Webhook route
app.use("/api/webhook", webHookRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`RepoGuardian running on port ${PORT}`);
});
