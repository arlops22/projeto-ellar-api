import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Places } from "./Places";

@Entity()
export class PlacesAddress {

    @PrimaryGeneratedColumn()
    id!: number

    @Column()
    cep: string

    @Column()
    address: string

    @Column()
    complement: string

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
    
    @OneToOne(() => Places, (place) => place.address)
    place: Places
}