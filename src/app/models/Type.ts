import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Place } from "./Place";

@Entity()
export class Type {

    @PrimaryGeneratedColumn()
    id: number

    @Column()
    name: string
    
    @OneToMany(() => Place, (place) => place.type, {
        cascade: true
    })
    places: Place[]

}