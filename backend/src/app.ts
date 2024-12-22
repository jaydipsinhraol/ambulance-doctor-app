import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import recordsRoutes from "./routes/recordsRoutes";

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.use("/api/records", recordsRoutes);

app.get("/", (req, res) => {
  res.send("Ambulance & Doctor Locator API is running!");
});

export default app;
