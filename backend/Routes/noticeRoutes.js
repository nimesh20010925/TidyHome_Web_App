import express from 'express';
import {
    getAllNotices,
    createNotice,
    deleteNotice,
    updateNotice
} from '../Controllers/noticeController.js';
import { authenticateUser } from '../middleware/authMiddleware.js';

const router = express.Router();

// Apply authentication to all routes
router.use(authenticateUser);

// GET all notices
router.get('/', getAllNotices);

// POST create new notice
router.post('/', createNotice);

// DELETE notice
router.delete('/:id', deleteNotice);

// PUT update notice
router.put('/:id', updateNotice);

export default router;
