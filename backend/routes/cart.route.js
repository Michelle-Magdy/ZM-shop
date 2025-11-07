import express from 'express';
import { protect } from '../controllers/auth.controller.js';
import { addCartItem, getUserCart, modifyItemQuantity, removeItemFromCart } from '../controllers/cart.controller.js';

const router = express.Router();

router.use(protect);

router.route('/:userId')
.get(getUserCart)
.post(addCartItem)
.patch(modifyItemQuantity, removeItemFromCart)
.delete(removeItemFromCart);

export default router;