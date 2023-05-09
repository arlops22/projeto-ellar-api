import { Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";

import { EventAddress } from "./EventAddress";
import { EventCategory } from "./EventCategory";
import { EventImage } from "./EventImage";
import { EventDisponibility } from "./EventDisponibility";

@Entity()
export class Event {

    @PrimaryGeneratedColumn()
    id: number

    @Column()
    name: string

    @Column()
    description: string

    @OneToOne(() => EventAddress, (event_address) => event_address.event, {
        cascade: true,
        nullable: true
    })
    @JoinColumn({name: 'event_addressId'})
    address: EventAddress

    @ManyToOne(() => EventCategory, (event_category) => event_category.events, {nullable: true})
    @JoinColumn({name: 'event_categoryId'})
    category: EventCategory

    @OneToMany(() => EventDisponibility, (disponibility) => disponibility.event, {cascade: true})
    disponibilities: EventDisponibility[]

    @OneToMany(() => EventImage, (image) => image.event, {cascade: true})
    images: EventImage[]
}