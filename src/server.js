import app from "./app/index.js";
import mongoDBConnection from "./config/db.js";
import { hostname, port } from "./app/secret.js";
import { errorLogger, logger } from "./helper/logger.mjs";

// app listen
app.listen(port, () => {
  mongoDBConnection();
  logger.info(
    `server is running on http://localhost:${port} or http://${hostname}:${port}`
  );
});

process.on("unhandledRejection", (error) => {
  errorLogger.error(error);
  process.exit(1);
});

process.on("uncaughtException", (error) => {
  errorLogger.error(error);
  process.exit(1);
});
