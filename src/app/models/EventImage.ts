import { Entity, JoinColumn, ManyToOne } from "typeorm";

import { Image } from "./Image";
import { Event } from "./Event";

@Entity()
export class EventImage extends Image {

    @ManyToOne(() => Event, (event) => event.images)
    @JoinColumn()
    event: Event
    
}