-- =============================================================================
-- Platione Sales Assist — baseline test data seed
-- =============================================================================
-- Migration-style, idempotent seed for a fresh QA database. Safe to re-run:
-- tables are created if missing and rows are upserted on conflict.
-- Applied via DbSeeder.runSqlFile('seed.sql') or `mysql < sql/seed.sql`.
-- =============================================================================

CREATE TABLE IF NOT EXISTS contacts (
  id          VARCHAR(64) PRIMARY KEY,
  first_name  VARCHAR(255) NOT NULL,
  last_name   VARCHAR(255) NOT NULL,
  email       VARCHAR(320) NOT NULL UNIQUE,
  phone       VARCHAR(32),
  company     VARCHAR(255),
  status      ENUM('ACTIVE', 'INACTIVE', 'ARCHIVED') NOT NULL DEFAULT 'ACTIVE',
  created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS actions (
  id          VARCHAR(64) PRIMARY KEY,
  contact_id  VARCHAR(64) NOT NULL,
  type        ENUM('CALL', 'EMAIL', 'MEETING', 'DEMO', 'FOLLOW_UP') NOT NULL,
  status      ENUM('PLANNED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED') NOT NULL DEFAULT 'PLANNED',
  title       VARCHAR(255) NOT NULL,
  due_date    TIMESTAMP NULL,
  CONSTRAINT fk_action_contact FOREIGN KEY (contact_id) REFERENCES contacts (id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS interactions (
  id          VARCHAR(64) PRIMARY KEY,
  contact_id  VARCHAR(64) NOT NULL,
  channel     ENUM('CALL', 'EMAIL', 'MEETING', 'WHATSAPP', 'IN_PERSON') NOT NULL,
  summary     TEXT,
  occurred_at TIMESTAMP NULL,
  CONSTRAINT fk_interaction_contact FOREIGN KEY (contact_id) REFERENCES contacts (id) ON DELETE CASCADE
);

-- Baseline contacts ---------------------------------------------------------
INSERT INTO contacts (id, first_name, last_name, email, phone, company, status)
VALUES
  ('cnt_seed_001', 'John',  'Doe',   'john.doe@plati-one.com',   '+1-202-555-0100', 'Acme Corp',     'ACTIVE'),
  ('cnt_seed_002', 'Jane',  'Smith', 'jane.smith@plati-one.com', '+1-202-555-0101', 'Globex',        'ACTIVE'),
  ('cnt_seed_003', 'Sam',   'Lee',   'sam.lee@plati-one.com',    '+1-202-555-0102', 'Initech',       'INACTIVE')
ON DUPLICATE KEY UPDATE first_name = VALUES(first_name);

-- A planned follow-up + a logged interaction for contact 001 ----------------
INSERT INTO actions (id, contact_id, type, status, title, due_date)
VALUES ('act_seed_001', 'cnt_seed_001', 'FOLLOW_UP', 'PLANNED', 'Quarterly check-in', DATE_ADD(NOW(), INTERVAL 3 DAY))
ON DUPLICATE KEY UPDATE title = VALUES(title);

INSERT INTO interactions (id, contact_id, channel, summary, occurred_at)
VALUES ('int_seed_001', 'cnt_seed_001', 'CALL', 'Intro call — interested in Pro tier', DATE_SUB(NOW(), INTERVAL 2 DAY))
ON DUPLICATE KEY UPDATE summary = VALUES(summary);
