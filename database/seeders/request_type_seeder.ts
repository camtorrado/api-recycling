import RequestType from '#models/request_type'
import { BaseSeeder } from '@adonisjs/lucid/seeders'

export default class extends BaseSeeder {
/**
 * Runs the seeder.
 *
 * Creates the request types that will be used for different collection requests.
 * The request types created are Programada and Demandada.
 */
  async run() {
    await RequestType.createMany([
      { name: 'Programada' },
      { name: 'Demandada' },
    ])
  }
}