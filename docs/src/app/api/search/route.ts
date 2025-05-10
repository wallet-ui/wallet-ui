import { source } from '@/lib/source';
import { createFromSource } from 'fumadocs-core/search/server';

export const dynamic = 'force-static';
export const revalidate = 0;

export const { GET } = createFromSource(source);
