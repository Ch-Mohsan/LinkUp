const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Generate JWT Token
const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: '30d'
  });
};

exports.registerUser = async (req, res) => {
  const { username, name, email, password, isPrivate } = req.body;
  
  try {
    // Check if user already exists
    const existingUser = await User.findOne({ 
      $or: [{ email }, { username }] 
    });
    
    if (existingUser) {
      return res.status(400).json({ 
        message: existingUser.email === email 
          ? 'Email already exists' 
          : 'Username already exists' 
      });
    }

    // Create new user
    const newUser = new User({ 
      username, 
      name, 
      email, 
      password,
      isPrivate: typeof isPrivate === 'boolean' ? isPrivate : false
    });
    
    await newUser.save();

    // Generate token
    const token = generateToken(newUser._id);

    res.status(201).json({ 
      message: 'User registered successfully', 
      token,
      user: newUser.getPublicProfile()
    });
    
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ 
      message: "Error registering user", 
      error: error.message 
    });   
  }
};

exports.loginUser = async (req, res) => {
  const { email, password } = req.body;
  
  try {
    // Check if user exists
    const user = await User.findOne({ email }).select('+password');
    
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Generate token
    const token = generateToken(user._id);

    // Update last seen
    user.lastSeen = new Date();
    user.isOnline = true;
    await user.save();

    res.status(200).json({ 
      message: 'Login successful', 
      token,
      user: user.getPublicProfile()
    });
        
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ 
      message: "Error logging in user", 
      error: error.message 
    });   
  }
};

exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    res.status(200).json({ user: user.getPublicProfile() });
  } catch (error) {
    console.error('Get me error:', error);
    res.status(500).json({ 
      message: "Error fetching user data", 
      error: error.message 
    });
  }
};

exports.logout = async (req, res) => {
  try {
    // Update user status
    await User.findByIdAndUpdate(req.user._id, {
      isOnline: false,
      lastSeen: new Date()
    });

    res.status(200).json({ message: 'Logged out successfully' });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({ 
      message: "Error logging out", 
      error: error.message 
    });
  }
};
