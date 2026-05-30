import {
    createQrCode,
    createQrCodeSvg,
    type QrCode,
    type QrCodeErrorCorrection,
    type QrCodeLogoOptions,
    type QrCodeOptions,
    type QrCodeSvgOptions,
} from '../index';

// [DESCRIBE] createQrCode
{
    {
        const result: QrCode = createQrCode('11111111111111111111111111111111');
        result satisfies QrCode;
    }
    {
        const options: QrCodeOptions = {
            border: 4,
            errorCorrection: 'medium',
        };
        const result: QrCode = createQrCode('https://wallet-ui.dev', options);
        result satisfies QrCode;
    }
    {
        const errorCorrection: QrCodeErrorCorrection = 'high';
        errorCorrection satisfies QrCodeErrorCorrection;
    }
}

// [DESCRIBE] createQrCodeSvg
{
    {
        const result: string = createQrCodeSvg('11111111111111111111111111111111');
        result satisfies string;
    }
    {
        const logo: QrCodeLogoOptions = {
            backgroundColor: '#fff',
            href: 'https://wallet-ui.dev/logo.svg',
            size: 0.2,
        };
        const options: QrCodeSvgOptions = {
            backgroundColor: '#fff',
            border: 4,
            errorCorrection: 'high',
            foregroundColor: '#000',
            logo,
            title: 'Wallet address',
        };
        const result: string = createQrCodeSvg('https://wallet-ui.dev', options);
        result satisfies string;
    }
}
