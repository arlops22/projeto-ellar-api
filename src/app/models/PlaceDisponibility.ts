import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm"

import { Place } from "./Place"

@Entity()
export class PlaceDisponibility {

    @PrimaryGeneratedColumn()
    id: number

    @Column()
    week_date: number

    @Column()
    opening_time: string

    @Column()
    close_time: string

    @ManyToOne(() => Place, (place) => place.disponibilities)
    @JoinColumn()
    place: Place
    
}