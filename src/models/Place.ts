import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Place {

    @PrimaryGeneratedColumn()
    id: number

    @Column()
    name: string

    @Column()
    description: string
    
}