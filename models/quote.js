import { supabase } from "../supabaseClient.js";

export class QuoteModel{
    static async createQuote(userId, bookId, content){
        const { data, error } = await supabase.from('quotes').insert({ user_id: userId, book_id: bookId, content: content }).select('content');

        if(error) return { message: "Ocurrio un error al crear la cita, por favor intenta mas tarde", error: error.message };

        return { quote: data[0] };
    }

    static async getBookQuotes(bookId, userId){
        const { data, error } = await supabase.from('quotes').select(`
            content
        `);

        if(error) return { message: "Ocurrio un error al obtener las citas, por favor intente mas tarde", error: error.message};

        return { quotes: data };
    }

    static async getQuotesSection(userId){
        const { data, error } = await supabase.from('quotes').select(`
            content,
            books(title, authors)    
        `).eq('user_id', userId).limit(3).order('created_at', { ascending: false });

        if(error) return { message: "Ocurrio un error al obtener las citas por favor intente mas tarde", error: error.message };

        return { quotes: data };
    }
}