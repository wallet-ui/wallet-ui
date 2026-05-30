import encodeQR from 'qr';

export type QrCodeErrorCorrection = 'high' | 'low' | 'medium' | 'quartile';

export interface QrCode {
    border: number;
    cells: boolean[][];
    errorCorrection: QrCodeErrorCorrection;
    size: number;
    value: string;
}

export interface QrCodeOptions {
    border?: number;
    errorCorrection?: QrCodeErrorCorrection;
}

const DEFAULT_QR_CODE_BORDER = 4;
const DEFAULT_QR_CODE_ERROR_CORRECTION: QrCodeErrorCorrection = 'medium';

export function createQrCode(value: string, options: QrCodeOptions = {}): QrCode {
    const border = options.border ?? DEFAULT_QR_CODE_BORDER;
    const errorCorrection = options.errorCorrection ?? DEFAULT_QR_CODE_ERROR_CORRECTION;
    const cells = encodeQR(value, 'raw', { border, ecc: errorCorrection }).map(row => row.map(Boolean));

    return {
        border,
        cells,
        errorCorrection,
        size: cells.length,
        value,
    };
}
