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
        }
        return {
            message: 'Sesion iniciada con exito!',
            rememberMe: data.user.user_metadata.rememberMe,
            access_token: data.session.access_token,
            userId: data.user.id
        }
    }

    static async updateUserInfo({ email, fullName, username, biography, }, userId){
        const user = await supabase.auth.getUser();
        if(user.data.user.email !== email){
            const { authData, error } = await supabase.auth.updateUser({
                email: email,
                data: {
                    fullName: fullName,
                    username: username,
                    firstTime: false
                }
            });
            if(error) return { message: 'Ocurrio un error al actualizar su usuario', error: error.message };
            const { data, dbError } = await supabase.from('users').update({
                id: userId,
                full_name: fullName,
                username: username,
                email: email,
                biography: biography
            }).eq('id', userId).select();
            if(dbError) return { message: 'Ocurrio un error al actualizar su usuario', error: dbError.message };
            return data;
        } else {
            const { authData, error } = await supabase.auth.updateUser({
                data: {
                    fullName: fullName,
                    username: username,
                    firstTime: false
                }
            });
            if(error) return { message: 'Ocurrio un error al actualizar su usuario', error: error.message };
            const { data, dbError } = await supabase.from('users').update({
                id: userId,
                full_name: fullName,
                username: username,
                email: email,
                biography: biography
            }).eq('id', userId).select();
            console.log(data);
            if(dbError) return { message: 'Ocurrio un error al actualizar su usuario', error: dbError.message };
            return data;
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
            following,
            biography
        `).eq('id', userId.data.user.id).single();

        return {
            message: 'Usuario obtenido',
            userId: user.data.id,
            username: user.data.username,
            email: userId.data.user.email,
            fullName: user.data.full_name,
            followers: user.data.followers,
            following: user.data.following,
            biography: user.data.biography
        }
    }

    static async getUserById(userId){
        const user = await supabase.from('users').select(`
            id,
            username,
            full_name,
            followers,
            following,
            biography
        `).eq('id', userId).single();
        
        if(user.error !== null) return { message: "No se encontro el usuario", error: user.error };

        return user
    }

    static async getUserId(){
        const user = await supabase.auth.getUser();

        if(user.error !== null) return { message: "No se encontro el usuario, vuelve a intentarlo o inicia sesion.", error: user.error };

        return { id: user.data.user.id };
    }
}