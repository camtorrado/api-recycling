import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import Route from './route.js'

export default class Location extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare name: string

  @column()
  declare postalCode: string

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  // Relational fields

  @column()
  declare routeId: number | null

  @belongsTo(() => Route)
  declare route: BelongsTo<typeof Route>

  // @hasMany(() => Address)
  // declare addresses: HasMany<typeof Address>

  // Relational fields
}
