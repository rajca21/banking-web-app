import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import path from 'path';
import { connectMongoDB } from './db/mongoDBConnect.js';
import authRoutes from './routes/auth.routes.js';
import userRoutes from './routes/user.routes.js';
import currencyRoutes from './routes/currency.routes.js';
import accountRoutes from './routes/account.routes.js';
import transactionRoutes from './routes/transaction.routes.js';

dotenv.config();

const port = process.env.PORT || 8000;
const app = express();
const __dirname = path.resolve();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  })
);
app.use(cookieParser());

app.get('/api', (req, res) => {
  res.send('Mobile Banking Server is up');
});

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/currencies', currencyRoutes);
app.use('/api/accounts', accountRoutes);
app.use('/api/transactions', transactionRoutes);

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '/client/dist')));
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'dist', 'index.html'));
  });
}

app.listen(port, () => {
  connectMongoDB();
  console.log('Server is running on port 8000');
});
