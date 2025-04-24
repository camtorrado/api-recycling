import vine from '@vinejs/vine'

/**
 * The auth schema is used to validate the shape of the user data
 * during the registration process.
 *
 * - `fullName` must be a string
 * - `email` must be a unique string with a valid email address format
 * - `phone` must be a number
 * - `password` must be a string with a minimum length of 8 and maximum length of 20
 * - `roleId` must be a number that exists in the `roles` table
 * - `address` is an optional object with the following properties
 *   - `street` must be a string
 *   - `neighborhood` must be a string
 *   - `locationId` must be a number that exists in the `locations` table
 *   - `mainAddress` must be a boolean
 */
export const authSchema = vine.compile(
  vine.object({
    fullName: vine.string(),
    email: vine
      .string()
      .email()
      .normalizeEmail()
      .unique(async (db, email) => {
        const exists = await db.from('users').select('email').where('email', email).first()
        return !exists
      }),
    phone: vine.number(),
    password: vine.string().minLength(8).maxLength(20),
    roleId: vine.number().exists(async (db, id) => {
      const exists = await db.from('roles').select('id').where('id', id).first()
      return !!exists
    }),
    address: vine
      .object({
        street: vine.string(),
        neighborhood: vine.string(),
        locationId: vine.number().exists(async (db, value) => {
          const exists = await db.from('locations').select('id').where('id', value).first()
          return !!exists
        }),
        mainAddress: vine.boolean(),
      })
  })
)

/**
 * The login schema is used to validate the shape of the user data
 * during the login process.
 *
 * - `email` must be a string with a valid email address format
 * - `password` must be a string with a minimum length of 8 and maximum length of 20
 */
export const loginSchema = vine.compile(
  vine.object({
    email: vine.string().email().normalizeEmail(),
    password: vine.string().minLength(8).maxLength(20),
  })
)

