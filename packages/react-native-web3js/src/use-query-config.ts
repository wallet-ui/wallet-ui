import { useQueryClient } from '@tanstack/react-query';

export function useQueryConfig() {
    const storageKey = 'authorization-cache';
    const queryClient = useQueryClient();
    const queryKey = ['wallet-authorization'];

    return { queryClient, queryKey, storageKey };
}
