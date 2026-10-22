import mongoose from 'mongoose';

const NoteSchema = new mongoose.Schema(
  {
    slug: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    content: {
      type: String,
      default: '',
    },
    expiryDate: {
      type: Date,
      default: null,
    },
    viewsCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true, // Automatically manages createdAt and updatedAt
  }
);

// Auto-delete note after expiry date passes
NoteSchema.index({ expiryDate: 1 }, { expireAfterSeconds: 0 });

export default mongoose.model('Note', NoteSchema);
