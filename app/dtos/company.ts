import { BaseModelDto } from '@adocasts.com/dto/base'
import Company from '#models/company'
import UserDto from '#dtos/user'

export default class CompanyDto extends BaseModelDto {
  declare id: number
  declare userId: number
  declare user: UserDto | null
  declare createdAt: string
  declare updatedAt: string

  constructor(company?: Company) {
    super()

    if (!company) return
    this.id = company.id
    this.userId = company.userId
    this.user = company.user && new UserDto(company.user)
    this.createdAt = company.createdAt.toISO()!
    this.updatedAt = company.updatedAt.toISO()!
  }
}