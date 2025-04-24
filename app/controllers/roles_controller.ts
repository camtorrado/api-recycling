import { RoleService } from '#services/role_service'
import { inject } from '@adonisjs/core'
import type { HttpContext } from '@adonisjs/core/http'

@inject()
export default class RolesController {
  constructor(private rolesService: RoleService) {}

  /**
   * Returns a list of all roles.
   *
   * @returns {Promise<Role[]>} A promise that resolves to an array of all roles.
   */
  async index({ response }: HttpContext) {
    return response.ok(await this.rolesService.getRoles().catch(() => response.notFound()))
  }
}
