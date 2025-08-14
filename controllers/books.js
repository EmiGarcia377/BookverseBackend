import { BookModel } from "../models/book.js";

export class BookController{
    static async addBook(req, res){
        const userId = req.params.userId;
        const { book, library } = req.body;
        const dbResponse = await BookModel.addBook(userId, book, library);
        if(dbResponse.error !== undefined) return res.status(500).json(dbResponse);
        return res.status(201).json(dbResponse);
    };

    static async addCustomBook(req, res){
        const userId = req.params.userId;
        const book = req.body.book;
        const objBook = JSON.parse(book);
        const bookCover = req.file;
        const dbResponse = await BookModel.addCustomBook(userId, objBook, bookCover);
        if(dbResponse.error !== undefined) return res.status(500).json(dbResponse);
        return res.status(201).json(dbResponse);
    };

    static async createLib(req, res){
        const userId = req.params.userId;
        const library = req.body;
        const libraryRes = await BookModel.createLib(userId, library);
        if(libraryRes.nameErr !== undefined) return res.status(400).json(libraryRes);
        if(libraryRes.error !== undefined) return res.status(500).json(libraryRes);
        return res.status(201).json(libraryRes);
    };

    static async updateStatus(req, res){
        const bookId = req.params.bookId;
        const status = req.body.newStatus;
        const statusUpdate = await BookModel.updateStatus(bookId, status);
        if(statusUpdate.error !== undefined) return res.status(500).json(statusUpdate);
        return res.status(200).json(statusUpdate);
    };

    static async updateActualPage(req, res){
        const bookId = req.params.bookId;
        const actualPage = req.body.actualPage;
        const pageUpdate = await BookModel.updateActualPage(bookId, actualPage);
        if(pageUpdate.error !== undefined) return res.status(500).json(pageUpdate);
        return res.status(200).json(pageUpdate);
    };

    static async getAllUserBooks(req, res){
        const userId = req.params.userId;
        const books = await BookModel.getAllUserBooks(userId);
        if(books.error !== undefined) return res.status(500).json(books);
        return res.status(200).json(books);
    };

    static async getStatusSection(req, res){
        const userId = req.params.userId;
        const bookTrackerData = await BookModel.getStatusSection(userId);
        if(bookTrackerData.error !== undefined) return res.status(500).json(bookTrackerData);
        return res.status(200).json(bookTrackerData);
    };

    static async getCustomLibraries(req, res){
        const userId = req.params.userId;
        const customLibraries = await BookModel.getCustomLibraries(userId);
        if(customLibraries.error !== undefined) return res.status(500).json(customLibraries);
        return res.status(200).json(customLibraries);
    };

    static async getUserLibraries(req, res){
        const userId = req.params.userId;
        const libraries = await BookModel.getUserLibraries(userId);
        if(libraries.error !== undefined) return res.status(500).json(libraries);
        return res.status(200).json(libraries);
    };
}