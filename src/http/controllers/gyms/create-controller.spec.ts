import request from 'supertest'
import { app } from '@/app'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { createAndAuthenticateUser } from '@/utils/test/create-and-authenticate-user'

describe('Create Gym Controller (e2e)', () => {
    beforeAll(async () => {
        await app.ready()
    })
    afterAll(async () => {
        await app.close()
    })
    
    it('should be able to create a gym', async () => {
        const { token } = await createAndAuthenticateUser(app, true)

        const response = await request(app.server)
            .post('/gyms')
            .set('Authorization', `Bearer ${token}`)
            .send({
                title: 'JS Gym',
                description: 'Description example',
                phone: '11-11111',
                latitude: -3.8382335,
                longitude: -49.680929, 
            })
        
        expect(response.status).toEqual(201)
    })
})
