import { BaseSeeder } from '@adonisjs/lucid/seeders'
import User from '#models/user'
import Address from '#models/address'
import Role from '#models/role'
import Location from '#models/location'
import Subscription from '#models/subscription'
import Company from '#models/company'

export default class extends BaseSeeder {
  /**
   * Seeds the database with the following users:
   * 1. Super Admin with Paid subscription
   * 2. User with Paid subscription
   * 3. User with Free subscription #1
   * 4. User with Free subscription #2
   * 5. Company User #1 - Usaquén
   * 6. Company User #2 - Chapinero
   */
  public async run() {
    const adminRole = await Role.findByOrFail('name', 'Admin')
    const userRole = await Role.findByOrFail('name', 'User')
    const companyRole = await Role.findByOrFail('name', 'Company')

    const usaquen = await Location.findByOrFail('name', 'Usaquén')
    const chapinero = await Location.findByOrFail('name', 'Chapinero')

    const paidSub = await Subscription.findByOrFail('name', 'Paid')
    const freeSub = await Subscription.findByOrFail('name', 'Free')

    // Super Admin user
    const superAdmin = await User.create({
      fullName: 'Super Admin',
      email: 'admin@example.com',
      phone: 3001234567,
      password: 'secret123',
      roleId: adminRole.id,
      subscriptionId: paidSub.id,
    })

    await Address.create({
      mainAddress: true,
      street: 'Calle 123',
      neighborhood: 'Any neighborhood',
      locationId: usaquen.id,
      userId: superAdmin.id,
    })

    // User with Paid subscription
    const userPaid = await User.create({
      fullName: 'User Paid',
      email: 'paiduser@example.com',
      phone: 3007654321,
      password: 'user1234',
      roleId: userRole.id,
      subscriptionId: paidSub.id,
    })

    await Address.create({
      mainAddress: true,
      street: 'Calle 456',
      neighborhood: 'Zona 2',
      locationId: usaquen.id,
      userId: userPaid.id,
    })

    // User with Free subscription #1
    const userFree1 = await User.create({
      fullName: 'User Free 1',
      email: 'freeuser1@example.com',
      phone: 3012345678,
      password: 'user1234',
      roleId: userRole.id,
      subscriptionId: freeSub.id,
    })

    await Address.create({
      mainAddress: true,
      street: 'Carrera 78',
      neighborhood: 'Zona 3',
      locationId: usaquen.id,
      userId: userFree1.id,
    })

    // User with Free subscription #2
    const userFree2 = await User.create({
      fullName: 'User Free 2',
      email: 'freeuser2@example.com',
      phone: 3023456789,
      password: 'user1234',
      roleId: userRole.id,
      subscriptionId: freeSub.id,
    })

    await Address.create({
      mainAddress: true,
      street: 'Diagonal 10',
      neighborhood: 'Zona 4',
      locationId: chapinero.id,
      userId: userFree2.id,
    })

    // Company User #1 - Usaquén
    const companyUser1 = await User.create({
      fullName: 'Blue Recycling',
      email: 'company1@example.com',
      phone: 3034567890,
      password: 'company123',
      roleId: companyRole.id,
      subscriptionId: null,
    })

    await Address.create({
      mainAddress: true,
      street: 'Transversal 45',
      neighborhood: 'Empresa Z1',
      locationId: usaquen.id,
      userId: companyUser1.id,
    })

    // If companyUser1 is a company create it in the companies table
    if (companyUser1.roleId === companyRole.id) {
      await Company.create({
        userId: companyUser1.id
      })
    }

    // Company User #2 - Chapinero
    const companyUser2 = await User.create({
      fullName: 'Green Recycling',
      email: 'company2@example.com',
      phone: 3045678901,
      password: 'company123',
      roleId: companyRole.id,
      subscriptionId: null,
    })

    await Address.create({
      mainAddress: true,
      street: 'Avenida 9',
      neighborhood: 'Empresa Z2',
      locationId: chapinero.id,
      userId: companyUser2.id,
    })

    // If companyUser2 is a company create it in the companies table
    if (companyUser2.roleId === companyRole.id) {
      await Company.create({
        userId: companyUser2.id
      })
    }
  }
}
