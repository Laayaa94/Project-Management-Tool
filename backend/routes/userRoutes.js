const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authenticateUser = require('../middleware/authmiddleware');



// Route to get projects associated with a user by userId
router.get('/:userId/projects', async (req, res) => {
    const { userId } = req.params;

    try {
        const projects = await userController.getProjectsByUserId(userId); // Call the controller function
        res.status(200).json(projects);
    } catch (error) {
        console.error('Error fetching projects for user:', error);
        res.status(500).json({ error: 'Error fetching projects for user' });
    }
});

// Search for a user by email (with authentication middleware)
router.get('/email/:email', authenticateUser, userController.searchUserByEmail);





module.exports = router;
