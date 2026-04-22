import Database from 'better-sqlite3';
import { join } from 'path';
import { mkdirSync } from 'fs';

const dataDir = join(process.cwd(), 'data');
mkdirSync(dataDir, { recursive: true });

const db = new Database(join(dataDir, 'openqed.db'));
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

db.exec(`
	CREATE TABLE IF NOT EXISTS users (
		id TEXT PRIMARY KEY,
		github_id INTEGER UNIQUE NOT NULL,
		username TEXT NOT NULL,
		display_name TEXT NOT NULL,
		avatar_url TEXT NOT NULL,
		verified INTEGER NOT NULL DEFAULT 0,
		verification_method TEXT,
		created_at TEXT NOT NULL DEFAULT (datetime('now')),
		contributions INTEGER NOT NULL DEFAULT 0,
		proofs INTEGER NOT NULL DEFAULT 0,
		reductions INTEGER NOT NULL DEFAULT 0
	)
`);

db.exec(`
	CREATE TABLE IF NOT EXISTS sessions (
		id TEXT PRIMARY KEY,
		user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
		created_at TEXT NOT NULL DEFAULT (datetime('now'))
	)
`);

export default db;
