import cors from "cors";
import express, { Application, Request, Response } from "express";
import globalErrorHandler from "./app/Middlewares/globalErrorHandler";
import notFound from "./app/Middlewares/notFound";
import router from "./app/routes";
import cookieParse from "cookie-parser";

const app: Application = express();

app.use(express.json());
app.use(cookieParse());
app.use(cors());
app.use(express.urlencoded({ extended: true }));

app.use("/api/v1", router);

app.get("/", (req: Request, res: Response) => {
  res.json({
    message: "PH-Health care is running ",
  });
});

app.use(notFound);
app.use(globalErrorHandler);

export default app;
