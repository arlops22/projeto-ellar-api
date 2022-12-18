import { Request, Response } from "express";

import { AppDataSource } from "../../../database";

import { Place } from "../../models/Place";
import { PlaceImage } from "../../models/PlaceImage";
import { PlaceDisponibility } from "../../models/PlaceDisponibility";
import { Type } from "../../models/Type";

const manager = AppDataSource.manager;

export const listPlaces = async (req: Request, res: Response) => {
    try {
        const builder = manager
            .getRepository(Place)
            .createQueryBuilder('place')
            .leftJoinAndSelect('place.address', 'place_address')
            .leftJoinAndSelect('place.type', 'type')
            .leftJoinAndSelect('place.disponibilities', 'place_disponibility')
            .leftJoinAndSelect('place.images', 'place_image')
            .leftJoinAndSelect('place.caracterizations', 'caracterization')
            .orderBy("place.name", 'DESC');
            
        const { term, page, perPage } = req.query;

        if (term) {
            builder.where('LOWER(place.name) LIKE :term', {term: `%${term.toString().toLowerCase()}%`})
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
            address,
            type_id,
            disponibilities,
            caracterizations
        } = req.body;

        // console.log('req.body', req.body)

        const place = new Place();

        place.name = name;
        place.description = description;
        place.address = address;
        place.disponibilities = disponibilities;
        place.caracterizations = caracterizations;

        const types = AppDataSource.getRepository(Type);
        const type = await types.findOneBy({id: type_id});
        if (type) place.type = type;

        await manager.save(place);

        return res.status(200).json(place);

    } catch (error) {
        console.log('error', error)
        return res.status(500).json(error);
    }
}

const handleCreatePlaceDisponibility = async (disponibilities: PlaceDisponibility[], place: Place) => {
    await Promise.all(disponibilities.map((disponibility: PlaceDisponibility) => {
        const new_disponibility = new PlaceDisponibility();
    
        new_disponibility.week_date = disponibility.week_date;
        new_disponibility.opening_time = disponibility.opening_time;
        new_disponibility.close_time = disponibility.close_time;
        new_disponibility.place = place;
    
        manager.save(new_disponibility);
    }));
}

const handleDeletePlaceDisponibility = async (disponibilities: PlaceDisponibility[]) => {
    await Promise.all(disponibilities.map(async (disponibility: PlaceDisponibility) => {
        const place_disponibilities = AppDataSource.getRepository(PlaceDisponibility);
        const place_disponibility = await place_disponibilities.findOneBy({id: disponibility.id});
    
        if (place_disponibility) await place_disponibilities.remove(place_disponibility);
    }));
}

const handleUpdatePlaceDisponibility = async (disponibilities: PlaceDisponibility[]) => {
    await Promise.all(disponibilities.map(async (disponibility: PlaceDisponibility) => {
        const place_disponibilities = AppDataSource.getRepository(PlaceDisponibility);
        const place_disponibility = await place_disponibilities.findOneBy({id: disponibility.id});
        if (place_disponibility) {
            place_disponibility.week_date = disponibility.week_date;
            place_disponibility.opening_time = disponibility.opening_time;
            place_disponibility.close_time = disponibility.close_time;

            await manager.save(place_disponibility);
        }
    }));
}

export const updatePlace = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { 
            name, 
            description,
            address,
            type_id,
            disponibilities,
            caracterizations
        } = req.body;

        const places = AppDataSource.getRepository(Place);
        const place = await places.findOneBy({id: parseInt(id)});

        if (!place) {
            return res.status(404).json({error: {message: "Local não encontrado!"}});
        } 

        place.name = name;
        place.description = description;
        place.address = address;
        place.caracterizations = caracterizations;

        if (type_id) {
            const types = AppDataSource.getRepository(Type);
            const type = await types.findOneBy({id: parseInt(type_id)});
            if (type) place.type = type;
        }

        const place_disponibility_repo = AppDataSource.getRepository(PlaceDisponibility);
        const place_disponibilities = await place_disponibility_repo.find();
        
        const disponibilities_for_update = disponibilities.filter((disponibility: PlaceDisponibility) => place_disponibilities.find((place_disponibility: PlaceDisponibility) => place_disponibility.id === disponibility.id) !== undefined);
        const disponibilities_for_delete = place_disponibilities.filter((place_disponibility: PlaceDisponibility) => !disponibilities.find((disponibility: PlaceDisponibility) => place_disponibility.id === disponibility.id));
        const disponibilities_for_create = disponibilities.filter((disponibility: PlaceDisponibility) => disponibility.id === undefined);

        await handleUpdatePlaceDisponibility(disponibilities_for_update);
        await handleDeletePlaceDisponibility(disponibilities_for_delete);
        await handleCreatePlaceDisponibility(disponibilities_for_create, place);

        await manager.save(place);

        return res.status(200).json(place);

    } catch (error) {
        return res.status(500).json(error);
    }
}

export const uploadImage = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        const places = AppDataSource.getRepository(Place);
        const place = await places.findOneBy({id: parseInt(id)});

        if (!place) {
            return res.status(404).json({error: {message: "Local não encontrado!"}});
        }

        if (!req.file) {
            return res.status(404).json({error: {message: "Imagem não encontrada!"}})
        }
        
        const image = new PlaceImage();
    
        image.path = req.file.path;
        image.place = place;
    
        manager.save(image);

        return res.status(200).json({place, file: req.file});
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
            return res.status(404).json({error: {message: "Local não encontrado!"}});
        }

        await places.remove(place);
        return res.status(200).json({message: "Local removido com sucesso!", place});

    } catch (error) {
        return res.status(500).json(error);
    }
}