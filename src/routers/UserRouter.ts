import { Router } from "express";
import { UserController } from "../controllers/UserController";
import { GlobalMiddleWare } from "../middlewares/GlobalMiddleWare";
import { UserValidators } from "../validators/UserValidators";

class UserRouter {
    public router: Router;

    constructor() {
        this.router = Router();
        this.getRoutes();
        this.postRoutes();
        this.putRoutes();
        this.patchRoutes();
        this.deleteRoutes();
    }

    getRoutes() {
      //this.router.use(configureSession)
      this.router.get(
        "/resend/verification/mail",
        GlobalMiddleWare.auth,
        UserController.resendVerificationEmail
      )
      this.router.get(
        "/login",
        UserValidators.login(),
        GlobalMiddleWare.checkError,
        UserController.login
      )
      this.router.get(
        "/send/reset/password/token",
        UserValidators.checkResetPasswordEmail(),
        GlobalMiddleWare.checkError,
        UserController.sendResetPasswordOtp
      )
      this.router.get(
        "/verify/reset/password/token",
        UserValidators.verifyResetPasswordToken(),
        GlobalMiddleWare.checkError,
        UserController.verifyResetPasswordToken
      )
      this.router.get("/profile", GlobalMiddleWare.auth, UserController.profile)
    }
    postRoutes() {
        this.router.post("/signup", UserValidators.signup(), GlobalMiddleWare.checkError, UserController.signup);
    }
    patchRoutes() {
        this.router.patch("/reset/password", UserValidators.resetPassword(), GlobalMiddleWare.checkError, UserController.resetPassword);
        this.router.patch("/verify/email/otp", GlobalMiddleWare.auth, UserValidators.verifyEmailOtp(), GlobalMiddleWare.checkError, UserController.verifyEmailOtp);
        this.router.patch("/update/phone",GlobalMiddleWare.auth, UserValidators.verifyPhoneNumber(), GlobalMiddleWare.checkError, UserController.updatePhoneNumber);
        this.router.patch("/update/profile", GlobalMiddleWare.auth, UserValidators.verifyUserProfile(), GlobalMiddleWare.checkError, UserController.updateUserProfile);
    }
    putRoutes() {}
    deleteRoutes() {}
}

export default new UserRouter().router;