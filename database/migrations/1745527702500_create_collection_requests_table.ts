import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'collection_requests'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')

      table.string('user_name')
      table.string('user_phone')
      table.string('user_street')
      table.string('user_neighborhood')
      table.string('user_location_name')
      table.string('waste_type_name')
      table.string('request_type_name')
      table.string('request_status_name')
      table.timestamp('schedule_date')

      // Foreign keys
      table
        .integer('user_id')
        .unsigned()
        .references('id')
        .inTable('users')
        .onDelete('CASCADE')

      table
        .integer('location_id')
        .unsigned()
        .references('id')
        .inTable('locations')
        .onDelete('SET NULL')

      table
        .integer('waste_type_id')
        .unsigned()
        .references('id')
        .inTable('waste_types')
        .onDelete('SET NULL')

      table
        .integer('request_type_id')
        .unsigned()
        .references('id')
        .inTable('request_types')
        .onDelete('SET NULL')

      table
        .integer('request_status_id')
        .unsigned()
        .references('id')
        .inTable('request_statuses')
        .onDelete('SET NULL')

      table
        .integer('shift_id')
        .unsigned()
        .references('id')
        .inTable('shifts')
        .onDelete('SET NULL')

      table.timestamp('created_at', { useTz: true }).defaultTo(this.now())
      table.timestamp('updated_at', { useTz: true }).defaultTo(this.now())
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}