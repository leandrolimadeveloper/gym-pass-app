import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-checkins-repository'
import { ValidateCheckInUseCase } from './validate-check-in-use-case'
import { ResourceNotFound } from './errors/resourece-not-found-error'

let inMemoryCheckInsRepository: InMemoryCheckInsRepository
let sut: ValidateCheckInUseCase

describe('Validate Check-in Use Case', async () => {
    beforeEach(async () => {
        inMemoryCheckInsRepository = new InMemoryCheckInsRepository()
        sut = new ValidateCheckInUseCase(inMemoryCheckInsRepository)

        vi.useFakeTimers()
    })

    afterEach(() => {
        vi.useRealTimers()
    })

    it('should be able to validate the check-in', async () => {
        const createdCheckIn = await inMemoryCheckInsRepository.create({
            gym_id: 'gym-01',
            user_Id: 'user-01'
        })

        const { checkIn } = await sut.execute({
            checkInId: createdCheckIn.id
        })

        expect(checkIn.validate_at).toEqual(expect.any(Date))
        expect(inMemoryCheckInsRepository.items[0].validate_at).toEqual(expect.any(Date))
    })

    it('should not be able to validate an inexistent check-in', async () => {
        await expect(() => 
            sut.execute({
                checkInId: 'inexistent-check-in-id'
            })
        ).rejects.toBeInstanceOf(ResourceNotFound)
    })

    it('should not be able to validade a check-in after 20 minutes', async () => {
        vi.setSystemTime(new Date(2024, 0, 1, 14, 10))

        const createdCheckIn = await inMemoryCheckInsRepository.create({
            gym_id: 'gym-01',
            user_Id: 'user-01'
        })

        const twentyOneMinutesInMs = 1000 * 60 * 21

        vi.advanceTimersByTime(twentyOneMinutesInMs)

        await expect(() => 
            sut.execute({
                checkInId: createdCheckIn.id
            })
        ).rejects.toBeInstanceOf(Error)
    })
    
})
