import axios from "axios";
import { v4 as uuidv4 } from "uuid";
import { getEnvironmentVariables } from "../environments/environment";
import Order from "../models/Order";

export class PaymentController {
  static async initiatePayment(req, res) {
    try {
      const { card_number, cvv, expiry_month, expiry_year, amount, email, order_id, phone_number } = req.body;
      const order = await Order.findOne({ order_id });
      const tx_ref = `order_${order._id}_ref_${uuidv4()}`
      if (!order) {
        return res.status(404).json({ message: 'Order not found' });
      };
      if (order.status === 'Paid') {
        return res.status(400).json({ message: 'Order has already been paid' });
      }
      const payload = {
        card_number,
        cvv,
        expiry_month,
        expiry_year,
        currency: "NGN",
        amount,
        redirect_url: `http://localhost:3500/`,
        payment_type: "card",
        order_id: order._id.toString(),
        tx_ref,
        email,
        phone_number
      }
      const response = await axios({
        url: 'https://api.flutterwave.com/v3/charges?type=card',
        method: 'post',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${getEnvironmentVariables().flutterwave_secret_key}`
        },
        data: payload
      });
      res.status(200).json(response.data);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async handleRedirect (req, res) {
    try {
      const { tx_ref } = req.query;
      const orderId = tx_ref.split('_ref_')[0].replace('order_', '');
      const verifyTransaction = await axios({
        url: `https://api.flutterwave.com/v3/transactions/${tx_ref}/verify`,
        method: 'get',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${getEnvironmentVariables().flutterwave_secret_key}`
        }
      });
      if (verifyTransaction.data.status === "success") {
        try {
          const order = await Order.findById(orderId)
          if (!order) {
            throw new Error("Order not found")
          }
          await Order.updateOne({ _id: orderId }, { status: "Paid" })
          // TODO: Send Email Notification here
        } catch (updateError) {
          // Log error, and perhaps notify an admin
          console.error("Error updating order status:", updateError.message)
        }
      } else {
        // TODO: Add specific actions or notifications for failed payments
      }
       const redirectionUrl = verifyTransaction.data.status === "success" ? "/success" : "/failed" //these pages are not created yet
       res.redirect(`http://localhost:3500${redirectionUrl}`)
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: error.message });
    }
  }
}
