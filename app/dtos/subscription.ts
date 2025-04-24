import { BaseModelDto } from '@adocasts.com/dto/base'
import Subscription from '#models/subscription'

export default class SubscriptionDto extends BaseModelDto {
  declare id: number
  declare name: string
  declare createdAt: string
  declare updatedAt: string

  constructor(subscription?: Subscription) {
    super()

    if (!subscription) return
    this.id = subscription.id
    this.name = subscription.name
    this.createdAt = subscription.createdAt.toISO()!
    this.updatedAt = subscription.updatedAt.toISO()!
  }
}