import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Place } from "./Place";

@Entity()
export class PlaceAddress {

    @PrimaryGeneratedColumn()
    id: number

    @Column()
    cep: string

    @Column()
    address: string

    @Column()
    complement: string

    @Column()
    neighborhood: string

    @Column()
    number: string

    @Column()
    city: string

    @Column()
    state: string

    @Column()
    latitude: number

    @Column()
    longitude: number
    
    @OneToOne(() => Place, (place) => place.address)
    place: Place
}