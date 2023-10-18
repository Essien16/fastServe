import User from "../models/User";
import { NodeMailer } from "../utils/NodeMailer";
import { Utils } from "../utils/Utils";
import { JWT } from "../utils/Jwt";


export class UserController {
  static async signup(req, res, next) {
    // console.log(Utils.generateEmailVerificationToken())

    const name = req.body.name;
    const phone = req.body.phone;
    const email = req.body.email;
    const password = req.body.password;
    const type = req.body.type;
    const verification_token_for_email =
      Utils.generateEmailVerificationToken(4);

    try {
      const hash = await Utils.encryptPassword(password);
      const data = {
        email,
        verification_token_for_email: verification_token_for_email,
        verification_token_time: Date.now() + new Utils().TOKEN_TIME,
        password: hash,
        phone,
        name,
        type,
      };
      let user = await new User(data).save();
      const payload = {
		    // _id: user._id,
        // aud: user._id,
        email: user.email,
        type: user.type
      };
      const jwt_access_token = JWT.jwtSign(payload, user._id);
      const refresh_token = JWT.jwtSignRefreshToken(payload, user._id)
      res.json({
        jwt_token: jwt_access_token,
        refreshToken: refresh_token,
        user: user,
      });
      //send an email to the user to verify their email
      await NodeMailer.sendMail({
        to: [user.email],
        subject: "Email Verification",
        html: `<h1>Your otp is ${verification_token_for_email}</h1>`,
      });
    } catch (error) {
    	  next(error);
    }
  }

  static async verifyEmailOtp(req, res, next) {
    const verification_token_for_email = req.body.verification_token_for_email;
    const email = req.user.email;
    try {
      const user = await User.findOneAndUpdate(
        {
          email: email,
          verification_token_for_email: verification_token_for_email,
          verification_token_time: { $gt: Date.now() },
          // type: ['user', 'admin']
        },
        {
          email_verified: true,
          updated_at: new Date(),
        },
        {
          new: true,
        }
      );
      if (user) {
        res.send(user);
      } else {
        throw new Error("Invalid OTP. Please generate a new token.");
      }
    } catch (error) {
      next(error);
    }
  }

  static async resendVerificationEmail(req, res, next) {
    // res.send(req.user)
    const email = req.user.email;
    const verification_token_for_email = Utils.generateEmailVerificationToken();
    try {
      const user: any = await User.findOneAndUpdate(
        {
          email: email,
        },
        {
          updated_at: new Date(),
          verification_token_for_email: verification_token_for_email,
          verification_token_time: Date.now() + new Utils().TOKEN_TIME,
        }
      );
      if (user) {
        res.json({ success: true });
        await NodeMailer.sendMail({
          to: [user.email],
          subject: "Re-send Email Verification",
          html: `<h1>Your otp is ${verification_token_for_email}</h1>`,
        });
      } else {
        throw new Error("User does not exist");
      }
    } catch (error) {
      next(error);
    }
  }

  static async login(req, res, next) {
    const user = req.user;
    const password = req.query.password;
    const hashed_password = user.password;
    const data = {
      password,
      hashed_password,
    };
    try {
      await Utils.comparePassword(data);
      const payload = {
        // aud: user._id,
        email: user.email,
        type: user.type,
      }
      // console.log(user._id)
      const jwt_access_token = JWT.jwtSign(payload, user._id);
      const refresh_token = JWT.jwtSignRefreshToken(payload, user._id)
      res.json({
        jwt_token: jwt_access_token,
        refreshToken: refresh_token,
        user: user,
      });
    } catch (error) {
      next(error);
    }
  }

  static async sendResetPasswordOtp(req, res, next) {
    const email = req.query.email;
    const reset_password_token = Utils.generateEmailVerificationToken();
    try {
      const user: any = await User.findOneAndUpdate(
        {
          email: email,
        },
        {
          updated_at: new Date(),
          reset_password_token: reset_password_token,
          reset_password_token_time: Date.now() + new Utils().TOKEN_TIME,
        }
      );
      if (user) {
        res.json({ success: true });
        await NodeMailer.sendMail({
          to: [user.email],
          subject: "Reset password- Email verification OTP",
          html: `<h1>Your otp is ${reset_password_token}</h1>`,
        });
      } else {
        throw new Error("User does not exist");
      }
    } catch (error) {
      next(error);
    }
  }

