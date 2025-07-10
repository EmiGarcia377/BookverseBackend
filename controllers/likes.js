import { LikesModel } from "../models/like.js";

export class LikesController{
    static async getLikes(req, res){
        const data = req.params.reviewId;
        const likes = await LikesModel.getLikes(data);
        if(likes.error !== undefined) return res.status(400).json(likes);
        return res.status(200).json(likes);
    }
    static async like(req, res){
        const data = req.body;
        const like = await LikesModel.like(data);
        if(like.error !== undefined) return res.status(400).json(like);
        return res.status(201).json(like);
    }
}