import LocationDto from '#dtos/location'
import Location from '#models/location'

export class LocationService {
  /**
   * Fetches all locations from the database.
   *
   * @returns {Promise<Location[]>} A promise that resolves to an array of all locations.
   */
  async getLocations() {
    return LocationDto.fromArray(await Location.all())
  }
}
