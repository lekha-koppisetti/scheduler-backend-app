import { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    await knex.schema.createTable('appointments', (table) => {
        table.uuid('id').notNullable();
        table.uuid('customerId').notNullable();
        table.uuid('operatorId').notNullable();
        
        table.dateTime('starttime').notNullable();
        table.dateTime('endtime').notNullable();
        table.dateTime('createdAt').defaultTo(knex.fn.now());
        table.dateTime('updatedAt').defaultTo(knex.fn.now());
        table.primary(['id']);
    });
}


export async function down(knex: Knex): Promise<void> {
    await knex.schema.dropTable('appointments');
}
