import { registerAs } from '@nestjs/config';

// src/config/database.config.ts

export default registerAs('database', () => ({
	host: process.env.DB_HOST,
	port: process.env.DB_PORT,
	username: process.env.DB_USER,
	password: process.env.DB_PASSWORD,
	name: process.env.DB_NAME,
	synchronize: true,
	logging: true,
	entities: [__dirname + '/../domain/entities/*.entity{.ts,.js}'],
}));
