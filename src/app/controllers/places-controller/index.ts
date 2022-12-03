import { Request, Response } from "express";

import { AppDataSource } from "../../../database";

import { Place } from "../../models/Place";
import { PlaceSchedule } from "../../models/PlaceSchedule";
import { Type } from "../../models/Type";

const manager = AppDataSource.manager;

export const listPlaces = async (req: Request, res: Response) => {
    try {
        const builder = manager
            .getRepository(Place)
            .createQueryBuilder('place')
            .leftJoinAndSelect('place.address', 'place_address')
            .leftJoinAndSelect('place.type', 'type')
            .leftJoinAndSelect('place.schedules', 'place_schedule')
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
            schedules,
            caracterizations
        } = req.body;

        const place = new Place();

        place.name = name;
        place.description = description;
        place.address = address;
        place.schedules = schedules;
        place.caracterizations = caracterizations;

        const types = AppDataSource.getRepository(Type);
        const type = await types.findOneBy({id: type_id});
        if (type) place.type = type;

        await manager.save(place);

        return res.status(200).json(place);

    } catch (error) {
        return res.status(500).json(error);
    }
}

const handleCreatePlaceSchedule = async (schedules: PlaceSchedule[], place: Place) => {
    await Promise.all(schedules.map((schedule: PlaceSchedule) => {
        const new_schedule = new PlaceSchedule();
    
        new_schedule.week_date = schedule.week_date;
        new_schedule.opening_time = schedule.opening_time;
        new_schedule.close_time = schedule.close_time;
        new_schedule.place = place;
    
        manager.save(new_schedule);
    }));
}

const handleDeletePlaceSchedule = async (schedules: PlaceSchedule[]) => {
    await Promise.all(schedules.map(async (schedule: PlaceSchedule) => {
        const place_schedules = AppDataSource.getRepository(PlaceSchedule);
        const place_schedule = await place_schedules.findOneBy({id: schedule.id});
    
        if (place_schedule) await place_schedules.remove(place_schedule);
    }));
}

const handleUpdatePlaceSchedule = async (schedules: PlaceSchedule[]) => {
    await Promise.all(schedules.map(async (schedule: PlaceSchedule) => {
        const place_schedules = AppDataSource.getRepository(PlaceSchedule);
        const place_schedule = await place_schedules.findOneBy({id: schedule.id});
        if (place_schedule) {
            place_schedule.week_date = schedule.week_date;
            place_schedule.opening_time = schedule.opening_time;
            place_schedule.close_time = schedule.close_time;

            await manager.save(place_schedule);
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
            schedules,
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

        const place_schedule_repo = AppDataSource.getRepository(PlaceSchedule);
        const place_schedules = await place_schedule_repo.find();
        
        const schedules_for_update = schedules.filter((schedule: PlaceSchedule) => place_schedules.find((place_schedule: PlaceSchedule) => place_schedule.id === schedule.id) !== undefined);
        const schedules_for_delete = place_schedules.filter((place_schedule: PlaceSchedule) => !schedules.find((schedule: PlaceSchedule) => place_schedule.id === schedule.id));
        const schedules_for_create = schedules.filter((schedule: PlaceSchedule) => schedule.id === undefined);

        await handleUpdatePlaceSchedule(schedules_for_update);
        await handleDeletePlaceSchedule(schedules_for_delete);
        await handleCreatePlaceSchedule(schedules_for_create, place);

        console.log('place', place.caracterizations)

        await manager.save(place);

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
            return res.status(404).json({error: {message: "Local não encontrado!"}});
        }

        await places.remove(place);
        return res.status(200).json({message: "Local removido com sucesso!", place});

    } catch (error) {
        return res.status(500).json(error);
    }
}