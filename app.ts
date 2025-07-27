import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';

import todoRoutes from './routes/todoRoutes';
import authRoutes from './routes/authRoutes';

dotenv.config();

const app = express();

app.use(express.json());
app.use(cookieParser());

app.use(
    cors({
      origin: 'http://localhost:5173', //frontend url
      credentials: true,             
    })
  );

app.use('/api/auth', authRoutes);
app.use('/api/todos', todoRoutes);

const PORT = process.env.PORT || 3000;

app.get('/', (_req, res) => {
    res.send('API is running!');
  });
  
app.listen(PORT, () => {
    console.log(`🚀 Server is running on http://localhost:${PORT}`);
  });