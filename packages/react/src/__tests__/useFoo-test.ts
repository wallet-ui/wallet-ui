import { renderHook } from '../test-renderer';
import { useFoo } from '../useFoo';

describe('useFoo', () => {
    it('should return foo', () => {
        const { result } = renderHook(() => useFoo());

        expect(result.current).toEqual({ foo: 'foo' });
    });
});
