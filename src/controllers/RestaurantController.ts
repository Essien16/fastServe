import Category from "../models/Category"
import Restaurant from "../models/Restaurant"
import User from "../models/User";
import { TableController } from "../controllers/TableController";
import { NodeMailer } from "../utils/NodeMailer"
import { Utils } from "../utils/Utils"
import Table from "../models/Table";
import mongoose from "mongoose";

export class RestaurantController {
  static async addRestaurant(req, res, next) {
      try {
        const { body, file } = req;
        const { user, verificationToken } = await RestaurantController.createUser(body)
        const restaurantDoc = await RestaurantController.createRestaurantDetails( body, user._id, req.body.cloudinaryUrl)
        const newTable = await TableController.createTable(restaurantDoc._id)
        await RestaurantController.createCategories(body, restaurantDoc._id)
        await NodeMailer.sendMail({
          to: [user.email],
          subject: "Email Verification",
          html: `<h1>Your otp is ${verificationToken}</h1>`,
        })
        res.send(restaurantDoc, newTable)
      } catch (error) {
        next(error)
      }
  }

  private static async createUser(restaurant) {
      const verification_token_for_email = Utils.generateEmailVerificationToken(6);
      const hash = await Utils.encryptPassword(restaurant.password);
      const data = {
          email: restaurant.email,
          verification_token_for_email,
          verification_token_time: Date.now() + new Utils().TOKEN_TIME,
          phone: restaurant.phone,
          password: hash,
          name: restaurant.name,
          type: "restaurant",
          status: "active",
      };
      // return await new User(data).save();
      const savedUser = await new User(data).save()
      return {
        user: savedUser,
        verificationToken: verification_token_for_email,
      }
  }

  private static async createRestaurantDetails(restaurant, userId, path) {
      const restaurant_data = {
          user_id: userId,
          name: restaurant.name,
          res_name: restaurant.res_name,
          description: restaurant.description,
          cover: path,
          address: restaurant.address,
          status: restaurant.status,
          created_at: Date.now(),
          updated_at: Date.now()
      };
      return await Restaurant.create(restaurant_data);
  }

  private static async createCategories(restaurant, restaurantId) {
      const categoriesData = JSON.parse(restaurant.categories).map((x) => {
          return { name: x, restaurant_id: restaurantId }
      });
      return await Category.insertMany(categoriesData);
  }

  static async getRestaurants(req, res, next) {
    try {
      const restaurants = await Restaurant.find({ status: "active" })
      res.send(restaurants)
    } catch (error) {
      next(error)
    }
  }

  static async getTables(req, res, next) {
    const { restaurantId } = req.params
    try {
      if (!mongoose.Types.ObjectId.isValid(restaurantId)) {
        return res.status(400).send("Invalid Restaurant ID")
      }
      const tables = await Table.find({ restaurant_id: restaurantId })
      res.status(200).json(tables)
    } catch (error) {
      res.status(500).send(error.toString())
    }
  }
}
