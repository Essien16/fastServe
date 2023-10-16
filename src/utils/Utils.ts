import * as bcrypt from 'bcrypt';
import * as multer from 'multer';
import * as dotenv from "dotenv"

const storageOptions = multer.diskStorage({
  destination:  (req, file, cb) => {
    cb(null, "./src/uploads")
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9)
    cb(null, uniqueSuffix + file.originalname);
  },
})

const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
    cb(null, true);
  } else {
    cb(null, false);
  }
};


export class Utils {
  //token should expire in 10mins
  public TOKEN_TIME = 60 * 10000;
  public multer = multer({storage: storageOptions, fileFilter: fileFilter});

  static generateEmailVerificationToken(digit: number = 4) {
    const digits = "0123456789";
    let otp = "";
    for (let x = 0; x < digit; x++) {
      otp += Math.floor(Math.random() * 10);
    }
    return otp;
  }

  static encryptPassword(password) {
    return new Promise((resolve, reject) => {
      bcrypt.hash(password, 10, (err, hash) => {
        if (err) {
          reject(err);
        } else {
          resolve(hash);
        }
      });
    });
  }

  static comparePassword(data: {password: string, hashed_password: string}): Promise<any> {
    return new Promise((resolve, reject) => {
      bcrypt.compare(data.password, data.hashed_password, (err, same) => {
        if (err) {
          reject(err);
        }else if (!same) {
            reject(new Error('Invalid email or password.'))
        } else {
          resolve(true);
        }
      });
    });
  }

  static dotenvConfig() {
    dotenv.config({ path: ".env" })
  }

}