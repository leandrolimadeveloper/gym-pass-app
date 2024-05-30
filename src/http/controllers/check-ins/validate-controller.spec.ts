import { app } from '@/app'
import { prisma } from '@/lib/prisma'
import { createAndAuthenticateUser } from '@/utils/test/create-and-authenticate-user'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import request from 'supertest'

describe('Validate Check-in Controller (e2e)', () => {
    beforeAll(async () => {
        await app.ready()
    })

    afterAll(async () => {
        await app.close()
    })

    it('should be able to validate a check-in', async () => {
        const { token } = await createAndAuthenticateUser(app, true)

        const user = await prisma.user.findFirstOrThrow()

        const gym = await prisma.gym.create({
            data: {
                title: 'JS Gym',
                latitude: -3.8382335,
                longitude: -49.680929
            }
        })

        let checkIn = await prisma.checkIn.create({
            data: {
                gym_id: gym.id,
                user_Id: user.id
            }
        })

        const response = await request(app.server)
            .patch(`/check-ins/${checkIn.id}/validate`)
            .set('Authorization', `Bearer ${token}`)
            .send({
                latitude: -3.8382335,
                longitude: -49.680929
            })

        expect(response.status).toEqual(204)

        checkIn = await prisma.checkIn.findUniqueOrThrow({
            where: {
                id: checkIn.id
            }
        })

        expect(checkIn.validate_at).toEqual(expect.any(Date))
    })
})
