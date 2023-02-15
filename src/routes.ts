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

routes.get('/places', authMiddleware, listPlaces);
routes.post('/place', authMiddleware, createPlace);
routes.patch('/place/:id', authMiddleware, updatePlace);
routes.put('/place/:id/upload_image', authMiddleware, uploads.single('image'), uploadImage);
routes.delete('/place/:id', authMiddleware, deletePlace);

routes.get('/types', authMiddleware, listTypes);
routes.post('/type', authMiddleware, createType);
routes.patch('/type/:id', authMiddleware, updateType);
routes.delete('/type/:id', authMiddleware, deleteType);

routes.get('/caracterizations', authMiddleware, listCaracterizations);
routes.post('/caracterization', authMiddleware, createCaracterization);
routes.patch('/caracterization/:id', authMiddleware, updateCaracterization);
routes.delete('/caracterization/:id', authMiddleware, deleteCaracterization);

export default routes;