// controllers/teamMembersController.js
const mongoose = require('mongoose');


const User = require('../models/User');





const addTeamMember = async (req, res) => {
  const { userId } = req.params;
  const { memberId, position } = req.body;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const existingMember = user.teamMembers.find(member => member.memberId.equals(memberId));
    if (existingMember) {
      return res.status(400).json({ message: 'Member already exists in team' });
    }

    user.teamMembers.push({ memberId, position });
    await user.save();

    res.status(201).json(user.teamMembers);
  } catch (error) {
    console.error('Error adding team member:', error);
    res.status(500).json({ message: 'Failed to add team member', error: error.message });
  }
};




const removeTeamMember = async (req, res) => {
  const { userId, memberId } = req.params;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Log the team members and the memberId for debugging
    console.log('Current team members:', user.teamMembers);
    console.log('Member ID to remove:', memberId);

    // Filter out the team member by memberId
    user.teamMembers = user.teamMembers.filter(member => {
      console.log('Checking member:', member);
      return member.memberId && !member.memberId.equals(memberId);
    });

    await user.save();

    res.status(200).json(user.teamMembers);
  } catch (error) {
    console.error('Error removing team member:', error);
    res.status(500).json({ message: 'Failed to remove team member', error: error.message });
  }
};

// Get all team members of a user
const getAllTeamMembers = async (req, res) => {
  const { userId } = req.params;

  try {
    const user = await User.findById(userId).populate('teamMembers.memberId', 'name email role');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Log the team members for debugging
    console.log('Team members:', user.teamMembers);

    res.status(200).json(user.teamMembers);
  } catch (error) {
    console.error('Error fetching team members:', error);
    res.status(500).json({ message: 'Failed to fetch team members', error: error.message });
  }
};


module.exports = {
  addTeamMember,
  removeTeamMember,
  getAllTeamMembers,
};
