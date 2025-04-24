import SubscriptionDto from '#dtos/subscription'
import Subscription from '#models/subscription'

export class SubscriptionService {
  /**
   * Fetches all subscriptions from the database and converts them to SubscriptionDto objects.
   *
   * @returns {Promise<SubscriptionDto[]>} A promise that resolves to an array of SubscriptionDto instances.
   */
  async getSubscriptions() {
    return SubscriptionDto.fromArray(await Subscription.all())
  }
}
