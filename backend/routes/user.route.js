import express from "express";
import {
  addUser,
  deleteUser,
  getAllUsers,
  getUser,
  getUserPermissions,
  updateUser,
  updateMe,
  getUsersStats,
} from "../controllers/user.controller.js";
import { protect, authorize } from "../controllers/auth.controller.js";
import { checkValidMongoId } from "../middlewares/checkValidMongoId.js";

const router = express.Router();

router.use(protect);

router.patch("/me", updateMe);
router.get("/me/permissions", getUserPermissions);

router.use(authorize("admin"));

router.route("/").get(getAllUsers).post(addUser);

router.get("/stats", getUsersStats)

router
  .route("/:id")
  .get(checkValidMongoId("id"), getUser)
  .patch(checkValidMongoId("id"), updateUser)
  .delete(checkValidMongoId("id"), deleteUser);


export default router;
