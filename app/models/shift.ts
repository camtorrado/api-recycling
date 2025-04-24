import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm'
import Route from './route.js'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'

export default class Shift extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  // Relational fields

  @column()
  declare routeId: number

  @belongsTo(() => Route)
  declare route: BelongsTo<typeof Route>

  // Relational fields

  @column.date()
  declare date: DateTime

  @column()
  declare startTime: string

  @column()
  declare endTime: string

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime
}
