import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

import { Event } from "./Event";

@Entity()
export class EventDisponibility {

    @PrimaryGeneratedColumn()
    id: number

    @Column()
    date: string

    @Column()
    start_time: string

    @Column()
    end_time: string

    @ManyToOne(() => Event, (event) => event.disponibilities)
    @JoinColumn()
    event: Event
    
}