import { RequestTypeService } from '#services/request_type_service'
import { inject } from '@adonisjs/core'
import type { HttpContext } from '@adonisjs/core/http'

@inject()
export default class RequestTypesController {
  
  constructor(private requestTypeService: RequestTypeService) {}

  /**
   * Fetches all request types from the database.
   * 
   * @returns {Promise<RequestTypeDto[]>} A promise that resolves to an array of RequestTypeDto instances.
   */
  async index({ response }: HttpContext) {
    return response.ok(await this.requestTypeService.getRequestTypes().catch(() => response.notFound()))
  }
}