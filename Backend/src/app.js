import express from "express";
import cors from "cors";
import morgan from "morgan";
import dotenv from "dotenv";

import authRoutes from "./routes/auth.routes.js";
import adminRoutes from "./routes/admin.routes.js";
import storeRoutes from "./routes/store.routes.js";
import ratingRoutes from "./routes/rating.routes.js";
import ownerRoutes from "./routes/owner.routes.js";

dotenv.config();

const app = express();

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://roxiler-systems-1722.onrender.com/",
    ],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

// ✅ handle preflight requests explicitly
app.options("*", cors());

app.use(express.json());
app.use(morgan("dev"));

app.get("/health", (_, res) => res.json({ ok: true }));

app.use("/auth", authRoutes);
app.use("/admin", adminRoutes);
app.use("/stores", storeRoutes);
app.use("/ratings", ratingRoutes);
app.use("/owner", ownerRoutes);

export default app;
