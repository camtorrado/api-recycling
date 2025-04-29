import Address from '#models/address'
import RequestStatus from '#models/request_status'
import RequestType from '#models/request_type'
import User from '#models/user'
import WasteType from '#models/waste_type'
import CollectionRequestService from '#services/collection_request_service'
import { collectionRequestSchema, validateRequestStatus } from '#validators/collection_request'
import { inject } from '@adonisjs/core'
import type { HttpContext } from '@adonisjs/core/http'

@inject()
export default class CollectionRequestsController {
  constructor(private collectionRequestService: CollectionRequestService) {}

  /**
   * Creates a new collection request for a user.
   *
   * This method validates the provided data, ensuring that the user exists,
   * the user has a valid main address, and both the waste type and request
   * type are valid. It also ensures that the request status is set to
   * "Pendiente". If all validations pass, it creates a new collection
   * request using the `CollectionRequestService`.
   *
   * @param {HttpContext} ctx - The HTTP context containing request and response objects.
   * @returns {Promise<any>} The newly created collection request or an error response.
   */
  async store({ request, response }: HttpContext) {
    try {
      if (!(await request.validateUsing(collectionRequestSchema))) {
        return response.badRequest({ message: 'Invalid request data' })
      }

      const data = request.only(['userId', 'wasteTypeId', 'requestTypeId', 'scheduleDate'])

      const userData = await User.find(data.userId)
      if (!userData) {
        return response.notFound({ message: 'User not found' })
      }

      const addressData = await Address.query()
        .where('user_id', userData.id)
        .where('main_address', true)
        .preload('location')
        .first()

      if (!addressData) {
        return response.notFound({ message: 'Address not found' })
      }

      const wasteType = await WasteType.find(data.wasteTypeId)
      if (!wasteType) {
        return response.notFound({ message: 'Waste type not found' })
      }

      const requestType = await RequestType.find(data.requestTypeId)
      if (!requestType) {
        return response.notFound({ message: 'Request type not found' })
      }

      const requestStatus = await RequestStatus.query().where('name', 'Pendiente').first()
      if (!requestStatus) {
        return response.notFound({ message: 'Request status not found' })
      }

      const collectionRequestData = {
        userName: userData.fullName,
        userPhone: userData.phone,
        userStreet: addressData.street,
        userNeighborhood: addressData.neighborhood,
        userLocationName: addressData.location.name,
        wasteTypeName: wasteType.name,
        requestTypeName: requestType.name,
        requestStatusName: requestStatus.name,
        scheduleDate: data.scheduleDate,
        userId: userData.id,
        locationId: addressData.location.id,
        wasteTypeId: wasteType.id,
        requestTypeId: requestType.id,
        requestStatusId: requestStatus.id,
      }

      const newRequest =
        await this.collectionRequestService.createCollectionRequest(collectionRequestData)
      return response.status(201).json(newRequest)
    } catch (error) {
      return response.status(400).json({ error: error.message })
    }
  }

  /**
   * Retrieves collection requests, optionally filtered by user, location, waste type,
   * request type, and request status.
   *
   * @param {{ request: HttpContext['request'], response: HttpContext['response'] }} ctx
   * The HTTP context containing request and response objects.
   * @returns {Promise<CollectionRequest[]>} A promise that resolves to an array of
   * collection requests. Each request is preloaded with its associated user,
   * location, waste type, request type, and request status.
   */
  public async show({ request, response }: HttpContext) {
    try {
      const filters = request.qs()
      const result = await this.collectionRequestService.findByFilters({
        userId: filters.userId ? Number(filters.userId) : undefined,
        locationId: filters.locationId ? Number(filters.locationId) : undefined,
        wasteTypeId: filters.wasteTypeId ? Number(filters.wasteTypeId) : undefined,
        requestTypeId: filters.requestTypeId ? Number(filters.requestTypeId) : undefined,
        requestStatusId: filters.requestStatusId ? Number(filters.requestStatusId) : undefined,
        startDate: filters.startDate ? filters.startDate : undefined,
        endDate: filters.endDate ? filters.endDate : undefined,
      })

      return response.ok(result)
    } catch (error) {
      // console.error(error)
      return response.status(500).json({ error: 'Error fetching collection requests', message: error.message })
    }
  }

  /**
   * Updates the status of a collection request.
   *
   * @param {{ request: HttpContext['request'], params: HttpContext['params'], response: HttpContext['response'] }} ctx
   * The HTTP context containing request, params, and response objects.
   * @returns {Promise<CollectionRequest>} A promise that resolves to the updated collection request.
   */
  async edit({ request, params, response }: HttpContext) {
    try {
      if (!(await request.validateUsing(validateRequestStatus))) {
        return response.badRequest({ message: 'Invalid request data' })
      }

      const { requestStatusId } = request.only(['requestStatusId'])
      const id = Number(params.id)

      if (!requestStatusId) {
        return response.badRequest({ message: 'requestStatusId is required' })
      }

      const updated = await this.collectionRequestService.updateStatus(id, requestStatusId)
      return response.ok(updated)
    } catch (error) {
      console.error(error)
      return response.status(400).json({ error: error.message })
    }
  }
}
