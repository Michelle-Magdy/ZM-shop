import express from 'express';
import { authorize, protect } from '../controllers/auth.controller.js';
import { addCoupon, couponExist, couponSanitizer, getCoupons, removeCoupon, updateCoupon } from '../controllers/coupon.controller.js';
const router = express.Router();

router.use(protect);

router.get('/exist/:code', couponExist);

router.use(authorize('admin'));

router.route('/:id')
.patch(couponSanitizer, updateCoupon)
.delete(removeCoupon);

router.route('/')
.get(getCoupons)
.post(couponSanitizer, addCoupon);


export default router;