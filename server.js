import express from 'express';
import cors from 'cors';
import pkj from 'body-parser';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const { json, status } = pkj;
const app = express();
app.use(cors());
app.use(json());

const supabase = createClient(
  process.env.SUPABASE_URL, 
  process.env.SUPABASE_KEY
);

app.post('/register', async (req, res) => {
  const { email, password, name, username, rememberMe } = req.body;
  let newUsername = ''
  if(username === '') {
    const nameArr = name.split(' ');
    for(let  i = 0; i < nameArr.length; i++){
      newUsername += nameArr[i];
    }
  } else {
    newUsername = username;
  }

  const { data, error } = await supabase.auth.signUp({
    email: email,
    password: password,
    options: {
      data:{
        fullName: name,
        username: newUsername,
        firstTime: true,
        rememberMe: rememberMe
      }
    }
  });

  if (error) return res.status(400).json({ error: error.message });

  return res.status(201).json({ message: 'Usuario registrado con éxito!' });
});

app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  const { data, error } = await supabase.auth.signInWithPassword({
    email: email,
    password: password
  });

  if(error) return res.status(400).json({ error: error.message });

  if(data.user.user_metadata.firstTime){
    await supabase.from('users').insert([
      { id: data.user.id, email: data.user.email, username: data.user.user_metadata.username, full_name: data.user.user_metadata.fullName }
    ]);
    data.user.user_metadata.firstTime = false;
  }

  return res.status(200).json({ 
    message: 'Sesion iniciada!', 
    rememberMe: data.user.user_metadata.rememberMe,
    access_token: data.session.access_token,
    userId: data.user.id
  });
});

app.post('/create-review', async (req, res) => {
  const { title, score, content } = req.body;

  const numScore = parseInt(score);
  const user = await supabase.auth.getUser();

  const { data, error } = await supabase.from('reviews').insert([
    { user_id: user.data.user.id, title: title, score: numScore, content: content }
  ]);
  if (error) return res.status(400).json({ message: 'Ocurrio un error al crear la reseña', error: error });

  return res.status(201).json({
    message: 'Reseña creada con exito!',
    userId: user.data.user.id
  })
});

app.put('/editReview/:reviewId', async (req, res) => {
  const id = req.params.reviewId;
  const { newTitle, newScore, newContent } = req.body;
  const user = await supabase.auth.getUser();

  const { error } = await supabase.from('reviews').update({
    user_id: user.data.user.id,
    id: id,
    title: newTitle,
    score: newScore,
    content: newContent
  }).eq('id', id).eq('user_id', user.data.user.id);

  if(error) return res.status(400).json({ message: "Ocurrio un error al editar la reseña", error: error });

  return res.status(200).json({
    message: 'Reseña editada con éxito!',
    reviewId: id
  });
})

app.get('/getUser', async (req, res) => {
  const data = await supabase.from('users').select();
  const userId = await supabase.auth.getUser();

  if(data.data.length === 0 || userId.data.user === null) return res.status(400).json({ message: "Inicia sesion para acceder!" });

  const userInfo = data.data.filter((user) => user.id === userId.data.user.id);

  return res.status(200).json({
    message: 'Usuario obtenido',
    userId: userInfo[0].id,
    username: userInfo[0].username,
    fullName: userInfo[0].full_name
  })
});

app.get('/getReview', async (req, res) => {
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

  if (error) return res.status(400).json({ message: "Ocurrio un error al cargar las reseñas", error: error });

  return res.status(200).json({ 
    message: 'reseñas obtenidas',
    reviews: data 
  });
});

app.get('/getUserReview/:userId', async (req, res) => {
  const id = req.params.userId;
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
  `).eq('user_id', id).order('created_at', { ascending: false });
  if(error) return res.status(400).json({ message: "Ocurrio un error al cargar las reseñas" });

  return res.status(200).json({
    message: 'reseñas obtenidas',
    reviews: data
  })
});

app.get('/getReviewById/:reviewId', async (req, res) => {
  const revId = req.params.reviewId;
  const { data, error } = await supabase.from('reviews').select(`
    id,
    title,
    score,
    content`
  ).eq('id', revId).single();

  if(error) return status(400).json({ message: "Ocurrio un error al cargar la reseña" });

  return res.status(200).json({
    message: 'reseña obtenida',
    review: data
  })
});

app.delete('/deleteReview/:reviewId', async(req, res) =>{
  const revId = req.params.reviewId;
  const user = await supabase.auth.getUser();

  const { response, error } = await supabase.from('reviews').delete().eq('id', revId).eq('user_id', user.data.user.id);

  if(error) return res.status(400).json({ message: "Ocurrio un error al eliminar la reseña", error: error });

  return res.status(200).json({
    message: 'Reseña eliminada con éxito!',
    reviewId: revId
  });
});

app.listen(3000, () => {
  console.log('API corriendo en http://localhost:3000');
});