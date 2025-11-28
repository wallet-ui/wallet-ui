import { useQueryConfig } from './use-query-config';

export function useInvalidateAuthorizations() {
    const { queryClient, queryKey } = useQueryConfig();

    return () => queryClient.invalidateQueries({ queryKey });
}
