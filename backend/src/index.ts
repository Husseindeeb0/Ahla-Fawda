import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import * as dotenv from "dotenv";
import connectDB from "./config/connectDB";
import authRoutes from "./routes/auth.routes";
import queueRoutes from "./routes/queue.routes";
import corsOptions from "./config/corsOptions";

import { createServer } from "http";
import { initSocket } from "./utils/socket";

dotenv.config();

const app = express();
const httpServer = createServer(app);
const PORT = process.env.PORT || 5000;

app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());

// Initialize Socket.io
initSocket(httpServer);

// Connect to MongoDB
connectDB();

// Routes
app.use("/auth", authRoutes);
app.use("/queue", queueRoutes);

httpServer.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

export default app;
