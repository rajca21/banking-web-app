import express from 'express';
import * as accountController from '../controllers/account.controller.js';
import { verifyToken } from '../middlewares/verifyToken.js';
import { verifyAdmin } from '../middlewares/verifyAdmin.js';

const router = express.Router();

// POST Endpoints
router.post('/', verifyToken, verifyAdmin, accountController.createAccount);
router.post('/my', verifyToken, accountController.createMyAccount);

// GET Endpoints
router.get('/', verifyToken, verifyAdmin, accountController.getAllAccounts);
router.get('/my', verifyToken, accountController.getMyAccounts);
router.get('/find', verifyToken, accountController.getByAccNumber);
router.get('/:id', verifyToken, accountController.getAccount);

// PUT Endpoints
router.put(
  '/verify/:id',
  verifyToken,
  verifyAdmin,
  accountController.verifyAccount
);

export default router;
