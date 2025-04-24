import { BaseModelDto } from '@adocasts.com/dto/base'
import User from '#models/user'
import AddressDto from '#dtos/address'
import RoleDto from '#dtos/role'
import SubscriptionDto from '#dtos/subscription'

export default class UserDto extends BaseModelDto {
  declare id: number
  declare fullName: string
  declare email: string
  declare phone: number
  declare password: string
  declare createdAt: string
  declare updatedAt: string | null
  declare addresses: AddressDto[]
  declare roleId: number
  declare role: RoleDto | null
  declare subscriptionId: number | null
  declare subscription: SubscriptionDto | null

  constructor(user?: User) {
    super()

    if (!user) return
    this.id = user.id
    this.fullName = user.fullName
    this.email = user.email
    this.phone = user.phone
    // this.password = user.password
    this.createdAt = user.createdAt.toISO()!
    this.updatedAt = user.updatedAt?.toISO()!
    this.addresses = AddressDto.fromArray(user.addresses)
    // this.roleId = user.roleId
    this.role = user.role && new RoleDto(user.role)
    // this.subscriptionId = user.subscriptionId
    this.subscription = user.subscription && new SubscriptionDto(user.subscription)
  }
}