import express from "express";
import bodyParser from "body-parser";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(bodyParser.json());


app.get("/", (req, res) => {
    res.send("RepoGuardian Webhook Server Running");
});

const PORT = process.env.PORT;

app.listen(PORT, () => {
    console.log(`RepoGuardian running on port ${PORT}`);
});
