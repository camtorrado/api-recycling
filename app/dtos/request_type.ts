import { BaseModelDto } from '@adocasts.com/dto/base'
import RequestType from '#models/request_type'

export default class RequestTypeDto extends BaseModelDto {
  declare id: number
  declare name: string
  declare createdAt: string
  declare updatedAt: string

  constructor(requestType?: RequestType) {
    super()

    if (!requestType) return
    this.id = requestType.id
    this.name = requestType.name
    this.createdAt = requestType.createdAt.toISO()!
    this.updatedAt = requestType.updatedAt.toISO()!
  }
}