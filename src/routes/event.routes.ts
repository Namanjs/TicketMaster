console.log("loading src/routes/event.routes.ts");
import { Router } from "express";
import { createEvent, getAllEvent, getEventById } from "../controllers/event.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.route('/createEvent').post(verifyJWT, createEvent);

router.route('/getEvents').get(getAllEvent);

router.route("/getEventById/:eventId").get(getEventById);

export default router;