import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm'
import Location from './location.js'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import User from './user.js'

export default class Address extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare mainAddress: boolean

  @column()
  declare street: string

  @column()
  declare neighborhood: string

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  // Relational fields

  @column()
  declare userId: number
  @belongsTo(() => User)
  declare user: BelongsTo<typeof User>

  @column()
  declare locationId: number
  @belongsTo(() => Location)
  declare location: BelongsTo<typeof Location>

  // Relational fields
}
