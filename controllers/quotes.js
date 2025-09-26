import { QuoteModel } from "../models/quote.js";

export class QuotesController{
    static async createQuote(req, res){
        const userId = req.params.userId;
        const bookId = req.params.bookId;
        const content = req.body.content;
        const quotePage = req.body.quotePage;
        const dbResponse = await QuoteModel.createQuote(userId, bookId, content, quotePage);
        if(dbResponse.error !== undefined) return res.status(500).json(dbResponse);
        return res.status(201).json(dbResponse);
    };

    static async getBookQuotes(req, res){
        const bookId = req.params.bookId;
        const quotes = await QuoteModel.getBookQuotes(bookId);
        if(quotes.error !== undefined) return res.status(500).json(quotes);
        return res.status(200).json(quotes);
    };

    static async getQuotesSection(req, res){
        const userId = req.params.userId;
        const quotes = await QuoteModel.getQuotesSection(userId);
        if(quotes.error !== undefined) return res.status(500).json(quotes);
        return res.status(200).json(quotes);
    };

    static async getAllQuotes(req, res){
        const userId = req.params.userId;
        const booksQuotes = await QuoteModel.getAllQuotes(userId);
        if(booksQuotes.error !== undefined) return res.status(500).json(booksQuotes);
        return res.status(200).json(booksQuotes)
    };

    static async updateQuote(req, res){
        const userId = req.params.userId;
        const quoteId = req.params.quoteId;
        const content = req.body.content;
        const quotePage = req.body.quotePage;
        const updatedQuote = await QuoteModel.updateQuote(userId, quoteId, content, quotePage);
        if(updatedQuote.error !== undefined) return res.status(500).json(updatedQuote);
        return res.status(200).json(updatedQuote)
    };

    static async deleteQuote(req, res){
        const userId = req.params.userId;
        const quoteId = req.params.quoteId;
        const dbResponse = await QuoteModel.deleteQuote(userId, quoteId);
        if(dbResponse.error !== undefined) return res.status(500).json(dbResponse);
        return res.status(200).json(dbResponse);
    }
}