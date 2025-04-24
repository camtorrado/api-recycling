import { WasteTypeService } from '#services/waste_type_service';
import { inject } from '@adonisjs/core';
import type { HttpContext } from '@adonisjs/core/http'

@inject()
export default class WasteTypesController {
  
  constructor(private wasteTypeService: WasteTypeService) {}

  /**
   * Fetches all waste types from the database.
   * 
   * @returns {Promise<WasteTypeDto[]>} A promise that resolves to an array of WasteTypeDto instances.
   */
  async index({ response }: HttpContext) {
    return response.ok(await this.wasteTypeService.getWasteTypes().catch(() => response.notFound()))
  }
}