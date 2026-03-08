"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMyTicket = exports.resetQueue = exports.toggleBookings = exports.decrementNumber = exports.incrementNumber = exports.takeNumber = exports.getQueueStatus = void 0;
const queue_model_1 = require("../models/queue.model");
const User_1 = require("../models/User");
const socket_1 = require("../utils/socket");
const getQueueStatus = async (req, res) => {
    try {
        let queue = await queue_model_1.Queue.findOne().sort({ createdAt: -1 });
        if (!queue) {
            queue = await queue_model_1.Queue.create({
                currentNumber: 0,
                lastIssuedNumber: 0,
                isBookingsOpen: true,
            });
        }
        res.json(queue);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.getQueueStatus = getQueueStatus;
const takeNumber = async (req, res) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({ message: "Authentication required" });
        }
        const user = await User_1.User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        if (user.savedNumber) {
            return res.status(400).json({ message: "You already have a number" });
        }
        let queue = await queue_model_1.Queue.findOne().sort({ createdAt: -1 });
        if (!queue) {
            queue = await queue_model_1.Queue.create({
                currentNumber: 0,
                lastIssuedNumber: 0,
                isBookingsOpen: true,
            });
        }
        if (!queue.isBookingsOpen) {
            return res.status(400).json({ message: "Bookings are currently closed" });
        }
        queue.lastIssuedNumber += 1;
        await queue.save();
        const ticket = await queue_model_1.Ticket.create({
            number: queue.lastIssuedNumber,
            userId: user._id,
            status: "waiting",
        });
        user.savedNumber = queue.lastIssuedNumber;
        await user.save();
        (0, socket_1.emitQueueUpdate)(queue);
        (0, socket_1.emitTicketUpdate)(userId, ticket);
        res.status(201).json(ticket);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.takeNumber = takeNumber;
const incrementNumber = async (req, res) => {
    try {
        let queue = await queue_model_1.Queue.findOne().sort({ createdAt: -1 });
        if (!queue) {
            return res.status(404).json({ message: "Queue not found" });
        }
        if (queue.currentNumber < queue.lastIssuedNumber) {
            queue.currentNumber += 1;
            await queue.save();
            // Update the ticket status to 'called'
            await queue_model_1.Ticket.findOneAndUpdate({ number: queue.currentNumber, status: "waiting" }, { status: "called" });
            (0, socket_1.emitQueueUpdate)(queue);
            res.json(queue);
        }
        else {
            res
                .status(400)
                .json({ message: "لا يوجد المزيد من الأشخاص في الانتظار" });
        }
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.incrementNumber = incrementNumber;
const decrementNumber = async (req, res) => {
    try {
        let queue = await queue_model_1.Queue.findOne().sort({ createdAt: -1 });
        if (!queue) {
            return res.status(404).json({ message: "Queue not found" });
        }
        if (queue.currentNumber > 0) {
            // Find the ticket being unset and change it back to 'waiting'
            await queue_model_1.Ticket.findOneAndUpdate({ number: queue.currentNumber, status: "called" }, { status: "waiting" });
            queue.currentNumber -= 1;
            await queue.save();
        }
        (0, socket_1.emitQueueUpdate)(queue);
        res.json(queue);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.decrementNumber = decrementNumber;
const toggleBookings = async (req, res) => {
    try {
        let queue = await queue_model_1.Queue.findOne().sort({ createdAt: -1 });
        if (!queue) {
            return res.status(404).json({ message: "Queue not found" });
        }
        queue.isBookingsOpen = !queue.isBookingsOpen;
        await queue.save();
        (0, socket_1.emitQueueUpdate)(queue);
        res.json(queue);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.toggleBookings = toggleBookings;
const resetQueue = async (req, res) => {
    try {
        let queue = await queue_model_1.Queue.findOne().sort({ createdAt: -1 });
        if (!queue) {
            return res.status(404).json({ message: "Queue not found" });
        }
        queue.currentNumber = 0;
        queue.lastIssuedNumber = 0;
        queue.isBookingsOpen = true;
        await queue.save();
        // Delete all tickets
        await queue_model_1.Ticket.deleteMany({});
        // Reset savedNumber for all users
        await User_1.User.updateMany({}, { savedNumber: null });
        (0, socket_1.emitQueueUpdate)(queue);
        // Notify all users their tickets are gone
        (0, socket_1.emitTicketUpdate)("all", null);
        res.json({ message: "Queue reset successfully" });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.resetQueue = resetQueue;
const getMyTicket = async (req, res) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({ message: "Authentication required" });
        }
        const ticket = await queue_model_1.Ticket.findOne({ userId }).sort({ createdAt: -1 });
        res.json(ticket);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.getMyTicket = getMyTicket;
//# sourceMappingURL=queue.controller.js.map