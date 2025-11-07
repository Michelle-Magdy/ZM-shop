import express from "express";
import Role from "../models/role.model.js";
import {
  addUser,
  deleteUser,
  getAllUsers,
  getUser,
  getUserPermissions,
  updateUser,
} from "../controllers/user.controller.js";
import { protect, authorize } from "../controllers/auth.controller.js";
import { checkValidMongoId } from "../middlewares/checkValidMongoId.js";

const router = express.Router();

router.use(protect, authorize("admin"));

router.route("/").get(getAllUsers).post(addUser);
router.get("/me/permissions", getUserPermissions);
router.route("/:id").get(checkValidMongoId("id"),getUser).patch(checkValidMongoId("id"),updateUser).delete(checkValidMongoId("id"),deleteUser);

export default router;
