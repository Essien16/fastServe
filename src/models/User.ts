import * as mongoose from 'mongoose';
import { model } from 'mongoose';

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  email_verified: {
    type: Boolean,
    required: true,
    default: false,
  },
  verification_token_for_email: {
    type: String,
    required: true,
  },
  verification_token_time: {
    type: Date,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  reset_password_token: {
    type: String,
    reqired: false,
  },
  reset_password_token_time: {
    type: Date,
    require: false,
  },
  name: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
  created_at: {
    type: Date,
    required: true,
    default: new Date(),
  },
  updated_at: {
    type: Date,
    required: true,
    default: new Date(),
  },
});

export default model('users', userSchema);
