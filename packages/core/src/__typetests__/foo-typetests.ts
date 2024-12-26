import { foo } from '../foo';

// [DESCRIBE] foo
{
    {
        const result: string = foo();
        result satisfies string;
    }
}
