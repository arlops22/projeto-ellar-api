import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export abstract class Image {

    @PrimaryGeneratedColumn()
    id: number

    @Column()
    path: string
}