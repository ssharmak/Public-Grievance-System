
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Grievance from './models/Grievance.js';
import User from './models/User.js';

dotenv.config();

const checkDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to DB');

    const grievanceCount = await Grievance.countDocuments({});
    console.log('Total Grievances:', grievanceCount);

    if (grievanceCount > 0) {
      const g = await Grievance.findOne({});
      console.log('Sample Grievance:', JSON.stringify(g, null, 2));
    }

    const userCount = await User.countDocuments({});
    console.log('Total Users:', userCount);

    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

checkDB();
