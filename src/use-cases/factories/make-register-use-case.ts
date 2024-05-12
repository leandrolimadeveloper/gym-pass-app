import { PrismaUsersRepository } from '@/repositories/prisma/prisma-users-repositories'
import { RegisterUseCase } from '../register-use-case'

export function makeRegisterUseCase() {
    const usersRepository = new PrismaUsersRepository()
    const registerUseCase = new RegisterUseCase(usersRepository)

    return registerUseCase
}
