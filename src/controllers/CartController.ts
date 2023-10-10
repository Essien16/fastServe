import Menu from "../models/Menu";
import Cart from "../models/Cart";

export class CartController {
  static async addToCart(req, res) {
    try {
      const { menuItemId, quantity } = req.body
      const session_id = req.session.id
      if (!Number.isInteger(quantity) || quantity <= 0) {
        return res.status(400).json({ error: "Invalid quantity" })
      }
      // Find the menu item.
      const menuItem = await Menu.findById(menuItemId)

      if (!menuItem || menuItem.status === "Sold Out") {
        return res.status(400).json({ error: "Item not available" })
      }

      let cart = await Cart.findOne({ session_id })

      // If cart doesn't exist, create a new one.
      if (!cart) {
        cart = new Cart({ session_id, items: [], total_price: 0 })
      }

      // Check if item already in cart and update or add new.
      const existingItemIndex = cart.items.findIndex(
        (item) => item.menuItem.toString() === menuItemId
      )

      if (existingItemIndex > -1) {
        cart.items[existingItemIndex].quantity += quantity
        cart.total_price += menuItem.price * quantity
      } else {
        cart.items.push({
          menuItem: menuItemId,
          quantity,
          priceAtOrderTime: menuItem.price,
        })
        cart.total_price += menuItem.price * quantity
      }

      await cart.save()
      res.status(200).json(cart)
    } catch (error) {
      res.status(500).json({ error: error.message })
    }
  }

  static async removeFromCart(req, res) {
    try {
      const { menuItemId } = req.body
      const session_id = req.session.id

      // Find the cart.
      let cart = await Cart.findOne({ session_id })

      if (!cart) {
        return res.status(404).json({ error: "Cart not found" })
      }

      // Find the item index.
      const itemIndex = cart.items.findIndex(
        (item) => item.menuItem.toString() === menuItemId
      )

      if (itemIndex === -1) {
        return res.status(404).json({ error: "Item not found in cart" })
      }

      // Update the total price.
      cart.total_price -=
        cart.items[itemIndex].priceAtOrderTime * cart.items[itemIndex].quantity

      // Remove the item from the cart.
      cart.items.splice(itemIndex, 1)

      await cart.save()
      res.status(200).json(cart)
    } catch (error) {
      res.status(500).json({ error: error.message })
    }
  }

  static async getCart(req, res) {
    try {
      const session_id = req.session.id
      const cart = await Cart.findOne({ session_id }).populate("items.menuItem")
      res.status(200).json(cart)
    } catch (error) {
      res.status(500).json({ error: error.message })
    }
  }

  static async emptyCart(session_id) {
    try {
        const cart = await Cart.findOne({ session_id })
        if (!cart) {
            throw new Error("Cart not found")
        }

        // Empty the items array and reset the total price
        cart.items = [] as any
        // cart.items = cart.items.filter(() => false)
        cart.total_price = 0

        // Save the updated cart
        await cart.save()

        return cart
    } catch (error) {
        throw error
    }
  }
}
