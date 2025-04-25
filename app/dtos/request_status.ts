import { BaseModelDto } from '@adocasts.com/dto/base'
import RequestStatus from '#models/request_status'

export default class RequestStatusDto extends BaseModelDto {
  declare id: number
  declare name: string
  declare createdAt: string
  declare updatedAt: string

  constructor(requestStatus?: RequestStatus) {
    super()

    if (!requestStatus) return
    this.id = requestStatus.id
    this.name = requestStatus.name
    this.createdAt = requestStatus.createdAt.toISO()!
    this.updatedAt = requestStatus.updatedAt.toISO()!
  }
}