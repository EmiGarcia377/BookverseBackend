import { Router } from "express";
import { QuotesController } from "../controllers/quotes.js";

export const quotesRouter = Router();

//Endpoint para crear una cita de un libro del usuario
quotesRouter.post('/createQuote/:userId/:bookId', QuotesController.createQuote);

//Endpoint para obtener las citas de un libro del usuario
quotesRouter.get('/getQuotes/:bookId', QuotesController.getBookQuotes);

//Endpoint para obtener las citas de la seccion de citas del book tracker de un usuario
quotesRouter.get('/getQuotesSection/:userId', QuotesController.getQuotesSection);

//Endpoint para obtener las citas de todos los libros de un usuario
quotesRouter.get('/getAllQuotes/:userId', QuotesController.getAllQuotes);

//Endpoint para actualizar el contenido de una cita de un libro del usuario
quotesRouter.patch('/updateQuote/:userId/:quoteId', QuotesController.updateQuote);

//Endpoint para elminar una cita de un libro del usuario
quotesRouter.delete('/deleteQuote/:userId/:quoteId', QuotesController.deleteQuote);