import express from "express";
import { authorize, protect } from "../controllers/auth.controller.js";
import {
  addCoupon,
  couponExist,
  couponSanitizer,
  getCoupons,
  removeCoupon,
  updateCoupon,
} from "../controllers/coupon.controller.js";
import { checkValidMongoId } from "../middlewares/checkValidMongoId.js";
const router = express.Router();

router.use(protect);

router.get("/exist/:code", couponExist);

router.use(authorize("admin"));

router.route("/").get(getCoupons).post(couponSanitizer, addCoupon);
router
  .route("/:id")
  .patch(checkValidMongoId("id"), couponSanitizer, updateCoupon)
  .delete(removeCoupon);

export default router;
