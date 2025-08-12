import { createFromSource } from 'fumadocs-core/search/server';

import { source } from '@/lib/source';

export const dynamic = 'force-static';
export const revalidate = 0;

export const { GET } = createFromSource(source);
