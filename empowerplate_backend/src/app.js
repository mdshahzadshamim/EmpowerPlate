import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { config } from "./config/config.js";

const app = express();

app.use(cors({ origin: config.corsOrigin, credentials: true }));
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static(("public")));
app.use(cookieParser());

// Import Routes
import userRouter from "./routes/user.routes.js";
import requestRouter from "./routes/request.routes.js";

// Declare Routes
app.use("/api/v1/users", userRouter);
app.use("/api/v1/requests", requestRouter);


export { app };