import { Server } from "http";
import app from "./app";
import Config from "./app/config";
import { errorlogger, logger } from "./app/utils/logger";

async function main() {
  const server: Server = app.listen(Config.PORT, () => {
    logger.info(`PH HEALTH CARE IS RUNNING ON PORT http://localhost:5000/`);
  });

  const exitHandler = () => {
    if (server) {
      server.close(() => {
        logger.info("Server closed");
      });
    }
    process.exit(1);
  };

  const unexpectedErrorHandler = (error: unknown) => {
    errorlogger.error(error);
    exitHandler();
  };

  process.on("uncaughtException", unexpectedErrorHandler);
  process.on("unhandledRejection", unexpectedErrorHandler);
}

main();
