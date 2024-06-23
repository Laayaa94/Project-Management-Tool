// controllers/userController.js

const User = require('../models/User');

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

module.exports = {
  getUserById,
};

// Search user by email
const searchUserByEmail = async (req, res) => {
  const { email } = req.params;

  try {
    const user = await User.findOne({ email });
    if (!user) {pro
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    console.error('Error searching user by email:', error);
    res.status(500).json({ message: 'Failed to search user by email', error: error.message });
  }
};

module.exports = {
  searchUserByEmail,
 
};
