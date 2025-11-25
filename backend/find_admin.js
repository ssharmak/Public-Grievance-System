
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';

dotenv.config();

const findAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to DB');

    const admin = await User.findOne({ role: { $in: ['admin', 'superadmin'] } });
    
    if (admin) {
      console.log('Admin Found:');
      console.log('Email:', admin.email);
      console.log('Role:', admin.role);
      // We can't show password, but we confirm existence.
    } else {
      console.log('No admin user found.');
    }

    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

findAdmin();
