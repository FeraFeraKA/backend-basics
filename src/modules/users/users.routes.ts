import { Router } from "express";
import { UserController } from "./users.controller.js";

const router = Router();

router.post("/", UserController.create);

router.get("/", UserController.list);
router.get("/:id/tasks", UserController.getTasks);
router.get("/:id", UserController.getUser);

export default router;
