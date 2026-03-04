import express from "express";
import router from "./modules/tasks/tasks.routes.js";

const app = express();

app.use(express.json());

app.use("/tasks", router);

app.use((err: any, req: any, res: any, next: any) => {
  if (err.status) {
    return res.status(err.status).json({
      error: {
        message: err.message,
      },
    });
  }

  console.error(err);

  res.status(500).json({
    error: {
      message: "Internal Server Error",
    },
  });
});

app.use((req, res) => {
  res.status(404).json({
    error: {
      message: "Route not found",
    },
  });
});

export default app;
