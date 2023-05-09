import { Request, Response } from "express";

import { AppDataSource } from "../../../database";
import { EventCategory } from "../../models/EventCategory";

const manager = AppDataSource.manager;

export const listCategories = async (req: Request, res: Response) => {
    try {
        const builder = manager
            .getRepository(EventCategory)
            .createQueryBuilder('category')
            .orderBy("category.name", 'DESC');

        const { term, page, perPage } = req.query;

        if (term) {
            builder.where('LOWER(category.name) LIKE :term', {term: `%${term.toString().toLowerCase()}%`})
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

export const createCategory = async (req: Request, res: Response) => {
    try {
        const { name } = req.body;

        const category = new EventCategory();

        category.name = name;

        await manager.save(category);

        return res.status(200).json(category);

    } catch (error) {
        return res.status(500).json(error);
    }
}

export const updateCategory = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { name } = req.body;

        const categories = AppDataSource.getRepository(EventCategory);
        const category = await categories.findOneBy({id: parseInt(id)});

        if (!category) {
            return res.status(404).json({error: {message: "Categoria não encontrado!"}});
        } 

        category.name = name;

        await manager.save(category);
        return res.status(200).json(category);

    } catch (error) {
        return res.status(500).json(error);
    }
}

export const deleteCategory = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        const categories = AppDataSource.getRepository(EventCategory);
        const category = await categories.findOneBy({id: parseInt(id)});

        if (!category) {
            return res.status(404).json({error: {message: "Categoria não encontrado!"}});
        }

        await categories.remove(category);
        return res.status(200).json({message: "Categoria removido com sucesso!", category});

    } catch (error) {
        return res.status(500).json(error);
    }
}