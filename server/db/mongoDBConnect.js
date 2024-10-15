import mongoose from 'mongoose';

export const connectMongoDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.log('Error while connecting to MongoDB: ', error.message);
    process.exit(1);
  }
};
