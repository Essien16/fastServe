import { body } from "express-validator"

export class CityValidators {
  static addCity() {
    return [
      body("name", "City name is required").isString(),
      body("lat", "Latitude is required").isNumeric(),
      body("lng", "Longitude is required").isNumeric(),
    ]
  }
}
