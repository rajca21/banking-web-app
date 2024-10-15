import { Transaction } from '../models/Transaction.model.js';
import { Account } from '../models/Account.model.js';
import { User } from '../models/User.model.js';

// @route:    POST /api/transactions
// @params:   none
// @body:   {
//      userSender: ObjectId
//      userReceiver: ObjectId
//      accountSender: ObjectId
//      accountReceiver: ObjectId
//      description: string
//      amount: number
//  }
// @desc:     Create new Transaction as Admin
export const createTransaction = async (req, res) => {
  const {
    userSender,
    userReceiver,
    accountSender,
    accountReceiver,
    description,
    senderAmount,
    receiverAmount,
  } = req.body;

  try {
    if (
      !userSender ||
      !userReceiver ||
      !accountSender ||
      !accountReceiver ||
      !description ||
      !senderAmount ||
      !receiverAmount
    ) {
      throw new Error('All fields are required');
    }

    const senderExists = await User.findById(userSender);
    if (!senderExists) {
      return res.status(404).json({
        success: false,
        message: 'Sender does not exist',
      });
    }
    const receiverExists = await User.findById(userReceiver);
    if (!receiverExists) {
      return res.status(404).json({
        success: false,
        message: 'Receiver does not exist',
      });
    }
    const senderAccountExists = await Account.findById(accountSender);
    if (!senderAccountExists) {
      return res.status(404).json({
        success: false,
        message: 'Sender account does not exist',
      });
    }
    if (senderAccountExists.user !== userSender) {
      return res.status(403).json({
        success: false,
        message: 'Sender account does not belong to sender',
      });
    }
    const receiverAccountExists = await Account.findById(accountReceiver);
    if (!receiverAccountExists) {
      return res.status(404).json({
        success: false,
        message: 'Receiver account does not exist',
      });
    }
    if (receiverAccountExists.user !== userReceiver) {
      return res.status(403).json({
        success: false,
        message: 'Receiver account does not belong to sender',
      });
    }

    if (senderAccountExists.balance < senderAmount) {
      return res.status(400).json({
        success: false,
        message: 'Not enough funds',
      });
    }

    if (isNaN(senderAmount) || isNaN(receiverAmount)) {
      return res.status(400).json({
        success: false,
        message: 'Amount must be greater than 0',
      });
    }

    senderAccountExists.balance += senderAmount;
    await senderAccountExists.save();
    receiverAccountExists.balance += receiverAmount;
    await receiverAccountExists.save();

    const newTransaction = new Transaction({
      userSender,
      userReceiver,
      accountSender,
      accountReceiver,
      description,
      senderAmount,
      receiverAmount,
      isInternal: userSender === userReceiver,
    });
    await newTransaction.save();

    res.status(201).json({
      success: true,
      message: 'Transaction created',
      transaction: newTransaction,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// @route:    POST /api/transactions/my
// @params:   none
// @body:   {
//      currency: ObjectId
//  }
// @desc:     Create new Transaction for Me
export const createMyTransaction = async (req, res) => {
  const {
    userReceiver,
    accountSender,
    accountReceiver,
    description,
    senderAmount,
    receiverAmount,
  } = req.body;

  try {
    if (
      !userReceiver ||
      !accountSender ||
      !accountReceiver ||
      !description ||
      !senderAmount ||
      !receiverAmount
    ) {
      throw new Error('All fields are required');
    }

    const senderExists = await User.findById(req.userId);
    if (!senderExists) {
      return res.status(404).json({
        success: false,
        message: 'Sender does not exist',
      });
    }
    const receiverExists = await User.findById(userReceiver);
    if (!receiverExists) {
      return res.status(404).json({
        success: false,
        message: 'Receiver does not exist',
      });
    }
    const senderAccountExists = await Account.findById(accountSender);
    if (!senderAccountExists) {
      return res.status(404).json({
        success: false,
        message: 'Sender account does not exist',
      });
    }
    const receiverAccountExists = await Account.findById(accountReceiver);
    if (!receiverAccountExists) {
      return res.status(404).json({
        success: false,
        message: 'Receiver account does not exist',
      });
    }

    if (isNaN(senderAmount) || isNaN(receiverAmount)) {
      return res.status(400).json({
        success: false,
        message: 'Amount must be greater than 0',
      });
    }

    if (senderAccountExists.balance < -senderAmount) {
      return res.status(400).json({
        success: false,
        message: 'Not enough funds',
      });
    }

    senderAccountExists.balance += senderAmount;
    await senderAccountExists.save();
    receiverAccountExists.balance += receiverAmount;
    await receiverAccountExists.save();

    const newTransaction = new Transaction({
      userSender: req.userId,
      userReceiver,
      accountSender,
      accountReceiver,
      description,
      senderAmount,
      receiverAmount,
      isInternal: req.userId === userReceiver,
    });
    await newTransaction.save();

    res.status(201).json({
      success: true,
      message: 'Transaction created',
      transaction: newTransaction,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// @route:    GET /api/transactions
// @params:   none
// @body:     none
// @desc:     Get All Transactions
export const getAllTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find({});

    res.status(200).json({
      success: true,
      transactions: transactions,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// @route:    GET /api/transactions/my
// @query:  {
//      startIndex: string (int)
//      limit: string (int)
//      order: string
//      searchTerm: string
//      account: ObjectID
// }
// @params:   none
// @body:     none
// @desc:     Get My Transactions
export const getMyTransactions = async (req, res) => {
  const startIndex = parseInt(req.query.startIndex) || 0;
  const limit = parseInt(req.query.limit || 5);
  const sortDirection = req.query.order === 'desc' ? -1 : 1;

  try {
    const transactions = await Transaction.find({
      $or: [{ userSender: req.userId }, { userReceiver: req.userId }],
      ...(req.query.searchTerm && {
        description: { $regex: req.query.searchTerm, $options: 'i' },
      }),
      ...(req.query.account && {
        $or: [
          { accountSender: req.query.account },
          { accountReceiver: req.query.account },
        ],
      }),
    })
      .sort({ createdAt: sortDirection })
      .skip(startIndex)
      .limit(limit)
      .populate({
        path: 'accountSender',
        populate: [{ path: 'user', select: '-password' }, { path: 'currency' }],
      })
      .populate({
        path: 'accountReceiver',
        populate: [{ path: 'user', select: '-password' }, { path: 'currency' }],
      })
      .exec();

    const totalTransactions = await Transaction.countDocuments({
      $or: [{ userSender: req.userId }, { userReceiver: req.userId }],
    });

    const filteredTransactions = await Transaction.countDocuments({
      $or: [{ userSender: req.userId }, { userReceiver: req.userId }],
      ...(req.query.searchTerm && {
        description: { $regex: req.query.searchTerm, $options: 'i' },
      }),
      ...(req.query.account && {
        $or: [
          { accountSender: req.query.account },
          { accountReceiver: req.query.account },
        ],
      }),
    });

    res.status(200).json({
      success: true,
      transactions: transactions,
      total: totalTransactions,
      filtered: filteredTransactions,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};
