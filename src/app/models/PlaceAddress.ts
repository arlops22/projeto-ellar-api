import { Entity, OneToOne } from "typeorm";

import { Place } from "./Place";
import { Address } from "./Address";


@Entity()
export class PlaceAddress extends Address{

    @OneToOne(() => Place, (place) => place.address)
    place: Place
}