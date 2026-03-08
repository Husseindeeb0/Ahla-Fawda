import { Request, Response } from "express";
interface AuthRequest extends Request {
    user?: {
        id: string;
        role: string;
    };
}
export declare const getQueueStatus: (req: Request, res: Response) => Promise<void>;
export declare const takeNumber: (req: AuthRequest, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const incrementNumber: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const decrementNumber: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const toggleBookings: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const resetQueue: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const getMyTicket: (req: AuthRequest, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export {};
//# sourceMappingURL=queue.controller.d.ts.map