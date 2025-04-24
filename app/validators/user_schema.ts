import vine from '@vinejs/vine'

/**
 * The user schema is used to validate the shape of the user data
 * during the registration and update processes.
 *
 * - `fullName` must be a string
 * - `email` must be a string with a valid email address format
 * - `phone` must be a number
 * - `roleId` must be a number that exists in the `roles` table
 * - `subscriptionId` must be a number that exists in the `subscriptions` table
 */
export const userSchema = vine.compile(
    vine.object({
        fullName: vine.string().optional(),
        email: vine.string().email().normalizeEmail().optional(),
        phone: vine.number().optional(),
        roleId: vine.number().exists(async (db, id) => {
            const exists = await db.from('roles').select('id').where('id', id).first()
            return !!exists
        }).optional(),
        subscriptionId: vine.number().exists(async (db, id) => {
            const exists = await db.from('subscriptions').select('id').where('id', id).first()
            return !!exists
        }).optional()
    })
)
