import RequestType from '#models/request_type'
import { BaseSeeder } from '@adonisjs/lucid/seeders'

export default class extends BaseSeeder {
  async run() {
    await RequestType.createMany([
      { name: 'Programada' },
      { name: 'Demandada' },
    ])
  }
}