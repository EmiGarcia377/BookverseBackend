import { ReviewModel } from "../models/review.js";

export class ReviewController{
    static async getAllReviews(req, res){
        const userId = req.params.userId;
        const reviews = await ReviewModel.getAllReviews(userId);
        if(reviews.error !== undefined) return res.status(400).json(reviews);
        return res.status(200).json(reviews);
    };

    static async getReviewById(req, res){
        const data = req.params;
        const review = await ReviewModel.getReviewById(data);
        if(review.error !== undefined) return res.status(400).json(review);
        return res.status(200).json(review);
    };

    static async getUserReview(req, res){
        const data = req.params;
        const userReviews = await ReviewModel.getReviewByUser(data);
        if(userReviews.error !== undefined) return res.status(400).json(userReviews);
        return res.status(200).json(userReviews);
    };

    static async getSavedReviews(req, res){
        const userId = req.params.userId;
        const savedReviews = await ReviewModel.getSavedReviews(userId);
        if(savedReviews.error !== undefined) return res.status(500).json(savedReviews);
        return res.status(200).json(savedReviews);
    }

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
        return res.status(204).json(reviewData);
    };

    static async deleteReview(req, res){
        const revId = req.params.reviewId;
        const reviewData = await ReviewModel.deleteReview(revId);
        if(reviewData.error !== undefined) return res.status(400).json(reviewData);
        return res.status(200).json(reviewData);
    };

    static async likeReview(req, res){
        const data = req.body;
        const like = await ReviewModel.likeReview(data);
        if(like.error !== undefined) return res.status(400).json(like);
        return res.status(201).json(like);
    };

    static async unlikeReview(req, res){
        const data = req.body;
        const unlike = await ReviewModel.unlikeReview(data);
        if(unlike.error !== undefined) return res.status(500).json(unlike);
        return res.status(200).json(unlike);
    };

    static async saveReview(req, res){
        const data = req.body;
        const save = await ReviewModel.saveReview(data);
        if(save.error !== undefined) return res.status(500).json(save);
        return res.status(200).json(save);
    };

    static async unsaveReview(req, res){
        const data = req.body;
        const unsave = await ReviewModel.unsaveReview(data);
        if(unsave.error !== undefined) return res.status(500).json(unsave);
        return res.status(200).json(unsave);
    }

    static async commentReview(req, res){
        const data = req.body;
        const commentRes = await ReviewModel.commentReview(data);
        if(commentRes.error !== undefined) return res.status(500).json(commentRes);
        return res.status(201).json(commentRes);
    };

    static async editComment(req, res){
        const data = req.body;
        const editCommentRes = await ReviewModel.editComment(data);
        if(editCommentRes.error !== undefined) return res.status(500).json(editCommentRes);
        return res.status(204).json(editCommentRes);
    };

    static async deleteComment(req, res){
        const data = req.body;
        const delCommentRes = await ReviewModel.deleteComment(data);
        if(delCommentRes.error !== undefined) return res.status(500).json(delCommentRes);
        return res.status(200).json(delCommentRes);
    }

    static async getReviewsComments(req, res){
        const reviewId = req.params.reviewId;
        const comments = await ReviewModel.getReviewsComments(reviewId);
        if(comments.error !== undefined) return res.status(500).json(comments);
        return res.status(201).json(comments);
    };
}