import { QuoteModel } from "../models/quote.js";

export class QuotesController{
    static async createQuote(req, res){
        const userId = req.params.userId;
        const bookId = req.params.bookId;
        const content = req.body.content;
        const dbResponse = await QuoteModel.createQuote(userId, bookId, content);
        if(dbResponse.error !== undefined) return res.status(500).json(dbResponse);
        return res.status(201).json(dbResponse);
    };

    static async getBookQuotes(req, res){
        const bookId = req.params.bookId;
        const userId = req.params.userId;
        const quotes = await QuoteModel.getBookQuotes(bookId, userId);
        if(quotes.error !== undefined) return res.status(500).json(quotes);
        return res.status(200).json(quotes);
    };

    static async getQuotesSection(req, res){
        const userId = req.params.userId;
        const quotes = await QuoteModel.getQuotesSection(userId);
        if(quotes.error !== undefined) return res.status(500).json(quotes);
        return res.status(200).json(quotes);
    };
}