import { BaseButton } from '@wallet-ui/react';
import React, { ReactNode } from 'react';

export function PlaygroundError({ error, reset }: { error: ReactNode | Error; reset?: () => void }) {
    return (
        <div style={{ display: 'flex', gap: 8, alignItems: 'center', color: 'red' }}>
            <div
                style={{
                    lineHeight: 1.5,
                    fontWeight: 500,
                    padding: '4px 8px',
                    borderRadius: 4,
                    backgroundColor: 'rgba(0, 0, 0, 0.05)',
                }}
            >
                {error instanceof Error ? error.message : error}
            </div>
            {reset ? (
                <BaseButton
                    label="Try again"
                    style={{
                        marginLeft: 8,
                        padding: '4px 8px',
                        border: '1px solid rgba(0,0,0,0.4)',
                        background: 'none',
                        cursor: 'pointer',
                    }}
                    onClick={reset}
                />
            ) : null}
        </div>
    );
}
