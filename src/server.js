import app from "./app/index.js";
import mongoDBConnection from "./config/db.js";
import { hostname, port } from "./app/secret.js";

// app listen
app.listen(port, () => {
  mongoDBConnection();
  console.log(
    `server is running on http://localhost:${port} or http://${hostname}:${port}`
      .bgGreen.red
  );
});

process.on("unhandledRejection", (error) => {
  console.log(error.name, error.message);
  process.exit(1);
});
