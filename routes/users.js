import { Router } from "express";
import { UserController } from "../controllers/users.js";
import { uploadSingleAvatars } from '../middleware/multer.js'

export const usersRouter = Router();

//Endpoint para registrar a un usuario
usersRouter.post('/register', UserController.registerUser);

//Endpoint para iniciar la sesion de un usuario
usersRouter.post('/login', UserController.loginUser);

//Endpoint para cerrar la sesion de un usuario
usersRouter.post('/logout', UserController.logoutUser);

//Endpoint para actualizar los datos de un usuario
usersRouter.put('/updateUser/:userId', UserController.updateUserInfo);

//Endpoint para actualizar la foto de perfil de un usuario
usersRouter.post('/updatepfp/:userId', uploadSingleAvatars,  UserController.updatePfp);

//Endpoint para obtener datos del usuario
usersRouter.get('/getUser', UserController.getUser);

//Endpoint para obtener datos de un usuario por su id
usersRouter.get('/getUser/:userId', UserController.getUserById);

//Endpoint para obtener el id de un usuario
usersRouter.get('/getId', UserController.getUserId);