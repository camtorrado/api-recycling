import vine from '@vinejs/vine'

/**
 * The address schema is used to validate the shape of the address data
 * when creating a new address associated with a user.
 *
 * - `street` must be a string
 * - `neighborhood` must be a string
 * - `locationId` must be a number that exists in the `locations` table
 * - `mainAddress` must be a boolean
 * - `userId` must be a number that exists in the `users` table
 */
export const addressSchema = vine.compile(
  vine.object({
    street: vine.string().optional(),
    neighborhood: vine.string().optional(),
    locationId: vine.number().optional(),
    mainAddress: vine.boolean().optional(),
    userId: vine.number().exists(async (db, user_id) => {
      const user = await db.from('users').select('id').where('id', user_id).first()
      return !!user
    }),
  })
)
