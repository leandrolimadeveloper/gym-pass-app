import { beforeEach, describe, expect, it } from 'vitest'
import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-checkins-repository'
import { CheckInUseCase } from './check-in-use-case'

let inMemoryCheckInsRepository: InMemoryCheckInsRepository
let sut: CheckInUseCase

describe('Check-in Use Case', async () => {
    beforeEach(() => {
        inMemoryCheckInsRepository = new InMemoryCheckInsRepository()
        sut = new CheckInUseCase(inMemoryCheckInsRepository)
    })

    it('should be able to check in a user', async () => {
        const { checkIn } = await sut.execute({
            userId: 'user-01',
            gymId: 'gym-01'
        })

        expect(checkIn.id).toEqual(expect.any(String))
    })
})
