export type FrameworkStyleId = 'custom' | 'mvp' | 'none' | 'pico' | 'simple' | 'water';

export const frameworkStyleOptions: { href: string; id: FrameworkStyleId; label: string }[] = [
    {
        href: '',
        id: 'custom',
        label: 'Custom URL',
    },
    {
        href: 'https://unpkg.com/mvp.css@1.17.2/mvp.css',
        id: 'mvp',
        label: 'MVP.css',
    },
    {
        href: '',
        id: 'none',
        label: 'None',
    },
    {
        href: 'https://cdn.jsdelivr.net/npm/@picocss/pico@2/css/pico.classless.min.css',
        id: 'pico',
        label: 'Pico CSS',
    },
    {
        href: 'https://cdn.simplecss.org/simple.min.css',
        id: 'simple',
        label: 'Simple.css',
    },
    {
        href: 'https://cdn.jsdelivr.net/npm/water.css@2/out/water.css',
        id: 'water',
        label: 'Water.css',
    },
];
