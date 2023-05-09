import express from "express";

import { 
    createCaracterization,
    deleteCaracterization,
    listCaracterizations, 
    updateCaracterization
} from "../app/controllers/caracteriztion-controller";
import { 
    listPlaces, 
    createPlace, 
    updatePlace,
    deletePlace,
    uploadPlaceImage,
    deleteImage
} from "../app/controllers/places-controller";
import { 
    createType, 
    deleteType, 
    listTypes, 
    updateType,
    uploadTypeImage
} from "../app/controllers/types-controller";
import { 
    login,
    register 
} from "../app/controllers/user-controller";
import { 
    createEvent, 
    deleteEvent, 
    deleteEventImage, 
    listEvents, 
    updateEvent, 
    uploadEventImage 
} from "../app/controllers/events-controller";
import { 
    createCategory, 
    deleteCategory, 
    listCategories, 
    updateCategory 
} from "../app/controllers/category-controller";

import uploads from "../app/config/uploads";
import authMiddleware from "../app/middlewares/auth";

const routes = express.Router();

routes.post('/register', register);
routes.post('/login', login);

routes.get('/places', authMiddleware, listPlaces);
routes.post('/place', authMiddleware, createPlace);
routes.patch('/place/:id', authMiddleware, updatePlace);
routes.delete('/place/:id', authMiddleware, deletePlace);

routes.put('/place/:id/upload_image', authMiddleware, uploads.single('image'), uploadPlaceImage);
routes.delete('/place/image/:id', authMiddleware, deleteImage);

routes.get('/types', authMiddleware, listTypes);
routes.post('/type', authMiddleware, createType);
routes.patch('/type/:id', authMiddleware, updateType);
routes.delete('/type/:id', authMiddleware, deleteType);

routes.put('/type/:id/upload_image', authMiddleware, uploads.single('image'), uploadTypeImage);
routes.delete('/type/image/:id', authMiddleware, deleteImage);

routes.get('/caracterizations', authMiddleware, listCaracterizations);
routes.post('/caracterization', authMiddleware, createCaracterization);
routes.patch('/caracterization/:id', authMiddleware, updateCaracterization);
routes.delete('/caracterization/:id', authMiddleware, deleteCaracterization);

routes.get('/events', authMiddleware, listEvents);
routes.post('/event', authMiddleware, createEvent);
routes.patch('/event/:id', authMiddleware, updateEvent);
routes.delete('/event/:id', authMiddleware, deleteEvent);

routes.put('/event/:id/upload_image', authMiddleware, uploads.single('image'), uploadEventImage);
routes.delete('/event/image/:id', authMiddleware, deleteEventImage);

routes.get('/categories', authMiddleware, listCategories);
routes.post('/category', authMiddleware, createCategory);
routes.patch('/category/:id', authMiddleware, updateCategory);
routes.delete('/category/:id', authMiddleware, deleteCategory);

// routes.put('/category/:id/upload_image', authMiddleware, uploads.single('image'), uploadPlaceImage);
// routes.delete('/category/image/:id', authMiddleware, deleteImage);

export default routes;