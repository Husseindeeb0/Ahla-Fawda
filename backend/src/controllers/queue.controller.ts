import { Request, Response } from "express";
import { Queue, Ticket } from "../models/queue.model";
import { User } from "../models/User";

interface AuthRequest extends Request {
  user?: {
    id: string;
    role: string;
  };
}

export const getQueueStatus = async (req: Request, res: Response) => {
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

export const takeNumber = async (req: AuthRequest, res: Response) => {
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

    res.status(201).json(ticket);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const incrementNumber = async (req: Request, res: Response) => {
  try {
    let queue = await Queue.findOne().sort({ createdAt: -1 });
    if (!queue) {
      return res.status(404).json({ message: "Queue not found" });
    }

    if (queue.currentNumber < queue.lastIssuedNumber) {
      queue.currentNumber += 1;
      await queue.save();

      // Update the ticket status to 'called'
      await Ticket.findOneAndUpdate(
        { number: queue.currentNumber, status: "waiting" },
        { status: "called" },
      );
    }

    res.json(queue);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const decrementNumber = async (req: Request, res: Response) => {
  try {
    let queue = await Queue.findOne().sort({ createdAt: -1 });
    if (!queue) {
      return res.status(404).json({ message: "Queue not found" });
    }

    if (queue.currentNumber > 0) {
      // Find the ticket being unset and change it back to 'waiting'
      await Ticket.findOneAndUpdate(
        { number: queue.currentNumber, status: "called" },
        { status: "waiting" },
      );

      queue.currentNumber -= 1;
      await queue.save();
    }

    res.json(queue);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const toggleBookings = async (req: Request, res: Response) => {
  try {
    let queue = await Queue.findOne().sort({ createdAt: -1 });
    if (!queue) {
      return res.status(404).json({ message: "Queue not found" });
    }

    queue.isBookingsOpen = !queue.isBookingsOpen;
    await queue.save();

    res.json(queue);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const resetQueue = async (req: Request, res: Response) => {
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

    res.json({ message: "Queue reset successfully" });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getMyTicket = async (req: AuthRequest, res: Response) => {
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
