import { Router } from "express";
import { UserController } from "../controllers/users.js";

export const usersRouter = Router();

//Endpoint para registrar a un usuario
usersRouter.post('/register', UserController.registerUser);

//Endpoint para iniciar la sesion de un usuario
usersRouter.post('/login', UserController.loginUser);

//Endpoint para obtener datos del usuario
usersRouter.get('/getUser', UserController.getUser);

//Endpoint para obtener datos de un usuario por su id
usersRouter.get('/getUser/:userId', UserController.getUserById);

//Endpoint para obtener el id de un usuario
usersRouter.get('/getId', UserController.getUserId);