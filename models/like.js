import { supabase } from "../supabaseClient.js";

export class LikesModel{
    static async getLikes({ reviewId }){
        const { count, error } = await supabase
        .from('likes')
        .select('*', { count: 'exact', head: true });
        if (error) return { message: "Ocurrio un error al obtener los likes", error: error.message };

        return {
            data: count
        };
    }

    static async like({ userId, reviewId }){
        if(!userId) return { message: "Inicia sesion para poder hacer esta accion!", error: "Usuario no registrado" };

        const { data, error } = await supabase.from('likes').insert({ user_id: userId, review_id: reviewId }).select();

        if (error) return { message: "Ocurrio un error al hacer esta accion, por favor intenta de nuevo", error: error.message };

        return { message: "Operacion realizada con exito" };
    }
}