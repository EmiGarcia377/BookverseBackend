import { UserModel } from "../models/user.js";

export class UserController{
    static async registerUser(req, res){
        const user = req.body;
        const newUser = await UserModel.registerUser(user);
        if(newUser !== undefined) return res.status(400).json(newUser);
        return res.status(201).json({ message: 'Usuario registrado con éxito!' });
    };

    static async loginUser(req, res){
        const user = req.body;
        const userLogin = await UserModel.loginUser(user);
        console.log(userLogin.error);
        if(userLogin.error !== undefined) return res.status(400).json(userLogin);
        return res.status(200).json(userLogin);
    };

    static async getUser(req, res){
        const userInfo = await UserModel.getUser();
        if(userInfo.error !== undefined) return res.status(400).json(userInfo);
        return res.status(200).json(userInfo);
    }
}