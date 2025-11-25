
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Grievance from './models/Grievance.js';

dotenv.config();

const checkDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    const count = await Grievance.countDocuments({});
    console.log('COUNT:' + count);
    process.exit(0);
  } catch (error) {
    console.log('ERROR');
    process.exit(1);
  }
};

checkDB();
