import { Request, Response } from "express";

import { AppDataSource } from "../../../database";
import { Types } from "../../models/Types";

const manager = AppDataSource.manager;

export const createType = async (req: Request, res: Response) => {
    try {
        const { name } = req.body;

        const type = new Types();

        type.name = name;

        await manager.save(type);

        return res.status(200).json(type);

    } catch (error) {
        return res.status(500).json(error);
    }
}