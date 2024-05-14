import { Prisma, CheckIn } from '@prisma/client'
import { CheckInsRepository } from '../check-in-repository'
import { randomUUID } from 'node:crypto'

export class InMemoryCheckInsRepository implements CheckInsRepository {
    public items: CheckIn[] = []

    async findByUserIdOnDate(userId: string, date: Date) {
        const checkInOnSameDate = this.items.find((checkIn) => checkIn.user_Id === userId)

        if (!checkInOnSameDate) {
            return null
        }

        return checkInOnSameDate
    }

    async create(data: Prisma.CheckInUncheckedCreateInput) {
        const checkIn = {
            id: randomUUID(),
            user_Id: data.user_Id,
            gym_id: data.gym_id,
            validate_at: data.validate_at ? new Date(data.validate_at) : null,
            created_at: new Date()
        }

        this.items.push(checkIn)

        return checkIn
    }
}
