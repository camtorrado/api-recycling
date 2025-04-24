import WasteType from '#models/waste_type'
import { BaseSeeder } from '@adonisjs/lucid/seeders'

export default class extends BaseSeeder {
  async run() {
    await WasteType.createMany([
      { name: 'Inorganico Reciclable' },
      { name: 'Peligroso' },
    ])
  }
}