import { ConfigService } from "@nestjs/config";
import type { TypeOrmModuleOptions } from "@nestjs/typeorm";

export const typeOrmConfig = (configService: ConfigService): TypeOrmModuleOptions => ({
    type: 'postgres',
    host: configService.get<string>('DATABASE_HOST'),
    port: Number(configService.get<string>('DATABASE_PORT')),
    username: configService.get<string>('DATABASE_USER'),
    password: configService.get<string>('DATABASE_PASS'),
    database: configService.get<string>('DATABASE_NAME'),
    ssl: true,
    logging: true,
});