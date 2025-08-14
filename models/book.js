import path from 'path';
import { supabase } from '../supabaseClient.js';

export class BookModel {
    static async addBook(userId, book, library){
        const { data, error } = await supabase.from('books').insert({
            user_id: userId, 
            google_book_id: book.id,
            title: book.volumeInfo.title,
            authors: book.volumeInfo.authors,
            thumbnail_url: book.volumeInfo.imageLinks.smallThumbnail,
            description: book.volumeInfo.description,
            categories: book.volumeInfo.categories,
            num_pages: book.volumeInfo.pageCount
        }).select();
        if(library != 'All'){
            const { data: libraryData, error: libErr } = await supabase.from('libraries').select('id').eq('user_id', userId).eq('name', library).single();
            const { error: libraryErr } = await supabase.from('library_books').insert({ library_id: libraryData.id, book_id: data[0].id });
            if(libraryErr) return { message: "Ocurrio un error al agregar el libro, por favor intenta mas tarde", error: error.message };
        }

        if(error) return { message: "Ocurrio un error al agregar el libro, por favor intenta mas tarde", error: error.message };

        return { message: "Libro agregado exitosamente", book: data[0] };
    }

    static async addCustomBook(userId, book, bookCover){
        if(book.coverUrl !== ''){
            const { data, error } = await supabase.from('books').insert({
                user_id: userId,
                title: book.title,
                authors: book.authors,
                thumbnail_url: book.coverUrl,
                description: book.description,
                categories: book.categories,
                num_pages: book.pages
            }).select();

            if(error) return { message: "Ocurrio un error al agregar el libro, por favor intenta mas tarde", error: error.message };

            return { message: "Libro personalizado agregado con exito", book: data[0] };
        } else if(bookCover){
            const fileExt = path.extname(bookCover.originalname);
            const fileName = `${userId}_${book.title}${fileExt}`;
            const filePath = `user_${userId}/${fileName}`;
            const { error: uploadError } = await supabase.storage.from('book-covers').upload(filePath, bookCover.buffer, {
                contentType: bookCover.mimetype,
                upsert: true
            });
            
            if(uploadError) return { message: "Ocurrio un error al subir la portada del libro", error: uploadError.message };

            const { data: publicUrlData } = supabase.storage.from('book-covers').getPublicUrl(filePath);
            const { data, error } = await supabase.from('books').insert({
                user_id: userId,
                title: book.title,
                authors: book.authors,
                thumbnail_url: publicUrlData.publicUrl,
                description: book.description,
                categories: book.categories,
                num_pages: book.pages
            }).select();
            
            if(error) return { message: "Ocurrio un error al agregar el libro, por favor intenta mas tarde", error: error.message };
            
            return { message: "Libro personalizado agregado con exito", book: data[0] };
        }
    }

    static async createLib(userId, library){
        const { data: libName, error: libError } = await supabase.from('libraries').select('name').eq('user_id', userId).eq('name', library.name);
        if(libName.length !== 0) return { nameErr: `Ya tienes una libreria llamada ${libName[0].name}!`}
        const { data, error } = await supabase.from('libraries').insert({
            user_id: userId,
            name: library.name,
            description: library.description
        }).select('name, description');

        if(error) return { message: "Ocurrio un error al agregar la libreria, por favor intente mas tarde", error: error.message };

        return { message: "Libreria agregada con exito", library: data[0] };
    }

    static async updateStatus(bookId, newStatus){

        const { data, error } = await supabase.from('books').update({ status: newStatus }).eq('id', bookId).select();

        if(error) return { message: "Ocurrio un error al actualizar el estado del libro", error: error.message };

        return { message: "Status actualizado con exito!" };
    }

    static async updateActualPage(bookId, actualPage){
        const { error } = await supabase.from('books').update({ actual_page: actualPage }).eq('id', bookId);
        if(error) return { message: "Ocurrio un error al actualizar la pagina actual del libro", error: error.message };
        return { message: "Pagina actual actualizada con exito!" };
    }

    static async getAllUserBooks(userId){
        const { data, error } = await supabase.from('books').select(`
            id,
            title,
            authors,
            thumbnail_url,
            description,
            categories,
            num_pages,
            actual_page,
            status
        `).eq('user_id', userId);

        if(error) return { message: "Ocurrio un error al obtener los libros, por favor intenta mas tarde", error: error.message };

        return { message: "Libros obtenidos con exito", books: data };
    }

    static async getStatusSection(userId){
        const { data: unreadBooks, error: unreadError } = await supabase.from('books').select(`
            id,
            title,
            authors,
            thumbnail_url,
            num_pages,
            actual_page,
            status
        `).eq('user_id', userId).eq('status', 'Sin leer').limit(4).order('created_at', { ascending: false });
        
        const { data: readingBooks, error: readingError } = await supabase.from('books').select(`
            id,
            title,
            authors,
            thumbnail_url,
            num_pages,
            actual_page,
            status
        `).eq('user_id', userId).eq('status', 'En progreso').limit(4).order('created_at', { ascending: false });
        
        const { data: readBooks, error: readError } = await supabase.from('books').select(`
            id,
            title,
            authors,
            thumbnail_url,
            num_pages,
            actual_page,
            status
        `).eq('user_id', userId).eq('status', 'Leido').limit(4).order('created_at', { ascending: false });

        if(unreadError || readingError || readError) {
            return { message: "Ocurrio un error al obtener los libros del apartado de book tracker", error: unreadError?.message || readingError?.message || readError?.message };
        }

        return {
            unreadBooks: unreadBooks,
            readingBooks: readingBooks,
            readBooks: readBooks
        }
    }

    static async getUserLibraries(userId){
        const { data, error } = await supabase.from('libraries').select('name').eq('user_id', userId);

        if(error) return { message: "Ocurrio un error al obtener las librerias, por favor intenta mas tarde", error: error.message };

        return { libraries: data };
    }

    static async getCustomLibraries(userId){
        const { data, error } = await supabase.rpc('get_user_libraries_with_count', { p_user_id: userId });
        
        if(error) return { message: "Ocurrio un error al obtener las librerias, por favor intenta mas tarde", error: error?.message };

        return { libraries: data };
    }
}