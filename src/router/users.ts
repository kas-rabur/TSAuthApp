import express from "express";
import { getAllUsers, deleteUser, updateUser, updateEmail } from "../controllers/user";
import { isAuthenticated, isOwner } from "../middlewares";
import { updatePassword } from "../controllers/authentication";

export default (router: express.Router) => {
    router.get('/users',isAuthenticated, getAllUsers);
    router.delete('/users/:id', isAuthenticated, isOwner, deleteUser);
    router.patch('/users/:id', isAuthenticated, isOwner, updateUser);
    router.patch('/users/email/:id', isAuthenticated, isOwner, updateEmail);
    router.patch('/users/:id/password', isAuthenticated, isOwner, updatePassword);
};
