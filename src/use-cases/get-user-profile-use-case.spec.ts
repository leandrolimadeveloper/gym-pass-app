import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { beforeEach, describe, expect, it } from 'vitest'
import { GetUserProfileUseCase } from './get-user-profile-use-case'
import { hash } from 'bcryptjs'
import { ResourceNotFound } from './errors/resourece-not-found-error'

let inMemoryUsersRepository: InMemoryUsersRepository
let sut: GetUserProfileUseCase

describe('Get User Profile', async () => {
    beforeEach(() => {
        inMemoryUsersRepository = new InMemoryUsersRepository()
        sut = new GetUserProfileUseCase(inMemoryUsersRepository)
    })

    it('should be able to get a user profile', async () => {
        const createdUser = await inMemoryUsersRepository.create({
            name: 'John Doe',
            email: 'johndoe@example.com',
            password_hash: await hash('123456', 6)
        })

        const { user } = await sut.execute({
            userId: createdUser.id
        })

        expect(user.name).toEqual('John Doe')
    })

    it('should not be able to get a user profile', async () => {
        await expect(() =>
            sut.execute({
                userId: 'id-not-exists'
            })
        ).rejects.toBeInstanceOf(ResourceNotFound)
    })

})
