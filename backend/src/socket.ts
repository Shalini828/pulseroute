import { Server } from "socket.io";

let io: Server;

export const setSocketIO = (socket: Server) => {
  io = socket;
};

export const getSocketIO = () => {
  if (!io) {
    throw new Error("Socket.IO has not been initialized.");
  }

  return io;
};