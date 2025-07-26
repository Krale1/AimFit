import { Router } from "express";
import { register, googleLogin, listUsers, verifyEmail, login } from "../controllers/authController";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.post("/google-login", googleLogin);
router.post("/verify-email", verifyEmail);
router.get("/users", listUsers);

export default router;
