import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
import cookieParser from "cookie-parser";
import userRoutes from "./routes/user.js";
import { Battle } from "./lib/battleLogic.js";
import { problem } from "./lib/problem.js";
import vm from "vm";

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
    credentials: true,
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
const activeBattles = new Map();

// Run test cases using vm to evaluate submitted code
function runTestCases(jsCode) {
  try {
    const script = new vm.Script(`(${jsCode})`);
    const func = script.runInNewContext();

    let passCount = 0;
    for (const test of problem.testCases) {
      const result = func(test.input.a, test.input.b);
      if (result === test.output) passCount++;
    }
    return passCount;
  } catch (err) {
    return 0;
  }
}

io.on("connection", (socket) => {
  console.log("🔌 New client connected:", socket.id);
  activeUsers.push({ socketId: socket.id, inBattle: false });

  // Waiting area matchmaking
  socket.on("waiting-area", () => {
    const currentUser = activeUsers.find((u) => u.socketId === socket.id);
    if (!currentUser) return;

    const opponent = activeUsers.find(
      (u) => u.socketId !== socket.id && !u.inBattle
    );

    if (opponent) {
      currentUser.inBattle = true;
      opponent.inBattle = true;

      // Notify both players of the opponent found
      socket.emit("found-opponent", { opponentSocketId: opponent.socketId });
      const opponentSocket = io.sockets.sockets.get(opponent.socketId);
      if (opponentSocket)
        opponentSocket.emit("found-opponent", { opponentSocketId: socket.id });
    } else {
      socket.emit("waiting", { message: "Waiting for an opponent..." });
    }
  });

  // Start battle between two players
  socket.on("start-battle", (opponentId) => {
    if (!opponentId) return;

    // Make sure both users are marked in battle
    const user1 = activeUsers.find((u) => u.socketId === socket.id);
    const user2 = activeUsers.find((u) => u.socketId === opponentId);
    if (!user1 || !user2) return;

    user1.inBattle = true;
    user2.inBattle = true;

    const battle = new Battle(socket.id, opponentId);
    battle.start();
    activeBattles.set(battle.id, battle);

    socket.emit("battle-started", { battleId: battle.id });
    const opponentSocket = io.sockets.sockets.get(opponentId);
    if (opponentSocket)
      opponentSocket.emit("battle-started", { battleId: battle.id });
  });

  socket.on("submit-code", (battleId, socketId, testResults) => {
  const battle = activeBattles.get(battleId);
  if (!battle) {
    socket.emit("error", { message: "Battle not found." });
    return;
  }
  console.log({battleId, socketId, testResults})
  const passCount = testResults.filter((t) => t.passed).length;
  battle.submitCode(socketId, passCount);

  // If both players have submitted and battle is finished, emit results
  if (battle.status === "finished") {
    const opponentId = battle.player1 === socketId ? battle.player2 : battle.player1;
    const opponentSocket = io.sockets.sockets.get(opponentId);

    const resultPayload = {
      winner: battle.winner,
      player1PassCount: battle.player1PassCount,
      player2PassCount: battle.player2PassCount,
    };

    socket.emit("battle-ended", resultPayload);
    if (opponentSocket) opponentSocket.emit("battle-ended", resultPayload);
  }
});


  // Clean up on disconnect
  socket.on("disconnect", () => {
    // Remove user from activeUsers and mark battle if any ended
    const index = activeUsers.findIndex((u) => u.socketId === socket.id);
    if (index !== -1) {
      const user = activeUsers[index];
      if (user.inBattle) {
        // Optionally handle ongoing battle user left
        // For simplicity, just mark inBattle false here
        user.inBattle = false;
      }
      activeUsers.splice(index, 1);
    }
    console.log("❌ Client disconnected:", socket.id);
  });
});

// User routes (if any)
app.use("/api/user", userRoutes);

const PORT = 4000;
server.listen(PORT, () => {
  console.log(`🚀 Server listening on http://localhost:${PORT}`);
});
