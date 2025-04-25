import { BaseModelDto } from '@adocasts.com/dto/base'
import CollectionRequest from '#models/collection_request'
import UserDto from '#dtos/user'
import LocationDto from '#dtos/location'
import WasteTypeDto from '#dtos/waste_type'
import RequestTypeDto from '#dtos/request_type'
import RequestStatusDto from '#dtos/request_status'
import ShiftDto from '#dtos/shift'
import { DateTime } from 'luxon'

export default class CollectionRequestDto extends BaseModelDto {
  declare id: number
  declare userName: string
  declare userPhone: number
  declare userStreet: string
  declare userNeighborhood: string
  declare userLocationName: string
  declare wasteTypeName: string
  declare requestTypeName: string
  declare requestStatusName: string
  declare scheduleDate: string
  declare userId: number
  declare user: UserDto | null
  declare locationId: number
  declare location: LocationDto | null
  declare wasteTypeId: number
  declare wasteType: WasteTypeDto | null
  declare requestTypeId: number
  declare requestType: RequestTypeDto | null
  declare requestStatusId: number
  declare requestStatus: RequestStatusDto | null
  declare shiftId: number
  declare shift: ShiftDto | null
  declare createdAt: string
  declare updatedAt: string

  constructor(collectionRequest?: CollectionRequest) {
    super()

    if (!collectionRequest) return
    this.id = collectionRequest.id
    this.userName = collectionRequest.userName
    this.userPhone = collectionRequest.userPhone
    this.userStreet = collectionRequest.userStreet
    this.userNeighborhood = collectionRequest.userNeighborhood
    this.userLocationName = collectionRequest.userLocationName
    this.wasteTypeName = collectionRequest.wasteTypeName
    this.requestTypeName = collectionRequest.requestTypeName
    this.requestStatusName = collectionRequest.requestStatusName

    this.scheduleDate = DateTime.isDateTime(collectionRequest.scheduleDate)
    ? collectionRequest.scheduleDate.toISO()!
    : DateTime.fromJSDate(new Date(collectionRequest.scheduleDate)).toISO()!

    // this.userId = collectionRequest.userId
    this.user = collectionRequest.user && new UserDto(collectionRequest.user)
    // this.locationId = collectionRequest.locationId
    this.location = collectionRequest.location && new LocationDto(collectionRequest.location)
    // this.wasteTypeId = collectionRequest.wasteTypeId
    this.wasteType = collectionRequest.wasteType && new WasteTypeDto(collectionRequest.wasteType)
    // this.requestTypeId = collectionRequest.requestTypeId
    this.requestType = collectionRequest.requestType && new RequestTypeDto(collectionRequest.requestType)
    // this.requestStatusId = collectionRequest.requestStatusId
    this.requestStatus = collectionRequest.requestStatus && new RequestStatusDto(collectionRequest.requestStatus)
    // this.shiftId = collectionRequest.shiftId
    this.shift = collectionRequest.shift && new ShiftDto(collectionRequest.shift)
    this.createdAt = collectionRequest.createdAt.toISO()!
    this.updatedAt = collectionRequest.updatedAt.toISO()!
  }
}