import Category from "../models/Category";
import Menu from "../models/Menu"

export class MenuController {

    static async addItem(req, res, next) {
        const itemData = req.body;
        const path = req.file.path;
        try {
            let item_data: any = {
              name: itemData.name,
              status: itemData.status,
              price: parseInt(itemData.price),
              restaurant_id: itemData.restaurant_id,
              category_id: itemData.category_id,
              itemImage: itemData.cloudinaryUrl,
              created_at: Date.now(),
              updated_at: Date.now(),
            }
            if (itemData.description) {
              item_data = {...item_data, description: itemData.description}
            }
            const itemDetail = await new Menu(item_data).save()
            res.send(itemDetail)
        } catch (error) {
            next(error)
        }
    }

    static async getMenu(req, res, next) {
        const restaurant = req.restaurant
        try{
            const categories = await Category.find({ restaurant_id: restaurant._id }, { __v: 0});
            const menu = await Menu.find({
                status: "Available",
                restaurant_id: restaurant._id
            })
            res.json({
                // restaurant,
                categories,
                menu
            })
        } catch (error) {
            next(error)
        }
    }
}
