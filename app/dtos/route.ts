import { BaseModelDto } from '@adocasts.com/dto/base'
import Route from '#models/route'
import LocationDto from '#dtos/location'

export default class RouteDto extends BaseModelDto {
  declare id: number
  declare name: string
  declare description: string | null
  declare locations: LocationDto[]
  declare createdAt: string
  declare updatedAt: string

  constructor(route?: Route) {
    super()

    if (!route) return
    this.id = route.id
    this.name = route.name
    this.description = route.description
    // this.locations = LocationDto.fromArray(route.locations)
    this.createdAt = route.createdAt.toISO()!
    this.updatedAt = route.updatedAt.toISO()!
  }
}