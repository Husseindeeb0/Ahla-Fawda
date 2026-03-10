export interface QueueStatus {
  currentNumber: number;
  lastIssuedNumber: number;
  isBookingsOpen: boolean;
}

export interface Ticket {
  _id: string;
  number: number;
  status: "waiting" | "called" | "finished";
  userId: string | null;
  createdByAdmin: boolean;
  customerName: string | null;
  createdAt: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: "user" | "admin";
  savedNumber: number | null;
}
