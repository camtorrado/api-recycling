import { BaseModelDto } from '@adocasts.com/dto/base'
import Shift from '#models/shift'
import RouteDto from '#dtos/route'

export default class ShiftDto extends BaseModelDto {
  declare id: number
  declare routeId: number
  declare route: RouteDto | null
  declare date: string
  declare startTime: string
  declare endTime: string
  declare createdAt: string

  constructor(shift?: Shift) {
    super()

    if (!shift) return
    this.id = shift.id
    this.routeId = shift.routeId
    this.route = shift.route && new RouteDto(shift.route)
    this.date = shift.date.toISO()!
    this.startTime = shift.startTime
    this.endTime = shift.endTime
    this.createdAt = shift.createdAt.toISO()!
  }
}