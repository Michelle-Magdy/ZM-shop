import express from 'express';
import { addUser, deleteUser, getAllUsers, getUser, getUserPermissions, updateUser } from '../controllers/user.controller.js';
import { protect } from '../controllers/auth.controller.js';

const router = express.Router();

router.use(protect);

router.route('/')
.get(getAllUsers)
.post(addUser)

router.route('/:id')
.get(getUser)
.patch(updateUser)
.delete(deleteUser);

router.get('/me/permissions', getUserPermissions);

export default router;