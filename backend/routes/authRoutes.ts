import { Router } from "express";
import { register, googleLogin, listUsers } from "../controllers/authController";

const router = Router();

router.post("/register", register);
router.post("/google-login", googleLogin);
router.get('/users', listUsers);

export default router;
    