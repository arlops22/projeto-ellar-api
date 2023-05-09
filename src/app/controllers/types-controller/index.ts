import { Request, Response } from "express";

import { AppDataSource } from "../../../database";
import { PlaceType } from "../../models/PlaceType";
import { s3Upload } from "../../config/s3-service";
import { PlaceTypeImage } from "../../models/PlaceTypeImage";

const manager = AppDataSource.manager;

export const listTypes = async (req: Request, res: Response) => {
    try {
        const builder = manager
            .getRepository(PlaceType)
            .createQueryBuilder('type')
            .orderBy("type.name", 'DESC');

        const { term, page, perPage } = req.query;

        if (term) {
            builder.where('LOWER(type.name) LIKE :term', {term: `%${term.toString().toLowerCase()}%`})
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

        const type = new PlaceType();

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

        const types = AppDataSource.getRepository(PlaceType);
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

export const uploadTypeImage = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        const types = AppDataSource.getRepository(PlaceType);
        const type = await types.findOneBy({id: parseInt(id)});

        if (!type) {
            return res.status(404).json({error: {message: "Evento não encontrado!"}});
        }

        if (!req.file) {
            return res.status(404).json({error: {message: "Imagem não encontrada!"}})
        }

        const s3_result = await s3Upload(req.file);
        
        const image = new PlaceTypeImage();
    
        image.path = s3_result.Location;
        image.type = type;
        
        type.image = image;
        
        await manager.save(image);

        return res.status(200).json(image);
    } catch (error) {
        return res.status(500).json(error);
    }
}

export const deleteType = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        const types = AppDataSource.getRepository(PlaceType);
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