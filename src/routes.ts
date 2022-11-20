import express from "express";

import { 
    listPlaces, 
    createPlace, 
    updatePlace,
    deletePlace
} from "./app/controllers/places-controller";
import { createType } from "./app/controllers/types-controller";

const routes = express.Router();

routes.get('/places', listPlaces);
routes.post('/place', createPlace);
routes.patch('/place/:id', updatePlace);
routes.delete('/place/:id', deletePlace);

routes.post('/type', createType);

export default routes;