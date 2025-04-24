import User from '#models/user'
import { AddressService } from '#services/address_service'
import { addressSchema } from '#validators/address_schema'
import { inject } from '@adonisjs/core'
import type { HttpContext } from '@adonisjs/core/http'

@inject()
export default class AddressesController {
  constructor(private addressService: AddressService) {}

  /**
   * Fetches and returns the addresses associated with a user by user ID.
   *
   * @param {HttpContext} ctx - The HTTP context containing request and response objects.
   * @returns {Promise<any>} The user's addresses, or a not found response if user does not exist.
   */
  async show({ request, response }: HttpContext) {
    const userId = request.param('id')
    if (isNaN(userId) || !userId) {
      return response.badRequest({ message: 'Invalid user id' })
    }

    const user = await User.find(userId)
    if (!user) {
      return response.notFound({ message: 'User not found' })
    }

    return this.addressService.getAddresses(user.id)
  }

  /**
   * Creates a new address associated with a user and loads the associated location.
   *
   * @param {HttpContext} ctx - The HTTP context containing request and response objects.
   * @returns {Promise<any>} The newly created address, or a bad request response if the validation fails.
   */
  async create({ request, response }: HttpContext) {
    const addressData = await request.validateUsing(addressSchema)
    if (!addressData) {
      return response.badRequest({ message: 'Invalid address data' })
    }

    return await this.addressService.createAddress(addressData)
  }

  /**
   * Updates an existing address for a user and loads the associated location.
   *
   * @param {HttpContext} ctx - The HTTP context containing request and response objects.
   * @returns {Promise<any>} The newly created address, or a bad request response if the validation fails.
   */
  async update({ request, response }: HttpContext) {
    if (isNaN(request.param('id')) || !request.param('id')) {
      return response.badRequest({ message: 'Invalid address id' })
    }

    if (!(await request.validateUsing(addressSchema))) {
      return response.badRequest({ message: 'Invalid address data' })
    }

    const data = request.only(['street', 'neighborhood', 'locationId', 'mainAddress', 'userId'])
    return await this.addressService.updateAddress(request.param('id'), data)
  }
}
