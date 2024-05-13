import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { beforeEach, describe, expect, it } from 'vitest'
import { AuthenticateUseCase } from './authenticate-use-case'
import { hash } from 'bcryptjs'
import { InvalidCredentialsError } from './errors/invalid-credentials-error'

let inMemoryUsersRepository: InMemoryUsersRepository
let sut: AuthenticateUseCase

describe('Authenticate Use Case', () => {
    beforeEach(() => {
        inMemoryUsersRepository = new InMemoryUsersRepository()
        sut = new AuthenticateUseCase(inMemoryUsersRepository)
    })

    it('should be able to authenticate a user', async () => {
        await inMemoryUsersRepository.create({
            name: 'John Doe',
            email: 'johndoe@example.com',
            password_hash: await hash('123456', 6)
        })

        const { user } = await sut.execute({
            email: 'johndoe@example.com',
            password: '123456'
        })

        expect(user).toBeDefined()
        expect(user.id).toEqual(expect.any(String))
    })

    it('should not be able to authenticate a user with wrong email', async () => {
        await expect(() =>
            sut.execute({
                email: 'johndoe@example.com',
                password: '123456'
            })
        ).rejects.toBeInstanceOf(InvalidCredentialsError)
    })

    it('should not be able to authenticate a user with wrong password', async () => {
        await inMemoryUsersRepository.create({
            name: 'John Doe',
            email: 'johndoe@example.com',
            password_hash: await hash('123456', 6)
        })

        await expect(() =>
            sut.execute({
                email: 'johndoe@example.com',
                password: '123123'
            })
        ).rejects.toBeInstanceOf(InvalidCredentialsError)
    })
})
