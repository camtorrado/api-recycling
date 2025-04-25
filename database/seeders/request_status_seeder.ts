import RequestStatus from '#models/request_status'
import { BaseSeeder } from '@adonisjs/lucid/seeders'

export default class extends BaseSeeder {
  /**
   * Runs the seeder.
   *
   * Creates the request statuses that will be used to track the state of collection
   * requests. The request statuses created are Pendiente, En Proceso, and Finalizado.
   */
  async run() {
    await RequestStatus.createMany([
      { name: 'Pendiente' },
      { name: 'En Proceso' },
      { name: 'Finalizado' },
    ])
  }
}