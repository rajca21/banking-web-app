import express from 'express';
import * as transactionController from '../controllers/transaction.controller.js';
import { verifyToken } from '../middlewares/verifyToken.js';
import { verifyAdmin } from '../middlewares/verifyAdmin.js';

const router = express.Router();

// POST Endpoints
router.post(
  '/',
  verifyToken,
  verifyAdmin,
  transactionController.createTransaction
);
router.post('/my', verifyToken, transactionController.createMyTransaction);

// GET Endpoints
router.get(
  '/',
  verifyToken,
  verifyAdmin,
  transactionController.getAllTransactions
);
router.get('/my', verifyToken, transactionController.getMyTransactions);

export default router;
