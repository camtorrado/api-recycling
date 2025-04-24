import User from '#models/user'
import { AuthService } from '#services/auth_service'
import { authSchema, loginSchema } from '#validators/auth_schema'
import { inject } from '@adonisjs/core'
import type { HttpContext } from '@adonisjs/core/http'

@inject()
export default class AuthController {
  constructor(private authService: AuthService) {}

  /**
   * Registers a new user and their associated address.
   *
   * This method validates the user data using the auth schema. If the data is valid,
   * it begins a database transaction to create a new user and their address. The
   * transaction ensures both the user and address are created successfully, or neither
   * is created if an error occurs. On success, the transaction is committed, and the
   * created user data, including the address, is returned. If validation fails or an
   * error occurs during creation, an appropriate error response is returned.
   *
   * @param {HttpContext} ctx - The HTTP context containing request and response objects.
   * @returns {Promise<any>} The created user and address data on success, or an error
   * response if validation fails or an error occurs.
   */
  async register({ request, response }: HttpContext) {
    // Validate request data
    if (!(await request.validateUsing(authSchema))) {
      return response.badRequest({ message: 'Invalid user data' })
    }

    try {
      // Get user and address data
      const userData = {
        fullName: request.input('fullName'),
        email: request.input('email'),
        phone: request.input('phone'),
        password: request.input('password'),
        roleId: request.input('roleId'),
      }

      const addressData = request.input('address')

      // Call service to register user
      const { user, accessToken } = await this.authService.register(userData, addressData)

      // Return response with user and address
      return response.created({
        user: {
          ...user.toJSON(),
          token: {
            type: 'Bearer',
            token: accessToken.value!.release(),
          },
        },
      })
    } catch (error) {
      return response.badRequest({
        message: 'Error creating user',
        error: error.message,
      })
    }
  }

/**
 * Authenticates a user based on provided email and password.
 *
 * This method validates the login credentials using the login schema.
 * If the credentials are valid, it calls the AuthService to authenticate
 * the user and generate an access token.
 *
 * @param {HttpContext} ctx - The HTTP context containing request and response objects.
 * @returns {Promise<{ user: User, accessToken: string }>} The authenticated user and access token.
 */
  async login({ request }: HttpContext) {
    const { email, password } = await request.validateUsing(loginSchema)
    return await this.authService.login(email, password)
  }

  /**
   * Deletes the current access token for the authenticated user, effectively logging
   * them out.
   *
   * @param {HttpContext} ctx - The HTTP context containing request and response objects,
   * as well as the authenticated user.
   * @returns {Promise<{ message: string }>} A promise that resolves to a response with
   * a success message on successful logout.
   */
  async logout({ auth }: HttpContext) {
    const user = auth.user!;
    await User.accessTokens.delete(user, user.currentAccessToken.identifier);
    return { message: "Successfully logged out" }
  }
}
