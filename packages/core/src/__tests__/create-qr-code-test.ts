import { createQrCode, createQrCodeSvg } from '../index';

const WALLET_ADDRESS = '11111111111111111111111111111111';

function getSvgPath(svg: string): string {
    return svg.match(/<path d="([^"]+)"/)?.[1] ?? '';
}

describe('createQrCode', () => {
    it('should create a QR code for a wallet address', () => {
        // Act
        const result = createQrCode(WALLET_ADDRESS);

        // Assert
        expect(result.border).toBe(4);
        expect(result.cells).toHaveLength(result.size);
        expect(result.cells.every(row => row.length === result.size)).toBe(true);
        expect(result.cells.some(row => row.some(Boolean))).toBe(true);
        expect(result.errorCorrection).toBe('medium');
        expect(result.value).toBe(WALLET_ADDRESS);
    });

    it('should create a QR code for a URL', () => {
        // Arrange
        const value = 'https://wallet-ui.dev/wallet/11111111111111111111111111111111';

        // Act
        const result = createQrCode(value);

        // Assert
        expect(result.cells).toHaveLength(result.size);
        expect(result.size).toBeGreaterThan(0);
        expect(result.value).toBe(value);
    });

    it('should include the quiet zone in the matrix', () => {
        // Act
        const result = createQrCode(WALLET_ADDRESS, { border: 4 });

        // Assert
        expect(
            result.cells
                .slice(0, 4)
                .flat()
                .every(cell => !cell),
        ).toBe(true);
        expect(
            result.cells
                .slice(-4)
                .flat()
                .every(cell => !cell),
        ).toBe(true);
        expect(result.cells.every(row => row.slice(0, 4).every(cell => !cell))).toBe(true);
        expect(result.cells.every(row => row.slice(-4).every(cell => !cell))).toBe(true);
    });
});

describe('createQrCodeSvg', () => {
    it('should create compact SVG output', () => {
        // Act
        const result = createQrCodeSvg(WALLET_ADDRESS, { title: 'Wallet address' });

        // Assert
        expect(result).toContain('<title>Wallet address</title>');
        expect(result).toContain('<rect fill="#fff"');
        expect(result).toContain('<path d="');
        expect(result).toContain('fill="#000"');
        expect(result).toContain('role="img"');
        expect(result).toContain('viewBox="0 0 ');
        expect(result.match(/<path/g)).toHaveLength(1);
    });

    it('should default to high error correction when a logo is provided', () => {
        // Arrange
        const value = 'aaaaaaaa';

        // Act
        const mediumSvg = createQrCodeSvg(value);
        const logoSvg = createQrCodeSvg(value, { logo: { href: 'logo.svg' } });

        // Assert
        expect(mediumSvg).toContain('viewBox="0 0 29 29"');
        expect(logoSvg).toContain('viewBox="0 0 33 33"');
        expect(getSvgPath(logoSvg)).not.toBe(getSvgPath(mediumSvg));
    });

    it('should render a centered logo with capped size', () => {
        // Act
        const result = createQrCodeSvg('aaaaaaaa', {
            logo: {
                backgroundColor: '#f8f8f8',
                href: 'https://wallet-ui.dev/logo.svg',
                size: 0.5,
            },
        });

        // Assert
        expect(result).toContain('<rect fill="#f8f8f8" height="8.25" width="8.25" x="12.375" y="12.375"/>');
        expect(result).toContain(
            '<image height="8.25" href="https://wallet-ui.dev/logo.svg" preserveAspectRatio="xMidYMid meet" width="8.25" x="12.375" y="12.375"/>',
        );
    });

    it('should escape XML text and attributes', () => {
        // Act
        const result = createQrCodeSvg('abc', {
            backgroundColor: '"<&>',
            foregroundColor: "'<&>",
            logo: {
                backgroundColor: '"<&>',
                href: 'https://wallet-ui.dev/logo.svg?color="red"&shape=<square>',
            },
            title: 'Wallet <UI> & "QR"',
        });

        // Assert
        expect(result).toContain('<title>Wallet &lt;UI&gt; &amp; "QR"</title>');
        expect(result).toContain('fill="&quot;&lt;&amp;&gt;"');
        expect(result).toContain('fill="&apos;&lt;&amp;&gt;"');
        expect(result).toContain(
            'href="https://wallet-ui.dev/logo.svg?color=&quot;red&quot;&amp;shape=&lt;square&gt;"',
        );
    });
});
