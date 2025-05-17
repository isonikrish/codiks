
import { io, Socket } from "socket.io-client";

let socket: Socket | null = null;

export const getSocket = (): Socket => {
    socket = io("http://localhost:4000"); // Replace with your actual backend URL
  return socket;
};
