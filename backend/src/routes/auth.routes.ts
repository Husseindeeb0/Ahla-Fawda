import express from "express";
import {
  signup,
  login,
  logout,
  getMe,
  refreshToken,
} from "../controllers/auth.controller";
import { verifyToken } from "../middleware/auth.middleware";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);
router.post("/refresh", refreshToken);
router.get("/me", verifyToken, getMe);

export default router;
