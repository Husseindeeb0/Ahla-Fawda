import { Server } from "socket.io";
import type { Socket } from "socket.io";
import { Server as HttpServer } from "http";

let io: Server;

export const initSocket = (httpServer: HttpServer) => {
  io = new Server(httpServer, {
    cors: {
      origin: "*", // Allow all origins for simplicity in production or use an array
      methods: ["GET", "POST", "PATCH"],
      credentials: true,
    },
  });

  io.on("connection", (socket: Socket) => {
    console.log(`User connected: ${socket.id}`);

    socket.on("disconnect", () => {
      console.log(`User disconnected: ${socket.id}`);
    });
  });

  return io;
};

export const getIO = () => {
  if (!io) {
    throw new Error("Socket.io not initialized!");
  }
  return io;
};

export const emitQueueUpdate = (data: any) => {
  if (io) {
    io.emit("queueUpdated", data);
  }
};

export const emitTicketUpdate = (userId: string, data: any) => {
  if (io) {
    io.emit(`ticketUpdated:${userId}`, data);
  }
};
