import { supabase } from '../supabaseClient.js';

export class UserModel {
    static async registerUser({ email, password, name, username, rememberMe }){
        console.log('Datos recibidos /register');
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
        console.log('Datos recibidos /login');
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
        console.log('Datos recibidos /getUser');
        const data = await supabase.from('users').select();
        const userId = await supabase.auth.getUser();

        if(data.data.length === 0 || userId.data.user === null) return { message: "Inicia sesion para acceder!" };

        const userInfo = data.data.filter((user) => user.id === userId.data.user.id);

        return {
            message: 'Usuario obtenido',
            userId: userInfo[0].id,
            username: userInfo[0].username,
            fullName: userInfo[0].full_name
        }
    }
}