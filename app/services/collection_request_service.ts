import CollectionRequest from '#models/collection_request'
import RequestStatus from '#models/request_status'
import Route from '#models/route'
import Shift from '#models/shift'
import { DateTime } from 'luxon'

const WASTE_TYPES = {
  HAZARDOUS: 'Peligroso',
  RECYCLABLE: 'Inorganico Reciclable',
}

const REQUEST_TYPES = {
  PROGRAMADA: 'Programada',
  DEMANDADA: 'Demandada',
}

const LIMITS = {
  HAZARDOUS_PER_MONTH: 1,
  PROGRAMADAS_PER_WEEK: 2,
  TOTAL_RECYCLABLE_PER_WEEK: 3,
}

export default class CollectionRequestService {
  /**
   * Determines if a user can make a hazardous waste collection request.
   *
   * This method checks the number of hazardous waste requests made by the user
   * in the current month and compares it with the allowed monthly limit.
   *
   * @param {number} userId - The ID of the user.
   * @returns {Promise<boolean>} True if the user can make a hazardous request,
   * otherwise false.
   */
  async canUserMakeHazardousRequest(userId: number): Promise<boolean> {
    const [start, end] = this.getMonthDateRange()

    const [
      {
        $extras: { total },
      },
    ] = await CollectionRequest.query()
      .where('user_id', userId)
      .where('waste_type_name', WASTE_TYPES.HAZARDOUS)
      .whereBetween('created_at', [start, end])
      .count('* as total')

    return Number(total) < LIMITS.HAZARDOUS_PER_MONTH
  }

  /**
   * Finds or creates a shift for a given location and schedule date.
   *
   * This method first finds the route associated with the given location,
   * and then checks if there is already a shift scheduled for the given
   * date and time. If there is, it throws an error. Otherwise, it creates
   * a new shift for the given time slot.
   *
   * @param {number} locationId - The ID of the location.
   * @param {DateTime} scheduleDate - The date and time of the shift.
   * @returns {Promise<Shift>} The newly created or existing shift.
   * @throws {Error} If there is already a shift scheduled in the given time slot.
   */
  async findOrCreateShift(locationId: number, scheduleDate: DateTime): Promise<Shift> {
    const route = await Route.query()
      .preload('locations', (q) => q.where('locations.id', locationId))
      .first()

    if (!route || route.locations.length === 0) {
      throw new Error('There is no route configured for this location.')
    }

    const date = scheduleDate.toISODate()!
    const startTime = scheduleDate.toFormat('HH:mm:ss')
    const endTime = scheduleDate.plus({ hours: 1 }).toFormat('HH:mm:ss')

    const overlappingShift = await Shift.query()
      .where('route_id', route.id)
      .andWhere('date', date)
      .andWhere((q) =>
        q
          .whereBetween('start_time', [startTime, endTime])
          .orWhereBetween('end_time', [startTime, endTime])
          .orWhere((b) => b.where('start_time', '<', startTime).andWhere('end_time', '>', endTime))
      )
      .first()

    if (overlappingShift) {
      throw new Error('There is already a shift scheduled in this time slot.')
    }

    return Shift.create({
      routeId: route.id,
      date: scheduleDate.startOf('day'),
      startTime,
      endTime,
    })
  }

  /**
   * Validates if a user can make a recyclable waste collection request.
   *
   * This method checks the number of recyclable waste requests made by the user
   * in the current week, and compares it with the allowed weekly limit.
   * If the request is a scheduled (programada) request, it also checks the
   * number of scheduled requests made by the user in the current week.
   *
   * @param {number} userId - The ID of the user.
   * @param {DateTime} scheduleDate - The date and time of the request.
   * @param {string} requestTypeName - The type of the request (programada or demandada).
   *
   * @returns {Promise<void>} Resolves if the user can make the request,
   * or throws an error otherwise.
   */
  async validateRecyclableRequestSlot(
    userId: number,
    scheduleDate: DateTime,
    requestTypeName: string
  ): Promise<void> {
    const requestType = requestTypeName.trim()
    const isProgrammed = requestType === REQUEST_TYPES.PROGRAMADA
    const isDemanded = requestType === REQUEST_TYPES.DEMANDADA

    if (!isProgrammed && !isDemanded) {
      throw new Error('Request type must be either "Programada" or "Demandada".')
    }

    const [start, end] = this.getWeekDateRange(scheduleDate)

    const requests = await CollectionRequest.query()
      .where('user_id', userId)
      .where('waste_type_name', WASTE_TYPES.RECYCLABLE)
      .whereBetween('schedule_date', [start, end])

    const programadas = requests.filter(
      (r) => r.requestTypeName?.trim() === REQUEST_TYPES.PROGRAMADA
    )

    if (isProgrammed && programadas.length >= LIMITS.PROGRAMADAS_PER_WEEK) {
      throw new Error(
        'You can only have up to 2 scheduled (programada) recyclable requests per week.'
      )
    }

    if (requests.length >= LIMITS.TOTAL_RECYCLABLE_PER_WEEK) {
      throw new Error(
        'You can only have up to 3 recyclable requests (programada or demandada) per week.'
      )
    }
  }

