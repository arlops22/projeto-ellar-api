import { Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Caracterization } from "./Caracterization";
import { PlaceAddress } from "./PlaceAddress";
import { PlaceImage } from "./PlaceImage";
import { PlaceSchedule } from "./PlaceSchedule";
import { Type } from "./Type";

@Entity()
export class Place {

    @PrimaryGeneratedColumn()
    id: number

    @Column()
    name: string

    @Column()
    description: string

    @OneToOne(() => PlaceAddress, (place_address) => place_address.place, {
        cascade: true
    })
    @JoinColumn({name: 'place_addressId'})
    address: PlaceAddress

    @ManyToOne(() => Type, (type) => type.places, {nullable: true})
    @JoinColumn()
    type: Type

    @OneToMany(() => PlaceSchedule, (schedule) => schedule.place, {cascade: true})
    schedules: PlaceSchedule[]

    @OneToMany(() => PlaceImage, (image) => image.place, {cascade: true})
    images: PlaceImage[]

    @ManyToMany(() => Caracterization)
    @JoinTable()
    caracterizations: Caracterization[]
}