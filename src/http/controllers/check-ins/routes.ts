import { FastifyInstance } from 'fastify'

import { verifyJWT } from '@/http/middlewares/verify-jwt'
import { verifyUserRole } from '@/http/middlewares/verify-user-role'

import { create } from './create-controller'
import { validate } from './validate-controller'
import { metrics } from './metrics-controller'
import { history } from './history-controller'


export async function checkInsRoutes(app: FastifyInstance) {
    app.addHook('onRequest', verifyJWT)

    app.post('/gyms/:gymId/check-ins', create)

    app.get('/check-ins/metrics', metrics)
    app.get('/check-ins/history', history)

    app.patch('/check-ins/:checkInId/validate', {onRequest: [verifyUserRole('ADMIN')]}, validate)
}
