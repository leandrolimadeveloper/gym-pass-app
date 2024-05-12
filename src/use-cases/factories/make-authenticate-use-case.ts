import { PrismaUsersRepository } from '@/repositories/prisma/prisma-users-repositories'
import { AuthenticateUseCase } from '../authenticate-use-case'

export function makeAuthenticateUseCase() {
    const usersRepository = new PrismaUsersRepository()
    const authenticateUseCase = new AuthenticateUseCase(usersRepository)

    return authenticateUseCase
}
