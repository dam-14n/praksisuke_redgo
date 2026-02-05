import express from "express";
import routes from "./routes.js";
import { db } from "./database.js";
import "dotenv/config";

const app = express();
const PORT = 80;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    routes(app);
})