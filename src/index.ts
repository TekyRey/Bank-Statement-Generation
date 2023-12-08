// src/index.ts
import * as express from "express";
import * as bodyParser from "body-parser";
import apiRouter from "./api/router";

const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use("/api", apiRouter);

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
