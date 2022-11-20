import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { PlacesAddress } from "./PlacesAddress";
import { Types } from "./Types";

@Entity()
export class Places {

    @PrimaryGeneratedColumn()
    id!: number

    @Column()
    name: string

    @Column()
    description: string

    @Column()
    category: string

    @OneToOne(() => PlacesAddress, (place_address) => place_address.place, {
        cascade: true
    })
    @JoinColumn()
    address: PlacesAddress

    @OneToOne(() => Types, (type) => type.id, {
        cascade: true
    })
    @JoinColumn()
    type: Types
    
}