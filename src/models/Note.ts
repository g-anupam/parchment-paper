import mongoose from 'mongoose';

const NoteSchema = new mongoose.Schema({
  title: String,
  content: String,

  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export const Note =
  mongoose.models.Note || mongoose.model('Note', NoteSchema);
