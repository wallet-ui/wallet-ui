import * as menu from '@zag-js/menu';
import { normalizeProps, useMachine } from '@zag-js/react';
import { useId } from 'react';

export type BaseDropdownApi = ReturnType<typeof menu.connect>;

export interface BaseDropdownControl {
    api: BaseDropdownApi;
    close: () => void;
    open: () => void;
}

export function useBaseDropdown(): BaseDropdownControl {
    const service = useMachine(menu.machine, { id: useId() });
    const api = menu.connect(service, normalizeProps);

    return {
        api,
        close: () => service.send({ type: 'CLOSE' }),
        open: () => service.send({ type: 'OPEN' }),
    };
}
