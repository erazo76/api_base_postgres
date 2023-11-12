
import { CacheService } from "infrastructure/cache";

describe('cache', () => {
    let service: CacheService;

    it('Cache', async () => {
        service = new CacheService();
        expect(service).toBeDefined();

        let result = service.createCacheOptions();
        expect(result).toStrictEqual({
            ttl: 1,
            max: 10,
        })
    })
});