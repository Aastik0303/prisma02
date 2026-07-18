type CacheClient = {
  get(key: string): Promise<string | null>;
  set(key: string, value: string, ...args: any[]): Promise<any>;
  del(key: string): Promise<number>;
};

export type CacheStatus = 'HIT' | 'MISS' | 'BYPASS';

export const sharedCacheControl = (
  browserSeconds: number,
  edgeSeconds: number,
  staleWhileRevalidateSeconds: number
) => (
  `public, max-age=${browserSeconds}, s-maxage=${edgeSeconds}, stale-while-revalidate=${staleWhileRevalidateSeconds}`
);

const stringifyCacheValue = (value: unknown) => (
  JSON.stringify(value, (_key, currentValue) => (
    typeof currentValue === 'bigint' ? currentValue.toString() : currentValue
  ))
);

export async function getOrSetJsonCache<T>(
  redis: CacheClient,
  key: string,
  ttlSeconds: number,
  loader: () => Promise<T>
): Promise<{ value: T; status: CacheStatus }> {
  try {
    const cached = await redis.get(key);
    if (cached) {
      return { value: JSON.parse(cached) as T, status: 'HIT' };
    }
  } catch {
    const value = await loader();
    return { value, status: 'BYPASS' };
  }

  const value = await loader();

  try {
    await redis.set(key, stringifyCacheValue(value), 'EX', ttlSeconds);
    return { value, status: 'MISS' };
  } catch {
    return { value, status: 'BYPASS' };
  }
}

export async function deleteJsonCache(redis: CacheClient, keys: string[]) {
  await Promise.all(keys.map(async key => {
    try {
      await redis.del(key);
    } catch {
      // Cache invalidation should not fail the write that produced fresh data.
    }
  }));
}
