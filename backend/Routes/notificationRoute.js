import express from 'express';
import {
  getNotifications,
  markAsRead,
  getNotificationHistory,
  createNotification,
} from '../controllers/noificationController.js';

const router = express.Router();

router.get('/', getNotifications);
router.post('/mark-as-read/:id', markAsRead);
router.get('/history', getNotificationHistory);
router.post('/create', createNotification); // (optional: you can call this from stock check)

export default router;