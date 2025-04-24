import Role from '#models/role'
import { BaseSeeder } from '@adonisjs/lucid/seeders'

export default class extends BaseSeeder {
  /**
   * Runs the seeder.
   *
   * Seeds the database with the predefined roles (admin, user, company).
   */
  async run() {
    // Write your database queries inside the run method
    await Role.createMany([
      { name: 'Admin', permission: JSON.stringify(['*']) },
      { name: 'User', permission: JSON.stringify(['*']) },
      { name: 'Company', permission: JSON.stringify(['*']) },
    ])
  }
}
