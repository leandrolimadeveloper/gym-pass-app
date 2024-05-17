import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository'
import { describe, expect, it, beforeEach } from 'vitest'
import { CreateGymUseCase } from './create-gym-use-case'

let inMemoryGymsRepository: InMemoryGymsRepository
let sut: CreateGymUseCase

describe('Create Gym Use Case', () => {
    beforeEach(() => {
        inMemoryGymsRepository = new InMemoryGymsRepository()
        sut = new CreateGymUseCase(inMemoryGymsRepository)
    })
    
    it('should be able to create a gym', async () => {
        const { gym } = await sut.execute({
            title: 'JavaScript Gym',
            description: null,
            phone: null,
            latitude: -3.8382335,
            longitude: -49.680929,
        })

        expect(gym).toBeDefined()
        expect(gym.id).toEqual(expect.any(String))
    })
})
