import RoleDto from '#dtos/role'
import Role from '#models/role'

export class RoleService {
  /**
   * Fetches all roles from the database.
   *
   * @returns {Promise<Role[]>} A promise that resolves to an array of all roles.
   */
  async getRoles() {
    const roles = await Role.query().where('name', '!=', 'Admin').orderBy('name', 'asc')
    return RoleDto.fromArray(await roles)
  }
}
