import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { User } from "../models/User";
import {
  generateAccessToken,
  generateRefreshToken,
  setTokensAsCookies,
  clearTokenCookies,
  REFRESH_TOKEN_SECRET,
} from "../utils/authUtils";
import {
  SignupRequest,
  SignupResponse,
  LoginRequest,
  LoginResponse,
  RefreshTokenRequest,
  RefreshTokenResponse,
  LogoutRequest,
  LogoutResponse,
  GetMeRequest,
  GetMeResponse,
} from "../types/auth.types";

export const signup = async (req: SignupRequest, res: SignupResponse) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const userSnapshot = await User.create({
      name,
      email,
      password: hashedPassword,
      role: "user",
    });

    const accessToken = generateAccessToken({
      id: userSnapshot._id.toString(),
      role: userSnapshot.role,
    });
    const refreshToken = generateRefreshToken({
      id: userSnapshot._id.toString(),
      role: userSnapshot.role,
    });

    // Save refresh token in DB
    await User.findByIdAndUpdate(userSnapshot._id, { refreshToken });

    setTokensAsCookies(res, accessToken, refreshToken);

    res.status(201).json({
      user: {
        id: userSnapshot._id,
        name: userSnapshot.name,
        email: userSnapshot.email,
        role: userSnapshot.role,
        savedNumber: userSnapshot.savedNumber,
      },
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const login = async (req: LoginRequest, res: LoginResponse) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      console.log(`Login failed: No user found for email ${email}`);
      return res.status(404).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log(`Login failed: Invalid password for user ${email}`);
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const accessToken = generateAccessToken({
      id: user._id.toString(),
      role: user.role,
    });
    const refreshToken = generateRefreshToken({
      id: user._id.toString(),
      role: user.role,
    });

    // Save refresh token in DB
    user.refreshToken = refreshToken;
    await user.save();

    setTokensAsCookies(res, accessToken, refreshToken);

    res.json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        savedNumber: user.savedNumber,
      },
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const refreshToken = async (
  req: RefreshTokenRequest,
  res: RefreshTokenResponse,
) => {
  try {
    const token = req.cookies.refreshToken;
    if (!token) {
      return res.status(401).json({ message: "Refresh token not found" });
    }

    const decoded = jwt.verify(token, REFRESH_TOKEN_SECRET) as any;
    const user = await User.findById(decoded.id);

    if (!user || user.refreshToken !== token) {
      return res.status(403).json({ message: "Invalid refresh token" });
    }

    const newAccessToken = generateAccessToken({
      id: user._id.toString(),
      role: user.role,
    });
    const newRefreshToken = generateRefreshToken({
      id: user._id.toString(),
      role: user.role,
    });

    // Update refresh token in DB
    user.refreshToken = newRefreshToken;
    await user.save();

    setTokensAsCookies(res, newAccessToken, newRefreshToken);

    res.json({ message: "Token refreshed successfully" });
  } catch (error) {
    res.status(403).json({ message: "Token refresh failed" });
  }
};

export const logout = async (req: LogoutRequest, res: LogoutResponse) => {
  try {
    const token = req.cookies.refreshToken;
    if (token) {
      // Find user with this refresh token and remove it
      await User.findOneAndUpdate(
        { refreshToken: token },
        { refreshToken: null },
      );
    }

    clearTokenCookies(res);
    res.json({ message: "Logged out successfully" });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getMe = async (req: GetMeRequest, res: GetMeResponse) => {
  try {
    if (!req.user?.id) {
      return res.status(401).json({ message: "Not authenticated" });
    }
    const user = await User.findById(req.user.id).select(
      "-password -refreshToken",
    );
    res.json(user);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
