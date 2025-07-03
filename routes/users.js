import { Router } from "express";

const usersRouter = Router();

usersRouter.post('/register', async (req, res) => {
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
})