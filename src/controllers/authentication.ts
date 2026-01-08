//this is where you write your databse actions for authentication and user management

import express, { response } from 'express';
import { getUserByEmail, createUser, getUserByID } from '../db/users';
import {random, authentication} from '../helpers';


export const login = async (req: express.Request, res: express.Response) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.sendStatus(400);
        }

        const user1 = await getUserByEmail(email).select('+authentication.salt +authentication.passwordHash');

        if (!user1){
            return res.sendStatus(400);
        };

        const expectedHash = authentication(user1.authentication.salt, password);
        
        if (user1.authentication.passwordHash != expectedHash){
            return res.sendStatus(403);
        }
        
        const salt = random();
        user1.authentication.sessionToken = authentication(salt, user1._id.toString());

        await user1.save();

        res.cookie('KACPER-AUTH', user1.authentication.sessionToken, {domain: 'localhost', path: '/'});
        return res.status(200).json(user1).end();

    }
    catch (error) {
        console.log(error);
        return res.sendStatus(400);
    }
}

export const register = async (req: express.Request, res: express.Response) => {
    try {
        const { username, email, password } = req.body;

        if (!username || !email || !password) {
            return res.sendStatus(400);
        }

        const existingUser = await getUserByEmail(email);

        if (existingUser){
            return res.sendStatus(400);
        }

        const salt = random();
        const user = await createUser({
            email,
            username,
            authentication: {
                salt,
                passwordHash: authentication(salt, password),
            },
        });

        return res.status(200).json(user).end();

    } catch (error) {
        console.log(error);
        return res.sendStatus(400);
    }    
}

export const updatePassword = async (req: express.Request, res: express.Response) => {
  try {
    console.log("hit updatePassword");

    const { id } = req.params;
    const body = req.body || {};
    const { newPassword, currentPassword } = body;

    if (!id || !newPassword || !currentPassword) {
      console.log("missing fields");
      return res.sendStatus(400);
    }

    const user = await getUserByID(id).select('+authentication.salt +authentication.passwordHash');

    if (!user) {
      return res.sendStatus(404);
    }

    const providedHash = authentication(user.authentication.salt, currentPassword);

    if (providedHash !== user.authentication.passwordHash) {
    return res.status(403).json({ message: "Current password incorrect" });
    }


    const salt = random();
    user.authentication.salt = salt;
    user.authentication.passwordHash = authentication(salt, newPassword);

    await user.save();

    return res.sendStatus(204);
  } catch (err) {
    console.error("updatePassword error:", err);
    return res.sendStatus(500);
  }
};
