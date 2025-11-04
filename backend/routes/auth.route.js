import express from 'express';
import { login } from '../controllers/auth.controller.js';

const router = express.Router();

router.route('/')
.get(login);

export default router;