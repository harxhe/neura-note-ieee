import { Request, Response } from 'express';
import { supabase } from '../supabase/client';

export const signup = async (req: Request, res: Response) => {
  const { email, password, username, fullname } = req.body;

  const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
    email,
    password,
  });

  if (signUpError || !signUpData.user) {
    return res.status(400).json({ error: signUpError?.message });
  }

  await supabase.from('users').insert([
    {
      id: signUpData.user.id,
      email,
      username,
      fullname,
    },
  ]);

  res.status(201).json({ message: 'User signed up', user: signUpData.user });
};

export const login = async (req: Request, res: Response) => {
    const { email, password } = req.body;
  
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
  
    if (error || !data.session) {
      return res.status(401).json({ error: error?.message || 'Login failed' });
    }
  
    const accessToken = data.session.access_token;
  
    res.cookie('token', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', 
      sameSite: 'strict',
      maxAge: 1000 * 60 * 60 * 24, // 1 day
    });
  
    res.json({ message: 'Logged in successfully' });
  };
  
export const logout = (_req: Request, res: Response) => {
    res.clearCookie('token');
    res.json({ message: 'Logged out successfully' });
  };
  