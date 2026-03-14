"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Ticket = exports.Queue = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const QueueSchema = new mongoose_1.default.Schema({
    currentNumber: {
        type: Number,
        default: 0,
    },
    lastIssuedNumber: {
        type: Number,
        default: 0,
    },
    isBookingsOpen: {
        type: Boolean,
        default: true,
    },
    date: {
        type: Date,
        default: Date.now,
    },
}, { timestamps: true });
exports.Queue = mongoose_1.default.model("Queue", QueueSchema);
const TicketSchema = new mongoose_1.default.Schema({
    number: {
        type: Number,
        required: true,
    },
    status: {
        type: String,
        enum: ["waiting", "called", "finished"],
        default: "waiting",
    },
    userId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "User",
        default: null,
    },
    createdByAdmin: {
        type: Boolean,
        default: false,
    },
    customerName: {
        type: String,
        default: null,
    },
}, { timestamps: true });
exports.Ticket = mongoose_1.default.model("Ticket", TicketSchema);
//# sourceMappingURL=queue.model.js.map