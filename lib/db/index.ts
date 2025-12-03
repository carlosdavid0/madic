import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL não está definida nas variáveis de ambiente');
}

const connectionString = process.env.DATABASE_URL;

// Configuração do cliente postgres
// max: 1 é recomendado para serverless/edge environments
// Para aplicações tradicionais, você pode aumentar este valor
const client = postgres(connectionString, {
  max: 1,
  idle_timeout: 20,
  connect_timeout: 10,
});

export const db = drizzle(client, { schema });

