import express from 'express';
import { addUser, deleteUser, getAllUsers, getUser, updateUser } from '../controllers/user.controller.js';

const router = express.Router();

router.route('/')
.get(getAllUsers)
.post(addUser)

router.route('/:id')
.get(getUser)
.patch(updateUser)
.delete(deleteUser);

export default router;