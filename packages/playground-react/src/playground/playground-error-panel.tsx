import { BaseButton } from '@wallet-ui/react';
import React from 'react';

export function PlaygroundErrorPanel({
    error,
    onClose,
    title,
}: {
    error: unknown;
    onClose: () => void;
    title?: string;
}) {
    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                <span
                    style={{
                        color: 'red',
                        fontWeight: 'bold',
                        fontSize: 20,
                    }}
                >
                    {title ?? 'We encountered the following error'}
                </span>
                <BaseButton
                    label="Close"
                    style={{ borderRadius: 4, border: '1px solid rgba(0, 0, 0, 0.2)', padding: '2px 4px' }}
                    onClick={() => onClose()}
                />
            </div>
            <pre
                style={{
                    whiteSpace: 'pre-wrap',
                    wordBreak: 'break-word',
                    fontSize: 10,
                    lineHeight: 1.5,
                    backgroundColor: 'rgba(0, 0, 0, 0.1)',
                    padding: 4,
                    borderRadius: 4,
                    border: '1px solid rgba(0, 0, 0, 0.2)',
                }}
            >
                {(error as Error)?.stack?.toString() ?? (error as Error)?.message?.toString()}
            </pre>
        </div>
    );
}
