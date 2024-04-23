import type { Knex } from 'knex'

// Criar modificar fazer algo com essa tabela
export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('transactions', (table) => {
    table.uuid('id').primary()
    table.text('title').notNullable()
    table.text('type').notNullable()
    table.decimal('amount', 10, 2).notNullable()
    table.timestamp('created_at').defaultTo(knex.fn.now()).notNullable()
  })
}

// Reverter caso dê merda
export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('transactions')
}
