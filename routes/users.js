const express = require('express');
const router = express.Router();

// GET /users
router.get('/', (req, res) => {
    // Logic to fetch all users
    res.send('Get all users');
});

// GET /users/:id
router.get('/:id', (req, res) => {
    const userId = req.params.id;
    // Logic to fetch a specific user by ID
    res.send(`Get user with ID ${userId}`);
});

// POST /users
router.post('/', (req, res) => {
    // Logic to create a new user
    res.send('Create a new user');
});

// PUT /users/:id
router.put('/:id', (req, res) => {
    const userId = req.params.id;
    // Logic to update a specific user by ID
    res.send(`Update user with ID ${userId}`);
});

module.exports = router;