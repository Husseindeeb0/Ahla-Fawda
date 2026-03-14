import { GetQueueStatusRequest, GetQueueStatusResponse, TakeNumberRequest, TakeNumberResponse, IncrementNumberRequest, IncrementNumberResponse, DecrementNumberRequest, DecrementNumberResponse, ToggleBookingsRequest, ToggleBookingsResponse, ResetQueueRequest, ResetQueueResponse, GetMyTicketRequest, GetMyTicketResponse, AdminCreateTicketRequest, AdminCreateTicketResponse, GetAllTicketsRequest, GetAllTicketsResponse, AdminRemoveTicketRequest, AdminRemoveTicketResponse } from "../types/queue.types";
export declare const getQueueStatus: (req: GetQueueStatusRequest, res: GetQueueStatusResponse) => Promise<void>;
export declare const takeNumber: (req: TakeNumberRequest, res: TakeNumberResponse) => Promise<TakeNumberResponse | undefined>;
export declare const incrementNumber: (req: IncrementNumberRequest, res: IncrementNumberResponse) => Promise<IncrementNumberResponse | undefined>;
export declare const decrementNumber: (req: DecrementNumberRequest, res: DecrementNumberResponse) => Promise<DecrementNumberResponse | undefined>;
export declare const toggleBookings: (req: ToggleBookingsRequest, res: ToggleBookingsResponse) => Promise<ToggleBookingsResponse | undefined>;
export declare const resetQueue: (req: ResetQueueRequest, res: ResetQueueResponse) => Promise<ResetQueueResponse | undefined>;
export declare const getMyTicket: (req: GetMyTicketRequest, res: GetMyTicketResponse) => Promise<GetMyTicketResponse | undefined>;
export declare const adminCreateTicket: (req: AdminCreateTicketRequest, res: AdminCreateTicketResponse) => Promise<AdminCreateTicketResponse | undefined>;
export declare const getAllTickets: (req: GetAllTicketsRequest, res: GetAllTicketsResponse) => Promise<void>;
export declare const adminRemoveTicket: (req: AdminRemoveTicketRequest, res: AdminRemoveTicketResponse) => Promise<AdminRemoveTicketResponse | undefined>;
//# sourceMappingURL=queue.controller.d.ts.map