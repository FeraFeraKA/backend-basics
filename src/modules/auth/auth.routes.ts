import { Router } from "express";
import { AuthController } from "./auth.controller.js";
import { authGuard } from "../../shared/middleware/authGuard.js";

const router = Router();

router.get("/me", authGuard, AuthController.me);

router.post("/register", AuthController.register);

router.post("/login", AuthController.login);

router.post("/refresh", AuthController.refresh);

router.post("/logout", AuthController.logout);

export default router;
