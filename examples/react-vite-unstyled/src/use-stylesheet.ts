import { useEffect } from 'react';

export function useStylesheet({ href, id }: { href: string; id: string }) {
    useEffect(() => {
        const existingLink = document.getElementById(id);

        if (!href) {
            existingLink?.remove();
            return;
        }

        const link =
            existingLink instanceof HTMLLinkElement
                ? existingLink
                : Object.assign(document.createElement('link'), { id, rel: 'stylesheet' });

        if (!link.parentNode) {
            document.head.append(link);
        }

        link.href = href;

        return () => {
            link.remove();
        };
    }, [href, id]);
}
