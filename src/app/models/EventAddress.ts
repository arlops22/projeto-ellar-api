import { Entity, OneToOne } from "typeorm";

import { Place } from "./Place";
import { Address } from "./Address";
import { Event } from "./Event";


@Entity()
export class EventAddress extends Address{

    @OneToOne(() => Place, (place) => place.address)
    event: Event
}