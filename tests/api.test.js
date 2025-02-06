const request = require('supertest');
const express = require('express');

// Create a new instance of the Express application for testing.
const app = express();
app.use(express.json());

// In-memory store for comments (this will be reset before each test)
let comments = [];

// API endpoint to submit a new comment
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

// API endpoint to retrieve all comments
app.get('/api/comments', (req, res) => {
  res.json(comments);
});

// Test suite for the Comments API
describe('Comments API', () => {
  // Reset the comments array before each test
  beforeEach(() => {
    comments = [];
  });

  test('GET /api/comments returns an empty array initially', async () => {
    const response = await request(app).get('/api/comments');
    expect(response.statusCode).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBe(0);
  });

  test('POST /api/comments successfully adds a comment', async () => {
    const newCommentData = { comment: 'Test comment', country: 'US' };
    const response = await request(app)
      .post('/api/comments')
      .send(newCommentData);
    expect(response.statusCode).toBe(201);
    expect(response.body).toHaveProperty('id');
    expect(response.body.comment).toBe(newCommentData.comment);
    expect(response.body.country).toBe(newCommentData.country);
    // Validate that a valid timestamp is returned
    expect(new Date(response.body.timestamp)).toBeInstanceOf(Date);
  });

  test('POST /api/comments returns 400 if the comment is missing', async () => {
    const newCommentData = { country: 'US' };
    const response = await request(app)
      .post('/api/comments')
      .send(newCommentData);
    expect(response.statusCode).toBe(400);
    expect(response.body).toHaveProperty('error');
  });

  test('POST /api/comments returns 400 if the country is missing', async () => {
    const newCommentData = { comment: 'Test comment' };
    const response = await request(app)
      .post('/api/comments')
      .send(newCommentData);
    expect(response.statusCode).toBe(400);
    expect(response.body).toHaveProperty('error');
  });

  test('GET /api/comments returns comments after adding one', async () => {
    // Add a comment first
    const newCommentData = { comment: 'Another test comment', country: 'GB' };
    await request(app).post('/api/comments').send(newCommentData);
    const response = await request(app).get('/api/comments');
    expect(response.statusCode).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBe(1);
    expect(response.body[0].comment).toBe(newCommentData.comment);
    expect(response.body[0].country).toBe(newCommentData.country);
  });
});
