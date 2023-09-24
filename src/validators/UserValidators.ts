import { body, query } from 'express-validator';
import { nextTick } from 'process';
import { idText } from 'typescript';
import User from '../models/User';

export class UserValidators {
  static signup() {
    return [
      body('name', 'Name is required').isString(),
      body('phone', 'Phone Number is required.').isString(),
      body('email', 'Email is required')
        .isEmail()
        .custom((email, { req }) => User.findOne({
          email,
          type: 'user',
        })
          .then((user) => {
            if (user) {
              // throw new Error('User Already Exists');
              throw 'User with email already exists';
            } else {
              return true;
            }
          })
          .catch((e) => {
            throw new Error(e);
          })),
      body('password', 'Password is required')
        .isAlphanumeric()
        .isLength({ min: 5, max: 25 })
        .withMessage('Password is too weak'),
      body('type', 'User role type is required').isString(),
    ];
  }

  static verifyEmailOtp() {
    return [
      body(
        'verification_token_for_email',
        'Email verification token is required',
      ).isNumeric(),
    ];
  }

  // static verifyUserForResendingEmail() {
  //     return [query("email", "Email is required").isEmail()];
  // }

  static login() {
    return [
      query('email', 'Email is required')
        .isEmail()
        .custom((email, { req }) => User.findOne({
          email,
        })
          .then((user) => {
            if (user) {
              req.user = user;
              return true;
            }
            throw 'Invalid email or password';
          })
          .catch((e) => {
            throw new Error(e);
          })),
      query('password', 'Password is required').isAlphanumeric(),
    ];
  }

  static checkResetPasswordEmail() {
    return [
      query('email', 'Email is required')
        .isEmail()
        .custom((email, { req }) => User.findOne({
          email,
          // NB: if you want to allow multiple roles to have the same email, we have to pass the types. For this implementation, multiple roles cannot have the same email.
        })
          .then((user) => {
            if (user) {
              return true;
            }
            throw 'No user with the given email found';
          })
          .catch((e) => {
            throw new Error(e);
          })),
    ];
  }

  static verifyResetPasswordToken() {
    return [
      query('email', 'Email is required').isEmail(),
      query('reset_password_token', 'Reset Password token is required')
        .isNumeric()
        .custom((reset_password_token, { req }) => User.findOne({
          email: req.query.email,
          reset_password_token,
          reset_password_token_time: { $gt: Date.now() },
          // NB: if you want to allow multiple roles to have the same email, we have to pass the types. For this implementation, multiple roles cannot have the same email.
        })
          .then((user) => {
            if (user) {
              return true;
            }
            throw 'Invalid OTP. Please generate a new OTP';
          })
          .catch((e) => {
            throw new Error(e);
          })),
    ];
  }

  static resetPassword() {
    return [
      body('email', 'Email is required')
        .isEmail()
        .custom((email, { req }) => User.findOne({
          email,
        })
          .then((user) => {
            if (user) {
              req.user = user;
              return true;
            }
            throw 'No user with the given email found';
          })
          .catch((e) => {
            throw new Error(e);
          })),
      body('new_password', 'Kindly enter your new password').isAlphanumeric(),
      body('otp', 'Reset Password token is required')
        .isNumeric()
        .custom((reset_password_token, { req }) => {
          if (req.user.reset_password_token === reset_password_token) {
            return true;
          }
          req.errorStatus = 401;
          throw 'Invalid token. Please try again';
        }),
    ];
  }

  static verifyPhoneNumber() {
    return [
      body('phone', 'Phone number is required').isString(),
    ];
  }

  static verifyUserProfile() {
    return [
      body('phone', 'Phone number is required').isString(),
      body('email', 'Email is required')
        .isEmail()
        .custom((email, { req }) => {
          if (req.user.email === email) throw 'Email already in use. Please provide the new emailto update your profile.';
          return User.findOne({
            email,
          })
            .then((user) => {
              if (user) {
                throw 'This email already belongs to a user. Please provide a unique email';
              } else {
                return true;
              }
            })
            .catch((e) => {
              throw new Error(e);
            });
        }),
      body('password', 'Password is required').isAlphanumeric(),
    ];
  }
}
