import { Request, Response } from "express";

import { AppDataSource } from "../../../database";
import { Places } from "../../models/Places";
import { PlacesSchedules } from "../../models/PlacesSchedule";
import { Types } from "../../models/Types";

const manager = AppDataSource.manager;

export const listPlaces = async (req: Request, res: Response) => {
    try {
        const builder = manager
            .getRepository(Places)
            .createQueryBuilder('places')
            .leftJoinAndSelect('places.schedules', 'places_schedules')
            .leftJoinAndSelect('places.address', 'places_address')
            .leftJoinAndSelect('places.type', 'types')
            .orderBy("places.name", 'DESC');
            
        const { term, page, perPage } = req.query;

        if (term) {
            builder.where('LOWER(places.name) LIKE :term', {term: `%${term.toString().toLowerCase()}%`})
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

export const createPlace = async (req: Request, res: Response) => {
    try {
        const { 
            name, 
            description,
            category,
            address,
            type_id,
            schedules
        } = req.body;

        const place = new Places();

        place.name = name;
        place.description = description;
        place.category = category;
        place.address = address;
        place.schedules = schedules;

        const types = AppDataSource.getRepository(Types);
        const type = await types.findOneBy({id: type_id});

        if (type) {
            place.type = type_id;
        }

        await manager.save(place);

        return res.status(200).json(place);

    } catch (error) {
        return res.status(500).json(error);
    }
}

export const updatePlace = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { 
            name, 
            description,
            category,
            address,
            type_id,
            schedules
        } = req.body;

        const places = AppDataSource.getRepository(Places);
        const place = await places.findOneBy({id: parseInt(id)});

        if (!place) {
            return res.status(404).json({error: {message: "Local não encontrado!"}});
        } 

        place.name = name;
        place.description = description;
        place.category = category;
        place.address = address;
        place.schedules = schedules;

        if (type_id) {
            const types = AppDataSource.getRepository(Types);
            const type = await types.findOneBy({id: parseInt(type_id)});
            if (type) place.type = type_id;
        }

        await manager.save(place);
        return res.status(200).json(place);

    } catch (error) {
        return res.status(500).json(error);
    }
}

export const deletePlace = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        const places = AppDataSource.getRepository(Places);
        const place = await places.findOneBy({id: parseInt(id)});

        if (!place) {
            return res.status(404).json({error: {message: "Local não encontrado!"}});
        }

        await places.remove(place);
        return res.status(200).json({message: "Local removido com sucesso!", place});

    } catch (error) {
        return res.status(500).json(error);
    }
}