import { BaseModelDto } from '@adocasts.com/dto/base'
import Address from '#models/address'
import UserDto from '#dtos/user'
import LocationDto from '#dtos/location'

export default class AddressDto extends BaseModelDto {
  declare id: number
  declare mainAddress: boolean
  declare street: string
  declare neighborhood: string
  declare createdAt: string
  declare updatedAt: string
  declare userId: number
  declare user: UserDto | null
  declare locationId: number
  declare location: LocationDto | null

  constructor(address?: Address) {
    super()

    if (!address) return
    this.id = address.id
    this.mainAddress = address.mainAddress
    this.street = address.street
    this.neighborhood = address.neighborhood
    this.createdAt = address.createdAt.toISO()!
    this.updatedAt = address.updatedAt.toISO()!
    this.userId = address.userId
    this.user = address.user && new UserDto(address.user)
    // this.locationId = address.locationId
    this.location = address.location && new LocationDto(address.location)
  }
}