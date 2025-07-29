import { Request, Response } from 'express';
import { supabase } from '../supabase/client'; 

export const getAllCourses = async (req: Request, res: Response) => {
  const { data, error } = await supabase
    .from('courses')
    .select('id, title, description');

  if (error) return res.status(500).json({ error: error.message });
  return res.json(data);
};

export const getCourseById = async (req: Request, res: Response) => {
  const { id } = req.params;

  const { data, error } = await supabase
    .from('courses')
    .select('id, title, description')
    .eq('id', id)
    .single();

  if (error) return res.status(500).json({ error: error.message });
  return res.json(data);
};


export const getCourseTopics = async (req: Request, res: Response) => {
  const { id } = req.params;

  const { data, error } = await supabase
    .from('course_topics')
    .select('id, topic_title, topic_description, materials, reference_links, order_index')
    .eq('course_id', id)
    .order('order_index', { ascending: true });

  if (error) return res.status(500).json({ error: error.message });
  return res.json(data);
};


export const getTopicById = async (req: Request, res: Response) => {
  const { id } = req.params;

  const { data, error } = await supabase
    .from('course_topics')
    .select('*')
    .eq('id', id)
    .single();

  if (error) return res.status(500).json({ error: error.message });
  return res.json(data);
};
