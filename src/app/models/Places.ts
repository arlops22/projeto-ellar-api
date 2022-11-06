import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { PlacesAddress } from "./PlacesAddress";

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
    
}