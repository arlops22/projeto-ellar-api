import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Places } from "./Places";

@Entity()
export class Types {

    @PrimaryGeneratedColumn()
    id: number

    @Column()
    name: string
    
    @OneToMany(() => Places, (place) => place.type, {
        cascade: true
    })
    places: Places[]

}