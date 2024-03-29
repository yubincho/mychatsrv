import { Module } from '@nestjs/common';
import {ConfigModule, ConfigService} from "@nestjs/config";
import {TypeOrmModule, TypeOrmModuleOptions} from "@nestjs/typeorm";

@Module({
    imports: [
        TypeOrmModule.forRootAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: (cfg: ConfigService) => {
                return {
                    type: 'postgres',
                    host: cfg.get('POSTGRES_HOST'),
                    port: cfg.get('POSTGRES_PORT'),
                    username: cfg.get('POSTGRES_USERNAME'),
                    password: cfg.get('POSTGRES_PASSWORD'),
                    database: cfg.get('POSTGRES_DB'),
                    entities: [__dirname + '/../**/*.entities{.ts,.js}'],
                    autoLoadEntities: true,
                    synchronize: true,
                } as TypeOrmModuleOptions;
            },
        }),
    ],
})
export class DatabaseModule {}
