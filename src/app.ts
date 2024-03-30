import cors from "cors";
import express, { Application, Request, Response } from "express";
import globalErrorHandler from "./app/Middlewares/globalErrorHandler";
import notFound from "./app/Middlewares/notFound";
import router from "./app/routes";
import cookieParse from "cookie-parser";

const app: Application = express();

app.use(cors());
app.use(cookieParse());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req: Request, res: Response) => {
  res.json({
    message: "PH-Health care is running ",
  });
});

app.use("/api/v1", router);

app.use(globalErrorHandler);
app.use(notFound);

export default app;
