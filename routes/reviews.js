import { Router } from "express";
import { ReviewController } from "../controllers/reviews.js";

export const reviewsRouter = Router();

//Endpoint para obtener todas las reseñas
reviewsRouter.get('/:userId', ReviewController.getAllReviews);

//Endpoint para obtener una reseña por su id
reviewsRouter.get('/getReviewById/:reviewId/:userId', ReviewController.getReviewById);

//Endpoint para obtener las reseñas de un usuario
reviewsRouter.get('/getUserReviews/:profileId/:userId', ReviewController.getUserReview);

//Endpoint para crear una reseña
reviewsRouter.post('/create', ReviewController.createReview);

//Endpoint para editar una reseña
reviewsRouter.put('/edit/:reviewId', ReviewController.editReview);

//Endpoint para eliminar una reseña
reviewsRouter.delete('/delete/:reviewId', ReviewController.deleteReview);

//Endpoint para dar like a una reseña
reviewsRouter.post('/like/:userId', ReviewController.likeReview);

//Endpoint para dislikear una reseña
reviewsRouter.delete('/unlike/:reviewId', ReviewController.unlikeReview);

//Endpoint para comentar una reseña
reviewsRouter.post('/comment', ReviewController.commentReview);

//Endpoint para poder obtener todos los comentarios de una reseña por su id
reviewsRouter.get('/comment/:reviewId', ReviewController.getReviewsComments);