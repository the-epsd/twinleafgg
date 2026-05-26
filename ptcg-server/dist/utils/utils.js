export function deepCompare(x, y) {
    if (x === y) {
        return true;
    }
    // if both x and y are null or undefined and exactly the same
    if (!(x instanceof Object) || !(y instanceof Object)) {
        return false;
    }
    // if they are not strictly equal, they both need to be Objects
    if (x.constructor !== y.constructor) {
        return false;
    }
    // they must have the exact same prototype chain, the closest we can do is
    // test there constructor.
    for (const p in x) {
        if (!Object.prototype.hasOwnProperty.call(x, p)) {
            continue;
        }
        // other properties were tested using x.constructor === y.constructor
        if (!Object.prototype.hasOwnProperty.call(y, p)) {
            return false;
        }
        // allows to compare x[ p ] and y[ p ] when set to undefined
        if (x[p] === y[p]) {
            continue;
        }
        // if they have the same strict value or identity then they are equal
        if (typeof (x[p]) !== 'object') {
            return false;
        }
        // Numbers, Strings, Functions, Booleans must be strictly equal
        if (!deepCompare(x[p], y[p])) {
            return false;
        }
        // Objects and Arrays must be tested recursively
    }
    for (const p in y) {
        if (Object.prototype.hasOwnProperty.call(y, p) && !Object.prototype.hasOwnProperty.call(x, p)) {
            return false;
        }
        // allows x[ p ] to be set to undefined
    }
    return true;
}
export function deepIterate(source, callback) {
    if (source === null) {
        return;
    }
    if (source instanceof Array) {
        source.forEach((item) => deepIterate(item, callback));
    }
    if (source instanceof Object) {
        for (const key in source) {
            if (Object.prototype.hasOwnProperty.call(source, key)) {
                deepIterate(source[key], callback);
                callback(source, key, source[key]);
            }
        }
    }
}
export function deepClone(source, ignores = [], refMap = []) {
    if (source === null) {
        return null;
    }
    if (source instanceof Array) {
        return source.map((item) => deepClone(item, ignores, refMap));
    }
    if (source instanceof Object) {
        if (ignores.some(ignore => source instanceof ignore)) {
            return source;
        }
        const ref = refMap.find(item => item.s === source);
        if (ref !== undefined) {
            return ref.d;
        }
        const dest = Object.create(source);
        refMap.push({ s: source, d: dest });
        for (const key in source) {
            if (Object.prototype.hasOwnProperty.call(source, key)) {
                dest[key] = deepClone(source[key], ignores, refMap);
            }
        }
        return dest;
    }
    return source;
}
export function generateId(array) {
    if (array.length === 0) {
        return 1;
    }
    const last = array[array.length - 1];
    let id = last.id + 1;
    while (array.find(g => g.id === id)) {
        if (id === Number.MAX_VALUE) {
            id = 0;
        }
        id = id + 1;
    }
    return id;
}
