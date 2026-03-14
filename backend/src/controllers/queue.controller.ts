import { Queue, Ticket } from "../models/queue.model";
import { User } from "../models/User";
import {
  emitQueueUpdate,
  emitTicketUpdate,
  emitTicketsUpdated,
} from "../utils/socket";
import {
  GetQueueStatusRequest,
  GetQueueStatusResponse,
  TakeNumberRequest,
  TakeNumberResponse,
  IncrementNumberRequest,
  IncrementNumberResponse,
  DecrementNumberRequest,
  DecrementNumberResponse,
  ToggleBookingsRequest,
  ToggleBookingsResponse,
  ResetQueueRequest,
  ResetQueueResponse,
  GetMyTicketRequest,
  GetMyTicketResponse,
  AdminCreateTicketRequest,
  AdminCreateTicketResponse,
  GetAllTicketsRequest,
  GetAllTicketsResponse,
  AdminRemoveTicketRequest,
  AdminRemoveTicketResponse,
} from "../types/queue.types";

export const getQueueStatus = async (
  req: GetQueueStatusRequest,
  res: GetQueueStatusResponse,
) => {
  try {
    let queue = await Queue.findOne().sort({ createdAt: -1 });
    if (!queue) {
      queue = await Queue.create({
        currentNumber: 0,
        lastIssuedNumber: 0,
        isBookingsOpen: true,
      });
    }
    res.json(queue);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const takeNumber = async (
  req: TakeNumberRequest,
  res: TakeNumberResponse,
) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: "Authentication required" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.savedNumber) {
      return res.status(400).json({ message: "You already have a number" });
    }

    let queue = await Queue.findOne().sort({ createdAt: -1 });
    if (!queue) {
      queue = await Queue.create({
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

    const ticket = await Ticket.create({
      number: queue.lastIssuedNumber,
      userId: user._id,
      status: "waiting",
    });

    user.savedNumber = queue.lastIssuedNumber;
    await user.save();

    emitQueueUpdate(queue);
    emitTicketUpdate(userId, ticket);
    emitTicketsUpdated();

    res.status(201).json(ticket);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const incrementNumber = async (
  req: IncrementNumberRequest,
  res: IncrementNumberResponse,
) => {
  try {
    let queue = await Queue.findOne().sort({ createdAt: -1 });
    if (!queue) {
      return res.status(404).json({ message: "Queue not found" });
    }

    if (queue.currentNumber < queue.lastIssuedNumber) {
      queue.currentNumber += 1;
      await queue.save();

      // Update the ticket status to 'called'
      const ticket = await Ticket.findOneAndUpdate(
        { number: queue.currentNumber, status: "waiting" },
        { status: "called" },
        { new: true },
      );

      if (ticket && ticket.userId) {
        emitTicketUpdate(ticket.userId.toString(), ticket);
      }

      emitQueueUpdate(queue);
      emitTicketsUpdated();
      res.json(queue);
    } else {
      res
        .status(400)
        .json({ message: "لا يوجد المزيد من الأشخاص في الانتظار" });
    }
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const decrementNumber = async (
  req: DecrementNumberRequest,
  res: DecrementNumberResponse,
) => {
  try {
    let queue = await Queue.findOne().sort({ createdAt: -1 });
    if (!queue) {
      return res.status(404).json({ message: "Queue not found" });
    }

    if (queue.currentNumber > 0) {
      // Find the ticket being unset and change it back to 'waiting'
      const ticket = await Ticket.findOneAndUpdate(
        { number: queue.currentNumber, status: "called" },
        { status: "waiting" },
        { new: true },
      );

      if (ticket && ticket.userId) {
        emitTicketUpdate(ticket.userId.toString(), ticket);
      }

      queue.currentNumber -= 1;
      await queue.save();
    }

    emitQueueUpdate(queue);
    emitTicketsUpdated();
    res.json(queue);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const toggleBookings = async (
  req: ToggleBookingsRequest,
  res: ToggleBookingsResponse,
) => {
  try {
    let queue = await Queue.findOne().sort({ createdAt: -1 });
    if (!queue) {
      return res.status(404).json({ message: "Queue not found" });
    }

    queue.isBookingsOpen = !queue.isBookingsOpen;
    await queue.save();

    emitQueueUpdate(queue);
    res.json(queue);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const resetQueue = async (
  req: ResetQueueRequest,
  res: ResetQueueResponse,
) => {
  try {
    let queue = await Queue.findOne().sort({ createdAt: -1 });
    if (!queue) {
      return res.status(404).json({ message: "Queue not found" });
    }

    queue.currentNumber = 0;
    queue.lastIssuedNumber = 0;
    queue.isBookingsOpen = true;
    await queue.save();

    // Delete all tickets
    await Ticket.deleteMany({});

    // Reset savedNumber for all users
    await User.updateMany({}, { savedNumber: null });

    emitQueueUpdate(queue);
    // Notify all users their tickets are gone
    emitTicketUpdate("all", null);
    emitTicketsUpdated();

    res.json({ message: "Queue reset successfully" });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getMyTicket = async (
  req: GetMyTicketRequest,
  res: GetMyTicketResponse,
) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: "Authentication required" });
    }

    const ticket = await Ticket.findOne({ userId }).sort({ createdAt: -1 });
    res.json(ticket);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const adminCreateTicket = async (
  req: AdminCreateTicketRequest,
  res: AdminCreateTicketResponse,
) => {
  try {
    const { customerName } = req.body;

    let queue = await Queue.findOne().sort({ createdAt: -1 });
    if (!queue) {
      queue = await Queue.create({
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

    const ticket = await Ticket.create({
      number: queue.lastIssuedNumber,
      status: "waiting",
      createdByAdmin: true,
      customerName: customerName || null,
    });

    emitQueueUpdate(queue);
    emitTicketsUpdated();

    res.status(201).json(ticket);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getAllTickets = async (
  req: GetAllTicketsRequest,
  res: GetAllTicketsResponse,
) => {
  try {
    const tickets = await Ticket.find()
      .populate("userId", "name email")
      .sort({ number: 1 });
    res.json(tickets);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const adminRemoveTicket = async (
  req: AdminRemoveTicketRequest,
  res: AdminRemoveTicketResponse,
) => {
  try {
    const { ticketId } = req.params;
    const ticket = await Ticket.findById(ticketId);

    if (!ticket) {
      return res.status(404).json({ message: "Ticket not found" });
    }

    // If it's a regular user ticket, clear their savedNumber
    if (ticket.userId) {
      await User.findByIdAndUpdate(ticket.userId, { savedNumber: null });
      emitTicketUpdate(ticket.userId.toString(), null);
    }

    await Ticket.findByIdAndDelete(ticketId);
    emitTicketsUpdated();

    res.json({ message: "Ticket removed successfully" });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
