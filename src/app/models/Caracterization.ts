import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Caracterization {

    @PrimaryGeneratedColumn()
    id: number

    @Column()
    name: string

}