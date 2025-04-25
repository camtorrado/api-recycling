import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm'
import User from './user.js'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import Location from './location.js'
import WasteType from './waste_type.js'
import RequestType from './request_type.js'
import RequestStatus from './request_status.js'
import Shift from './shift.js'

export default class CollectionRequest extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare userName: string

  @column()
  declare userPhone: number

  @column()
  declare userStreet: string

  @column()
  declare userNeighborhood: string

  @column()
  declare userLocationName: string

  @column()
  declare wasteTypeName: string

  @column()
  declare requestTypeName: string

  @column()
  declare requestStatusName: string

  @column()
  declare scheduleDate: DateTime

  // Relational fields

  @column()
  declare userId: number
  @belongsTo(() => User)
  declare user: BelongsTo<typeof User>

  // -- Get locationId from user
  @column()
  declare locationId: number
  @belongsTo(() => Location)
  declare location: BelongsTo<typeof Location>

  @column()
  declare wasteTypeId: number
  @belongsTo(() => WasteType)
  declare wasteType: BelongsTo<typeof WasteType>

  @column()
  declare requestTypeId: number
  @belongsTo(() => RequestType)
  declare requestType: BelongsTo<typeof RequestType>

  @column()
  declare requestStatusId: number
  @belongsTo(() => RequestStatus)
  declare requestStatus: BelongsTo<typeof RequestStatus>

  @column()
  declare shiftId: number
  @belongsTo(() => Shift)
  declare shift: BelongsTo<typeof Shift>

  // Relational fields

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
