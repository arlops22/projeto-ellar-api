import express from "express";

import { 
    createCaracterization,
    deleteCaracterization,
    listCaracterizations, 
    updateCaracterization
} from "./app/controllers/caracteriztion-controller";
import { 
    listPlaces, 
    createPlace, 
    updatePlace,
    deletePlace,
    uploadImage
} from "./app/controllers/places-controller";
import { 
    createType, 
    deleteType, 
    listTypes, 
    updateType
} from "./app/controllers/types-controller";
import { 
    login,
    register 
} from "./app/controllers/user-controller";

import uploads from "./app/config/uploads";
import authMiddleware from "./app/middlewares/auth";

const routes = express.Router();

routes.post('/register', register);
routes.post('/login', login);

routes.get('/places', listPlaces);
routes.post('/place', createPlace);
routes.patch('/place/:id', updatePlace);
routes.put('/place/:id', uploads.single('image'), uploadImage);
routes.delete('/place/:id', authMiddleware, deletePlace);

routes.get('/types', listTypes);
routes.post('/type', createType);
routes.patch('/type/:id', updateType);
routes.delete('/type/:id', deleteType);

routes.get('/caracterizations', listCaracterizations);
routes.post('/caracterization', createCaracterization);
routes.patch('/caracterization/:id', updateCaracterization);
routes.delete('/caracterization/:id', deleteCaracterization);

export default routes;