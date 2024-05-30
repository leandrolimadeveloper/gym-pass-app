import { app } from '@/app'
import { createAndAuthenticateUser } from '@/utils/test/create-and-authenticate-user'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import request from 'supertest'

describe('Nearby Gyms Controller (e2e)', () => {
    beforeAll(async () => {
        await app.ready()
    })

    afterAll(async () => {
        await app.close()
    })

    it('should be able to list nearby gyms', async () => {
        const { token } = await createAndAuthenticateUser(app, true)

        await request(app.server)
            .post('/gyms')
            .set('Authorization', `Bearer ${token}`)
            .send({
                title: 'JS Gym',
                description: 'Description example',
                phone: '11-11111',
                latitude: -3.8295394,
                longitude: -49.6744915,
            })

        await request(app.server)
            .post('/gyms')
            .set('Authorization', `Bearer ${token}`)
            .send({
                title: 'TS Gym',
                description: 'Description example',
                phone: '11-11111',
                latitude: -3.5189123,
                longitude: -49.5631125,
            })
        
        const response = await request(app.server)
            .get('/gyms/nearby')
            .set('Authorization', `Bearer ${token}`)
            .query({
                latitude: -3.8295394,
                longitude: -49.6744915
            })
            .send()

        expect(response.status).toEqual(200)
        expect(response.body.gyms).toEqual([
            expect.objectContaining({ title: 'JS Gym'})
        ])
    })
})
