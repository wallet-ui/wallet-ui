import { createQrCode, type QrCodeOptions } from './create-qr-code';

export interface QrCodeLogoOptions {
    backgroundColor?: string;
    href: string;
    size?: number;
}

export interface QrCodeSvgOptions extends QrCodeOptions {
    backgroundColor?: string;
    foregroundColor?: string;
    logo?: QrCodeLogoOptions;
    title?: string;
}

const DEFAULT_QR_CODE_BACKGROUND_COLOR = '#fff';
const DEFAULT_QR_CODE_FOREGROUND_COLOR = '#000';
const DEFAULT_QR_CODE_LOGO_SIZE = 0.2;
const MAX_QR_CODE_LOGO_SIZE = 0.25;

export function createQrCodeSvg(value: string, options: QrCodeSvgOptions = {}): string {
    const backgroundColor = options.backgroundColor ?? DEFAULT_QR_CODE_BACKGROUND_COLOR;
    const foregroundColor = options.foregroundColor ?? DEFAULT_QR_CODE_FOREGROUND_COLOR;
    const logo = options.logo;
    const qrCode = createQrCode(value, {
        border: options.border,
        errorCorrection: options.errorCorrection ?? (logo ? 'high' : undefined),
    });
    const title = options.title ? `<title>${escapeSvgText(options.title)}</title>` : '';
    const background = `<rect fill="${escapeSvgAttribute(backgroundColor)}" height="${qrCode.size}" width="${qrCode.size}" x="0" y="0"/>`;
    const foreground = `<path d="${createQrCodeSvgPath(qrCode.cells)}" fill="${escapeSvgAttribute(foregroundColor)}"/>`;
    const logoSvg = logo ? createQrCodeLogoSvg({ backgroundColor, logo, size: qrCode.size }) : '';

    return `<svg role="img" shape-rendering="crispEdges" viewBox="0 0 ${qrCode.size} ${qrCode.size}" xmlns="http://www.w3.org/2000/svg">${title}${background}${foreground}${logoSvg}</svg>`;
}

function createQrCodeLogoSvg({
    backgroundColor,
    logo,
    size,
}: {
    backgroundColor: string;
    logo: QrCodeLogoOptions;
    size: number;
}): string {
    const logoSize = formatSvgNumber(size * getQrCodeLogoSize(logo.size));
    const logoPosition = formatSvgNumber((size - Number(logoSize)) / 2);
    const logoBackgroundColor = logo.backgroundColor ?? backgroundColor;

    return [
        `<rect fill="${escapeSvgAttribute(logoBackgroundColor)}" height="${logoSize}" width="${logoSize}" x="${logoPosition}" y="${logoPosition}"/>`,
        `<image height="${logoSize}" href="${escapeSvgAttribute(logo.href)}" preserveAspectRatio="xMidYMid meet" width="${logoSize}" x="${logoPosition}" y="${logoPosition}"/>`,
    ].join('');
}

function createQrCodeSvgPath(cells: boolean[][]): string {
    return cells
        .flatMap((row, rowIndex) =>
            row.map((cell, columnIndex) => (cell ? `M${columnIndex} ${rowIndex}h1v1H${columnIndex}z` : '')),
        )
        .join('');
}

function escapeSvgAttribute(value: string): string {
    return value
        .replace(/&/g, '&amp;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&apos;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
}

function escapeSvgText(value: string): string {
    return value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function formatSvgNumber(value: number): string {
    return Number(value.toFixed(6)).toString();
}

function getQrCodeLogoSize(size = DEFAULT_QR_CODE_LOGO_SIZE): number {
    return Math.min(size, MAX_QR_CODE_LOGO_SIZE);
}
