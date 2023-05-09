import { Entity, JoinColumn, ManyToOne } from "typeorm";

import { Place } from "./Place";
import { Image } from "./Image";

@Entity()
export class PlaceImage extends Image {

    @ManyToOne(() => Place, (place) => place.images)
    @JoinColumn()
    place: Place
}