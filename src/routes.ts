import express from "express";

import { 
    listPlaces, 
    createPlace, 
    updatePlace,
    deletePlace
} from "./app/controllers/places-controller";
import { 
    createType, 
    deleteType, 
    listTypes, 
    updateType
} from "./app/controllers/types-controller";

const routes = express.Router();

routes.get('/places', listPlaces);
routes.post('/place', createPlace);
routes.patch('/place/:id', updatePlace);
routes.delete('/place/:id', deletePlace);

routes.get('/types', listTypes);
routes.post('/type', createType);
routes.patch('/type/:id', updateType);
routes.delete('/type/:id', deleteType);

export default routes;