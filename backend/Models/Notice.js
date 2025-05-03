import mongoose from 'mongoose';

const noticeSchema = new mongoose.Schema({
  message: {
    type: String,
    required: true
  },
  homeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Home',
    required: true,
    index: true
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

noticeSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

export const Notice = mongoose.model('Notice', noticeSchema);
