import Route from '#models/route'
import Location from '#models/location'
import { BaseSeeder } from '@adonisjs/lucid/seeders'

export default class extends BaseSeeder {
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
