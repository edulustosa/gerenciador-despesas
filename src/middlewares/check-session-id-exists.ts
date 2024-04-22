import type {
  FastifyRequest,
  FastifyReply,
  HookHandlerDoneFunction,
} from 'fastify'

export function checkSessionIdExists(
  request: FastifyRequest,
  reply: FastifyReply,
  done: HookHandlerDoneFunction,
) {
  const { sessionId } = request.cookies

  if (!sessionId) {
    return reply.status(401).send({
      error: 'Unauthorized',
    })
  }

  done()
}
