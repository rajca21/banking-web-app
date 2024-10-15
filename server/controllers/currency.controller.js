import { Currency } from '../models/Currency.model.js';

// @route:    POST /api/currencies
// @params: {
//      id: Mongoose ObjectID
//}
// @body:   {
//      name: string
//      code: string
//      accountPrefix: string
//  }
// @desc:     Create New Currency
export const createCurrency = async (req, res) => {
  const { name, code, accountPrefix, toEur, fromEur } = req.body;

  try {
    if (!name || !code || !accountPrefix) {
      throw new Error('All fields are required');
    }

    const newCurrency = new Currency({
      name,
      code,
      accountPrefix,
      toEur,
      fromEur,
    });
    await newCurrency.save();

    return res.status(201).json({
      success: true,
      message: 'Currency created successfully',
      currency: newCurrency,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// @route:    GET /api/currencies
// @params:   none
// @body:     none
// @desc:     Get All Currencies
export const getCurrencies = async (req, res) => {
  try {
    const currencies = await Currency.find({});

    return res.status(200).json({
      success: true,
      currencies,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// @route:    GET /api/currencies/:id
// @params: {
//      id: Mongoose ObjectID
//}
// @body:     none
// @desc:     Get Single Currency
export const getCurrency = async (req, res) => {
  const { id } = req.params;

  try {
    const currency = await Currency.findById(id);
    if (!currency) {
      return res.status(404).json({
        success: false,
        message: 'Currency not found',
      });
    }

    return res.status(200).json({
      success: true,
      currency,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// @route:    PUT /api/currencies/:id
// @params: {
//      id: Mongoose ObjectID
//}
// @body:   {
//      name: string
//      code: string
//      accountPrefix: string
//  }
// @desc:     Update Currency
export const updateCurrency = async (req, res) => {
  const { id } = req.params;

  try {
    const updatedCurrency = await Currency.findByIdAndUpdate(
      id,
      {
        $set: {
          name: req.body.name,
          code: req.body.code,
          accountPrefix: req.body.accountPrefix,
        },
      },
      { new: true }
    );
    if (!updatedCurrency) {
      return res.status(404).json({
        success: false,
        message: 'Currency not found',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Currency updated',
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// @route:    DELETE /api/currencies/:id
// @params: {
//      id: Mongoose ObjectID
//}
// @body:     none
// @desc:     Delete Currency
export const deleteCurrency = async (req, res) => {
  const { id } = req.params;

  try {
    await Currency.findByIdAndDelete(id);

    return res.status(200).json({
      success: true,
      message: 'Currency deleted',
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};
