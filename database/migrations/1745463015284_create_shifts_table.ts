import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'shifts'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table
      .integer('route_id')
      .unsigned()
      .references('id')
      .inTable('routes')
      .onDelete('CASCADE')
      .notNullable()
      table.date('date').notNullable()
      table.time('startTime').notNullable()
      table.time('endTime').notNullable()
      table.timestamp('created_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}