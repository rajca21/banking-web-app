import express from 'express';
import * as authController from '../controllers/auth.controller.js';
import { verifyToken } from '../middlewares/verifyToken.js';

const router = express.Router();

// POST Endpoints
router.post('/signup', authController.signup);
router.post('/verify-email', authController.verifyEmail);
router.post('/login', authController.login);
router.post('/logout', authController.logout);
router.post('/forgot-password', authController.forgotPassword);

// GET Endpoints
router.get('/check-auth', verifyToken, authController.checkAuth);

// PUT Endpoints
router.put('/reset-password/:token', authController.resetPassword);
router.put('/update-user-info', verifyToken, authController.updateUserInfo);

export default router;
