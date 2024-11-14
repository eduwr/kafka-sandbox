import express from "express";
import router from "./api/catalog.routes";

const app = express();

app.use(express.json());

app.use(router);

export default app;
