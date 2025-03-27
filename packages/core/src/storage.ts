import { persistentAtom } from '@nanostores/persistent';
import { computed, WritableAtom } from 'nanostores';

export class Storage<T> {
    private readonly atom: WritableAtom<T>;

    constructor(
        readonly key: string,
        readonly initial: T,
    ) {
        this.atom = persistentAtom<T>(key, initial, { decode: JSON.parse, encode: JSON.stringify });
    }

    get() {
        return this.atom.get();
    }

    set(value: T) {
        this.atom.set(value);
    }

    get value() {
        return computed(this.atom, value => value);
    }
}
