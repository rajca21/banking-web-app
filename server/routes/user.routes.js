import express from 'express';
import * as userController from '../controllers/user.controller.js';
import { verifyToken } from '../middlewares/verifyToken.js';
import { verifyAdmin } from '../middlewares/verifyAdmin.js';

const router = express.Router();

// POST Endpoints
router.get('/', verifyToken, verifyAdmin, userController.getUsers);

export default router;
