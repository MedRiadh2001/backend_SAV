import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { RolePermisionModule } from './RolePermissionModule/rolePermision.module';
import { UserModule } from './UserModule/user.module';
import { SuiviModule } from './suivi/suivi.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get("DB_HOST"),
        port: configService.get("DB_PORT"),
        username: configService.get("DB_USERNAME"),
        password: configService.get("DB_PASSWORD"),
        database: configService.get("DB_NAME"),
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        synchronize: configService.get("TYPEORM_SYNCHRONIZE"),
      }),
      inject: [ConfigService],
    }),
    RolePermisionModule,
    UserModule,
    SuiviModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
