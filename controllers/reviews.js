import { ReviewModel } from "../models/review.js";

export class ReviewController{
    static async getAllReviews(req, res){
      const reviews = await ReviewModel.getAllReviews();
      if(reviews.error !== undefined) return res.status(400).json(reviews);
      return res.status(200).json(reviews);
    };

    static async getReviewById(req, res){
        const revId = req.params.reviewId;
        const review = await ReviewModel.getReviewById(revId);
        if(review.error !== undefined) return res.status(400).json(review);
        return res.status(200).json(review);
    };

    static async getUserReview(req, res){
        const id = req.params.userId;
        const userReviews = await ReviewModel.getReviewByUser(id);
        if(userReviews.error !== undefined) return res.status(400).json(userReviews);
        return res.status(200).json(userReviews);
    };

    static async createReview(req, res){
        const review = req.body;
        const data = ReviewModel.createReview(review);
        if(data.error !== undefined) return res.status(400).json(data);
        return res.status(201).json(data);
    };

    static async editReview(req, res){
        const id = req.params.reviewId;
        const newReview = req.body;
        const reviewData = await ReviewModel.editReview(newReview, id);
        if(reviewData.error !== undefined) return res.status(400).json(reviewData);
        return res.status(200).json(reviewData);
    };

    static async deleteReview(req, res){
        const revId = req.params.reviewId;
        const reviewData = await ReviewModel.deleteReview(revId);
        if(reviewData.error !== undefined) return res.status(400).json(reviewData);
        return res.status(200).json(reviewData);
    }
}