  /**
   * Creates a new collection request.
   *
   * This method verifies the provided data for creating a collection request.
   * It ensures that a schedule date is present and correctly formatted. It
   * determines if the waste type is hazardous or recyclable. For hazardous waste,
   * it checks if the user is within the allowed monthly request limit. If the waste
   * type is recyclable, it validates the user's request slot based on the weekly limit.
   * It also finds or creates an appropriate shift for the collection.
   *
   * @param {Partial<CollectionRequest>} data - The data for creating a collection request.
   * @returns {Promise<CollectionRequest>} The created collection request.
   * @throws {Error} If the schedule date is missing or if the request limits are exceeded.
   */
  async createCollectionRequest(data: Partial<CollectionRequest>): Promise<CollectionRequest> {
    const trx = await CollectionRequest.transaction()

    try {
      if (!data.scheduleDate) {
        throw new Error('Schedule date is required.')
      }

      const scheduleDate = DateTime.fromFormat(
        data.scheduleDate.toString(),
        'yyyy-MM-dd HH:mm:ss',
        {
          zone: 'America/Bogota',
        }
      )

      const wasteType = data.wasteTypeName?.toLowerCase()
      const isHazardous = wasteType?.includes(WASTE_TYPES.HAZARDOUS.toLowerCase())
      const isRecyclable = wasteType?.includes(WASTE_TYPES.RECYCLABLE.toLowerCase())

      if (isHazardous) {
        const canRequest = await this.canUserMakeHazardousRequest(data.userId!)
        if (!canRequest) {
          throw new Error('You can only make one hazardous waste request per month.')
        }
      }

      const shift = await this.findOrCreateShift(data.locationId!, scheduleDate)
      data.shiftId = shift.id
      data.scheduleDate = scheduleDate

      if (isRecyclable) {
        await this.validateRecyclableRequestSlot(data.userId!, scheduleDate, data.requestTypeName!)
      }

      const request = await CollectionRequest.create(data, { client: trx })
      await trx.commit()
      return request
    } catch (error) {
      await trx.rollback()
      throw error
    }
  }

  /**
   * Gets the start and end dates of the current month in SQL format.
   *
   * @returns {string[]} The start and end dates of the current month in SQL format.
   */
  private getMonthDateRange(): [string, string] {
    return [DateTime.now().startOf('month').toSQL()!, DateTime.now().endOf('month').toSQL()!]
  }

  /**
   * Gets the start and end dates of the week for a given date in SQL format.
   *
   * @param {DateTime} date - The date for which to get the week's date range.
   * @returns {[string, string]} The start and end dates of the week in SQL format.
   */
  private getWeekDateRange(date: DateTime): [string, string] {
    return [date.startOf('week').toSQL()!, date.endOf('week').toSQL()!]
  }

  /**
   * Retrieves collection requests, optionally filtered by user, location, waste type,
   * request type, and request status.
   *
   * @param {{userId?: number, locationId?: number, wasteTypeId?: number, requestTypeId?: number, requestStatusId?: number}} filters
   * @returns {Promise<CollectionRequest[]>} A promise that resolves to an array of
   * collection requests. Each request is preloaded with its associated user,
   * location, waste type, request type, and request status.
   */
  async findByFilters(filters: {
    userId?: number
    locationId?: number
    wasteTypeId?: number
    requestTypeId?: number
    requestStatusId?: number
  }) {
    const query = CollectionRequest.query()

    if (filters.userId) {
      query.where('user_id', filters.userId)
    }

    if (filters.locationId) {
      query.where('location_id', filters.locationId)
    }

    if (filters.wasteTypeId) {
      query.where('waste_type_id', filters.wasteTypeId)
    }

    if (filters.requestTypeId) {
      query.where('request_type_id', filters.requestTypeId)
    }

    if (filters.requestStatusId) {
      query.where('request_status_id', filters.requestStatusId)
    }

    return await query
      .preload('user')
      .preload('location')
      .preload('wasteType')
      .preload('requestType')
      .preload('requestStatus')
      .preload('shift') // esto es opcional, puedes quitarlo si no lo necesitas en la respuesta
  }

  /**
   * Updates only the status of a collection request.
   *
   * @param id - The ID of the collection request.
   * @param requestStatusId - The new status ID to assign.
   * @returns The updated collection request.
   * @throws Error if the request is not found.
   */
  async updateStatus(id: number, requestStatusId: number): Promise<CollectionRequest> {
    const request = await CollectionRequest.find(id)

    if (!request) {
      throw new Error('Collection request not found')
    }

    const status = await RequestStatus.findOrFail(requestStatusId)
    request.requestStatusId = requestStatusId
    request.requestStatusName = status.name
    await request.save()

    return request
  }
}
