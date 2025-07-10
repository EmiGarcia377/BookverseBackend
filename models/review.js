import { supabase } from '../supabaseClient.js';

export class ReviewModel {
    static async getAllReviews(userId){
        if(userId === 'null'){
            const { data, error } = await supabase.rpc('get_reviews_public');
            if(error) return { message: "Ocurrio un error al cargar las reseñas", error: error.message }
            return { message: "No se encontro el id del usuario", reviews: data }
        } else if(userId !== 'null') {
            const { data, error } = await supabase.rpc('get_reviews', { current_user_id: userId });
            if (error) return { message: "Ocurrio un error al cargar las reseñas", error: error.message };
            return { message: 'reseñas obtenidas', reviews: data };
        }
    }

    static async getReviewById(revId){
        const { data, error } = await supabase.from('reviews').select(`
            id,
            title,
            score,
            content,
            users (
                id,
                full_name,
                username
            )
        `).eq('id', revId).single();

        if(error) return { message: "No se encontro la reseña con su Id", error: error.message };

        return {
            message: 'reseña obtenida',
            review: data
        };
    }

    static async getReviewByUser(userId){
        const { data, error } = await supabase.from('reviews').select(`
            id,
            title,
            score,
            content,
            created_at,
            users (
                id,
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
        const user = await supabase.auth.getUser();

        const { response, error } = await supabase.from('reviews').delete().eq('id', reviewId).eq('user_id', user.data.user.id);

        if(error) return { message: "Ocurrio un error al eliminar la reseña, intente de nuevo", error: error.message };

        return {
            message: 'Reseña eliminada con éxito!',
            reviewId: reviewId
        };
    }
}