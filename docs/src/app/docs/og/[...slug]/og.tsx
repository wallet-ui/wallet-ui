import type { ImageResponseOptions } from 'next/dist/compiled/@vercel/og/types';
import { ImageResponse } from 'next/og';
import type { ReactElement, ReactNode } from 'react';

interface GenerateProps {
    title: ReactNode;
    description?: ReactNode;
    primaryTextColor?: string;
}

export function generateOGImage(options: GenerateProps & ImageResponseOptions): ImageResponse {
    const { title, description, primaryTextColor, ...rest } = options;

    return new ImageResponse(
        generate({
            title,
            description,
            primaryTextColor,
        }),
        {
            width: 1200,
            height: 630,
            ...rest,
        },
    );
}

export function generate({ primaryTextColor = 'rgb(255,150,255)', ...props }: GenerateProps): ReactElement {
    return (
        <div
            style={{
                display: 'flex',
                flexDirection: 'column',
                width: '100%',
                height: '100%',
                color: 'white',
                backgroundColor: '#121212',
            }}
        >
            <div
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    width: '100%',
                    height: '100%',
                    padding: '4rem',
                }}
            >
                <p
                    style={{
                        fontWeight: 600,
                        fontSize: '76px',
                    }}
                >
                    {props.title}
                </p>
                <p
                    style={{
                        fontSize: '48px',
                        color: 'rgba(240,240,240,0.7)',
                    }}
                >
                    {props.description}
                </p>
                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        marginTop: 'auto',
                        width: '100%',
                    }}
                >
                    <div
                        style={{
                            display: 'flex',
                            flexDirection: 'row',
                            alignItems: 'center',
                            gap: '24px',
                            marginTop: 'auto',
                            color: primaryTextColor,
                        }}
                    >
                        <img
                            src="https://avatars.githubusercontent.com/u/188287575"
                            height={84}
                            width={84}
                            alt="Wallet UI Image"
                        />
                        <p
                            style={{
                                fontSize: '46px',
                                fontWeight: 600,
                            }}
                        >
                            Wallet UI
                        </p>
                    </div>

                    <p
                        style={{
                            fontSize: '24px',
                            fontWeight: 400,
                            color: 'rgba(240,240,240,0.7)',
                        }}
                    >
                        https://wallet-ui.dev
                    </p>
                </div>
            </div>
        </div>
    );
}
