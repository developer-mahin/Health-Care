import cookieParse from "cookie-parser";
import cors from "cors";
import express, { Application, Request, Response } from "express";
import globalErrorHandler from "./app/Middlewares/globalErrorHandler";
import notFound from "./app/Middlewares/notFound";
import { AppointmentServices } from "./app/modules/Appointment/appointment.service";
import router from "./app/routes";
import cron from "node-cron";

const app: Application = express();

app.use(express.json());
app.use(cookieParse());
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);
app.use(express.urlencoded({ extended: true }));

cron.schedule("* * * * *", () => {
  try {
    AppointmentServices.cancelUnpaidAppointment();
  } catch (error) {
    console.error(error);
  }
});

app.use("/api/v1", router);

app.get("/", (req: Request, res: Response) => {
  res.json({
    message: "PH-Health care is running ",
  });
});

app.use(notFound);
app.use(globalErrorHandler);

export default app;
