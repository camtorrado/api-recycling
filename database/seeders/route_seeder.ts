import Route from '#models/route'
import Location from '#models/location'
import { BaseSeeder } from '@adonisjs/lucid/seeders'

export default class extends BaseSeeder {
  /**
   * Creates predefined routes and assign them to their respective locations.
   *
   * This seed will create 6 routes: Norte, Centro, Occidente, Noroccidente, Sur, and Histórica.
   * Each route will be assigned to the locations that belong to it.
   *
   * The routes and their locations are:
   * - Norte: Usaquén, Chapinero, Santa Fe
   * - Centro: San Cristóbal, Usme, Tunjuelito, Puente Aranda
   * - Occidente: Bosa, Kennedy, Fontibón, Engativá
   * - Noroccidente: Suba, Barrios Unidos, Teusaquillo
   * - Sur: Rafael Uribe Uribe, Ciudad Bolívar, Antonio Nariño
   * - Histórica: Los Mártires, La Candelaria, Sumapaz
   */
  public async run() {
    const locations = await Location.all()
    const locationMap = Object.fromEntries(locations.map(loc => [loc.name, loc]))

    const rutas = [
      {
        name: 'Ruta Norte',
        description: 'Recolección en Usaquén, Chapinero, Santa Fe',
        localidades: ['Usaquén', 'Chapinero', 'Santa Fe'],
      },
      {
        name: 'Ruta Centro',
        description: 'Recolección en San Cristóbal, Usme, Tunjuelito, Puente Aranda',
        localidades: ['San Cristóbal', 'Usme', 'Tunjuelito', 'Puente Aranda'],
      },
      {
        name: 'Ruta Occidente',
        description: 'Recolección en Bosa, Kennedy, Fontibón, Engativá',
        localidades: ['Bosa', 'Kennedy', 'Fontibón', 'Engativá'],
      },
      {
        name: 'Ruta Noroccidente',
        description: 'Recolección en Suba, Barrios Unidos, Teusaquillo',
        localidades: ['Suba', 'Barrios Unidos', 'Teusaquillo'],
      },
      {
        name: 'Ruta Sur',
        description: 'Recolección en Rafael Uribe Uribe, Ciudad Bolívar, Antonio Nariño',
        localidades: ['Rafael Uribe Uribe', 'Ciudad Bolívar', 'Antonio Nariño'],
      },
      {
        name: 'Ruta Histórica',
        description: 'Recolección en Los Mártires, La Candelaria, Sumapaz',
        localidades: ['Los Mártires', 'La Candelaria', 'Sumapaz'],
      },
    ]

    for (const ruta of rutas) {
      const newRoute = await Route.create({
        name: ruta.name,
        description: ruta.description,
      })

      for (const nombreLocalidad of ruta.localidades) {
        const location = locationMap[nombreLocalidad]
        if (location) {
          location.routeId = newRoute.id
          await location.save()
        }
      }
    }
  }
}
