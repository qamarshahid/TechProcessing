import { GenericContainer, StartedTestContainer } from 'testcontainers';
import { DataSource } from 'typeorm';

describe('Testcontainers Postgres', () => {
  let container: StartedTestContainer;
  let dataSource: DataSource;

  beforeAll(async () => {
    container = await new GenericContainer('postgres')
      .withEnv('POSTGRES_USER', 'test')
      .withEnv('POSTGRES_PASSWORD', 'test')
      .withEnv('POSTGRES_DB', 'testdb')
      .withExposedPorts(5432)
      .start();
    dataSource = new DataSource({
      type: 'postgres',
      host: container.getHost(),
      port: container.getMappedPort(5432),
      username: 'test',
      password: 'test',
      database: 'testdb',
    });
    await dataSource.initialize();
  });

  afterAll(async () => {
    await dataSource.destroy();
    await container.stop();
  });

  it('should connect to real Postgres', async () => {
    expect(dataSource.isInitialized).toBe(true);
  });
});
