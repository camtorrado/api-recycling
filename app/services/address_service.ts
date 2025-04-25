import AddressDto from '#dtos/address'
import Address from '#models/address'

export class AddressService {
  /**
   * Fetches all addresses associated with a user from the database.
   *
   * @param {number} user_id - The id of the user whose addresses should be fetched.
   * @returns {Promise<Address[]>} A promise that resolves to an array of all addresses
   *   associated with the user.
   */
  async getAddresses(user_id: number) {
    const addresses = AddressDto.fromArray(
      await Address.query().where('user_id', user_id).preload('location').exec()
    )
    return addresses
  }

  /**
   * Updates an existing address for a user and loads the associated location.
   *
   * @param {number} address_id - The id of the address to be updated.
   * @param {any} address - The address to be updated. The object should contain the fields
   *   `user_id`, `street`, `neighborhood`, `location_id`, and `mainAddress`.
   * @returns {Promise<Address>} A promise that resolves to the newly created address.
   */
  async updateAddress(address_id: number, address: any) {
    const existingAddress = await Address.findOrFail(address_id)
    await existingAddress.merge(address).save()
    await existingAddress.load('location')
    return new AddressDto(existingAddress)
  }

  /**
   * Creates a new address for a user and loads the associated location.
   *
   * @param {any} address - The address to be created. The object should contain the fields
   *   `user_id`, `street`, `neighborhood`, `location_id`, and `mainAddress`.
   * @returns {Promise<Address>} A promise that resolves to the newly created address.
   */
  async createAddress(address: any) {
    const newAddress = await Address.create(address)
    await newAddress.load('location')
    return new AddressDto(newAddress)
  }
}
