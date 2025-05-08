// Hacky way to persist the open state of the playground cards in the URL.
// https://nuqs.47ng.com seems way more solid, but it needs adapters for each framework.
import React, { useEffect } from 'react';

export function useOpenState() {
    const url = new URL(window.location.href);
    const openParams = url.searchParams.get('open');
    const [open, setOpen] = React.useState<string[]>(openParams ? openParams.split(',') : []);

    function handleToggle(name: string) {
        setOpen(prev => {
            return prev.includes(name) ? prev.filter(item => item !== name) : [...prev, name];
        });
    }

    useEffect(() => {
        const url = new URL(window.location.href);
        url.searchParams.delete('open');
        url.searchParams.set('open', open.join(','));
        window.history.pushState(null, '', url.toString());
    }, [open]);

    return { open, handleToggle };
}