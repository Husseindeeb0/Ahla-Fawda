import { Server } from "socket.io";
import type { Socket } from "socket.io";
import { Server as HttpServer } from "http";

let io: Server;

export const initSocket = (httpServer: HttpServer) => {
  io = new Server(httpServer, {
    cors: {
      origin: ["http://localhost:5173", "https://ahla-fawda-h.vercel.app"],
      methods: ["GET", "POST", "PATCH"],
      credentials: true,
    },
  });

  io.on("connection", (socket: Socket) => {
    console.log(`User connected: ${socket.id}`);

    // Join a private room for user-specific updates
    socket.on("join", (userId: string) => {
      socket.join(userId);
      console.log(`User ${userId} joined room`);
    });

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
    if (userId === "all") {
      io.emit("ticketUpdated:all", data);
    } else {
      io.to(userId).emit(`ticketUpdated:${userId}`, data);
    }
  }
};

export const emitTicketsUpdated = () => {
  if (io) {
    io.emit("ticketsUpdated");
  }
};
