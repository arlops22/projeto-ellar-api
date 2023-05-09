import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from "typeorm";

import { PlaceType } from "./PlaceType";
import { Image } from "./Image";

@Entity()
export class PlaceTypeImage extends Image {

    @OneToOne(() => PlaceType, (type) => type.image)
    type: PlaceType
}