import express from 'express';
import {
  getAllCourses,
  getCourseById,
  getCourseTopics,
  getTopicById
} from '../controllers/courseController';

const router = express.Router();

// /api/courses/
router.get('/', getAllCourses);

// /api/courses/:id
router.get('/:id', getCourseById);

// /api/courses/:id/topics
router.get('/:id/topics', getCourseTopics);

// /api/topics/:id (optional)
router.get('/topics/:id', getTopicById);

export default router;
