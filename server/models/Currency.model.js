import mongoose from 'mongoose';

const CurrencySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    code: {
      type: String,
      required: true,
      unique: true,
    },
    accountPrefix: {
      type: String,
      required: true,
      unique: true,
    },
    toEur: {
      type: Number,
      default: 1,
    },
    fromEur: {
      type: Number,
      default: 1,
    },
  },
  { timestamps: true }
);

export const Currency = mongoose.model('Currency', CurrencySchema);
