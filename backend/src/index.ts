import express from "express";
import routes from "./routes.js";
import migrateToLatest from "./migration.js";

const app = express();
const PORT = process.env.PORT;

app.listen(PORT, async () => {
  console.log(`Server is running on port ${PORT}`);
  console.log("Running database migrations...");
  await migrateToLatest();
  console.log("Database migrations completed.");
  routes(app);
});
