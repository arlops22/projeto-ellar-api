import { Request, Response } from "express";

import { AppDataSource } from "../../../database";

import { s3Delete, s3Upload } from "../../config/s3-service";
import { Place } from "../../models/Place";
import { PlaceTypeImage } from "../../models/PlaceTypeImage";
import { PlaceDisponibility } from "../../models/PlaceDisponibility";
import { PlaceType } from "../../models/PlaceType";
import { PlaceImage } from "../../models/PlaceImage";

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
        place.disponibilities = disponibilities;
        place.caracterizations = caracterizations;

        if (address) {
            place.address = address;
        }

        const types = AppDataSource.getRepository(PlaceType);
        const type = await types.findOneBy({id: type_id});
        if (type) place.type = type;

        await manager.save(place);

        return res.status(200).json(place);

    } catch (error) {
        console.log('error', error)
        return res.status(500).json(error);
    }
}

const deleteDisponibilities = async (disponibility_ids: number[]) => {
    await Promise.all(disponibility_ids.map(async (disponibility_id: number) => {
        await manager
            .createQueryBuilder()
            .delete()
            .from(PlaceDisponibility)
            .where("id = :id", { id: disponibility_id })
            .execute()
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
            caracterizations,
            disponibilities,
            disponibilities_for_delete
        } = req.body;

        const places = AppDataSource.getRepository(Place);
        const place = await places.findOne({
            where: {
                id: parseInt(id)
            },
            relations: {
                address: true,
                type: true,
                disponibilities: true,
                images: true,
                caracterizations: true
            }
        })

        if (!place) {
            return res.status(404).json({error: {message: "Local não encontrado!"}});
        } 

        if (name) place.name = name;
        if (description) place.description = description;

        if (address) place.address = address;
        if (caracterizations) place.caracterizations = caracterizations;

        if (type_id) {
            const types = AppDataSource.getRepository(PlaceType);
            const type = await types.findOneBy({id: parseInt(type_id)});
            if (type) place.type = type;
        }

        if (disponibilities_for_delete?.length > 0) {
            await deleteDisponibilities(disponibilities_for_delete);
        }

        if (disponibilities) {
            place.disponibilities = disponibilities;
        }

        await manager.save(place);

        return res.status(200).json(place);

    } catch (error) {
        return res.status(500).json(error);
    }
}

export const uploadPlaceImage = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        const places = AppDataSource.getRepository(Place);
        const place = await places.findOne({
            where: {
                id: parseInt(id)
            },
            relations: {
                address: true,
                type: true,
                disponibilities: true,
                images: true,
                caracterizations: true
            }
        })

        if (!place) {
            return res.status(404).json({error: {message: "Local não encontrado!"}});
        }

        if (!req.file) {
            return res.status(404).json({error: {message: "Imagem não encontrada!"}})
        }

        const s3_result = await s3Upload(req.file);
        
        const image = new PlaceImage();
    
        image.path = s3_result.Location;
        image.place = place;
        
        await manager.save(image);

        return res.status(200).json(image);
    } catch (error) {
        return res.status(500).json(error);
    }
}

export const deleteImage = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        const images = AppDataSource.getRepository(PlaceImage);
        const image = await images.findOneBy({id: parseInt(id)});

        if (!image) {
            return res.status(404).json({error: {message: "Imagem não encontrada!"}})
        }

        const s3_result = await s3Delete(image);
        console.log('s3_result', s3_result)
        
        await images.remove(image);

        return res.status(200).json({message: "Imagem removida com sucesso!", image});
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