import {knex} from 'knex';

export const connectionObj = {
  // host: '35.200.243.206',
  host : '192.168.1.3',
  user: 'postgres',
  password: 'admin',
  database: 'postgres',
  port: '5432'
}

export const pg = knex({
  client: 'pg',
  connection: connectionObj,
  pool: { min: 2, max: 20 }
});

export async function accessDatabase(): Promise<boolean> {
  const result = await pg.raw('SELECT NOW()');
  return result.rowCount === 1;
}
