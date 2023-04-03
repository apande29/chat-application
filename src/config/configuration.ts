export default () => ({
  database: {
    type: process.env.DB_TYPE || 'postgres',
    masterHost: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT) || 5432,
    username: process.env.DB_USERNAME || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres',
    database: process.env.DB_NAME || 'chat',
    schema: process.env.DB_SCHEMA || 'public',
    synchronize:
      ((process.env.DB_SYNCHRONIZATION == 'true') as boolean) || true,
    retryAttempts: 10,
    retryDelay: 3000,
    keepConnectionAlive: false,
  },
  testDb: {
    type: process.env.DB_TYPE || 'postgres',
    masterHost: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT) || 5432,
    username: process.env.DB_USERNAME || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres',
    database: process.env.DB_NAME || 'chat',
    schema: process.env.DB_SCHEMA || 'public',
    synchronize:
      ((process.env.DB_SYNCHRONIZATION == 'true') as boolean) || false,
    retryAttempts: 10,
    retryDelay: 3000,
    keepConnectionAlive: false,
  },
  nodeConfiguration: {
    port: parseInt(process.env.PORT, 10) || 4000,
    accessControlOrigin: process.env.ACCESS_CONTROL_ALLOW_ORIGIN || '*',
  },
  keys: {
    jwtServerAlgorithm: process.env.JWT_SERVER_ALGORITHM || 'HS512',
    jwtServerSecret: process.env.JWT_SERVER_SECRET || 'super',
  },
});
