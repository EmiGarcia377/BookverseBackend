import { supabase } from "../supabaseClient.js";

export class QuoteModel{
    static async createQuote(userId, bookId, content, quotePage){
        const { data, error } = await supabase.from('quotes').insert({ user_id: userId, book_id: bookId, content: content, num_page: quotePage }).select('content');

        if(error) return { message: "Ocurrio un error al crear la cita, por favor intenta mas tarde", error: error.message };

        return { quote: data[0] };
    }

    static async getBookQuotes(bookId){
        const { data, error } = await supabase.from('quotes').select(`
            content,
            num_page,
            id
        `).eq('book_id', bookId);

        if(error) return { message: "Ocurrio un error al obtener las citas, por favor intente mas tarde", error: error.message};

        return { quotes: data };
    }

    static async getQuotesSection(userId){
        const { data, error } = await supabase.from('quotes').select(`
            content,
            num_page,
            id,
            books(title, authors)    
        `).eq('user_id', userId).limit(3).order('created_at', { ascending: false });

        if(error) return { message: "Ocurrio un error al obtener las citas por favor intente mas tarde", error: error.message };

        return { quotes: data };
    }

    static async getAllQuotes(userId){
        const { data, error } = await supabase.rpc('get_user_quotes', { p_user_id: userId });

        if(error) return { message: "Ocurrio un error al obtener todas las citas, por favor intente mas tarde", error: error.message };

        return { data };
    }

    static async updateQuote(userId, quoteId, content, quotePage){
        const { data, error } = await supabase.from('quotes').update({ content: content, num_page: quotePage }).eq('id', quoteId).eq('user_id', userId).select('content, num_page, id');

        if(error) return { message: "Ocurrio un error al actualizar la cita, por favor intente mas tarde", error: error.message };

        return { updatedQuote: data[0] };
    }

    static async deleteQuote(userId, quoteId){
        const { data, error } = await supabase.from('quotes').delete().eq('id', quoteId).eq('user_id', userId);

        if(error) return { message: "Ocurrio un error al eliminar la cita, por favor intente mas tarde", error: error.message };

        return { message: "Cita eliminada correctamente" };
    }
}