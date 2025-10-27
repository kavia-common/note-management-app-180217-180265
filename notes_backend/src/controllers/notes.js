const { v4: uuidv4 } = require('uuid');

/**
 * In-memory store for notes.
 * This is a simple array and will reset when the process restarts.
 * Note structure:
 * {
 *   id: string,
 *   title: string,
 *   content: string,
 *   createdAt: ISOString,
 *   updatedAt: ISOString
 * }
 */
const notes = [];

// Helper to find note index by id
function findNoteIndex(id) {
  return notes.findIndex((n) => n.id === id);
}

class NotesController {
  // PUBLIC_INTERFACE
  /**
   * List all notes.
   * Query params:
   *  - q: optional search query to filter by title or content (case-insensitive substring)
   */
  list(req, res) {
    const { q } = req.query || {};
    let data = notes;
    if (q && typeof q === 'string') {
      const term = q.toLowerCase();
      data = notes.filter(
        (n) =>
          (n.title && n.title.toLowerCase().includes(term)) ||
          (n.content && n.content.toLowerCase().includes(term))
      );
    }
    return res.status(200).json({ items: data, count: data.length });
  }

  // PUBLIC_INTERFACE
  /**
   * Get a note by id.
   */
  getById(req, res) {
    const { id } = req.params;
    const note = notes.find((n) => n.id === id);
    if (!note) {
      return res.status(404).json({ error: 'Note not found' });
    }
    return res.status(200).json(note);
  }

  // PUBLIC_INTERFACE
  /**
   * Create a new note.
   * Body:
   *  - title: string (required, non-empty)
   *  - content: string (required, non-empty)
   */
  create(req, res) {
    const { title, content } = req.body || {};

    // Basic validation
    if (typeof title !== 'string' || title.trim().length === 0) {
      return res.status(400).json({ error: 'Title is required and must be a non-empty string' });
    }
    if (typeof content !== 'string' || content.trim().length === 0) {
      return res.status(400).json({ error: 'Content is required and must be a non-empty string' });
    }

    const now = new Date().toISOString();
    const note = {
      id: uuidv4(),
      title: title.trim(),
      content: content.trim(),
      createdAt: now,
      updatedAt: now,
    };
    notes.push(note);
    return res.status(201).json(note);
  }

  // PUBLIC_INTERFACE
  /**
   * Update an existing note by id.
   * Body:
   *  - title: string (optional, non-empty if provided)
   *  - content: string (optional, non-empty if provided)
   */
  update(req, res) {
    const { id } = req.params;
    const idx = findNoteIndex(id);
    if (idx === -1) {
      return res.status(404).json({ error: 'Note not found' });
    }

    const { title, content } = req.body || {};
    if (title !== undefined && (typeof title !== 'string' || title.trim().length === 0)) {
      return res.status(400).json({ error: 'If provided, title must be a non-empty string' });
    }
    if (content !== undefined && (typeof content !== 'string' || content.trim().length === 0)) {
      return res.status(400).json({ error: 'If provided, content must be a non-empty string' });
    }
    if (title === undefined && content === undefined) {
      return res.status(400).json({ error: 'Provide at least one of title or content to update' });
    }

    const current = notes[idx];
    const updated = {
      ...current,
      title: title !== undefined ? title.trim() : current.title,
      content: content !== undefined ? content.trim() : current.content,
      updatedAt: new Date().toISOString(),
    };
    notes[idx] = updated;
    return res.status(200).json(updated);
  }

  // PUBLIC_INTERFACE
  /**
   * Delete a note by id.
   */
  delete(req, res) {
    const { id } = req.params;
    const idx = findNoteIndex(id);
    if (idx === -1) {
      return res.status(404).json({ error: 'Note not found' });
    }
    const [removed] = notes.splice(idx, 1);
    return res.status(200).json({ success: true, deletedId: removed.id });
  }
}

module.exports = new NotesController();
