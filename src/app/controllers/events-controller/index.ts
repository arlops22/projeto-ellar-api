import { Request, Response } from "express";

import { AppDataSource } from "../../../database";

import { s3Delete, s3Upload } from "../../config/s3-service";
import { Event } from "../../models/Event";
import { EventCategory } from "../../models/EventCategory";
import { EventDisponibility } from "../../models/EventDisponibility";
import { EventImage } from "../../models/EventImage";

const manager = AppDataSource.manager;

export const listEvents = async (req: Request, res: Response) => {
    try {
        const builder = manager
            .getRepository(Event)
            .createQueryBuilder('event')
            .leftJoinAndSelect('event.address', 'event_address')
            .leftJoinAndSelect('event.category', 'event_category')
            .leftJoinAndSelect('event.disponibilities', 'event_disponibility')
            .leftJoinAndSelect('event.images', 'event_image')
            .orderBy("event.name", 'DESC');
            
        const { term, page, perPage } = req.query;

        if (term) {
            builder.where('LOWER(event.name) LIKE :term', {term: `%${term.toString().toLowerCase()}%`})
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

export const createEvent = async (req: Request, res: Response) => {
    try {
        const { 
            name, 
            description,
            address,
            category_id,
            disponibilities
        } = req.body;

        // console.log('req.body', req.body)

        const event = new Event();

        event.name = name;
        event.description = description;

        if (disponibilities) {
            event.disponibilities = disponibilities;
        }
        if (address) {
            event.address = address;
        }

        const categories = AppDataSource.getRepository(EventCategory);
        const category = await categories.findOneBy({id: category_id});
        if (category) event.category = category;

        await manager.save(event);

        return res.status(200).json(event);

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
            .from(EventDisponibility)
            .where("id = :id", { id: disponibility_id })
            .execute()
    }));
}

export const updateEvent = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { 
            name, 
            description,
            address,
            category_id,
            disponibilities,
            disponibilities_for_delete
        } = req.body;

        const events = AppDataSource.getRepository(Event);
        const event = await events.findOne({
            where: {
                id: parseInt(id)
            },
            relations: {
                address: true,
                category: true,
                disponibilities: true,
                images: true
            }
        })

        if (!event) {
            return res.status(404).json({error: {message: "Evento não encontrado!"}});
        } 

        if (name) event.name = name;
        if (description) event.description = description;

        if (address) event.address = address;

        if (category_id) {
            const categories = AppDataSource.getRepository(EventCategory);
            const category = await categories.findOneBy({id: parseInt(category_id)});
            if (category) event.category = category;
        }

        if (disponibilities_for_delete?.length > 0) {
            await deleteDisponibilities(disponibilities_for_delete);
        }

        if (disponibilities) {
            event.disponibilities = disponibilities;
        }

        await manager.save(event);

        return res.status(200).json(event);

    } catch (error) {
        return res.status(500).json(error);
    }
}

export const uploadEventImage = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        const events = AppDataSource.getRepository(Event);
        const event = await events.findOne({
            where: {
                id: parseInt(id)
            },
            relations: {
                address: true,
                category: true,
                disponibilities: true,
                images: true
            }
        })

        if (!event) {
            return res.status(404).json({error: {message: "Evento não encontrado!"}});
        }

        if (!req.file) {
            return res.status(404).json({error: {message: "Imagem não encontrada!"}})
        }

        const s3_result = await s3Upload(req.file);
        
        const image = new EventImage();
    
        image.path = s3_result.Location;
        image.event = event;
        
        await manager.save(image);

        return res.status(200).json(image);
    } catch (error) {
        return res.status(500).json(error);
    }
}

export const deleteEventImage = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        const images = AppDataSource.getRepository(EventImage);
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

export const deleteEvent = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        const events = AppDataSource.getRepository(Event);
        const event = await events.findOneBy({id: parseInt(id)});

        if (!event) {
            return res.status(404).json({error: {message: "Evento não encontrado!"}});
        }

        await events.remove(event);
        return res.status(200).json({message: "Evento removido com sucesso!", event});

    } catch (error) {
        return res.status(500).json(error);
    }
}