import { RouteService } from '#services/route_service'
import { inject } from '@adonisjs/core'
import type { HttpContext } from '@adonisjs/core/http'

@inject()
export default class RoutesController {
  constructor(private routeService: RouteService) {}

  /**
   * Fetches all routes from the database.
   *
   * @param {{ response: HttpContext['response'] }} ctx - The HTTP context containing the response object.
   * @returns {Promise<any>} A promise that resolves to an OK response with the routes, or a not found response on error.
   */
  async index({ response }: HttpContext) {
    return response.ok(await this.routeService.getRoutes().catch(() => response.notFound()))
  }
}
