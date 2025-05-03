import { Notice } from '../Models/Notice.js';
import mongoose from 'mongoose';

// Get all notices for the user's home
export const getAllNotices = async (req, res) => {
  try {
    const notices = await Notice.find({ homeId: req.user.homeId })
      .sort({ createdAt: -1 })
      .populate('createdBy', 'name');

    res.json(notices);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create a new notice
export const createNotice = async (req, res) => {
  const { message } = req.body;

  if (!message) {
    return res.status(400).json({ message: 'Notice message is required' });
  }

  try {
    const newNotice = new Notice({
      message,
      homeId: req.user.homeId,
      createdBy: req.user._id
    });

    const savedNotice = await newNotice.save();
    res.status(201).json(savedNotice);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete a notice
export const deleteNotice = async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).json({ message: 'Invalid notice ID' });
  }

  try {
    const notice = await Notice.findById(req.params.id);

    if (!notice) {
      return res.status(404).json({ message: 'Notice not found' });
    }

    if (!notice.createdBy.equals(req.user._id) && req.user.role !== 'homeOwner') {
      return res.status(403).json({ message: 'Not authorized to delete this notice' });
    }

    await Notice.deleteOne({ _id: notice._id });
    res.json({ message: 'Notice deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update a notice
export const updateNotice = async (req, res) => {
  const { message } = req.body;

  if (!message) {
    return res.status(400).json({ message: 'Notice message is required' });
  }

  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).json({ message: 'Invalid notice ID' });
  }

  try {
    const notice = await Notice.findById(req.params.id);

    if (!notice) {
      return res.status(404).json({ message: 'Notice not found' });
    }

    if (!notice.createdBy.equals(req.user._id)) {
      return res.status(403).json({ message: 'Not authorized to update this notice' });
    }

    notice.message = message;
    notice.updatedAt = Date.now();

    const updatedNotice = await notice.save();
    res.json(updatedNotice);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
