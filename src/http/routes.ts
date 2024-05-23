import { FastifyInstance } from 'fastify'
import { registerController } from './controllers/register-controller'
import { authenticateController } from './controllers/authenticate-controller'
import { profileController } from './controllers/profile-controller'

export async function appRoutes(app: FastifyInstance) {
    app.post('/users', registerController)
    app.get('/me', profileController)
    app.post('/sessions', authenticateController)
}
