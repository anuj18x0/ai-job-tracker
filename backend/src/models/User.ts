import mongoose, { Schema, Document } from 'mongoose';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  isVerified: boolean;
  verificationToken?: string;
  resetPasswordToken?: string;
  resetPasswordExpire?: Date;
  matchPassword(password: string): Promise<boolean>;
  getVerificationToken(): string;
  getResetPasswordToken(): string;
  resumeText?: string;
  resumeLastUpdated?: Date;
}

const UserSchema: Schema = new Schema({
  name: {
    type: String,
    required: [true, 'Please add a name'],
  },
  email: {
    type: String,
    required: [true, 'Please add an email'],
    unique: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Please add a valid email',
    ],
  },
  password: {
    type: String,
    required: [true, 'Please add a password'],
    minlength: 6,
    select: false,
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  resumeText: String,
  resumeLastUpdated: Date,
  verificationToken: String,
  resetPasswordToken: String,
  resetPasswordExpire: Date,
}, {
  timestamps: true,
});

// Encrypt password using bcrypt
UserSchema.pre<IUser>('save', async function() {
  if (!this.isModified('password')) {
    return;
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Match user-entered password to hashed password in database
UserSchema.methods.matchPassword = async function(enteredPassword: string) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Generate and hash verification token
UserSchema.methods.getVerificationToken = function() {
  const token = crypto.randomBytes(32).toString('hex');
  this.verificationToken = crypto.createHash('sha256').update(token).digest('hex');
  return token;
};

// Generate and hash password reset token
UserSchema.methods.getResetPasswordToken = function() {
  const resetToken = crypto.randomBytes(20).toString('hex');
  this.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
  this.resetPasswordExpire = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
  return resetToken;
};

export default mongoose.model<IUser>('User', UserSchema);
