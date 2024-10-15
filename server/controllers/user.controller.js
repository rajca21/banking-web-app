import { User } from '../models/User.model.js';

// @route:    GET /api/users
// @params:   none
// @body:     none
// @desc:     Get All Users
export const getUsers = async (req, res) => {
  try {
    const users = await User.find({});

    res.status(200).json({
      success: true,
      users,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};
