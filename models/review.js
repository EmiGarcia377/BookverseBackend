import { supabase } from '../supabaseClient.js';

export class ReviewModel {
    static async getAllReviews(){
        console.log('Datos recibidos /');
        const { data, error } = await supabase.from('reviews').select(`
            id,
            title,
            score,
            content,
            created_at,
            users (
            full_name,
            username
            )
        `).order('created_at', { ascending: false });

        if (error) return { message: "Ocurrio un error al cargar las reseñas", error: error.message };

        return { 
            message: 'reseñas obtenidas',
            reviews: data 
        };
    }

    static async getReviewById(revId){
        console.log('Datos recibidos /getReviewById/:reviewId');
        const { data, error } = await supabase.from('reviews').select(`
            id,
            title,
            score,
            content`
        ).eq('id', revId).single();

        if(error) return { message: "No se encontro la reseña con su Id", error: error.message };

        return {
            message: 'reseña obtenida',
            review: data
        };
    }

    static async getReviewByUser(userId){
        console.log('Datos recibidos /getUserReview/:userId');
        const { data, error } = await supabase.from('reviews').select(`
            id,
            title,
            score,
            content,
            created_at,
            users (
            full_name,
            username
            )
        `).eq('user_id', userId).order('created_at', { ascending: false });

        if(error) return { message: "Ocurrio un error al cargar las reseñas del usuario", error: error.message };

        return {
            message: 'reseñas obtenidas',
            reviews: data
        };
    }

    static async createReview({ title, score, content }){
        console.log('Datos recibidos /create');
        const numScore = parseInt(score);
        const user = await supabase.auth.getUser();
        const { data, error } = await supabase.from('reviews').insert([
            { user_id: user.data.user.id, title: title, score: numScore, content: content }
        ]);

        if (error) return { message: 'Ocurrio un error al crear la reseña', error: error.message };

        return {
            message: 'Reseña creada con exito!',
            userId: user.data.user.id
        };
    }

    static async editReview({ newTitle, newScore, newContent }, reviewId){
        console.log('Datos recibidos /edit/:reviewId');
        const user = await supabase.auth.getUser();
        const { error } = await supabase.from('reviews').update({
            user_id: user.data.user.id,
            id: reviewId,
            title: newTitle,
            score: newScore,
            content: newContent
        }).eq('id', reviewId).eq('user_id', user.data.user.id);

        if(error) return { message: "Ocurrio un error al editar la reseña", error: error.message };

        return {
            message: 'Reseña editada con éxito!',
            reviewId: reviewId
        };
    }

    static async deleteReview(reviewId){
        console.log('Datos recibidos /delete/:reviewId');
        const user = await supabase.auth.getUser();

        const { response, error } = await supabase.from('reviews').delete().eq('id', reviewId).eq('user_id', user.data.user.id);

        if(error) return { message: "Ocurrio un error al eliminar la reseña, intente de nuevo", error: error.message };

        return {
            message: 'Reseña eliminada con éxito!',
            reviewId: reviewId
        };
    }
}