import { Column, Entity, PrimaryGeneratedColumn } from "typeorm"

@Entity()
export class PlaceCaracterization {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    name: string
}