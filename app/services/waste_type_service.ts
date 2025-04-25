import WasteTypeDto from '#dtos/waste_type'
import WasteType from '#models/waste_type'

export class WasteTypeService {
  /**
   * Fetches all waste types from the database.
   *
   * @returns {Promise<WasteTypeDto[]>} A promise that resolves to an array of WasteTypeDto instances.
   */
  async getWasteTypes() {
    return WasteTypeDto.fromArray(await WasteType.all())
  }
}
