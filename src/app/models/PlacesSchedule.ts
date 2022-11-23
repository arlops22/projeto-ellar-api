import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Places } from "./Places";

@Entity()
export class PlacesSchedules {

    @PrimaryGeneratedColumn()
    id: number

    @Column()
    weekDate: number

    @Column()
    openingTime: string

    @Column()
    closeTime: string

    @ManyToOne(() => Places, (place) => place.schedules)
    @JoinColumn({name: 'placeId'})
    place: Places
    
}