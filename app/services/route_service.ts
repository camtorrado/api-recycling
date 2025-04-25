import Route from "#models/route";

export class RouteService {
  /**
   * Retrieves all routes from the database.
   *
   * @returns {Promise<Route[]>} A promise that resolves to an array of all routes.
   */
  async getRoutes() {
    return await Route.all()
  }
}