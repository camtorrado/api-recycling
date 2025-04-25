import Address from '#models/address'
import Company from '#models/company'
import Role from '#models/role'
import User from '#models/user'

export class AuthService {
  /**
   * Registers a new user and their associated address within a transaction.
   *
   * @param {any} userData - An object containing the user's data: fullName, email, phone, password, and roleId.
   * @param {any} addressData - An object containing the address data: mainAddress, street, neighborhood, and locationId.
   *
   * @returns {Promise<{ user: User, address: Address }>} A promise that resolves to an object with the created user and address.
   *
   * @throws {Error} If there is an error during the transaction, it will be rolled back and the error will be thrown.
   */
  async register(userData: any, addressData: any) {
    // Begin a transaction
    const trx = await User.transaction()

    try {
      // Create the user
      const user = new User()
      user.useTransaction(trx)
      user.fullName = userData.fullName
      user.email = userData.email
      user.phone = userData.phone
      user.password = userData.password
      user.roleId = userData.roleId
      user.subscriptionId = userData.subscriptionId
      await user.save()

      // Create the address
      const address = new Address()
      address.useTransaction(trx)
      address.mainAddress = addressData.mainAddress ?? false
      address.street = addressData.street
      address.neighborhood = addressData.neighborhood
      address.locationId = addressData.locationId
      address.userId = user.id
      await address.save()

      // If the user is a company, create a company
      const companyRole = await Role.findByOrFail('name', 'Company')
      if (userData.roleId === companyRole.id) {
        const company = new Company()
        company.useTransaction(trx)
        company.userId = user.id
        await company.save()
      }

      // Commit the transaction
      await trx.commit()

      // Load the associated role and addresses
      await user.load('role')
      await user.load('addresses', (addressQuery) => {
        addressQuery.preload('location')
      })

      // Create the access token
      const role = await Role.find(user.roleId)
      const permission = role?.permission
      const accessToken = await User.accessTokens.create(user, permission)

      return { user, accessToken }
    } catch (error) {
      await trx.rollback()
      throw error
    }
  }

  /**
   * Authenticates a user by email and password.
   *
   * @param {string} email The user's email address.
   * @param {string} password The user's password.
   *
   * @returns {Promise<{ user: User, accessToken: string }>}
   * Resolves to an object containing the authenticated user and an access token
   * to be used for subsequent requests. The access token is specific to the user
   * and their role.
   */
  async login(email: string, password: string) {
    const user = await User.verifyCredentials(email, password)
    const role = await Role.find(user.roleId)
    const permission = role?.permission
    const accessToken = await User.accessTokens.create(user, permission)
    await user.load('role')
    return {
      user: {
        ...user.toJSON(),
        token: {
          type: 'Bearer',
          token: accessToken.value!.release(),
        },
      },
    }
  }
}
