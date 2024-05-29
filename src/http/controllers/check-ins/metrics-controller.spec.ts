import { app } from '@/app'
import { prisma } from '@/lib/prisma'
import { createAndAuthenticateUser } from '@/utils/test/create-and-authenticate-user'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import request from 'supertest'

describe('Check-in Metrics Controller (e2e)', () => {
    beforeAll(async () => {
        await app.ready()
    })

    afterAll(async () => {
        await app.close()
    })

    it('should be able to get the total count of check-ins', async () => {
        const { token } = await createAndAuthenticateUser(app)

        const user = await prisma.user.findFirstOrThrow()

        const gym = await prisma.gym.create({
            data: {
                title: 'JS Gym',
                latitude: -3.8382335,
                longitude: -49.680929
            }
        })

        await prisma.checkIn.createMany({
            data: [
                {
                    gym_id: gym.id,
                    user_Id: user.id
                },
                {
                    gym_id: gym.id,
                    user_Id: user.id  
                }
            ]
        })

        const response = await request(app.server)
            .get('/check-ins/metrics')
            .set('Authorization', `Bearer ${token}`)
            .send()

        expect(response.status).toEqual(200)
        expect(response.body.checkInsCount).toEqual(2)
    })
})
