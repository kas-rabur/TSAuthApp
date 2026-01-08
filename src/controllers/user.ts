import express from 'express';

import { deleteUserByID, getUserByID, getUsers } from '../db/users';

export const getAllUsers = async (req: express.Request, res: express.Response) => {
    try {
        const users = await getUsers();

        return res.status(200).json(users).end();
    } catch (error) {
        console.log(error);
        return res.sendStatus(400);
    }
}

export const deleteUser = async (req: express.Request, res: express.Response) => {
    try {
        const {id} = req.params;

        const user = await getUserByID(id);

        if (!user){
            return res.sendStatus(400);
        }

        const deletedUser = await deleteUserByID(id);
        return res.json(deletedUser);

    } catch (error) {
        console.log(error);
        return res.sendStatus(400);
    }
}

export const updateUser = async (req: express.Request, res: express.Response) => {
  try {
    const { id } = req.params;
    const { username } = req.body as { username?: string };

    if (!id) return res.sendStatus(400);
    if (!username) return res.sendStatus(400);

    const user = await getUserByID(id);
    if (!user) return res.sendStatus(404);

    user.username = username;
    await user.save();

    return res.status(200).json(user);
  } catch (error) {
    console.log(error);
    return res.sendStatus(400);
  }
};

export const updateEmail = async (req: express.Request, res: express.Response) => {
    try {
        const { id } = req.params;
        const { email } = req.body;

        if (!id || !email) {
            return res.sendStatus(400);
        }
        const user = await getUserByID(id);
        if (!user) {
            return res.sendStatus(404);
        }
        user.email = email;
        await user.save();
        return res.status(200).json(user);

    } catch (error) {
        console.log(error);
        return res.sendStatus(400);
    }
}

