import { FastifyInstance } from 'fastify'
import { registerController } from './controllers/register-controller'
import { authenticateController } from './controllers/authenticate-controller'
import { profileController } from './controllers/profile-controller'
import { verifyJWT } from './middlewares/verify-jwt'

export async function appRoutes(app: FastifyInstance) {
    app.post('/users', registerController)
    app.get('/me', { onRequest: [verifyJWT] }, profileController)
    app.post('/sessions', authenticateController)
}
