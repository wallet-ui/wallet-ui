import { handleCopyText } from '../handle-copy-text';

// [DESCRIBE] handleCopyText
{
    {
        const result: void = handleCopyText(undefined);
        result satisfies void;
    }
    {
        const result: void = handleCopyText('test text');
        result satisfies void;
    }
}
