/* eslint-disable react-hooks/rules-of-hooks */

import { useFoo } from '../useFoo';

// [DESCRIBE] The function returned from `useFoo`
{
    // [DESCRIBE] Default
    {
        // It returns a `Foo` type
        const foo = useFoo();

        foo satisfies { foo: string };
    }
}
