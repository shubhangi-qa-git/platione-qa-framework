/**
 * CLI entry point for database seeding: `npm run seed:db`.
 * Applies the baseline SQL seed, then optionally bulk-inserts contacts.
 */
import { DbSeeder } from './DbSeeder';
import { DbUtil } from '../../utils/DbUtil';
import { Logger } from '../../utils/logger';

async function main(): Promise<void> {
  const bulk = Number(process.argv[2] || 0);
  await DbSeeder.runSqlFile('seed.sql');
  if (bulk > 0) await DbSeeder.bulkInsertContacts(bulk);
  await DbUtil.close();
  Logger.info('Seeding finished');
}

main().catch((err) => {
  Logger.error('Seeding failed', { error: String(err) });
  process.exit(1);
});
