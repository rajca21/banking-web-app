import { Account } from '../models/Account.model.js';
import { Currency } from '../models/Currency.model.js';
import { User } from '../models/User.model.js';
import { generateAccountNumber } from '../utils/generateVerificationCode.js';

// @route:    POST /api/accounts
// @params:   none
// @body:   {
//      user: ObjectId
//      currency: ObjectId
//      isVerified: boolean
//      number: string
//      balance: number
//  }
// @desc:     Create new Account as Admin
export const createAccount = async (req, res) => {
  const { user, currency, isVerified, number, balance } = req.body;

  try {
    if (!user || !currency || !number) {
      throw new Error('All fields are required');
    }

    const userExists = await User.findById(user);
    if (!userExists) {
      return res.status(404).json({
        success: false,
        message: 'User does not exist',
      });
    }

    const currencyExists = await Currency.findById(currency);
    if (!currencyExists) {
      return res.status(404).json({
        success: false,
        message: 'Currency does not exist',
      });
    }

    const accountExists = await Account.findOne({ number });
    if (accountExists) {
      return res.status(400).json({
        success: false,
        message: 'Account with this number already exists',
      });
    }

    const userAccountExists = await Account.findOne({
      user,
      currency,
    });
    if (userAccountExists) {
      return res.status(400).json({
        success: false,
        message: 'This user already has an account in this currency',
      });
    }

    const newAccount = new Account({
      user,
      currency,
      balance,
      number,
      isVerified,
    });
    await newAccount.save();

    return res.status(201).json({
      success: true,
      message: 'Account created',
      account: newAccount,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// @route:    POST /api/accounts/my
// @params:   none
// @body:   {
//      currency: ObjectId
//  }
// @desc:     Request new Account for Me
export const createMyAccount = async (req, res) => {
  const { currency } = req.body;

  try {
    if (!currency) {
      throw new Error('Currency is required');
    }

    const currencyExists = await Currency.findById(currency);
    if (!currencyExists) {
      return res.status(404).json({
        success: false,
        message: 'Currency does not exist',
      });
    }

    const userAccountExists = await Account.findOne({
      user: req.userId,
      currency,
    });
    if (userAccountExists) {
      return res.status(400).json({
        success: false,
        message: 'You already have an account in this currency',
      });
    }

    const accountNumber = generateAccountNumber(currencyExists.accountPrefix);

    const newAccount = new Account({
      user: req.userId,
      currency,
      number: accountNumber,
    });
    await newAccount.save();

    return res.status(201).json({
      success: true,
      message: 'Account pending',
      account: newAccount,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// @route:    GET /api/accounts
// @params:   none
// @query:    {
//      user: ObjectId
//      currency: ObjectId
// }
// @body:     none
// @desc:     Get All Account
export const getAllAccounts = async (req, res) => {
  try {
    const user = req.query.user;
    const currency = req.query.currency;

    const filter = {};
    if (user) filter.user = user;
    if (currency) filter.currency = currency;

    const accounts = await Account.find(filter)
      .populate({
        path: 'user',
        select: '-password',
      })
      .populate('currency')
      .exec();

    const totalAccounts = await Account.countDocuments();
    const totalFiltered = await Account.countDocuments(filter);

    res.status(200).json({
      success: true,
      accounts,
      total: totalAccounts,
      filtered: totalFiltered,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// @route:    GET /api/accounts/my
// @params:   none
// @body:     none
// @desc:     Get All Account
export const getMyAccounts = async (req, res) => {
  try {
    const accounts = await Account.find({ user: req.userId })
      .populate({
        path: 'user',
        select: '-password',
      })
      .populate('currency')
      .exec();

    const totalAccounts = await Account.countDocuments({ user: req.userId });

    return res.status(200).json({
      success: true,
      accounts,
      total: totalAccounts,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// @route:    GET /api/accounts/find
// @params:   none
// @query:  {
//      number: string
// }
// @body:     none
// @desc:     Get Single Account by Account number
export const getByAccNumber = async (req, res) => {
  const { number } = req.query;

  try {
    const account = await Account.findOne({ number })
      .populate({
        path: 'user',
        select: '-password',
      })
      .populate('currency')
      .exec();

    if (!account) {
      return res.status(404).json({
        success: false,
        message: 'Account not found',
      });
    }

    return res.status(200).json({
      success: true,
      account,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// @route:    GET /api/accounts/:id
// @params: {
//      id: Mongoose ObjectID
//}
// @body:     none
// @desc:     Get Single Account
export const getAccount = async (req, res) => {
  const { id } = req.params;

  try {
    const account = await Account.findById(id)
      .populate({
        path: 'user',
        select: '-password',
      })
      .populate('currency')
      .exec();

    if (!account) {
      return res.status(404).json({
        success: false,
        message: 'Account not found',
      });
    }

    return res.status(200).json({
      success: true,
      account,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// @route:    PUT /api/accounts/verify/:id
// @params: {
//      id: Mongoose ObjectID
//}
// @body:     none
// @desc:     Verify Account
export const verifyAccount = async (req, res) => {
  const { id } = req.params;

  try {
    const updatedAccount = await Account.findByIdAndUpdate(
      id,
      {
        $set: {
          isVerified: true,
        },
      },
      { new: true }
    );
    if (!updatedAccount) {
      return res.status(404).json({
        success: false,
        message: 'Account not found',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Account updated',
      account: updatedAccount,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};
