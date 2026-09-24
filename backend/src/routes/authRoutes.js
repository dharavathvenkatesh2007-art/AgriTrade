import { Router } from "express";
import { login, me, register } from "../controllers/authController.js";
import { authenticate } from "../middleware/auth.js";

const router = Router();
router.post("/register", register);
router.post("/login", login);
router.get("/me", authenticate, me);
router.post("/logout", authenticate, (_req, res) => res.json({ success: true, message: "Logged out" }));
export default router;
