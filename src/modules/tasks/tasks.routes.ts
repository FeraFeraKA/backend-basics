import { Router } from "express";
import { TaskController } from "./tasks.controller.js";

const router = Router();

router.get("/", TaskController.list);

router.post("/", TaskController.create);

router.get("/:id", TaskController.get);

router.patch("/:id", TaskController.update);

router.delete("/:id", TaskController.remove);

export default router;
