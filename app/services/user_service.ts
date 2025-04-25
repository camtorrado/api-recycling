import UserDto from '#dtos/user'
import User from '#models/user'

export class UserService {
  /**
   * Updates an existing user by their id.
   *
   * @param {number} id The id of the user to be updated.
   * @param {any} userData The user data to be used for the update.
   *
   * @returns {Promise<User>} A promise that resolves to the updated user.
   */
  async update(id: number, userData: any) {
    const user = await User.find(id)
    if (!user) {
      throw new Error('User not found')
    }
    user.fullName = userData.fullName ?? user.fullName
    user.email = userData.email ?? user.email
    user.phone = userData.phone ?? user.phone
    user.password = userData.password ?? user.password
    user.roleId = userData.roleId ?? user.roleId
    user.subscriptionId = userData.subscriptionId ?? user.subscriptionId
    await user.save()
    await user.load('role')
    return user
  }

  /**
   * Retrieves a user by their id, and loads their associated role and addresses with their locations.
   *
   * @param {number} id The id of the user to be retrieved.
   *
   * @returns {Promise<User>} A promise that resolves to the user with their associated role and addresses with locations.
   *
   * @throws {Error} If the user is not found.
   */
  async getUserInfo(id: number) {
    const user = await User.find(id)
    if (!user) {
      throw new Error('User not found')
    }
    await user.load('role')
    await user.load('addresses', (addressQuery) => {
      addressQuery.preload('location')
    })
    return user
  }

  /**
   * Retrieves users, optionally filtered by role or subscription id.
   *
   * @param {{roleId?: number, subscriptionId?: number}} [filter={}]
   * @returns {Promise<User[]>} A promise that resolves to the filtered list of users.
   */
  async getUsers(filter: { roleId?: number; subscriptionId?: number } = {}) {
    const query = User.query()

    if (filter.roleId) {
      query.where('roleId', filter.roleId)
    }

    if (filter.subscriptionId) {
      query.where('subscriptionId', filter.subscriptionId)
    }

    const users = await query
      .preload('role')
      .preload('subscription')
      .preload('addresses', (addressQuery) => {
        addressQuery.preload('location')
      })

    return UserDto.fromArray(users)
  }
}
