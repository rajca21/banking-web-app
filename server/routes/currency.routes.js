import express from 'express';
import * as currencyController from '../controllers/currency.controller.js';
import { verifyToken } from '../middlewares/verifyToken.js';
import { verifyAdmin } from '../middlewares/verifyAdmin.js';

const router = express.Router();

// POST Endpoints
router.post('/', verifyToken, verifyAdmin, currencyController.createCurrency);

// GET Endpoints
router.get('/', verifyToken, currencyController.getCurrencies);
router.get('/:id', verifyToken, currencyController.getCurrency);

// PUT Endpoints
router.put('/:id', verifyToken, verifyAdmin, currencyController.updateCurrency);

// DELETE Endpoints
router.delete(
  '/:id',
  verifyToken,
  verifyAdmin,
  currencyController.deleteCurrency
);

export default router;
