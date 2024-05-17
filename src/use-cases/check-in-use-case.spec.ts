import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-checkins-repository'
import { CheckInUseCase } from './check-in-use-case'
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository'
import { Decimal } from '@prisma/client/runtime/library'
import { MaxNumberOfCheckInsError } from './errors/max-number-of-check-ins-error'
import { MaxDistanceError } from './errors/max-distance-error'

let inMemoryCheckInsRepository: InMemoryCheckInsRepository
let inMemoryGymsRepository: InMemoryGymsRepository
let sut: CheckInUseCase

describe('Check-in Use Case', async () => {
    beforeEach(async () => {
        inMemoryCheckInsRepository = new InMemoryCheckInsRepository()
        inMemoryGymsRepository = new InMemoryGymsRepository()
        sut = new CheckInUseCase(inMemoryCheckInsRepository, inMemoryGymsRepository)

        await inMemoryGymsRepository.create({
            id: 'gym-01',
            title: 'Academia do JS',
            description: '',
            phone: '',
            latitude: -3.8382335,
            longitude: -49.680929,
        })

        vi.useFakeTimers()
    })

    afterEach(() => {
        vi.useRealTimers()
    })

    it('should be able to check in a user', async () => {
        const { checkIn } = await sut.execute({
            userId: 'user-01',
            gymId: 'gym-01',
            userLatitude: -3.8382335,
            userLongitude: -49.680929
        })

        expect(checkIn.id).toEqual(expect.any(String))
    })

    it('should not be able to check in twice in the same day', async () => {
        vi.setSystemTime(new Date(2023, 0, 1, 8, 0, 0))

        await sut.execute({
            userId: 'user-01',
            gymId: 'gym-01',
            userLatitude: -3.8382335,
            userLongitude: -49.680929
        })

        await expect(() =>
            sut.execute({
                userId: 'user-01',
                gymId: 'gym-01',
                userLatitude: -3.8382335,
                userLongitude: -49.680929
            })
        ).rejects.toBeInstanceOf(MaxNumberOfCheckInsError)
    })

    it('should be able to check in twice but in different days', async () => {
        vi.setSystemTime(new Date(2023, 0, 1, 8, 0, 0))

        await sut.execute({
            userId: 'user-01',
            gymId: 'gym-01',
            userLatitude: -3.8382335,
            userLongitude: -49.680929
        })

        vi.setSystemTime(new Date(2023, 0, 2, 8, 0, 0))

        const { checkIn } = await sut.execute({
            userId: 'user-01',
            gymId: 'gym-01',
            userLatitude: -3.8382335,
            userLongitude: -49.680929
        })

        expect(checkIn.id).toEqual(expect.any(String))
    })

    it('should not be able to check in a distant gym', async () => {
        inMemoryGymsRepository.items.push({
            id: 'gym-02',
            title: 'Academia do JS',
            latitude: new Decimal(-3.8382335),
            longitude: new Decimal(-49.680929),
            description: '',
            phone: ''
        })

        await expect(() => 
            sut.execute({
                gymId: 'gym-02',
                userId: 'user-01',
                userLatitude: -3.8114712,
                userLongitude: -49.6303747
            })
        ).rejects.toBeInstanceOf(MaxDistanceError)
    })
})
