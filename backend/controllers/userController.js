// controllers/userController.js

const User = require('../models/User');


// Function to fetch user by ID
const getUserById = async (req, res) => {
  const { userId } = req.params;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json(user);
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ message: 'Failed to fetch user', error: error.message });
  }
};

// Function to search user by email
const searchUserByEmail = async (req, res) => {
  const { email } = req.params;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    console.error('Error searching user by email:', error);
    res.status(500).json({ message: 'Failed to search user by email', error: error.message });
  }
};

const getProjectsByUserId = async (userId) => {
  try {
    console.log('Fetching projects for user with userId:', userId);
    const user = await User.findById(userId).populate('projects'); // Populate 'projects' field
    if (!user) {
      throw new Error('User not found');
    }
    return user.projects; // Return the populated projects array
  } catch (error) {
    console.error('Error fetching projects for user:', error);
    throw error; // Handle or rethrow the error as needed
  }
};


module.exports = {
  getUserById,
  searchUserByEmail,
  getProjectsByUserId,
 
 

};
