import express from "express";
import http from "http";
import { Server } from "socket.io";
import userRoutes from './routes/user.js'
import cors from "cors";
import cookieParser from "cookie-parser";
const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000", // your Next.js frontend
    methods: ["GET", "POST"],
  },
});
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());


io.on("connection", (socket) => {
  console.log("⚡ User connected:", socket.id);

  // Example event
  socket.on("disconnect", () => {
    console.log("🚪 User disconnected:", socket.id);
  });
});

app.use("/api/user", userRoutes)
const PORT = 4000;
server.listen(PORT, () => {
  console.log(`🚀 Server listening on http://localhost:${PORT}`);
});
