import { BaseModelDto } from '@adocasts.com/dto/base'
import WasteType from '#models/waste_type'

export default class WasteTypeDto extends BaseModelDto {
  declare id: number
  declare name: string
  declare createdAt: string
  declare updatedAt: string

  constructor(wasteType?: WasteType) {
    super()

    if (!wasteType) return
    this.id = wasteType.id
    this.name = wasteType.name
    this.createdAt = wasteType.createdAt.toISO()!
    this.updatedAt = wasteType.updatedAt.toISO()!
  }
}