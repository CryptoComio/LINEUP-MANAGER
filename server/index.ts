import express, { type Request, type Response, type NextFunction } from "express";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";

const app = express();
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: false, limit: "10mb" }));

// Healthcheck per piattaforme di deploy
app.get("/healthz", (_req, res) => res.status(200).send("ok"));

(async () => {
  const server = await registerRoutes(app);

  // Error handler
  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    res.status(status).json({ message });
    throw err;
  });

  // In dev usa Vite SSR middleware; in prod servi statici da dist/public
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  // Porta da env (fallback 5000)
  const port = parseInt(process.env.PORT || "5000", 10);
  server.listen(
    { port, host: "0.0.0.0", reusePort: true },
    () => log(`serving on port ${port}`)
  );
})();
