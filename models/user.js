import { supabase } from '../supabaseClient.js';

export class UserModel {
    static async registerUser({ email, password, name, username, rememberMe }){
        let newUsername = '';
        if (username === '') {
            const nameArr = name.split(' ');
            for (let i = 0; i < nameArr.length; i++) {
                newUsername += nameArr[i];
            }
        } else {
            newUsername = username;
        }
        const { data, error } = await supabase.auth.signUp({
            email: email,
            password: password,
            options: {
                data: {
                    fullName: name,
                    username: newUsername,
                    firstTime: true,
                    rememberMe: rememberMe
                }
            }
        });

        if (error) return { message: "Ocurrio un error al registrar su usuario, intente de nuevo por favor", error: error.message };

        return { message: 'Usuario registrado con éxito!' };
    }

    static async loginUser({ email, password }){
        const { data, error } = await supabase.auth.signInWithPassword({
            email: email,
            password: password
        });

        if(error) return { message: "Ocurrio un error al iniciar sesion, intente de nuevo por favor", error: error.message };

        if(data.user.user_metadata.firstTime){
            await supabase.from('users').insert([
            { id: data.user.id, email: data.user.email, username: data.user.user_metadata.username, full_name: data.user.user_metadata.fullName }
            ]);
            data.user.user_metadata.firstTime = false;
        }
        return {
            message: 'Sesion iniciada con exito!',
            rememberMe: data.user.user_metadata.rememberMe,
            access_token: data.session.access_token,
            userId: data.user.id
        }
    }

    static async getUser(){
        const userId = await supabase.auth.getUser();
        if(userId.error) return { message: "Inicia sesion!", error: userId.error.message };
        const user = await supabase.from('users').select(`
            id, 
            username, 
            full_name,
            followers,
            following
        `).eq('id', userId.data.user.id).single();

        return {
            message: 'Usuario obtenido',
            userId: user.data.id,
            username: user.data.username,
            fullName: user.data.full_name,
            followers: user.data.followers,
            following: user.data.following
        }
    }

    static async getUserById(userId){
        const user = await supabase.from('users').select(`
            id,
            username,
            full_name,
            followers,
            following
        `).eq('id', userId).single();
        
        if(user.error !== null) return { message: "No se encontro el usuario", error: user.error };

        return user
    }
}