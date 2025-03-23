"use strict";
var __spreadArray = (this && this.__spreadArray) || function (to, from) {
    for (var i = 0, il = from.length, j = to.length; i < il; i++, j++)
        to[j] = from[i];
    return to;
};
exports.__esModule = true;
exports.JsonPatch = void 0;
var utils_1 = require("../../utils");
var JsonPatch = /** @class */ (function () {
    function JsonPatch() {
    }
    JsonPatch.prototype.diff = function (src, dest) {
        var deltas = this.delta(src, dest, [], []);
        return deltas.map(function (d) { return ({
            op: d.op,
            path: d.path.join('.'),
            val: d.val
        }); });
    };
    JsonPatch.prototype.apply = function (src, patch) {
        var result = src;
        for (var _i = 0, patch_1 = patch; _i < patch_1.length; _i++) {
            var delta = patch_1[_i];
            if (delta.path === '') {
                result = this.applyToObject(result, delta);
            }
            else {
                var item = this.fromPath(result, delta.path);
                if (item !== undefined) {
                    var newValue = this.applyToObject(item.value, delta);
                    item.holder[item.key] = newValue;
                }
            }
        }
        return result;
    };
    JsonPatch.prototype.delta = function (src, dest, path, results) {
        if (src instanceof Object && dest instanceof Object) {
            if (src.constructor !== dest.constructor) {
                results.push({ op: 'set', path: path, val: dest });
                return results;
            }
            if (src instanceof Array && dest instanceof Array) {
                return this.deltaArray(src, dest, path, results);
            }
            return this.deltaObject(src, dest, path, results);
        }
        if (src !== dest) {
            results.push({ op: 'set', path: path, val: dest });
            return results;
        }
        return results;
    };
    JsonPatch.prototype.deltaArray = function (src, dest, path, results) {
        var _this = this;
        var results1 = [];
        var results2 = [];
        src = src.slice();
        var i = 0;
        var j = 0;
        while (i < dest.length && j < src.length) {
            if (this.isEqual(src[j], dest[i])) {
                i += 1;
                j += 1;
            }
            else {
                var fromIndex = src.findIndex(function (value, index) {
                    return index > j && _this.isEqual(value, dest[i]);
                });
                if (fromIndex !== -1) {
                    var temp = src[fromIndex];
                    src[fromIndex] = src[j];
                    src[j] = temp;
                    results1.push({ op: 'move', path: path, val: [fromIndex, i] });
                    j += 1;
                    i += 1;
                }
                else {
                    fromIndex = dest.findIndex(function (value, index) {
                        return index > i && _this.isEqual(value, src[j]);
                    });
                    if (fromIndex === -1) {
                        this.delta(src[j], dest[i], __spreadArray(__spreadArray([], path), [String(i)]), results1);
                    }
                    else {
                        src.splice(j, 0, dest[i]);
                        results1.push({ op: 'add', path: path, val: [i, dest[i]] });
                    }
                    j += 1;
                    i += 1;
                }
            }
        }
        while (i < dest.length) {
            results1.push({ op: 'add', path: path, val: [i, dest[i]] });
            i += 1;
        }
        var toDelete = [];
        while (j < src.length) {
            toDelete.push(j);
            j += 1;
        }
        if (toDelete.length > 0) {
            results1.push({ op: 'del', path: path, val: toDelete });
        }
        results2.push({ op: 'set', path: path, val: dest });
        var option1 = JSON.stringify(results1);
        var option2 = JSON.stringify(results2);
        results.push.apply(results, (option1.length < option2.length ? results1 : results2));
        return results;
    };
    JsonPatch.prototype.deltaObject = function (src, dest, path, results) {
        var srcKeys = Object.keys(src);
        var destKeys = Object.keys(dest);
        for (var _i = 0, destKeys_1 = destKeys; _i < destKeys_1.length; _i++) {
            var key = destKeys_1[_i];
            if (!this.isEqual(src[key], dest[key])) {
                this.delta(src[key], dest[key], __spreadArray(__spreadArray([], path), [key]), results);
            }
        }
        var toDelete = [];
        for (var _a = 0, srcKeys_1 = srcKeys; _a < srcKeys_1.length; _a++) {
            var key = srcKeys_1[_a];
            if (!destKeys.includes(key)) {
                toDelete.push(key);
            }
        }
        if (toDelete.length > 0) {
            results.push({ op: 'del', path: path, val: toDelete });
        }
        return results;
    };
    JsonPatch.prototype.isEqual = function (src, dest) {
        return utils_1.deepCompare(src, dest);
    };
    JsonPatch.prototype.applyToObject = function (root, delta) {
        switch (delta.op) {
            case 'add': {
                var index = delta.val[0];
                var value = delta.val[1];
                root.splice(index, 0, value);
                break;
            }
            case 'set':
                root = delta.val;
                break;
            case 'del': {
                var toDelete = delta.val.slice();
                if (root instanceof Array) {
                    toDelete.sort(function (a, b) { return b - a; });
                    toDelete.forEach(function (idx) {
                        root.splice(idx, 1);
                    });
                }
                else {
                    toDelete.forEach(function (key) {
                        delete root[key];
                    });
                }
                break;
            }
            case 'move': {
                var arr = root;
                var fromKey = delta.val[0];
                var toKey = delta.val[1];
                var temp = arr[fromKey];
                arr[fromKey] = arr[toKey];
                arr[toKey] = temp;
                break;
            }
        }
        return root;
    };
    JsonPatch.prototype.fromPath = function (root, path) {
        var parts = path.split('.');
        var result = { holder: root, key: '', value: root };
        try {
            for (var _i = 0, parts_1 = parts; _i < parts_1.length; _i++) {
                var part = parts_1[_i];
                result.holder = result.value;
                result.value = result.value[part];
                result.key = part;
            }
        }
        catch (error) {
            return;
        }
        return result;
    };
    return JsonPatch;
}());
exports.JsonPatch = JsonPatch;
