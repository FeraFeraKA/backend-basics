import express from "express";
import router from "./modules/tasks/tasks.routes.js";
import {
  errorHandler,
  routeHandler,
} from "./shared/middleware/errorHandler.js";
import { requestLogger } from "./shared/middleware/requestLogger.js";

const app = express();

app.use(requestLogger);

app.use(express.json());

app.use("/tasks", router);

app.use(routeHandler);

app.use(errorHandler);

export default app;
