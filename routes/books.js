import { Router } from "express";
import { BookController } from "../controllers/books.js";
import { uploadSingleCover } from "../middleware/multer.js";

export const booksRouter = Router();

//Endpoint para agregar un libro
booksRouter.post('/addBook/:userId', BookController.addBook);

//Endpoint para agregar un libro personalizado
booksRouter.post('/createCustomBook/:userId', uploadSingleCover, BookController.addCustomBook);

//Endpoint para crear una libreria personalizada
booksRouter.post('/createLib/:userId', BookController.createLib);

//Endpoint para actualizar el status de un libro
booksRouter.patch('/updateStatus/:bookId', BookController.updateStatus);

//Endpoint para actualizar las paginas actuales leidas de un libro por el usuario
booksRouter.patch('/updateActualPage/:bookId', BookController.updateActualPage);

//Endpoint para obtener los libros del usuario
booksRouter.get('/getBooks/:userId', BookController.getAllUserBooks);

//Endpoint para obtener los libros del usuario de la seccion de seguimiento
booksRouter.get('/getStatusSection/:userId', BookController.getStatusSection);

//Endpoint para obtener las librerias del usuario
booksRouter.get('/getUserLib/:userId', BookController.getUserLibraries);

//Endpoint para obtener las librerias personalizadas del usuario
booksRouter.get('/getCustomLib/:userId', BookController.getCustomLibraries);