import { Router } from "express";
import { buyTicket, getUserTickets } from "../controllers/ticket.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/buyTicket").post(verifyJWT, buyTicket);

router.route("/getAllTickets").get(verifyJWT, getUserTickets);

export default router;