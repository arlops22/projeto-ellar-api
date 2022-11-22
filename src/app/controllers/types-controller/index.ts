import { Request, Response } from "express";

import { AppDataSource } from "../../../database";
import { Types } from "../../models/Types";

const manager = AppDataSource.manager;

export const listTypes = async (req: Request, res: Response) => {
    try {
        const builder = manager
            .getRepository(Types)
            .createQueryBuilder('types')
            .orderBy("types.name", 'DESC');

        const { term, page, perPage } = req.query;

        if (term) {
            builder.where('LOWER(types.name) LIKE :term', {term: `%${term.toString().toLowerCase()}%`})
        }
        
        const current_page = page ? parseInt(page.toString()) : 1;
        const current_per_page = perPage ? parseInt(perPage.toString()) : 10;

        builder.offset((current_page - 1) * current_per_page).limit(current_per_page);

        const data = await builder.getMany();
        const total_elements = await builder.getCount();

        return res.status(200).json({
            page: current_page,
            total_pages: Math.ceil(total_elements / current_per_page),
            data

        });
    } catch (error) {
        return res.status(500).json(error);
    }
}

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

export const updateType = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { name } = req.body;

        const types = AppDataSource.getRepository(Types);
        const type = await types.findOneBy({id: parseInt(id)});

        if (!type) {
            return res.status(404).json({error: {message: "Tipo não encontrado!"}});
        } 

        type.name = name;

        await manager.save(type);
        return res.status(200).json(type);

    } catch (error) {
        return res.status(500).json(error);
    }
}

export const deleteType = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        const types = AppDataSource.getRepository(Types);
        const type = await types.findOneBy({id: parseInt(id)});

        if (!type) {
            return res.status(404).json({error: {message: "Tipo não encontrado!"}});
        }

        await types.remove(type);
        return res.status(200).json({message: "Tipo removido com sucesso!", type});

    } catch (error) {
        return res.status(500).json(error);
    }
}