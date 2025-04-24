import { BaseModelDto } from '@adocasts.com/dto/base'
import Role from '#models/role'

export default class RoleDto extends BaseModelDto {
  declare id: number
  declare name: string
  declare permission: any
  declare createdAt: string
  declare updatedAt: string

  constructor(role?: Role) {
    super()

    if (!role) return
    this.id = role.id
    this.name = role.name
    this.permission = role.permission
    this.createdAt = role.createdAt.toISO()!
    this.updatedAt = role.updatedAt.toISO()!
  }
}