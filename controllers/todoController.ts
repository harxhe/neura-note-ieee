import { Request, Response } from 'express';
import { supabase } from '../supabase/client';

export const getTodos = async (_req: Request, res: Response) => {
  const { data, error } = await supabase.from('todos').select('*').order('created_at', { ascending: false });
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
};

export const addTodo = async (req: Request, res: Response) => {
  const { title } = req.body;
  const { data, error } = await supabase.from('todos').insert([{ title }]).select();
  if (error) return res.status(500).json({ error: error.message });
  res.status(201).json(data[0]);
};

export const updateTodo = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { completed } = req.body;
  const { data, error } = await supabase
    .from('todos')
    .update({ completed })
    .eq('id', id)
    .select();
  if (error) return res.status(500).json({ error: error.message });
  res.json(data[0]);
};

export const deleteTodo = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { error } = await supabase.from('todos').delete().eq('id', id);
  if (error) return res.status(500).json({ error: error.message });
  res.status(204).send();
};
