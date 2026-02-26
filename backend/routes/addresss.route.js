import express from "express";
import {
  addAddress,
  getAddresses,
  getAddressFromLocation,
  getAddress,
  deleteAddress,
  updateAddress,
} from "../controllers/address.controller.js";
import { protect } from "../controllers/auth.controller.js";

const router = express.Router();
router.use(protect);

// Good: static route before dynamic route
router.get("/lookup", getAddressFromLocation);

// CRUD
router.get("/", getAddresses);
router.post("/", addAddress);

router.route("/:id").get(getAddress).delete(deleteAddress).patch(updateAddress);

export default router;
