const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

// Middleware to parse JSON bodies
app.use(express.json());

// In-memory store for comments (for demo purposes)
let comments = [];

// Endpoint to submit a new comment
app.post('/api/comments', (req, res) => {
  const { comment, country } = req.body;
  if (!comment || !country) {
    return res.status(400).json({ error: 'Missing comment or country.' });
  }
  const newComment = {
    id: comments.length + 1,
    comment,
    country,
    timestamp: new Date()
  };
  comments.push(newComment);
  res.status(201).json(newComment);
});

// Endpoint to retrieve all comments
app.get('/api/comments', (req, res) => {
  res.json(comments);
});

// Serve static files (your front-end)
app.use(express.static('public')); // Place your HTML/CSS/JS files in a folder named "public"

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
