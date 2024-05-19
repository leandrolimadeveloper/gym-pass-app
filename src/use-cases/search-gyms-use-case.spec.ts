import { beforeEach, describe, expect, it } from 'vitest'
import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-checkins-repository'
import { FetchUserCheckInsHistoryUseCase } from './fetch-user-check-ins-history-use-case'
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository'
import { SearchGymsUseCase } from './search-gyms-use-case'

let inMemoryGymsRepository: InMemoryGymsRepository
let sut: SearchGymsUseCase

describe('Search Gyms Use Case', async () => {
    beforeEach(async () => {
        inMemoryGymsRepository = new InMemoryGymsRepository()
        sut = new SearchGymsUseCase(inMemoryGymsRepository)
    })

    it('should be able to search for gyms', async () => {
        await inMemoryGymsRepository.create({
            title: 'JavaScript Academy',
            description: null,
            phone: null,
            latitude: -3.8382335,
            longitude: -49.680929,
        })

        await inMemoryGymsRepository.create({
            title: 'Golang Gym',
            description: null,
            phone: null,
            latitude: -3.8382335,
            longitude: -49.680929,
        })

        const { gyms } = await sut.execute({
            query: 'Golang Gym',
            page: 1
        })

        expect(gyms).toHaveLength(1)
        expect(gyms).toEqual([expect.objectContaining({ title: 'Golang Gym'})])
    })

    it('should be able to fetch paginated gyms by search', async () => {
        for (let i = 1; i <= 22; i++) {
            await inMemoryGymsRepository.create({
                title: `Golang Gym ${i}`,
                description: null,
                phone: null,
                latitude: -3.8382335,
                longitude: -49.680929,
            })
        }

        const { gyms } = await sut.execute({
            query: 'Golang',
            page: 2
        })

        expect(gyms).toHaveLength(2)
        expect(gyms).toEqual([
            expect.objectContaining({ title: 'Golang Gym 21'}),
            expect.objectContaining({ title: 'Golang Gym 22'})
        ])
    })
})
