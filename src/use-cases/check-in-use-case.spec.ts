import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-checkins-repository'
import { CheckInUseCase } from './check-in-use-case'

let inMemoryCheckInsRepository: InMemoryCheckInsRepository
let sut: CheckInUseCase

describe('Check-in Use Case', async () => {
    beforeEach(() => {
        inMemoryCheckInsRepository = new InMemoryCheckInsRepository()
        sut = new CheckInUseCase(inMemoryCheckInsRepository)

        vi.useFakeTimers()
    })

    afterEach(() => {
        vi.useRealTimers()
    })

    it('should be able to check in a user', async () => {
        
        const { checkIn } = await sut.execute({
            userId: 'user-01',
            gymId: 'gym-01'
        })

        expect(checkIn.id).toEqual(expect.any(String))
    })

    it('should not be able to check in twice in the same day', async () => {
        vi.setSystemTime(new Date(2023, 0, 1, 8, 0, 0))
        
        const { checkIn } = await sut.execute({
            userId: 'user-01',
            gymId: 'gym-01'
        })

        console.log(checkIn.created_at)

        await expect(() =>
            sut.execute({
                userId: 'user-01',
                gymId: 'gym-01'
            })
        ).rejects.toBeInstanceOf(Error)
    })

    it('should be able to check in twice but in different days', async () => {
        vi.setSystemTime(new Date(2023, 0, 1, 8, 0, 0))

        await sut.execute({
            gymId: 'gym-01',
            userId: 'user-01'
        })

        vi.setSystemTime(new Date(2023, 0, 2, 8, 0, 0))

        const { checkIn } = await sut.execute({
            gymId: 'gym-01',
            userId: 'user-01'
        })

        expect(checkIn.id).toEqual(expect.any(String))
    })
})
