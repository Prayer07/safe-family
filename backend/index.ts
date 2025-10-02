// backend/src/server.ts
import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import authRoutes from "./routes/auth.js"; // you should have auth routes implemented (signup/login)
import familyRoutes from "./routes/family.js";
import locationRoutes from "./routes/location.js";
import sosRoutes from "./routes/sos.js";
import historyRoutes from "./routes/history.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/family", familyRoutes);
app.use("/api/location", locationRoutes);
app.use("/api/sos", sosRoutes);
app.use("/api/history", historyRoutes);

const HOST = "0.0.0.0"

const MONGO = process.env.MONGO_URI || "mongodb://localhost:27017/safefamily";
mongoose.connect(MONGO).then(() => {
  console.log("Mongo connected");
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => console.log(`API listening on ${HOST}:${PORT}`));
}).catch((err) => {
  console.error("Mongo connection error:", err);
});



// import express, { type Application, type Request, type Response } from "express";
// import http from "http";
// import cors from "cors";
// import { connectDB } from "./db.js";
// // import { PORT } from "./config.js";
// import authRoutes from "./routes/auth.js";
// import familyRoutes from "./routes/family.js";
// import locationRoutes from "./routes/location.js";
// import sosRoutes from "./routes/sos.js";
// import { initSocket } from "./socket.js";

// import dotenv from "dotenv"

// dotenv.config()

// const PORT = process.env.PORT!
// const HOST = "0.0.0.0"

// const app: Application = express();
// app.use(cors());
// app.use(express.json());

// // API Routes
// app.use("/api/auth", authRoutes);
// app.use("/api/family", familyRoutes);
// app.use("/api/location", locationRoutes);
// app.use("/api/sos", sosRoutes);

// app.get("/", (req: Request, res: Response) => {
//     res.send("SafeFamily API running...");
// });

// const server = http.createServer(app);

// (async () => {
//     await connectDB();
//     initSocket(server); // initialize socket.io

//     server.listen(PORT, () => {
//         console.log(`🚀 Server listening on port ${HOST}:${PORT}`);
//     });
// })();