import mongoose from "mongoose";

const QueueSchema = new mongoose.Schema(
  {
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
  },
  { timestamps: true },
);

export const Queue = mongoose.model("Queue", QueueSchema);

const TicketSchema = new mongoose.Schema(
  {
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
      type: mongoose.Schema.Types.ObjectId,
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
  },
  { timestamps: true },
);

export const Ticket = mongoose.model("Ticket", TicketSchema);
