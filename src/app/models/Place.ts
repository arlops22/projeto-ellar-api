import { Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";

import { PlaceAddress } from "./PlaceAddress";
import { PlaceType } from "./PlaceType";
import { PlaceDisponibility } from "./PlaceDisponibility";
import { PlaceImage } from "./PlaceImage";
import { PlaceCaracterization } from "./PlaceCaracterization";


@Entity()
export class Place {

    @PrimaryGeneratedColumn()
    id: number

    @Column()
    name: string

    @Column()
    description: string

    @OneToOne(() => PlaceAddress, (place_address) => place_address.place, {
        cascade: true,
        nullable: true
    })
    @JoinColumn({name: 'place_addressId'})
    address: PlaceAddress

    @ManyToOne(() => PlaceType, (type) => type.places, {nullable: true})
    @JoinColumn({name: 'placeTypeId'})
    type: PlaceType

    @OneToMany(() => PlaceDisponibility, (disponibility) => disponibility.place, {cascade: true})
    disponibilities: PlaceDisponibility[]

    @OneToMany(() => PlaceImage, (image) => image.place, {cascade: true})
    images: PlaceImage[]

    @ManyToMany(() => PlaceCaracterization)
    @JoinTable()
    caracterizations: PlaceCaracterization[]
}