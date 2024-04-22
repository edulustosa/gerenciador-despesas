import fastify from 'fastify'
import cookie from '@fastify/cookie'

import { transactionsRoutes } from './routes/transactions'

export const app = fastify()

/*
  * Hook global adicionado para todas as rotas abaixo dele
  app.addHook('preHandler', async (request) => {
    console.log(`[${request.method}] ${request.url}`)
  })
*/

app.register(cookie)

app.register(transactionsRoutes, {
  prefix: 'transactions',
})
