import { createQrCode, type QrCodeErrorCorrection, type QrCodeLogoOptions } from '@wallet-ui/core';
import React from 'react';

import { BaseSvg, BaseSvgProps } from './base-svg';

export interface WalletUiQrCodeProps extends Omit<BaseSvgProps, 'children' | 'viewBox'> {
    backgroundColor?: string;
    border?: number;
    errorCorrection?: QrCodeErrorCorrection;
    foregroundColor?: string;
    logo?: QrCodeLogoOptions;
    title?: string;
    value: string;
}

const DEFAULT_QR_CODE_BACKGROUND_COLOR = '#fff';
const DEFAULT_QR_CODE_FOREGROUND_COLOR = '#000';
const DEFAULT_QR_CODE_LOGO_SIZE = 0.2;
const LOGO_BACKGROUND_PADDING = 1;
const MAX_QR_CODE_LOGO_SIZE = 0.25;

export function WalletUiQrCode({
    backgroundColor = DEFAULT_QR_CODE_BACKGROUND_COLOR,
    border,
    errorCorrection,
    foregroundColor = DEFAULT_QR_CODE_FOREGROUND_COLOR,
    logo,
    title,
    value,
    ...props
}: WalletUiQrCodeProps) {
    const effectiveErrorCorrection = errorCorrection ?? (logo ? 'high' : undefined);
    const hasAccessibleName = Boolean(title || props['aria-label'] || props['aria-labelledby']);
    const titleId = React.useId();
    const qrCode = React.useMemo(
        () =>
            createQrCode(value, {
                border,
                errorCorrection: effectiveErrorCorrection,
            }),
        [border, effectiveErrorCorrection, value],
    );
    const path = React.useMemo(() => createQrCodeSvgPath(qrCode.cells), [qrCode.cells]);

    return (
        <BaseSvg
            aria-hidden={hasAccessibleName ? undefined : true}
            aria-labelledby={props['aria-labelledby'] ?? (title ? titleId : undefined)}
            data-wu="wallet-ui-qr-code"
            role={hasAccessibleName ? 'img' : undefined}
            shapeRendering="crispEdges"
            viewBox={`0 0 ${qrCode.size} ${qrCode.size}`}
            {...props}
        >
            {title ? <title id={titleId}>{title}</title> : null}
            <rect fill={backgroundColor} height={qrCode.size} width={qrCode.size} x={0} y={0} />
            <path d={path} fill={foregroundColor} />
            {logo ? <WalletUiQrCodeLogo backgroundColor={backgroundColor} logo={logo} size={qrCode.size} /> : null}
        </BaseSvg>
    );
}

function WalletUiQrCodeLogo({
    backgroundColor,
    logo,
    size,
}: {
    backgroundColor: string;
    logo: QrCodeLogoOptions;
    size: number;
}) {
    const logoSize = size * getQrCodeLogoSize(logo.size);
    const logoPosition = (size - logoSize) / 2;
    const logoBackgroundPosition = Math.max(0, Math.floor(logoPosition) - LOGO_BACKGROUND_PADDING);
    const logoBackgroundEnd = Math.min(size, Math.ceil(logoPosition + logoSize) + LOGO_BACKGROUND_PADDING);
    const logoBackgroundSize = logoBackgroundEnd - logoBackgroundPosition;
    const logoBackgroundColor = logo.backgroundColor ?? backgroundColor;

    return (
        <>
            <rect
                fill={logoBackgroundColor}
                height={formatSvgNumber(logoBackgroundSize)}
                width={formatSvgNumber(logoBackgroundSize)}
                x={formatSvgNumber(logoBackgroundPosition)}
                y={formatSvgNumber(logoBackgroundPosition)}
            />
            <image
                height={formatSvgNumber(logoSize)}
                href={logo.href}
                preserveAspectRatio="xMidYMid meet"
                width={formatSvgNumber(logoSize)}
                x={formatSvgNumber(logoPosition)}
                y={formatSvgNumber(logoPosition)}
            />
        </>
    );
}

function createQrCodeSvgPath(cells: boolean[][]): string {
    return cells
        .flatMap((row, rowIndex) =>
            row.map((cell, columnIndex) => (cell ? `M${columnIndex} ${rowIndex}h1v1H${columnIndex}z` : '')),
        )
        .join('');
}

function formatSvgNumber(value: number): number {
    return Number(value.toFixed(6));
}

function getQrCodeLogoSize(size = DEFAULT_QR_CODE_LOGO_SIZE): number {
    return Math.min(size, MAX_QR_CODE_LOGO_SIZE);
}
