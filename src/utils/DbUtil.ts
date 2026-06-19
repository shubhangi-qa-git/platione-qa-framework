import { env } from '../config/env';
import { Logger } from './logger';

/**
 * Database utility.
 *
 * Thin seam over the DB driver used by the DB seeder and for cleanup/teardown.
 * Kept as a mock by default so the framework runs with zero infrastructure;
 * swap the body for a real `mysql2` pool when a QA database is available — the
 * public surface (query / cleanupTable / close) stays the same.
 */
export class DbUtil {
  private static connected = false;

  static async connect(): Promise<void> {
    // Real impl: this.pool = await mysql.createPool(env.db)
    Logger.info('DB connect', { host: env.db.host, database: env.db.database });
    this.connected = true;
  }

  static async query<T = unknown>(sql: string, params: unknown[] = []): Promise<T[]> {
    if (!this.connected) await this.connect();
    Logger.debug('DB query', { sql, params });
    // Real impl: const [rows] = await this.pool.execute(sql, params); return rows
    return [];
  }

  /** Delete rows created by a test run, e.g. cleanupTable('contacts', 'email', testEmail). */
  static async cleanupTable(table: string, column: string, value: string): Promise<void> {
    await this.query(`DELETE FROM ?? WHERE ?? = ?`, [table, column, value]);
    Logger.info('DB cleanup', { table, column, value });
  }

  static async close(): Promise<void> {
    if (!this.connected) return;
    // Real impl: await this.pool.end()
    this.connected = false;
    Logger.info('DB connection closed');
  }
}
