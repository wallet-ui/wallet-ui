import { foo } from '../foo';

describe('foo', () => {
    it('should return foo', () => {
        const result = foo();

        expect(result).toBe('foo');
    });
});
