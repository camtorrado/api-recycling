import RequestTypeDto from '#dtos/request_type'
import RequestType from '#models/request_type'

export class RequestTypeService {
  /**
   * Fetches all request types from the database.
   *
   * @returns {Promise<RequestTypeDto[]>} A promise that resolves to an array of RequestTypeDto instances.
   */
  async getRequestTypes() {
    return RequestTypeDto.fromArray(await RequestType.all())
  }
}
