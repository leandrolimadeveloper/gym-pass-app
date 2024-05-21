import { CheckIn } from '@prisma/client'
import { CheckInsRepository } from '@/repositories/check-in-repository'
import { ResourceNotFound } from './errors/resourece-not-found-error'

interface ValidateCheckInUseCaseRequest {
    checkInId: string
}

interface ValidateCheckInUseCaseResponse {
    checkIn: CheckIn
}

export class ValidateCheckInUseCase {
    constructor(
        private checkInsRepository: CheckInsRepository,
    ) { }

    async execute({ checkInId }: ValidateCheckInUseCaseRequest): Promise<ValidateCheckInUseCaseResponse> {
        const checkIn = await this.checkInsRepository.findById(checkInId)

        if (!checkIn) {
            throw new ResourceNotFound()
        }

        checkIn.validate_at = new Date()

        await this.checkInsRepository.save(checkIn)

        return { checkIn }
    }
}
