import express from "express";
import { handleWebhook } from "../controllers/webhookController.js";
import { verifySignature } from "../middleware/verifySignature.js";

const router = express.Router();

router.post("/", (req, res, next) => {
  console.log("EVENT TYPE:", req.headers["x-github-event"]);
  next();
}, verifySignature, handleWebhook);

export default router;
