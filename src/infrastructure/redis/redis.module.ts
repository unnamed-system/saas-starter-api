import { createKeyv } from '@keyv/redis';
import { CacheModule } from '@nestjs/cache-manager';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { RedisService } from './redis.service';

@Module({
	imports: [
		CacheModule.registerAsync({
			isGlobal: true,
			imports: [ConfigModule],
			inject: [ConfigService],
			useFactory: (configService: ConfigService) => {
				const port = configService.get<number>('redis.port');
				const host = configService.get('redis.host');
				// const username = configService.get('redis.username');
				// const password = configService.get('redis.password');
				const connection = `redis://${host}:${port}`;

				return {
					stores: [createKeyv(connection)],
				};
			},
		}),
	],
	providers: [RedisService],
	exports: [RedisService],
})
export class RedisModule {}
