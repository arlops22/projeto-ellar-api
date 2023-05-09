import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import { AppDataSource } from "../../../database";
import { User } from "../../models/User";

const manager = AppDataSource.manager;

export const register = async (req: Request, res: Response) => {
    try {
        const { 
            name,
            role,
            email, 
            password 
        } = req.body;
        
        const users = manager.getRepository(User);
        const user_exists = await users.findOne({where: { email }});

        if (user_exists) {
            return res.sendStatus(409);
        }

        const user = new User();

        user.name = name;
        user.role = role;
        user.email = email;
        user.password = password;

        await manager.save(user);

        return res.status(200).json(user);

    } catch (error) {
        return res.status(500).json(error);
    }
}

export const login = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;
        
        const users = manager.getRepository(User);
        const user = await users.findOne({where: { email }});

        if (!user) {
            return res.status(401).json({ error: { message: 'Não autorizado!!' } });
        }

        const is_valid_password = await bcrypt.compare(password, user.password);

        if (!is_valid_password) {
            return res.status(401).json({ error: { message: 'Não autorizado!!' } });
        }

        const token = jwt.sign({ id: user.id }, 'secret', {expiresIn: '1d'});

        const { password: user_password, ...user_attrs } = user

        return res.status(200).json({ user: user_attrs, token })
    } catch (error) {
        return res.status(500).json(error);
    }
}