import { Router } from "express";
import { ReviewController } from "../controllers/reviews.js";

export const reviewsRouter = Router();

//Endpoint para obtener todas las reseñas
reviewsRouter.get('/:userId', ReviewController.getAllReviews);

//Endpoint para obtener una reseña por su id
reviewsRouter.get('/getReviewById/:reviewId', ReviewController.getReviewById);

//Endpoint para obtener las reseñas de un usuario
reviewsRouter.get('/getUserReview/:userId', ReviewController.getUserReview);

//Endpoint para crear una reseña
reviewsRouter.post('/create', ReviewController.createReview);

//Endpoint para editar una reseña
reviewsRouter.put('/edit/:reviewId', ReviewController.editReview);

//Endpoint para eliminar una reseña
reviewsRouter.delete('/delete/:reviewId', ReviewController.deleteReview);