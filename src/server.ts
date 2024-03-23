import { Server } from "http";
import app from "./app";

const port = 5000;

async function main() {
  const server: Server = app.listen(port, () => {
    console.log(`PH HEALTH CARE IS RUNNING ON PORT http://localhost:5000/`);
  });
}

main();
