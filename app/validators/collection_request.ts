import vine from '@vinejs/vine'

export const collectionRequestSchema = vine.compile(
    vine.object({
        userId: vine.number().exists(async (db, id) => {
            const exists = await db.from('users').select('id').where('id', id).first()
            return !!exists
        }),
        wasteTypeId: vine.number().exists(async (db, id) => {
            const exists = await db.from('waste_types').select('id').where('id', id).first()
            return !!exists
        }),
        requestTypeId: vine.number().exists(async (db, id) => {
            const exists = await db.from('request_types').select('id').where('id', id).first()
            return !!exists
        }),
        scheduleDate: vine.date()
    })
)

export const validateRequestStatus = vine.compile(
    vine.object({
        requestStatusId: vine.number().exists(async (db, id) => {
            const exists = await db.from('request_statuses').select('id').where('id', id).first()
            return !!exists
        }),
    })
)