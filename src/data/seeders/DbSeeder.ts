import * as fs from 'fs';
import * as path from 'path';
import { DbUtil } from '../../utils/DbUtil';
import { ContactFactory } from '../factories/ContactFactory';
import { Contact } from '../../types/models';
import { Logger } from '../../utils/logger';

/**
 * Database seeder.
 *
 * Writes directly to the DB — use it for states the API can't reach (bulk
 * fixtures, historic timestamps, intentionally corrupt rows). Two entry points:
 *   - runSqlFile(): apply a checked-in .sql script (migration-style baseline)
 *   - bulkInsertContacts(): factory-generated rows for volume/perf tests
 *
 * Goes through DbUtil so swapping the mock for a real driver is a one-file change.
 */
export class DbSeeder {
  /** Apply a SQL script from the sql/ directory (e.g. baseline seed). */
  static async runSqlFile(fileName: string): Promise<void> {
    const filePath = path.resolve(process.cwd(), 'sql', fileName);
    const sql = fs.readFileSync(filePath, 'utf-8');
    const statements = sql
      .split(';')
      .map((s) => s.trim())
      .filter(Boolean);
    for (const statement of statements) {
      await DbUtil.query(statement);
    }
    Logger.info('Ran SQL seed file', { fileName, statements: statements.length });
  }

  /** Insert N factory contacts directly — fast path for large datasets. */
  static async bulkInsertContacts(count: number): Promise<Contact[]> {
    const contacts = ContactFactory.createMany(count);
    for (const c of contacts) {
      await DbUtil.query(
        `INSERT INTO contacts (first_name, last_name, email, phone, status)
         VALUES (?, ?, ?, ?, ?)`,
        [c.firstName, c.lastName, c.email, c.phone, c.status],
      );
    }
    Logger.info('Bulk inserted contacts', { count });
    return contacts;
  }

  /** Remove rows seeded by tests (safe ordering: children before parents). */
  static async cleanup(): Promise<void> {
    await DbUtil.query('DELETE FROM interactions WHERE contact_id LIKE ?', ['cnt_%']);
    await DbUtil.query('DELETE FROM actions WHERE contact_id LIKE ?', ['cnt_%']);
    await DbUtil.query('DELETE FROM contacts WHERE email LIKE ?', ['%@plati-one.com']);
    Logger.info('DbSeeder cleanup complete');
  }
}
