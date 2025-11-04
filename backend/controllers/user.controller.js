import User from "../models/user.model.js"
import { createOne, getAll, getOne, softDeleteOne, updateOne } from "./factoryHandler.js"

export const getAllUsers = getAll(User);

export const getUser = getOne(User); // id must be in params as 'id'

export const addUser = createOne(User); // data should be in request body

export const updateUser = updateOne(User); // id in params and data in request body

export const deleteUser = softDeleteOne(User) // id in params and it's not soft delete