const User = require('../models/user');

// GET /api/users/me - Get current user details
exports.getCurrentUser = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId).select('-password');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    return res.json({
      id: user._id,
      email: user.email,
      username: user.username
    });
  } catch (err) {
    console.error('Error fetching user:', err);
    return res.status(500).json({ message: 'Server error fetching user details' });
  }
}; 