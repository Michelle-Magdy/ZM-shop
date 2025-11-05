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

const router = express.Router();

router.use(protect, authorize("admin"));

router.route("/").get(getAllUsers).post(addUser);

router.route("/:id").get(getUser).patch(updateUser).delete(deleteUser);

router.get("/me/permissions", getUserPermissions);

export default router;
