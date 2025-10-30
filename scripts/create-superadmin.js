import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables from parent directory
dotenv.config({ path: join(__dirname, '..', '.env') });

// User Schema (matching your backend model)
const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
  },
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user',
  },
  avatar: {
    type: String,
    default: null,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
}, {
  timestamps: true,
});

const User = mongoose.model('User', UserSchema);

async function createSuperAdmin() {
  try {
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');

    // Check if superadmin already exists
    const existingAdmin = await User.findOne({ username: 'pgo.superadmin' });
    
    if (existingAdmin) {
      console.log('⚠️  Superadmin already exists!');
      console.log('👤 Username:', existingAdmin.username);
      console.log('📧 Email:', existingAdmin.email);
      console.log('📛 Name:', existingAdmin.name);
      console.log('🔑 Role:', existingAdmin.role);
      console.log('📅 Created:', existingAdmin.createdAt);
      console.log('\n❌ Skipping creation to avoid duplicates.');
      process.exit(0);
    }

    // Hash the password
    console.log('🔐 Hashing password...');
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('superadmin2025', salt);

    // Create superadmin user
    console.log('👤 Creating superadmin account...');
    const superAdmin = await User.create({
      username: 'pgo.superadmin',
      name: 'PGO Super Administrator',
      email: 'pgo.superadmin@bataan.gov.ph',
      password: hashedPassword,
      role: 'admin',
      isActive: true,
      avatar: null,
    });

    console.log('\n✅ Superadmin account created successfully!\n');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📋 SUPERADMIN CREDENTIALS');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('🔑 Username:  ', superAdmin.username);
    console.log('🔒 Password:  ', 'superadmin2025');
    console.log('📛 Name:      ', superAdmin.name);
    console.log('📧 Email:     ', superAdmin.email);
    console.log('👑 Role:      ', superAdmin.role);
    console.log('🆔 User ID:   ', superAdmin._id);
    console.log('📅 Created:   ', superAdmin.createdAt);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    console.log('⚠️  IMPORTANT: Keep these credentials secure!\n');

    process.exit(0);
  } catch (error) {
    console.error('\n❌ Error creating superadmin:');
    console.error(error.message);
    process.exit(1);
  }
}

// Run the script
console.log('🚀 Starting Superadmin Creation Script...\n');
createSuperAdmin();
