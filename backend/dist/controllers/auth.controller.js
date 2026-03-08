"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMe = exports.logout = exports.refreshToken = exports.login = exports.signup = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_1 = require("../models/User");
const authUtils_1 = require("../utils/authUtils");
const signup = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const existingUser = await User_1.User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }
        const hashedPassword = await bcryptjs_1.default.hash(password, 12);
        const userSnapshot = await User_1.User.create({
            name,
            email,
            password: hashedPassword,
            role: "user",
        });
        const accessToken = (0, authUtils_1.generateAccessToken)({
            id: userSnapshot._id.toString(),
            role: userSnapshot.role,
        });
        const refreshToken = (0, authUtils_1.generateRefreshToken)({
            id: userSnapshot._id.toString(),
            role: userSnapshot.role,
        });
        // Save refresh token in DB
        await User_1.User.findByIdAndUpdate(userSnapshot._id, { refreshToken });
        (0, authUtils_1.setTokensAsCookies)(res, accessToken, refreshToken);
        res.status(201).json({
            user: {
                id: userSnapshot._id,
                name: userSnapshot.name,
                email: userSnapshot.email,
                role: userSnapshot.role,
                savedNumber: userSnapshot.savedNumber,
            },
        });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.signup = signup;
const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User_1.User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        const isMatch = await bcryptjs_1.default.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials" });
        }
        const accessToken = (0, authUtils_1.generateAccessToken)({
            id: user._id.toString(),
            role: user.role,
        });
        const refreshToken = (0, authUtils_1.generateRefreshToken)({
            id: user._id.toString(),
            role: user.role,
        });
        // Save refresh token in DB
        user.refreshToken = refreshToken;
        await user.save();
        (0, authUtils_1.setTokensAsCookies)(res, accessToken, refreshToken);
        res.json({
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                savedNumber: user.savedNumber,
            },
        });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.login = login;
const refreshToken = async (req, res) => {
    try {
        const token = req.cookies.refreshToken;
        if (!token) {
            return res.status(401).json({ message: "Refresh token not found" });
        }
        const decoded = jsonwebtoken_1.default.verify(token, authUtils_1.REFRESH_TOKEN_SECRET);
        const user = await User_1.User.findById(decoded.id);
        if (!user || user.refreshToken !== token) {
            return res.status(403).json({ message: "Invalid refresh token" });
        }
        const newAccessToken = (0, authUtils_1.generateAccessToken)({
            id: user._id.toString(),
            role: user.role,
        });
        const newRefreshToken = (0, authUtils_1.generateRefreshToken)({
            id: user._id.toString(),
            role: user.role,
        });
        // Update refresh token in DB
        user.refreshToken = newRefreshToken;
        await user.save();
        (0, authUtils_1.setTokensAsCookies)(res, newAccessToken, newRefreshToken);
        res.json({ message: "Token refreshed successfully" });
    }
    catch (error) {
        res.status(403).json({ message: "Token refresh failed" });
    }
};
exports.refreshToken = refreshToken;
const logout = async (req, res) => {
    try {
        const token = req.cookies.refreshToken;
        if (token) {
            // Find user with this refresh token and remove it
            await User_1.User.findOneAndUpdate({ refreshToken: token }, { refreshToken: null });
        }
        (0, authUtils_1.clearTokenCookies)(res);
        res.json({ message: "Logged out successfully" });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.logout = logout;
const getMe = async (req, res) => {
    try {
        const user = await User_1.User.findById(req.user.id).select("-password -refreshToken");
        res.json(user);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.getMe = getMe;
//# sourceMappingURL=auth.controller.js.map