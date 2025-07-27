import { Request, Response, NextFunction } from 'express';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!, // Use service role for backend
  { auth: { persistSession: false } }
);

export const authenticateUser = async (req: Request, res: Response, next: NextFunction) => {
    const token = req.cookies.token;
  
    if (!token) {
      return res.status(401).json({ error: 'Unauthorized: No token in cookies' });
    }
  
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser(token);
  
    if (error || !user) {
      return res.status(401).json({ error: 'Invalid token' });
    }
  
    (req as any).user = user;
    next();
  };
  