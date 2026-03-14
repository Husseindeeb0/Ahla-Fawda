"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.emitTicketsUpdated = exports.emitTicketUpdate = exports.emitQueueUpdate = exports.getIO = exports.initSocket = void 0;
const socket_io_1 = require("socket.io");
let io;
const initSocket = (httpServer) => {
    io = new socket_io_1.Server(httpServer, {
        cors: {
            origin: ["http://localhost:5173", "https://ahla-fawda-h.vercel.app"],
            methods: ["GET", "POST", "PATCH"],
            credentials: true,
        },
    });
    io.on("connection", (socket) => {
        console.log(`User connected: ${socket.id}`);
        socket.on("disconnect", () => {
            console.log(`User disconnected: ${socket.id}`);
        });
    });
    return io;
};
exports.initSocket = initSocket;
const getIO = () => {
    if (!io) {
        throw new Error("Socket.io not initialized!");
    }
    return io;
};
exports.getIO = getIO;
const emitQueueUpdate = (data) => {
    if (io) {
        io.emit("queueUpdated", data);
    }
};
exports.emitQueueUpdate = emitQueueUpdate;
const emitTicketUpdate = (userId, data) => {
    if (io) {
        io.emit(`ticketUpdated:${userId}`, data);
    }
};
exports.emitTicketUpdate = emitTicketUpdate;
const emitTicketsUpdated = () => {
    if (io) {
        io.emit("ticketsUpdated");
    }
};
exports.emitTicketsUpdated = emitTicketsUpdated;
//# sourceMappingURL=socket.js.map