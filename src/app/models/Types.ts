import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Places } from "./Places";

@Entity()
export class Types {

    @PrimaryGeneratedColumn()
    id!: number

    @Column()
    name: string
    
    @OneToOne(() => Places, (place) => place.type, {nullable: true})
    place: Places

}