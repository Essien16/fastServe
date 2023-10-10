import City from "../models/City"


export class CityController {
  static async addCity(req, res, next) {
    const name = req.body.name
    const lat = req.body.lat
    const lng = req.body.lng
    try {
      const data = {
        name,
        lat,
        lng
      }
      const city = await new City(data).save()
      res.send(city)
    } catch (error) {
      next(error)
    }
  }

  static async getCities(req, res, next) {
    try {
      const cities = await City.find({ status: true })
      res.send(cities)
    } catch (error) {
      next(error)
    }
  }
}
