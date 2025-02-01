import dotenv from 'dotenv';
import createHttpError from 'http-errors';
import User from '../../models/user.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

dotenv.config();

// Register Controller
const registerUsers = async (req, res, next) => {
  const { userName, email, password } = req.body;

  try {
    // Validate input
    if (!userName || !email || !password) {
      return next(createHttpError(400, 'All fields are required.'));
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return next(createHttpError(400, 'User already exists. Please login.'));
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const newUser = new User({
      userName,
      email,
      password: hashedPassword,
    });

    await newUser.save();

    res.status(201).json({
      success: true,
      message: 'Registration successful.',
    });
  } catch (error) {
    console.error('Registration error:', error);
    next(createHttpError(500, 'An error occurred during registration.'));
  }
};

// Login Controller
const loginUsers = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    // Validate input
    if (!email || !password) {
      return next(createHttpError(400, 'Email and password are required.'));
    }

    // Check if user exists
    const checkUser = await User.findOne({ email });
    if (!checkUser) {
      return res.status(404).json({
        success: false,
        message: 'User does not exist. Please register first.',
      });
    }

    // Compare passwords
    const isPasswordMatch = await bcrypt.compare(password, checkUser.password);
    if (!isPasswordMatch) {
      return res.status(401).json({
        success: false,
        message: 'Incorrect password.',
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: checkUser._id, email: checkUser.email },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    }).json({
      success: true,
      message: 'Logged in successfully.',
      user: {
        email: checkUser.email,
        id: checkUser._id,
      },
      token: token,
    });
  } catch (error) {
    console.error('Login error:', error);
    next(createHttpError(500, 'An error occurred during login.'));
  }
};

// Logout Controller
const logoutUsers = (req, res, next) => {
  try {
    res.clearCookie('token', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
    }).json({
      success: true,
      message: 'Logged out successfully.',
    });
  } catch (error) {
    console.error('Logout error:', error);
    next(createHttpError(500, 'An error occurred during logout.'));
  }
};
// auth middleware
const authMiddleware = async (req ,res,next)=>{
  const token = req.cookies.token;
  if(!token){
    return res.status(401).json({
      success:false,
      message:"Unauthorized"
    })
  }
  try{
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next()
  }catch(error){
    res.status(401).json({
    success : false,
    message :'Unauthorised user!'
    })
  }
}

export { registerUsers, loginUsers, logoutUsers,authMiddleware };