  static verifyResetPasswordToken(req, res, next) {
    res.json({ success: true});
  };

  static async resetPassword(req, res, next) {
    const user = req.user;
    const new_password = req.body.new_password;
    try {
      const encryptedPassword = await Utils.encryptPassword(new_password);
      const updatedUser = await User.findByIdAndUpdate(
			user._id,
        {
          updated_at: new Date(),
          password: encryptedPassword,
        },
        {
          new: true,
        }
      );
      if (updatedUser) {
        res.send(updatedUser);
      } else {
        throw new Error("User does not exist");
      }
    } catch (error) {
      next(error);
    }
  }

  static async profile(req, res, next) {
    const user = req.user;
    try {
      const profile = await User.findById(user.aud);
      if (profile) {
        res.send(profile);
      } else {
        res.status(404).send("User does not exist. Please try again with a valid user.");
      }
    } catch (error) {
      next(error);
    }
  }

  static async updatePhoneNumber(req, res, next) {
    const user = req.user //this is from the global middleware
    const phone = req.body.phone;
    try {
      const userData = await User.findByIdAndUpdate(
        user.aud,
        { phone: phone, updated_at: new Date() },
        { new: true }
      );
      res.send(userData);
    } catch (error) {
      next(error);
    };
  };

  static async updateUserProfile(req, res, next) {
    const user = req.user;
    const phone = req.body.phone;
    const new_email = req.body.email;
    const plain_password = req.body.password;
    const verification_token_for_email = Utils.generateEmailVerificationToken(4);
    try {
      const userData = await User.findById(user.aud);
      if (!userData) throw new Error("User doesn't exist");
      await Utils.comparePassword({
        password: plain_password,
        hashed_password: userData.password,
      });
      const updatedUser = await User.findByIdAndUpdate(
        user.aud,
        {
          phone: phone,
          email: new_email,
          email_verified: false, //NB: when confirming the new email, update the token in the verify email token endpoint in postman with the new token that was generated when you updated the users details.
          verification_token_for_email,
          verification_token_time: Date.now() + new Utils().TOKEN_TIME,
          updated_at: new Date(),
        },
        { new: true }
      );
      const payload = {
        // aud: user.aud,
        email: updatedUser.email,
        type: updatedUser.type,
      };
      const access_token = JWT.jwtSign(payload, user.aud);
      const refresh_token = JWT.jwtSignRefreshToken(payload, user.aud)
      //console.log(req.session)
      res.json({
        token: access_token,
        refreshToken: refresh_token,
        user: updatedUser,
      });
      // send email to user for updated email verification
      await NodeMailer.sendMail({
        to: [updatedUser.email],
        subject: "Updated Email Verification",
        html: `<h1>Your Otp is ${verification_token_for_email}</h1>`,
      });
    } catch (error) {
      next(error);
    };
  };

  static async getNewToken(req, res, next) {
    const refreshToken = req.body.refreshToken;
    try {
      const decodedData = await JWT.jwtVerifyRefreshToken(refreshToken);
      if (decodedData) {
        const payload = {
          // aud: decodedData.aud,
          email: decodedData.email,
          type: decodedData.type,
        }
        //console.log(decodedData._id)
        const jwt_access_token = JWT.jwtSign(payload, decodedData.aud)
        const refresh_token = JWT.jwtSignRefreshToken(payload, decodedData.aud)
        res.json({
          jwt_token: jwt_access_token,
          refreshToken: refresh_token,
        })
      } else {
        req.errorStatus = 403;
        throw "Access denied";
      }
    } catch (error) {
      req.errorStatus = 403
      next(error)
    }
  };
}