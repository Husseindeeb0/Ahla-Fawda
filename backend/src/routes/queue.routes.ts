import express from "express";
import {
  getQueueStatus,
  takeNumber,
  incrementNumber,
  decrementNumber,
  toggleBookings,
  resetQueue,
  getMyTicket,
  adminCreateTicket,
  getAllTickets,
  adminRemoveTicket,
} from "../controllers/queue.controller";
import { verifyToken, isAdmin } from "../middleware/auth.middleware";

const router = express.Router();

router.get("/status", getQueueStatus);
router.post("/take", verifyToken, takeNumber);
router.get("/my-ticket", verifyToken, getMyTicket);

// Admin routes
router.patch("/increment", verifyToken, isAdmin, incrementNumber);
router.patch("/decrement", verifyToken, isAdmin, decrementNumber);
router.patch("/toggle-bookings", verifyToken, isAdmin, toggleBookings);
router.post("/reset", verifyToken, isAdmin, resetQueue);
router.post("/admin-ticket", verifyToken, isAdmin, adminCreateTicket);
router.get("/all-tickets", verifyToken, isAdmin, getAllTickets);
router.delete("/ticket/:ticketId", verifyToken, isAdmin, adminRemoveTicket);

export default router;
