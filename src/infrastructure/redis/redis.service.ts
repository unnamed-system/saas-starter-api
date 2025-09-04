import { Cache, CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';

@Injectable()
export class RedisService {
	@Inject(CACHE_MANAGER) private readonly cacheManager: Cache;

	public async set(key: string, value: any, ttl?: number): Promise<void> {
		const serialized = JSON.stringify(value);
		await this.cacheManager.set(key, serialized, ttl);
	}

	public async mset(items: Record<string, any>, ttl?: number): Promise<void> {
		const entries = Object.entries(items);
		for (const [key, value] of entries) {
			await this.set(key, value, ttl);
		}
	}

	public async get<T>(key: string): Promise<T | undefined> {
		return this.cacheManager.get<T>(key);
	}

	public async mget<T = any>(keys: string[]): Promise<(T | undefined)[]> {
		const results = await Promise.all(keys.map((key) => this.get<T>(key)));
		return results;
	}

	public async delete(key: string): Promise<void> {
		await this.cacheManager.del(key);
	}

	public async clearAll(): Promise<void> {
		await this.cacheManager.clear();
	}
}
