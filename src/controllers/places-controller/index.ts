import { Request, Response } from "express";

import { AppDataSource } from "../../database";
import { Place } from "../../models/Place";

export const listPlaces = async (req: Request, res: Response) => {
    try {
        const places = await AppDataSource.manager.find(Place);
        return res.status(200).json(places);
    } catch (error) {
        return res.status(500).json(error);
    }
}

export const createPlace = async (req: Request, res: Response) => {
    try {
        const { name, description } = req.body;

        const place = new Place();

        place.name = name;
        place.description = description;

        await AppDataSource.manager.save(place);

        return res.status(200).json(place);

    } catch (error) {
        return res.status(500).json(error);
    }
}

export const updatePlace = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { name, description } = req.body;

        const places = AppDataSource.getRepository(Place);

        const place = await places.findOneBy({id: parseInt(id)});

        if (!place) {
            return res.status(401).json({error: {message: "Local não encontrado!"}});
        } 
        
        place.name = name;
        place.description = description;

        await AppDataSource.manager.save(place);
        return res.status(200).json(place);

    } catch (error) {
        return res.status(500).json(error);
    }
}

export const deletePlace = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        const places = AppDataSource.getRepository(Place);

        const place = await places.findOneBy({id: parseInt(id)});
        if (!place) {
            return res.status(401).json({error: {message: "Local não encontrado!"}});
        }
        await places.remove(place);
        return res.status(200).json({message: "Local removido com sucesso!", place});

    } catch (error) {
        return res.status(500).json(error);
    }
}