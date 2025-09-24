import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import routes from "./routes";
import path from "path";

const app = express();

app.use(express.json());
app.use(cookieParser());

// If your frontend runs on http://localhost:3000
app.use(
  cors({
    origin: process.env.FRONTEND_ORIGIN || "http://localhost:3000",
    credentials: false, // not using cookies for auth in Option A
    allowedHeaders: ["Content-Type", "Authorization"],
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  })
);

app.use("/api/uploads", express.static(path.join(__dirname, "uploads")));

// (Optional) health
app.get("/api/health", (_req, res) => res.json({ status: "ok" }));

app.use("/api", routes);

// Error handler (basic)
app.use(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  (err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
    const status = err.status || 500;
    const message = err.message || "Server error";
    res.status(status).json({ error: message });
  }
);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`API listening on ${PORT}`);
});
