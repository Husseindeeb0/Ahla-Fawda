import { io } from "socket.io-client";

const VITE_API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";
const SOCKET_URL = VITE_API_URL.replace("/api", "");

export const socket = io(SOCKET_URL, {
  withCredentials: true,
  autoConnect: true,
});

// Optionally, add a helper to listen for updates
export const subscribeToQueueUpdates = (callback: (data: any) => void) => {
  socket.on("queueUpdated", callback);
  return () => socket.off("queueUpdated", callback);
};

export const subscribeToTicketUpdates = (
  userId: string,
  callback: (data: any) => void,
) => {
  const eventName =
    userId === "all" ? "ticketUpdated:all" : `ticketUpdated:${userId}`;
  socket.on(eventName, callback);
  return () => socket.off(eventName, callback);
};
