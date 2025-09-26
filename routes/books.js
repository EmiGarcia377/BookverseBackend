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

//Endpoint para actualizar la informacion de un libro personalizado de un usuario
booksRouter.put('/updateBook/:bookId', BookController.updateBook);

//Endpoint para actualizar el archivo de la portada de un libro personalizado de un usuario
booksRouter.put('/uploadCover/:userId/:bookTitle', uploadSingleCover, BookController.updateBookCover);

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

//Endpoint para obtener el titulo y el autor de los libros del usuario
booksRouter.get('/getBooksWAuthors/:userId', BookController.getBooksWAuthors);

//Endpoint para obtener los libros de una libraria del usuario
booksRouter.get('/getLibraryBooks/:userId/:libraryId', BookController.getLibraryBooks);

//Enpoint para eliminar la relacion entre un libro y una libreria personalizada
booksRouter.delete('/removeBookFromLib/:bookId/:libraryId', BookController.deleteBookFromLib);

//Endpoint para eliminar un libro del BookTracker del usuario
booksRouter.delete('/deleteBook/:bookId/:userId', BookController.deleteBook);