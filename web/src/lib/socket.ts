import { io, Socket } from "socket.io-client";

let socket: Socket | null = null;

export const getSocket = (): Socket => {
  if (!socket) {
    socket = io("http://localhost:4000", {
      autoConnect: false,  // optional: you can control when to connect
    });
    socket.connect(); // connect once
  }
  return socket;
};
