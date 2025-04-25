import WasteType from '#models/waste_type'
import { BaseSeeder } from '@adonisjs/lucid/seeders'

export default class extends BaseSeeder {
  /**
   * Seeds the database with waste types.
   *
   * This method creates two waste types: "Inorganico Reciclable" and "Peligroso".
   */
  async run() {
    await WasteType.createMany([{ name: 'Inorganico Reciclable' }, { name: 'Peligroso' }])
  }
}
