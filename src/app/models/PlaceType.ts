import { Column, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm"

import { Place } from "./Place"
import { PlaceTypeImage } from "./PlaceTypeImage"

@Entity()
export class PlaceType {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    name: string

    @OneToMany(() => Place, (place) => place.type, {
        cascade: true
    })
    places: Place[]

    @OneToOne(() => PlaceTypeImage, (image) => image.type)
    @JoinColumn({name: 'type_imageId'})
    image: PlaceTypeImage

}