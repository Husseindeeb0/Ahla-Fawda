import { SignupRequest, SignupResponse, LoginRequest, LoginResponse, RefreshTokenRequest, RefreshTokenResponse, LogoutRequest, LogoutResponse, GetMeRequest, GetMeResponse } from "../types/auth.types";
export declare const signup: (req: SignupRequest, res: SignupResponse) => Promise<SignupResponse | undefined>;
export declare const login: (req: LoginRequest, res: LoginResponse) => Promise<LoginResponse | undefined>;
export declare const refreshToken: (req: RefreshTokenRequest, res: RefreshTokenResponse) => Promise<RefreshTokenResponse | undefined>;
export declare const logout: (req: LogoutRequest, res: LogoutResponse) => Promise<void>;
export declare const getMe: (req: GetMeRequest, res: GetMeResponse) => Promise<GetMeResponse | undefined>;
//# sourceMappingURL=auth.controller.d.ts.map