import mongoose from 'mongoose';

const TransactionSchema = new mongoose.Schema(
  {
    userSender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    userReceiver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    accountSender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Account',
      required: true,
    },
    accountReceiver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Account',
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    senderAmount: {
      type: Number,
      required: true,
    },
    receiverAmount: {
      type: Number,
      required: true,
    },
    isInternal: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export const Transaction = mongoose.model('Transaction', TransactionSchema);
