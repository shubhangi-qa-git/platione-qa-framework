/**
 * Environment configuration loader.
 *
 * Resolves which environment file to load from the TEST_ENV variable
 * (qa | staging | prod-like), falling back to `qa`. Centralising this means
 * tests never read process.env directly — they ask `env` for typed values, so
 * a missing variable fails loudly at startup instead of as `undefined` deep in
 * a test.
 */
import * as dotenv from 'dotenv';
import * as path from 'path';

export type EnvName = 'qa' | 'staging' | 'prod-like';

const envName = (process.env.TEST_ENV as EnvName) || 'qa';

// Load the matching .env.<name> file. Real CI secrets override file values.
dotenv.config({ path: path.resolve(process.cwd(), `.env.${envName}`) });

function required(key: string): string {
  const value = process.env[key];
  if (!value) {
    throw new Error(
      `Missing required env var "${key}" for environment "${envName}". ` +
        `Check .env.${envName}.`,
    );
  }
  return value;
}

export const env = {
  name: envName,
  baseUrl: process.env.BASE_URL || 'http://localhost:4200',
  apiUrl: process.env.API_URL || 'http://localhost:8080/api',
  // Credentials are optional locally (mock mode) but required against real envs.
  username: process.env.TEST_USER || 'qa.user@plati-one.com',
  password: process.env.TEST_PASSWORD || 'Password123!',
  // When true, API clients return mock responses instead of hitting the network.
  mockApi: process.env.MOCK_API !== 'false',
  db: {
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT || 3306),
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'root',
    database: process.env.DB_NAME || 'platione_qa',
  },
  required,
};
