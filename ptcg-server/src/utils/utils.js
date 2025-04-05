"use strict";
exports.__esModule = true;
exports.generateId = exports.deepClone = exports.deepIterate = exports.deepCompare = void 0;
function deepCompare(x, y) {
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
    for (var p in x) {
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
    for (var p in y) {
        if (Object.prototype.hasOwnProperty.call(y, p) && !Object.prototype.hasOwnProperty.call(x, p)) {
            return false;
        }
        // allows x[ p ] to be set to undefined
    }
    return true;
}
exports.deepCompare = deepCompare;
function deepIterate(source, callback) {
    if (source === null) {
        return;
    }
    if (source instanceof Array) {
        source.forEach(function (item) { return deepIterate(item, callback); });
    }
    if (source instanceof Object) {
        for (var key in source) {
            if (Object.prototype.hasOwnProperty.call(source, key)) {
                deepIterate(source[key], callback);
                callback(source, key, source[key]);
            }
        }
    }
}
exports.deepIterate = deepIterate;
function deepClone(source, ignores, refMap) {
    if (ignores === void 0) { ignores = []; }
    if (refMap === void 0) { refMap = []; }
    if (source === null) {
        return null;
    }
    if (source instanceof Array) {
        return source.map(function (item) { return deepClone(item, ignores, refMap); });
    }
    if (source instanceof Object) {
        if (ignores.some(function (ignore) { return source instanceof ignore; })) {
            return source;
        }
        var ref = refMap.find(function (item) { return item.s === source; });
        if (ref !== undefined) {
            return ref.d;
        }
        var dest = Object.create(source);
        refMap.push({ s: source, d: dest });
        for (var key in source) {
            if (Object.prototype.hasOwnProperty.call(source, key)) {
                dest[key] = deepClone(source[key], ignores, refMap);
            }
        }
        return dest;
    }
    return source;
}
exports.deepClone = deepClone;
function generateId(array) {
    if (array.length === 0) {
        return 1;
    }
    var last = array[array.length - 1];
    var id = last.id + 1;
    while (array.find(function (g) { return g.id === id; })) {
        if (id === Number.MAX_VALUE) {
            id = 0;
        }
        id = id + 1;
    }
    return id;
}
exports.generateId = generateId;
