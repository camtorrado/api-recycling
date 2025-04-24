import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'addresses'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.boolean('main_address').defaultTo(false)
    })
  }

  async down() {
    this.schema.alterTable(this.tableName, table => {
      table.dropColumn('main_address')
    })
  }
}