import Subscription from '#models/subscription'
import { BaseSeeder } from '@adonisjs/lucid/seeders'

export default class extends BaseSeeder {
  
  /**
   * Seeds the database with predefined subscription types.
   *
   * This method creates multiple subscription entries in the database
   * with different subscription levels such as 'Free' and 'Paid'.
   */
  async run() {
    await Subscription.createMany([
      { name: 'Free' },
      { name: 'Paid' },
    ])
  }
}