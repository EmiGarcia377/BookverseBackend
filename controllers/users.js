import { UserModel } from "../models/user.js";

export class UserController{
    static async registerUser(req, res){
        const user = req.body;
        const newUser = await UserModel.registerUser(user);
        if(newUser !== undefined) return res.status(500).json(newUser);
        return res.status(201).json({ message: 'Usuario registrado con éxito!' });
    };

    static async loginUser(req, res){
        const user = req.body;
        const userLogin = await UserModel.loginUser(user);
        if(userLogin.error !== undefined) return res.status(500).json(userLogin);
        return res.status(200).json(userLogin);
    };

    static async updateUserInfo(req, res){
        const userInfo = req.body;
        const userId = req.params.userId;
        const updatedUser = await UserModel.updateUserInfo(userInfo, userId);
        if(updatedUser.error !== undefined) return res.status(500).json(updatedUser);
        return res.status(200).json(updatedUser);
    };

    static async getUser(req, res){
        const userInfo = await UserModel.getUser();
        if(userInfo.error !== undefined) return res.status(500).json(userInfo);
        return res.status(200).json(userInfo);
    }

    static async getUserById(req, res){
        const userId = req.params.userId;
        const user = await UserModel.getUserById(userId);
        if(user.error !== null) return res.status(500).json(user);
        else if (user.data) return res.status(200).json(user);
    }

    static async getUserId(req, res){
        const id = await UserModel.getUserId();
        if(!id.id) return res.status(500).json(id);
        return res.status(200).json(id); 
    }
}