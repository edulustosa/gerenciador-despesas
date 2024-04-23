import type { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { randomUUID } from 'node:crypto'
import { knex } from '../database'
import { checkSessionIdExists } from '../middlewares/check-session-id-exists'

// Cookies <-> Formas de manter contexto entre requisições

interface Transaction {
  title?: string | undefined
  amount?: number | undefined
  type?: 'credit' | 'debit' | undefined
}

export async function transactionsRoutes(app: FastifyInstance) {
  /*
    * Hook que é adicionado a todas as rotas dessa função

    app.addHook('preHandler', async (request) => {
      console.log(`[${request.method} ${request.url}]`)
    })
  */

  app.get(
    '/',
    {
      preHandler: [checkSessionIdExists],
    },
    async (request) => {
      const { sessionId } = request.cookies

      const transactions = await knex('transactions')
        .select()
        .where('session_id', sessionId)

      return { transactions }
    },
  )

  app.get(
    '/:id',
    {
      preHandler: [checkSessionIdExists],
    },
    async (request) => {
      const getTransactionParamSchema = z.object({
        id: z.string().uuid(),
      })

      const { id } = getTransactionParamSchema.parse(request.params)

      const { sessionId } = request.cookies

      const transaction = await knex('transactions')
        .where({
          id,
          session_id: sessionId,
        })
        .first()

      return { transaction }
    },
  )

  app.get(
    '/summary',
    {
      preHandler: [checkSessionIdExists],
    },
    async (request) => {
      const { sessionId } = request.cookies

      const summary = await knex('transactions')
        .sum('amount', { as: 'amount' })
        .where('session_id', sessionId)
        .first()

      return { summary }
    },
  )

  app.post('/', async (request, reply) => {
    const createTransactionBodySchema = z.object({
      title: z.string(),
      amount: z.number(),
      type: z.enum(['credit', 'debit']),
    })

    const { title, amount, type } = createTransactionBodySchema.parse(
      request.body,
    )

    let sessionId = request.cookies.sessionId

    if (!sessionId) {
      sessionId = randomUUID()

      reply.cookie('sessionId', sessionId, {
        path: '/',
        maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
      })
    }

    await knex('transactions').insert({
      id: randomUUID(),
      title,
      amount: type === 'credit' ? amount : amount * -1,
      type,
      session_id: sessionId,
    })

    return reply.status(201).send()
  })

  app.put(
    '/:id',
    {
      preHandler: [checkSessionIdExists],
    },
    async (request, reply) => {
      const createTransactionBodySchema = z.object({
        title: z.string().optional(),
        amount: z.number().optional(),
        type: z.enum(['credit', 'debit']).optional(),
      })

      const getTransactionParamSchema = z.object({
        id: z.string().uuid(),
      })

      const parsedUpdatedTransaction: Transaction =
        createTransactionBodySchema.parse(request.body)

      const { id } = getTransactionParamSchema.parse(request.params)
      const { sessionId } = request.cookies

      for (const key in parsedUpdatedTransaction) {
        if (!parsedUpdatedTransaction[key as keyof Transaction]) {
          delete parsedUpdatedTransaction[key as keyof Transaction]
        }
      }

      const transaction = await knex('transactions')
        .where({
          id,
          session_id: sessionId,
        })
        .first()

      if (!transaction) {
        return reply.code(400).send({
          error: "Transaction don't exist",
        })
      }

      const amount = parsedUpdatedTransaction.amount || transaction.amount
      const transactionType = parsedUpdatedTransaction.type || transaction.type

      if (
        (transactionType === 'credit' && amount < 0) ||
        (transactionType === 'debit' && amount > 0)
      ) {
        parsedUpdatedTransaction.amount = amount * -1
      }

      const updatedTransaction = await knex('transactions')
        .where({
          id,
          session_id: sessionId,
        })
        .update(parsedUpdatedTransaction)
        .returning('*')

      return { transaction: updatedTransaction[0] }
    },
  )

  app.delete(
    '/:id',
    {
      preHandler: [checkSessionIdExists],
    },
    async (request, reply) => {
      const getTransactionParamSchema = z.object({
        id: z.string().uuid(),
      })

      const { id } = getTransactionParamSchema.parse(request.params)

      const { sessionId } = request.cookies

      await knex('transactions')
        .where({
          id,
          session_id: sessionId,
        })
        .del()

      return reply.status(200).send()
    },
  )
}
