import { LocationService } from '#services/location_service'
import { inject } from '@adonisjs/core'
import type { HttpContext } from '@adonisjs/core/http'

@inject()
export default class LocationsController {
  constructor(private locationService: LocationService) {}

  /**
   * Fetches all locations from the database.
   *
   * @returns {Promise<Location[]>} A promise that resolves to an array of all locations.
   */
  async index({ response }: HttpContext) {
    return response.ok(await this.locationService.getLocations().catch(() => response.notFound()))
  }
}
