import express from 'express';
import { addFAQ, deleteFAQ, getAllFAQ, updateFAQ } from '../controllers/FAQ.controller.js';

const router = express.Router();

router.route('/')
.get(getAllFAQ)
.post(addFAQ);

router.route('/:id')
.delete(deleteFAQ)
.patch(updateFAQ);

export default router;