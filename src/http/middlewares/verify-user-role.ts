import { FastifyReply, FastifyRequest } from 'fastify'

export function verifyUserRole(roleToVerify: 'ADMIN' | 'MEMBER') {
    return (request: FastifyRequest, reply: FastifyReply, done: () => void) => {
        const { role } = request.user

        if (role !== roleToVerify) {
            return reply.status(401).send({ message: 'Unauthorized' })
        } else {
            done()
        }
    }
}
