import type { HttpContext } from '@adonisjs/core/http'
import { UserService } from '#services/user_service'
import { inject } from '@adonisjs/core'
import { userSchema } from '#validators/user_schema'

@inject()
export default class UsersController {
  constructor(private readonly userService: UserService) {}

  /**
   * Updates an existing user.
   *
   * @param {{ request: HttpContext['request'], response: HttpContext['response'], auth: HttpContext['auth'] }} ctx
   * The HTTP context containing request and response objects, as well as the authenticated user.
   * @returns {Promise<any>} The updated user.
   */
  async update({ request, response }: HttpContext) {
    if (isNaN(request.param('id')) || !request.param('id')) {
      return response.badRequest({ message: 'Invalid user id' })
    }

    if (!(await request.validateUsing(userSchema))) {
      return response.badRequest({ message: 'Invalid user data' })
    }

    const data = request.only([
      'fullName',
      'email',
      'phone',
      'password',
      'roleId',
      'subscriptionId',
    ])
    const user = await this.userService.update(request.param('id'), data)
    return response.ok(user)
  }

  /**
   * Returns the user information.
   *
   * @param {{ request: HttpContext['request'], response: HttpContext['response'], auth: HttpContext['auth'] }} ctx
   * The HTTP context containing request and response objects, as well as the authenticated user.
   * @returns {Promise<any>} The user information.
   */
  async me({ request, response }: HttpContext) {
    if (isNaN(request.param('id')) || !request.param('id')) {
      return response.badRequest({ message: 'Invalid user id' })
    }

    const id = parseInt(request.param('id'))
    const user = await this.userService.getUserInfo(id)
    return response.ok(user)
  }

  /**
   * Returns users, optionally filtered by role or subscription id.
   *
   * @param {{ request: HttpContext['request'], response: HttpContext['response'] }} ctx
   * @returns {Promise<any>} The list of users.
   */
  async index({ request, response }: HttpContext) {
    const roleId = request.input('roleId')
    const subscriptionId = request.input('subscriptionId')

    const filter: { roleId?: number; subscriptionId?: number } = {}

    if (roleId) filter.roleId = parseInt(roleId)
    if (subscriptionId) filter.subscriptionId = parseInt(subscriptionId)

    const users = await this.userService.getUsers(filter)
    return response.ok(users)
  }
}
