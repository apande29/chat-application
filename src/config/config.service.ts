import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { getMetadataArgsStorage } from 'typeorm';

@Injectable()
export class BackendConfigService {
  constructor(private configService: ConfigService) {}

  get port(): number {
    return Number(this.configService.get<number>('nodeConfiguration.port'));
  }

  get typeormConfigOptions(): TypeOrmModuleOptions {
    return {
      type: this.configService.get<string>('database.type'),
      port: Number(this.configService.get<number>('database.port')),
      username: this.configService.get<string>('database.username'),
      password: this.configService.get<string>('database.password'),
      database: this.configService.get<string>('database.database'),
      schema: this.configService.get<string>('database.schema'),
      entities: getMetadataArgsStorage().tables.map((tbl) => tbl.target),
      synchronize: Boolean(
        this.configService.get<boolean>('database.synchronize'),
      ),
      retryAttempts: Number(
        this.configService.get<number>('database.retryAttempts'),
      ),
      retryDelay: Number(this.configService.get<number>('database.retryDelay')),
      keepConnectionAlive: Boolean(
        this.configService.get<boolean>('database.keepConnectionAlive'),
      ),
      logging: ['error'],
      logger: 'simple-console',
      maxQueryExecutionTime: 1000,
    } as TypeOrmModuleOptions;
  }

  get typeormTestingConfigOptions(): TypeOrmModuleOptions {
    return {
      type: this.configService.get<string>('testDb.type'),
      port: Number(this.configService.get<number>('testDb.port')),
      username: this.configService.get<string>('testDb.username'),
      password: this.configService.get<string>('testDb.password'),
      database: this.configService.get<string>('testDb.database'),
      schema: this.configService.get<string>('testDb.schema'),
      entities: getMetadataArgsStorage().tables.map((tbl) => tbl.target),
      synchronize: Boolean(
        this.configService.get<boolean>('testDb.synchronize'),
      ),
      retryAttempts: Number(
        this.configService.get<number>('testDb.retryAttempts'),
      ),
      retryDelay: Number(this.configService.get<number>('testDb.retryDelay')),
      keepConnectionAlive: Boolean(
        this.configService.get<boolean>('testDb.keepConnectionAlive'),
      ),
      logging: ['error'],
      logger: 'simple-console',
      maxQueryExecutionTime: 1000,
    } as TypeOrmModuleOptions;
  }
}
