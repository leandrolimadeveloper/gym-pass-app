import { beforeEach, describe, expect, it } from 'vitest'
import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-checkins-repository'
import { FetchUserCheckInsHistoryUseCase } from './fetch-user-check-ins-history-use-case'

let inMemoryCheckInsRepository: InMemoryCheckInsRepository
let sut: FetchUserCheckInsHistoryUseCase

describe('Fetch Check-in History', async () => {
    beforeEach(async () => {
        inMemoryCheckInsRepository = new InMemoryCheckInsRepository()
        sut = new FetchUserCheckInsHistoryUseCase(inMemoryCheckInsRepository)
    })

    it('should be able to fetch check-ins history', async () => {
        await inMemoryCheckInsRepository.create({
            gym_id: 'gym-01',
            user_Id: 'user-01'
        })

        await inMemoryCheckInsRepository.create({
            gym_id: 'gym-02',
            user_Id: 'user-01',
        })

        const { checkIns } = await sut.execute({
            userId: 'user-01',
            page: 1
        })

        expect(checkIns).toHaveLength(2)
        expect(checkIns).toEqual([
            expect.objectContaining({ gym_id: 'gym-01'}),
            expect.objectContaining({ gym_id: 'gym-02'})
        ])
    })

    it('should be able to fetch paginated check-ins history', async () => {
        for (let i = 1; i <= 22; i++) {
            await inMemoryCheckInsRepository.create({
                gym_id: `gym-${i}`,
                user_Id: 'user-01'
            })
        }

        const { checkIns } = await sut.execute({
            userId: 'user-01',
            page: 2
        })

        expect(checkIns).toHaveLength(2)
        expect(checkIns).toEqual([
            expect.objectContaining({ gym_id: 'gym-21'}),              
            expect.objectContaining({ gym_id: 'gym-22'})
        ])
    })
})
