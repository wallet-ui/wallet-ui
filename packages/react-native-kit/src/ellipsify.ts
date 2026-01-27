export function ellipsify(str = '', len = 4, delimiter = '..') {
    const limit = len * 2 + delimiter.length;

    return str.length > limit ? str.slice(0, len) + delimiter + str.slice(-len) : str;
}
