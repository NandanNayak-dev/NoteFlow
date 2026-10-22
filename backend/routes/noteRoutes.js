import express from 'express';
import Note from '../models/Note.js';

const router = express.Router();

// Helper to sanitize slug
const sanitizeSlug = (slug) => {
  return String(slug || '')
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9_-]/g, '-');
};

/**
 * @route   GET /api/notes/:slug
 * @desc    Fetch note by slug or auto-create a new one if it does not exist (Zero Friction)
 */
router.get('/:slug', async (req, res) => {
  try {
    const slug = sanitizeSlug(req.params.slug);
    if (!slug) {
      return res.status(400).json({ error: 'Valid note slug is required' });
    }

    let note = await Note.findOne({ slug });

    // Zero-friction: Auto-create note if not found
    if (!note) {
      note = await Note.create({
        slug,
        content: '',
      });

      return res.status(201).json({
        slug: note.slug,
        content: note.content,
        expiryDate: null,
        createdAt: note.createdAt,
        updatedAt: note.updatedAt,
        isNewNote: true,
      });
    }

    // Check if expired (in case TTL has a slight delay)
    if (note.expiryDate && new Date() > note.expiryDate) {
      await Note.deleteOne({ _id: note._id });
      note = await Note.create({ slug, content: '' });
      return res.status(200).json({
        slug: note.slug,
        content: note.content,
        expiryDate: null,
        createdAt: note.createdAt,
        updatedAt: note.updatedAt,
      });
    }

    // Increment view count
    note.viewsCount = (note.viewsCount || 0) + 1;
    await note.save();

    return res.status(200).json({
      slug: note.slug,
      content: note.content,
      expiryDate: note.expiryDate,
      createdAt: note.createdAt,
      updatedAt: note.updatedAt,
      viewsCount: note.viewsCount,
    });
  } catch (error) {
    console.error('Error fetching/creating note:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * @route   PUT /api/notes/:slug
 * @desc    Update note content or expiry date
 */
router.put('/:slug', async (req, res) => {
  try {
    const slug = sanitizeSlug(req.params.slug);
    const { content, expiryDate } = req.body;

    let note = await Note.findOne({ slug });
    if (!note) {
      note = new Note({ slug, content: content || '' });
    }

    // Update content if provided
    if (typeof content === 'string') {
      note.content = content;
    }

    // Expiry date updates
    if (expiryDate !== undefined) {
      note.expiryDate = expiryDate ? new Date(expiryDate) : null;
    }

    await note.save();

    return res.status(200).json({
      success: true,
      slug: note.slug,
      content: note.content,
      expiryDate: note.expiryDate,
      updatedAt: note.updatedAt,
    });
  } catch (error) {
    console.error('Error updating note:', error);
    res.status(500).json({ error: 'Failed to update note' });
  }
});

export default router;
