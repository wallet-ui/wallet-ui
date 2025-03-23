import * as dialog from '@zag-js/dialog';
import { normalizeProps, useMachine } from '@zag-js/react';
import { useId } from 'react';

export type BaseModalApi = ReturnType<typeof dialog.connect>;

export interface BaseModalControl {
    api: BaseModalApi;
    close: () => void;
    open: () => void;
}

export function useBaseModal(): BaseModalControl {
    const service = useMachine(dialog.machine, { id: useId(), modal: true });
    const api = dialog.connect(service, normalizeProps);

    return {
        api,
        close: () => service.send({ type: 'CLOSE' }),
        open: () => service.send({ type: 'OPEN' }),
    };
}
