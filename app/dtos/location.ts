import { BaseModelDto } from '@adocasts.com/dto/base'
import Location from '#models/location'
import RouteDto from '#dtos/route'

export default class LocationDto extends BaseModelDto {
  declare id: number
  declare name: string
  declare postalCode: string
  declare createdAt: string
  declare updatedAt: string
  declare routeId: number | null
  declare route: RouteDto | null

  constructor(location?: Location) {
    super()

    if (!location) return
    this.id = location.id
    this.name = location.name
    this.postalCode = location.postalCode
    this.createdAt = location.createdAt.toISO()!
    this.updatedAt = location.updatedAt.toISO()!
    this.routeId = location.routeId
    this.route = location.route && new RouteDto(location.route)
  }
}