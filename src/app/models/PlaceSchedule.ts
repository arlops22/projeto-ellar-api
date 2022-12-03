import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Place } from "./Place";

@Entity()
export class PlaceSchedule {

    @PrimaryGeneratedColumn()
    id: number

    @Column()
    week_date: number

    @Column()
    opening_time: string

    @Column()
    close_time: string

    @ManyToOne(() => Place, (place) => place.schedules)
    @JoinColumn()
    place: Place
    
}