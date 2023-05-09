import { Request, Response } from "express";

import { AppDataSource } from "../../../database";
import { PlaceCaracterization } from "../../models/PlaceCaracterization";

const manager = AppDataSource.manager;

export const listCaracterizations = async (req: Request, res: Response) => {
    try {
        const builder = manager
            .getRepository(PlaceCaracterization)
            .createQueryBuilder('caracterization')
            .orderBy("caracterization.name", 'DESC');

        const { term, page, perPage } = req.query;

        if (term) {
            builder.where('LOWER(caracterization.name) LIKE :term', {term: `%${term.toString().toLowerCase()}%`})
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

export const createCaracterization = async (req: Request, res: Response) => {
    try {
        const { name } = req.body;

        const caracterization = new PlaceCaracterization();

        caracterization.name = name;

        await manager.save(caracterization);

        return res.status(200).json(caracterization);

    } catch (error) {
        return res.status(500).json(error);
    }
}

export const updateCaracterization = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { name } = req.body;

        const caracterizations = AppDataSource.getRepository(PlaceCaracterization);
        const caracterization = await caracterizations.findOneBy({id: parseInt(id)});

        if (!caracterization) {
            return res.status(404).json({error: {message: "Caracterização não encontrado!"}});
        } 

        caracterization.name = name;

        await manager.save(caracterization);
        return res.status(200).json(caracterization);

    } catch (error) {
        return res.status(500).json(error);
    }
}

export const deleteCaracterization = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        const caracterizations = AppDataSource.getRepository(PlaceCaracterization);
        const caracterization = await caracterizations.findOneBy({id: parseInt(id)});

        if (!caracterization) {
            return res.status(404).json({error: {message: "Caracterização não encontrado!"}});
        }

        await caracterizations.remove(caracterization);
        return res.status(200).json({message: "Caracterização removido com sucesso!", caracterization});

    } catch (error) {
        return res.status(500).json(error);
    }
}