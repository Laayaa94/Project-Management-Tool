const express = require('express');
const router = express.Router();
const teamMembersController = require('../controllers/teamMembersController');
const authenticateUser = require('../middleware/authmiddleware'); // Ensure you have your authentication middleware imported and set up correctly

// Add a team member to a user's team
router.post('/:userId/add', authenticateUser, teamMembersController.addTeamMember);


// Remove a team member
router.delete('/:userId/remove/:memberId', authenticateUser, teamMembersController.removeTeamMember);
// Get all team members of a user
router.get('/:userId/get', authenticateUser, teamMembersController.getAllTeamMembers);

module.exports = router;
