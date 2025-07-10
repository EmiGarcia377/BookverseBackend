import { Router } from "express";
import { LikesController } from "../controllers/likes.js";

export const likesRouter = Router();

//Endpoint para obtener los likes de una reseña
likesRouter.get('/:reviewId', LikesController.getLikes);

//Endpoint para dar like a una reseña
likesRouter.post('/like/:userId', LikesController.like);