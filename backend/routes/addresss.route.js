import express from "express";
import { addAddress, getAddresses } from "../controllers/address.controller.js";
import { protect } from "../controllers/auth.controller.js";

const router = express.Router();
router.use(protect);
router.get("/:userId", getAddresses);
router.post("/", addAddress);
export default router;
