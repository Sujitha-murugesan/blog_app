const express = require('express');
const db = require('../config/db');
const auth = require('../middleware/auth');

const router = express.Router();

// GET /api/blogs  (public) - list all blogs, newest first
router.get('/', (req, res) => {
  const blogs = db.readAll('blogs').sort((a, b) => b.id - a.id);
  res.json(blogs);
});

// GET /api/blogs/:id  (public)
router.get('/:id', (req, res) => {
  const blog = db.readAll('blogs').find((b) => b.id === Number(req.params.id));
  if (!blog) return res.status(404).json({ message: 'Blog not found.' });
  res.json(blog);
});

// POST /api/blogs  (protected) - create a blog
router.post('/', auth, (req, res) => {
  const title = (req.body.title || '').trim();
  const content = (req.body.content || '').trim();

  if (!title || !content) {
    return res.status(400).json({ message: 'Title and content are required.' });
  }
  if (title.length > 150) {
    return res.status(400).json({ message: 'Title must be 150 characters or fewer.' });
  }

  const blogs = db.readAll('blogs');
  const blog = {
    id: db.nextId(blogs),
    title,
    content,
    authorId: req.user.id,
    authorName: req.user.name,
    createdAt: new Date().toISOString(),
  };
  blogs.push(blog);
  db.writeAll('blogs', blogs);

  res.status(201).json({ message: 'Blog created successfully.', blog });
});

module.exports = router;
