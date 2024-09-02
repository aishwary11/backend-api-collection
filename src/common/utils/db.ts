import knex from 'knex';
const db = knex({
  client: 'mysql',
  connection: {
    host: '127.0.0.1',
    user: 'root',
    port: 3306,
    password: process.env.DB_PASS,
    database: process.env.DATABASE,
  },
  pool: { min: 0, max: 7 },
});

export default db;
