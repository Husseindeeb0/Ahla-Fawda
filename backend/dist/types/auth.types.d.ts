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
export interface UserResponsePayload {
    user: {
        id: unknown;
        name: string;
        email: string;
        role: string;
        savedNumber?: number | null | undefined;
    };
}
export interface MessageResponsePayload {
    message: string;
}
export type SignupRequest = Request<{}, any, {
    name: string;
    email: string;
    password: string;
}>;
export type SignupResponse = Response<UserResponsePayload | ErrorResponsePayload>;
export type LoginRequest = Request<{}, any, {
    email: string;
    password: string;
}>;
export type LoginResponse = Response<UserResponsePayload | ErrorResponsePayload>;
export type RefreshTokenRequest = Request;
export type RefreshTokenResponse = Response<MessageResponsePayload | ErrorResponsePayload>;
export type LogoutRequest = Request;
export type LogoutResponse = Response<MessageResponsePayload | ErrorResponsePayload>;
export type GetMeRequest = AuthRequest;
export type GetMeResponse = Response<any | ErrorResponsePayload>;
//# sourceMappingURL=auth.types.d.ts.map