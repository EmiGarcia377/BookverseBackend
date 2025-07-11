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

    static async getReviewById({ reviewId, userId }){
        if(!userId || userId === 'null'){
            const { data, error } = await supabase.rpc('get_review_by_id_public', { review_id_input: reviewId }).single();
            if(error) return { message: "No se encontro la reseña con su Id", error: error.message };
            return { message: "No se encontro el id del usuario, inicie sesion o registrese", review: data };
        } else if(userId !== 'null'){
            const { data, error } = await supabase.rpc('get_review_by_id', { review_id_input: reviewId, current_user_id: userId }).single();
            if(error) return { message: "Ocurrio un error al cargar la reseña", error: error.message };
            return { message: "Reseña encontrada con exito", review: data };
        }
    }

    static async getReviewByUser({ profileId, userId }){
        if(!userId || userId === 'undefined' || userId === 'null'){
            const { data, error } = await supabase.rpc('get_reviews_by_user_public', { target_user_id: profileId });
            if(error) return { message: "Ocurrio un error al buscar las reseñas de este usuario", error: error.message };
            return { message: "No se encontro el id del usuario, inicie sesion o registrese", reviews: data };
        } else if(userId !== 'null'){
            const { data, error } = await supabase.rpc('get_reviews_by_user', { target_user_id: profileId, current_user_id: userId });
            if(error) return { message: "Ocurrio un error al buscar las reseñas de este usuario", error: error.message };
            return { message: "Reseña encontrada con exito", reviews: data };
        }
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

    static async likeReview({ userId, reviewId }){
        if(!userId) return { message: "Inicia sesion para poder hacer esta accion!", error: "Usuario no registrado" };

        const { data, error } = await supabase.from('likes').insert({ user_id: userId, review_id: reviewId }).select();
        const { count, countErr } = await supabase.from('likes').select('*', { count: 'exact', head: true}).eq('review_id', reviewId); 

        if (error || countErr) return { message: "Ocurrio un error al hacer esta accion, por favor intenta de nuevo", error: error.message };

        return { message: "Operacion realizada con exito", count: count };
    }

    static async unlikeReview({ userId, reviewId }){
        if(!userId) return { message: "Inicia sesion para poder hacer esta accion!", error: "Usuario no registrado" };

        const { error } = await supabase.from('likes').delete().match({ user_id: userId, review_id: reviewId });
        const { count, countErr } = await supabase.from('likes').select('*', { count: 'exact', head: true}).eq('review_id', reviewId); 

        if (error || countErr) return { message: 'Error al quitar like', error: error.message };

        return { message: 'Like eliminado correctamente', count: count };
    }
}