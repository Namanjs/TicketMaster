console.log("loading src/routes/event.routes.ts");
import { Router } from "express";
import { createEvent } from "../controllers/event.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.route('/createEvent').post(verifyJWT, createEvent);

export default router;