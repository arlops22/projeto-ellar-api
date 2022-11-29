import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Caracterizations {

    @PrimaryGeneratedColumn()
    id: number

    @Column()
    name: string

}