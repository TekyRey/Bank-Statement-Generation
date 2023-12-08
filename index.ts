// src/index.ts
import * as express from "express";
import * as bodyParser from "body-parser";
import router from "./api/src/router";

const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use("/api", router);

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
