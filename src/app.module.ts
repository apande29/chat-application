import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './v1/auth/auth.module';
import { GroupModule } from './v1/group/group.module';
import { MessageModule } from './v1/message/message.module';
import { UserModule } from './v1/user/user.module';
import { BackendConfigService } from './config/config.service';
import { BackendConfigModule } from './config/config.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      useFactory: (config: BackendConfigService) => config.typeormConfigOptions,
      inject: [BackendConfigService],
      imports: [BackendConfigModule],
    }),
    AuthModule,
    UserModule,
    GroupModule,
    MessageModule,
  ],
  providers: [],
  exports: [TypeOrmModule],
})
export class AppModule {}
