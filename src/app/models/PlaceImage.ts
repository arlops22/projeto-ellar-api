import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Place } from "./Place";

@Entity()
export class PlaceImage {

    @PrimaryGeneratedColumn()
    id: number

    @Column()
    path: string

    @ManyToOne(() => Place, (place) => place.schedules)
    @JoinColumn()
    place: Place
    
}