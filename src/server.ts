import { Server } from "http";
import app from "./app";
import Config from "./app/config";

async function main() {
  const server: Server = app.listen(Config.PORT, () => {
    console.log(`PH HEALTH CARE IS RUNNING ON PORT http://localhost:5000/`);
  });
}

main();
