import React from 'react';
import type { FallbackProps } from 'react-error-boundary';
import { getErrorMessage } from '../errors';
import { PlaygroundError } from './playground-error';

export function PlaygroundErrorBoundaryNotSupported({ error, resetErrorBoundary }: FallbackProps) {
    return (
        <PlaygroundError
            error={getErrorMessage(error, 'This account does not support this feature')}
            reset={resetErrorBoundary}
        />
    );
}
