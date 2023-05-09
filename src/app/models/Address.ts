import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";


@Entity()
export abstract class Address {

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
}