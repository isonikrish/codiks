import express from "express";
import http from "http";
import { Server } from "socket.io";
import userRoutes from "./routes/user.js";
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

const activeUsers = [];

io.on("connection", (socket) => {
  activeUsers.push({ socketId: socket.id, inBattle: false });
  console.log(activeUsers);
  socket.on("waiting-area", () => {
    const currentUser = activeUsers.find((u) => u.socketId === socket.id);
    if (!currentUser) return;

    const opponent = activeUsers.find(
      (u) => u.socketId !== socket.id && !u.inBattle
    );
    if (opponent) {
      currentUser.inBattle = true;
      opponent.inBattle = true;

      socket.emit("found-opponent", {
        opponentSocketId: opponent.socketId,
      });
      const opponentSocket = io.sockets.sockets.get(opponent.socketId);
      if (opponentSocket) {
        opponentSocket.emit("found-opponent", {
          opponentSocketId: socket.id,
        });
      }
    } else {
      // Optional: tell user no opponent yet
      socket.emit("waiting", { message: "Waiting for an opponent..." });
    }
  });

  socket.on("disconnect", () => {
    const index = activeUsers.findIndex((u) => u.socketId === socket.id);
    if (index !== -1) activeUsers.splice(index, 1);
  });
});

app.use("/api/user", userRoutes);
const PORT = 4000;
server.listen(PORT, () => {
  console.log(`🚀 Server listening on http://localhost:${PORT}`);
});
