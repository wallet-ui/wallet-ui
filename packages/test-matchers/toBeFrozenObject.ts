expect.extend({
    toBeFrozenObject(actual: object) {
        return {
            message: () => `Expected object ${this.isNot ? 'not ' : ''}to be frozen`,
            pass: Object.isFrozen(actual),
        };
    },
});

declare global {
    namespace Vi {
        interface AsymmetricMatchersContaining {
            toBeFrozenObject(): void;
        }
        interface Assertion {
            toBeFrozenObject(): void;
        }
    }
}

export {};
