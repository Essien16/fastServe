import Order from "../models/Order"
import Cart from "../models/Cart"
import mongoose, { ObjectId } from "mongoose"

interface MenuItem {
  _id: ObjectId
  name: string
}

interface CartItem {
  menuItem: MenuItem | ObjectId
  quantity: number
  priceAtOrderTime: number
}

interface Cart {
  items: CartItem[]
  total_price: number 
}

interface OrderData {
  session_id: string
  restaurant_id: mongoose.Types.ObjectId
  table_id: mongoose.Types.ObjectId
  orderItems: Array<{
    name: string
    price: number
    quantity: number
  }>
  orderType: string
  address?: string //optional because of dinein and takeout order
  total_price: number
  payment_method: string
  user_id?: mongoose.Types.ObjectId //optional because I'm allowing first time users to place orders without signing up or logging in. I implemented sessions for this use case.
}

export class OrderController {
  static async createOrder(req, res) {
    try {
      const { restaurant_id, table_id, orderType, address, payment_method } =
        req.body
      const session_id = req.session.id

      const cart: Cart | null = await Cart.findOne({ session_id }).populate(
        "items.menuItem"
      )
      if (!cart) {
        return res.status(404).json({ error: "Cart not found" })
      }
      if (orderType === "DELIVERY" && !address) {
        return res
          .status(400)
          .json({ error: "Address is required for delivery orders" })
      }
      const orderItems = cart.items.map((item) => {
        if (typeof item.menuItem === "object" && "name" in item.menuItem) {
          return {
            name: item.menuItem.name,
            price: item.priceAtOrderTime,
            quantity: item.quantity,
          }
        } else {
          throw new Error("Menu item not properly populated")
        }
      });

      const total_price = cart.total_price

      const orderData: OrderData = {
        session_id,
        restaurant_id,
        table_id,
        orderItems,
        orderType,
        address,
        total_price,
        payment_method,
      }

      if (req.session?.user_id) {
        orderData.user_id = req.session.user_id
      }
      const newOrder = new Order(orderData)
      await newOrder.save()
      await Cart.deleteOne({ session_id })

      res.status(201).json(newOrder)
    } catch (error) {
      res.status(500).json({ error: error.message })
    }
  }

  static async getOrders(req, res, next) {
    const user_id = req.session.user_id;
    //for pagiantion feature
    const perPage = 5;
    const currentPage = parseInt(req.query.page) || 1;
    const previousPage = currentPage == 1 ? null : currentPage - 1;
    let nextPage = currentPage + 1;
    try {
      const order_count = await Order.countDocuments({ user_id: user_id });
      if (!order_count) {
        res.json({
          orders: [],
          perPage,
          currentPage,
          previousPage: null,
          nextPage: null,
          totalPage: 0
        })
      }
      const totalPage = Math.ceil(order_count/perPage);
      if (totalPage == 0 || totalPage == currentPage) {
        nextPage = null;
      }
      if (totalPage < currentPage) {
        throw "No more Orders"
      }
      const orders = await Order.find({ user_id }, {user_id: 0, __v:0 })
                                  .skip((perPage * currentPage) - perPage)
                                  .limit(perPage)
                                  .sort({"created_at": -1})
                                  .populate("restaurant_id")
                                  .exec();
      res.json({
        orders,
        perPage,
        currentPage,
        previousPage,
        nextPage,
        totalPage
      });
    } catch (error) {
      next(error)
    };
  };
}
