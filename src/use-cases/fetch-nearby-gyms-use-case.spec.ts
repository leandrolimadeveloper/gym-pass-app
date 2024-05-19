import { beforeEach, describe, expect, it } from 'vitest'
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository'
import { FetchNearbyGymsUseCase } from './fetch-nearby-gyms-use-case'

let inMemoryGymsRepository: InMemoryGymsRepository
let sut: FetchNearbyGymsUseCase

describe('Fetch Nearby Gyms Use Case', async () => {
    beforeEach(async () => {
        inMemoryGymsRepository = new InMemoryGymsRepository()
        sut = new FetchNearbyGymsUseCase(inMemoryGymsRepository)
    })

    it('should be able to fetch nearby gyms', async () => {
        await inMemoryGymsRepository.create({
            title: 'Near Gym',
            description: null,
            phone: null,
            latitude: -3.8295394,
            longitude: -49.6744915,
        })

        await inMemoryGymsRepository.create({
            title: 'Far Gym',
            description: null,
            phone: null,
            latitude: -3.5189123,
            longitude: -49.5631125,
        })

        const { gyms } = await sut.execute({
            userLatitude: -3.8384766,
            userLongitude: -49.6878243
        })

        expect(gyms).toHaveLength(1)
        expect(gyms).toEqual([expect.objectContaining({ title: 'Near Gym'})])
    })
})
