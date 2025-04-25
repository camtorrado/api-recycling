/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import AddressesController from '#controllers/addresses_controller'
import AuthController from '#controllers/auth_controller'
import LocationsController from '#controllers/locations_controller'
import RolesController from '#controllers/roles_controller'
import router from '@adonisjs/core/services/router'
import { middleware } from './kernel.js'
import UsersController from '#controllers/users_controller'
import SubscriptionsController from '#controllers/subscriptions_controller'
import WasteTypesController from '#controllers/waste_types_controller'
import RequestTypesController from '#controllers/request_types_controller'
import CollectionRequestsController from '#controllers/collection_requests_controller'
import RoutesController from '#controllers/routes_controller'

router
  .group(() => {
    router
      .group(() => {
        router.get('/', [RolesController, 'index']).as('roles.index')
      })
      .prefix('roles')

    router
      .group(() => {
        router.get('/', [LocationsController, 'index']).as('locations.index')
      })
      .prefix('locations')

    router
      .group(() => {
        router.get('/', [SubscriptionsController, 'index']).as('suscriptions.index')
      })
      .prefix('subscriptions')

    router
      .group(() => {
        router.get('/', [RoutesController, 'index']).as('routes.index')
      })
      .prefix('routes').use(middleware.auth())

    router
      .group(() => {
        router.get('/', [WasteTypesController, 'index']).as('waste-types.index')
      })
      .prefix('waste-types').use(middleware.auth())

    router
      .group(() => {
        router.get('/', [RequestTypesController, 'index']).as('request-types.index')
      })
      .prefix('request-types').use(middleware.auth())

    router
      .group(() => {
        router.post('/', [CollectionRequestsController, 'store']).as('collection-requests.index')
        router.get('/', [CollectionRequestsController, 'show']).as('collection-requests.show')
        router.patch('/:id/status', [CollectionRequestsController, 'edit']).as('collection-requests.edit')
      })
      .prefix('collection-requests')
      .use(middleware.auth())

    router
      .group(() => {
        // Address routes
        router.get('/:id/addresses', [AddressesController, 'show']).as('users.addresses.show')
        router.post('/addresses', [AddressesController, 'create']).as('users.addresses.create')
        router.patch('/addresses/:id', [AddressesController, 'update']).as('users.addresses.update')
        // User routes
        router.patch('/:id', [UsersController, 'update']).as('users.update')
        router.get('/:id', [UsersController, 'me']).as('users.me')
        router.get('/', [UsersController, 'index']).as('users.index')
      })
      .prefix('users')
      .use(middleware.auth())

    router
      .group(() => {
        router.post('/login', [AuthController, 'login']).as('auth.login')
        router.post('/register', [AuthController, 'register']).as('auth.register')
        router
          .delete('/logout', [AuthController, 'logout'])
          .use(middleware.auth())
          .as('auth.logout')
      })
      .prefix('auth')

    router.get('/', async () => {
      return {
        message: 'Hello, world!',
      }
    })

    router.any('*', async ({ response }) => {
      return response.status(404).json({
        message: 'The requested route does not exist',
      })
    })
  })
  .prefix('api/v1')
