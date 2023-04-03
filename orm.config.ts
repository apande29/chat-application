import { DataSourceOptions } from 'typeorm';

const config: DataSourceOptions = {
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'postgres',
  password: 'postgres',
  database: 'chat',
  entities: ['src/entities/*.entity{.ts,.js}'],
  synchronize: true,
};
export default config;
