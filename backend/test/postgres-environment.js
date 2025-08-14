// Jest custom environment to start a real PostgreSQL using Testcontainers
// and expose DATABASE_* env vars for the Nest application during e2e tests.

const NodeEnvironment = require('jest-environment-node').default;
const { PostgreSqlContainer } = require('@testcontainers/postgresql');
const { spawnSync } = require('child_process');
const path = require('path');

class PostgresEnvironment extends NodeEnvironment {
  async setup() {
    await super.setup();

    // Start ephemeral Postgres
    this.container = await new PostgreSqlContainer('postgres:16-alpine')
      .withDatabase('techserve_e2e')
      .withUsername('postgres')
      .withPassword('postgres')
      .start();

    // Inject env for app under test
    process.env.NODE_ENV = 'test';
    process.env.SKIP_DB = 'false';
    process.env.DATABASE_HOST = this.container.getHost();
    process.env.DATABASE_PORT = String(this.container.getMappedPort(5432));
    process.env.DATABASE_NAME = this.container.getDatabase();
    process.env.DATABASE_USERNAME = this.container.getUsername();
    process.env.DATABASE_PASSWORD = this.container.getPassword();

    // Optional: run migrations if present
    const result = spawnSync('npm', ['run', 'migration:run'], {
      cwd: path.join(__dirname, '..'),
      stdio: 'inherit',
      env: { ...process.env },
    });

    if (result.status !== 0) {
      throw new Error('Migration failed');
    }
  }

  async teardown() {
    if (this.container) {
      await this.container.stop();
    }
    await super.teardown();
  }
}

module.exports = PostgresEnvironment;
