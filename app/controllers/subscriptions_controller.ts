import { SubscriptionService } from '#services/subscription_service'
import { inject } from '@adonisjs/core'
import type { HttpContext } from '@adonisjs/core/http'

@inject()
export default class SubscriptionsController {
  constructor(private subscriptionService: SubscriptionService) {}

  /**
   * Fetches all subscriptions from the database.
   *
   * @returns {Promise<Subscription[]>} A promise that resolves to an array of all subscriptions.
   */
  async index({ response }: HttpContext) {
    return response.ok(await this.subscriptionService.getSubscriptions())
  }
}
