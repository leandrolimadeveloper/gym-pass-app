import { beforeEach, describe, expect, it } from 'vitest'
import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-checkins-repository'
import { GetUserMetricsUseCase } from './get-user-metrics-use-case'

let inMemoryCheckInsRepository: InMemoryCheckInsRepository
let sut: GetUserMetricsUseCase

describe('Get User Metrics Use Case', async () => {
    beforeEach(async () => {
        inMemoryCheckInsRepository = new InMemoryCheckInsRepository()
        sut = new GetUserMetricsUseCase(inMemoryCheckInsRepository)
    })

    it('should be able to count the number of check-ins', async () => {
        await inMemoryCheckInsRepository.create({
            gym_id: 'gym-01',
            user_Id: 'user-01'
        })

        await inMemoryCheckInsRepository.create({
            gym_id: 'gym-02',
            user_Id: 'user-01',
        })

        const { checkInsCount } = await sut.execute({
            userId: 'user-01',
        })

        expect(checkInsCount).toEqual(2)
    })
})
