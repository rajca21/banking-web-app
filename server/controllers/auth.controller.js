import bcryptjs from 'bcryptjs';
import crypto from 'crypto';
import { User } from '../models/User.model.js';
import { generateVerificationCode } from '../utils/generateVerificationCode.js';
import { generateTokenAndSetCookie } from '../utils/generateTokenAndSetCookie.js';
import {
  sendForgotPasswordMail,
  sendResetSuccessEmail,
  sendVerificationMail,
  sendWelcomeEmail,
} from '../utils/mail/emails.js';

// @route:    POST /api/auth/signup
// @params:   none
// @body:   {
//      firstName: string
//      lastName: string
//      email: string
//      password: string
//  }
// @desc:     Register new User
export const signup = async (req, res) => {
  const { email, password, firstName, lastName } = req.body;

  try {
    if (!email || !password || !firstName || !lastName) {
      throw new Error('All fields are required');
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({
        success: false,
        message: 'User already exists',
      });
    }

    const hashedPassword = await bcryptjs.hash(password, 10);
    const verificationCode = generateVerificationCode();

    const user = new User({
      email,
      password: hashedPassword,
      firstName,
      lastName,
      verificationToken: verificationCode,
      verificationTokenExpiresAt: Date.now() + 24 * 60 * 60 * 1000, // expires in 24h
    });
    await user.save();

    generateTokenAndSetCookie(res, user._id);
    await sendVerificationMail(user.firstName, user.email, verificationCode);

    return res.status(201).json({
      success: true,
      message: 'User signed up successfully',
      user: {
        ...user._doc,
        password: undefined, // remove password from response (security)
      },
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// @route:    POST /api/auth/verify-email
// @params:   none
// @body:   {
//      email: string
//      code: string
//  }
// @desc:     Verify Users Email
export const verifyEmail = async (req, res) => {
  const { email, code } = req.body;

  try {
    const user = await User.findOne({
      email,
      verificationToken: code,
      verificationTokenExpiresAt: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired verification code',
      });
    }

    user.isVerified = true;
    user.verificationToken = undefined;
    user.verificationTokenExpiresAt = undefined;

    await user.save();
    await sendWelcomeEmail(user.email, user.firstName);

    res.status(200).json({
      success: true,
      message: 'Account verified successfully',
      user: {
        ...user._doc,
        password: undefined,
      },
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// @route:    POST /api/auth/login
// @params:   none
// @body:   {
//      email: string
//      password: string
//  }
// @desc:     Login User
export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Wrong credentials',
      });
    }

    const isPasswordValid = await bcryptjs.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({
        success: false,
        message: 'Wrong credentials',
      });
    }

    if (!user.isVerified) {
      return res.status(400).json({
        success: false,
        message: "Your account hasn't been verified! Check your email",
      });
    }

    generateTokenAndSetCookie(res, user._id);

    res.status(200).json({
      success: true,
      message: 'User logged in successfully',
      user: {
        ...user._doc,
        password: undefined,
      },
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// @route:    POST /api/auth/logout
// @params:   none
// @body:     none
// @desc:     Logout User
export const logout = async (req, res) => {
  try {
    res.clearCookie('token');
    res.status(200).json({
      success: true,
      message: 'User logged out successfully',
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// @route:    POST /api/auth/forgot-password
// @params:   none
// @body:   {
//      email: string
//  }
// @desc:     Start Reset Password Session
export const forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'User not found',
      });
    }

    const resetToken = crypto.randomBytes(20).toString('hex');
    const resetTokenExpiresAt = Date.now() + 1 * 60 * 60 * 1000; // 1 hour

    user.resetPasswordToken = resetToken;
    user.resetPasswordExpiresAt = resetTokenExpiresAt;
    await user.save();

    await sendForgotPasswordMail(
      user.email,
      user.firstName,
      `${process.env.CLIENT_URL}/reset-password/${resetToken}/${email}`
    );

    res.status(200).json({
      success: true,
      message: 'Password reset link sent to your email',
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// @route:    POST /api/auth/reset-password
// @params:   {
//      token: string
//  }
// @body:   {
//      email: string
//      password: string
//  }
// @desc:     Change Users Password
export const resetPassword = async (req, res) => {
  const { token } = req.params;
  const { password, email } = req.body;

  try {
    const user = await User.findOne({
      email,
      resetPasswordToken: token,
      resetPasswordExpiresAt: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired reset password session',
      });
    }

    const hashedPassword = await bcryptjs.hash(password, 10);
    user.password = hashedPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpiresAt = undefined;
    await user.save();

    sendResetSuccessEmail(user.email, user.firstName);

    res.status(200).json({
      success: true,
      message: 'Password reset successfull',
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// @route:    GET /api/auth/check-auth
// @params:   none
// @body:     none
// @desc:     Check if user is Logged In (cookie)
export const checkAuth = async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'User authenticated',
      user: {
        ...user._doc,
        password: undefined,
      },
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// @route:    PUT /api/auth/update-user-info
// @params:   none
// @body:   {
//      firstName: string
//      lastName: string
//      pin: string
//  }
// @desc:     Update User Info
export const updateUserInfo = async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    if (req.body.password) {
      req.body.password = bcryptjs.hashSync(req.body.password, 10);
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.userId,
      {
        $set: {
          firstName: req.body.firstName,
          lastName: req.body.lastName,
          userPin: req.body.pin,
        },
      },
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: 'User logged in successfully',
      user: {
        ...updatedUser._doc,
        password: undefined,
      },
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};
