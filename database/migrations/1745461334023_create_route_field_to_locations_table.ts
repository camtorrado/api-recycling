import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'locations'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table
        .integer('route_id')
        .unsigned()
        .references('id')
        .inTable('routes')
        .onDelete('CASCADE')
        .nullable()
    })
  }

  async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('route_id')
    })
  }
}