"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const queue_controller_1 = require("../controllers/queue.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const router = express_1.default.Router();
router.get("/status", queue_controller_1.getQueueStatus);
router.post("/take", auth_middleware_1.verifyToken, queue_controller_1.takeNumber);
router.get("/my-ticket", auth_middleware_1.verifyToken, queue_controller_1.getMyTicket);
// Admin routes
router.patch("/increment", auth_middleware_1.verifyToken, auth_middleware_1.isAdmin, queue_controller_1.incrementNumber);
router.patch("/decrement", auth_middleware_1.verifyToken, auth_middleware_1.isAdmin, queue_controller_1.decrementNumber);
router.patch("/toggle-bookings", auth_middleware_1.verifyToken, auth_middleware_1.isAdmin, queue_controller_1.toggleBookings);
router.post("/reset", auth_middleware_1.verifyToken, auth_middleware_1.isAdmin, queue_controller_1.resetQueue);
router.post("/admin-ticket", auth_middleware_1.verifyToken, auth_middleware_1.isAdmin, queue_controller_1.adminCreateTicket);
router.get("/all-tickets", auth_middleware_1.verifyToken, auth_middleware_1.isAdmin, queue_controller_1.getAllTickets);
router.delete("/ticket/:ticketId", auth_middleware_1.verifyToken, auth_middleware_1.isAdmin, queue_controller_1.adminRemoveTicket);
exports.default = router;
//# sourceMappingURL=queue.routes.js.map