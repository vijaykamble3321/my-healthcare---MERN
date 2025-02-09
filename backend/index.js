import express from "express";
import path from "path";
import serverConfig from "./serverConfig.js";
import dbConnect from "./db.js";

const app = express();
const port = serverConfig.port;

app.use(express.json());

const dir = path.resolve();
app.use(express.static(path.join(dir,"../frontend")));

//api
try {
    await dbConnect();
  app.listen(port,() => {
    console.log(`app listinig at http://localhost:${port}`);
  });
} catch (error) {
  console.log(error);
}
