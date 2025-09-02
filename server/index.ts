import express from "express";
import path from "path";
import { fileURLToPath } from "url";

const app = express();
const port = process.env.PORT || 8080;

// Health check endpoint
app.get("/healthz", (_req, res) => {
  res.status(200).send("ok");
});

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const publicDir = path.resolve(__dirname, "public");

// Serve static files from the client build
app.use(express.static(publicDir));

// SPA fallback for non-API routes
app.get("*", (req, res) => {
  if (req.path.startsWith("/api")) {
    res.status(404).end();
    return;
  }
  res.sendFile(path.join(publicDir, "index.html"));
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
