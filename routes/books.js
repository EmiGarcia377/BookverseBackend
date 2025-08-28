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

//Endpoint para poder agregar un libro a una libreria personalizada del usuario
booksRouter.post('/addBookToLib/:bookId', BookController.addBookToLib);

//Endpoint para actualizar el status de un libro
booksRouter.patch('/updateStatus/:bookId', BookController.updateStatus);

//Endpoint para actualizar las paginas actuales leidas de un libro por el usuario
booksRouter.patch('/updateActualPage/:bookId', BookController.updateActualPage);

//Endpoint para actualizar el resumen del libro de un usuario
booksRouter.patch('/updateBookSummary/:bookId', BookController.updateBookSummary);

//Endpoint para obtener los libros del usuario
booksRouter.get('/getBooks/:userId', BookController.getAllUserBooks);

//Endpoint para obtener los libros del usuario de la seccion de seguimiento
booksRouter.get('/getStatusSection/:userId', BookController.getStatusSection);

//Endpoint para obtener las librerias del usuario
booksRouter.get('/getUserLib/:userId', BookController.getUserLibraries);

//Endpoint para obtener las librerias personalizadas del usuario
booksRouter.get('/getCustomLib/:userId', BookController.getCustomLibraries);

//Endpoint para obtener las librerias donde esta guardado un libro
booksRouter.get('/getBookLibraries/:bookId', BookController.getBookLibraries);

//Endpoint para obtener las librerias personalizadas del usuario junto con sus libros
booksRouter.get('/getLibsWBooks/:userId', BookController.getLibwBooks);

//Endpoint para obtener el resumen del libro de un usuario
booksRouter.get('/getBookSummary/:bookId', BookController.getBookSummary);