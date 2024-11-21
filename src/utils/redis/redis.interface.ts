export interface IRedisService {
  set(key: string, value: string, expirationInSeconds: number): Promise<void>;
  get(key: string): Promise<string | null>;
  del(key: string): Promise<void>;
}
