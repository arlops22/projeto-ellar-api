import express from "express";

import { 
    listPlaces, 
    createPlace, 
    updatePlace,
    deletePlace
} from "./app/controllers/places-controller";

const routes = express.Router();

routes.get('/places', listPlaces);
routes.post('/place', createPlace);
routes.patch('/place/:id', updatePlace);
routes.delete('/place/:id', deletePlace);

export default routes;