import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'addresses'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('street').notNullable()
      table.string('neighborhood').notNullable()
      table.integer('location_id')
           .unsigned()
           .references('id')
           .inTable('locations')
           .onDelete('CASCADE')
           .notNullable()
      table.integer('user_id')
           .unsigned()
           .references('id')
           .inTable('users')
           .onDelete('CASCADE')
           .notNullable() 
      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}