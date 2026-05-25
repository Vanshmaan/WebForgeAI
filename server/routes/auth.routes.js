import express from "express";
import { googleAuth } from "../controllers/auth.controller.js";
import { logout } from "../controllers/auth.controller.js";

const authRouter = express.Router();

authRouter.post("/google", (req, res, next) => {
  console.log("🔥 ROUTE HIT WORKING");
  next();
}, googleAuth);
authRouter.get("/logout",logout)

export default authRouter;