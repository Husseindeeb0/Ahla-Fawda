import { Request, Response } from "express";

export interface AuthRequest extends Request {
  user?: {
    id: string;
    role: string;
  };
}

export interface ErrorResponsePayload {
  message: string;
}

export interface MessageResponsePayload {
  message: string;
}

export interface QueueStatusPayload {
  currentNumber: number;
  lastIssuedNumber: number;
  isBookingsOpen: boolean;
  createdAt?: any;
  updatedAt?: any;
}

export interface TicketPayload {
  number: number;
  userId?: unknown;
  status: "waiting" | "called" | "finished";
  createdByAdmin?: boolean;
  customerName?: string | null;
  createdAt?: any;
  updatedAt?: any;
}

// ---- getQueueStatus ----
export type GetQueueStatusRequest = Request;
export type GetQueueStatusResponse = Response<
  QueueStatusPayload | ErrorResponsePayload
>;

// ---- takeNumber ----
export type TakeNumberRequest = AuthRequest;
export type TakeNumberResponse = Response<TicketPayload | ErrorResponsePayload>;

// ---- incrementNumber ----
export type IncrementNumberRequest = Request;
export type IncrementNumberResponse = Response<
  QueueStatusPayload | ErrorResponsePayload
>;

// ---- decrementNumber ----
export type DecrementNumberRequest = Request;
export type DecrementNumberResponse = Response<
  QueueStatusPayload | ErrorResponsePayload
>;

// ---- toggleBookings ----
export type ToggleBookingsRequest = Request;
export type ToggleBookingsResponse = Response<
  QueueStatusPayload | ErrorResponsePayload
>;

// ---- resetQueue ----
export type ResetQueueRequest = Request;
export type ResetQueueResponse = Response<
  MessageResponsePayload | ErrorResponsePayload
>;

// ---- getMyTicket ----
export type GetMyTicketRequest = AuthRequest;
export type GetMyTicketResponse = Response<
  TicketPayload | null | ErrorResponsePayload
>;

// ---- adminCreateTicket ----
export interface AdminCreateTicketRequest extends AuthRequest {
  body: {
    customerName?: string;
  };
}
export type AdminCreateTicketResponse = Response<
  TicketPayload | ErrorResponsePayload
>;

// ---- getAllTickets ----
export type GetAllTicketsRequest = Request;
export type GetAllTicketsResponse = Response<
  TicketPayload[] | ErrorResponsePayload
>;

// ---- adminRemoveTicket ----
export type AdminRemoveTicketRequest = Request<{ ticketId: string }>;
export type AdminRemoveTicketResponse = Response<
  MessageResponsePayload | ErrorResponsePayload
>;
