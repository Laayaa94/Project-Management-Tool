// routes/userRoutes.js

const express = require('express');
const router = express.Router();
const userController=require('../controllers/userController')
const authenticateUser = require('../middleware/authmiddleware');

// Search for a user by email
router.get('/email/:email', authenticateUser, userController.searchUserByEmail);
module.exports = router;
