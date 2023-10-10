import * as QRCode from "qrcode";
import { v4 as uuidv4 } from "uuid";
import Restaurant from "../models/Restaurant";
import Table from "../models/Table";


export class TableController {
  static async createTable(restaurant_id) {
    try {
      const nextTableNumber = await this.calculateNextTableNumber(restaurant_id);
      const qrCodeImage = await this.generateQRCodeImage(restaurant_id);

      const newTable = new Table({
        restaurant_id,
        number: nextTableNumber,
        qr_code: qrCodeImage,
      });

      await newTable.save();
      await Restaurant.findByIdAndUpdate(
        restaurant_id,
        { $inc: { table_count: 1 } },
        { new: true }
      )
      return {
        message: 'Table created successfully!',
        table: newTable,
      };
    } catch (error) {
      console.error('Error while creating table:', error.message || error);  // Log the error
      throw new Error('Error occurred while creating table.');  // Throw a generic error message
    }
  }

  static async calculateNextTableNumber(restaurant_id) {
    try {
      const highestTable = await Table.find({ restaurant_id })
                                      .sort({ number: -1 })
                                      .limit(1);
      let nextTableNumber = 1;
      if (highestTable.length > 0) {
        nextTableNumber = highestTable[0].number + 1;
      }
      return nextTableNumber;
    } catch (error) {
      console.error('Error while calculating next table number:', error.message || error);
      throw new Error('Error occurred while calculating the next table number.');
    }
  }

  static async generateQRCodeImage(restaurant_id) {
    try {
      const uniqueIdentifier = uuidv4();
      const qrCodeURL = `http://localhost:3500/api/v1/menu/${restaurant_id}/${uniqueIdentifier}`;
      return await QRCode.toDataURL(qrCodeURL);
    } catch (error) {
      console.error('Error while generating QR Code image:', error.message || error);
      throw new Error('Error occurred while generating QR code image.');
    }
  }

  static async addTable(req, res, next) {
    try {
      const { restaurant_id } = req.body;
      if (!restaurant_id) {
        return res.status(400).json({ message: "Restaurant ID is required." })
      }
      const result = await TableController.createTable(
        restaurant_id
      )
      return res.status(201).json(result)
    } catch (error) {
      // You might want to check for different types of errors and handle them accordingly
      return next(error)
    }
  }
}
