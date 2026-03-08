import { Response } from "express";
declare const ACCESS_TOKEN_SECRET: string;
declare const REFRESH_TOKEN_SECRET: string;
export declare const generateAccessToken: (payload: {
    id: string;
    role: string;
}) => string;
export declare const generateRefreshToken: (payload: {
    id: string;
    role: string;
}) => string;
export declare const setTokensAsCookies: (res: Response, accessToken: string, refreshToken: string) => void;
export declare const clearTokenCookies: (res: Response) => void;
export { ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET };
//# sourceMappingURL=authUtils.d.ts.map