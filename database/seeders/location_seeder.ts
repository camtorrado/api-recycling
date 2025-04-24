import Location from '#models/location'
import { BaseSeeder } from '@adonisjs/lucid/seeders'

export default class extends BaseSeeder {
  /**
   * Seeds the database with predefined locations and their postal codes.
   *
   * This method creates multiple location entries in the database for different
   * neighborhoods, each with its corresponding postal code range.
   */

  async run() {
    // Write your database queries inside the run method
    await Location.createMany([
      { name: 'Usaquén', postalCode: '110111-110151' },
      { name: 'Chapinero', postalCode: '110211-110231' },
      { name: 'Santa Fe', postalCode: '110311-110321' },
      { name: 'San Cristóbal', postalCode: '110411-110441' },
      { name: 'Usme', postalCode: '110511-110571' },
      { name: 'Tunjuelito', postalCode: '110611-110621' },
      { name: 'Bosa', postalCode: '110711-110741' },
      { name: 'Kennedy', postalCode: '110811-110881' },
      { name: 'Fontibón', postalCode: '110911-110931' },
      { name: 'Engativá', postalCode: '111011-111071' },
      { name: 'Suba', postalCode: '111111-111176' },
      { name: 'Barrios Unidos', postalCode: '111211-111221' },
      { name: 'Teusaquillo', postalCode: '111311-111321' },
      { name: 'Los Mártires', postalCode: '111411' },
      { name: 'Antonio Nariño', postalCode: '111511' },
      { name: 'Puente Aranda', postalCode: '111611-111631' },
      { name: 'La Candelaria', postalCode: '111711' },
      { name: 'Rafael Uribe Uribe', postalCode: '111811-111841' },
      { name: 'Ciudad Bolívar', postalCode: '111911-111981' },
      { name: 'Sumapaz', postalCode: '112011-112041' },
    ])
  }
}
