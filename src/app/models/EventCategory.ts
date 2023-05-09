import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

import { Event } from "./Event";

@Entity()
export class EventCategory {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    name: string
    
    @OneToMany(() => Event, (event) => event.category, {
        cascade: true
    })
    events: Event[]

}